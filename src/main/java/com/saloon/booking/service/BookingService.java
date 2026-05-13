package com.saloon.booking.service;

import com.saloon.booking.dto.AvailabilityRequestDto;
import com.saloon.booking.dto.BookingRequestDto;
import com.saloon.booking.dto.AppointmentDto;
import com.saloon.booking.model.Appointment;
import com.saloon.booking.model.AppointmentStatus;
import com.saloon.booking.model.ServiceItem;
import com.saloon.booking.model.Staff;
import com.saloon.booking.repository.AppointmentRepository;
import com.saloon.booking.repository.ServiceItemRepository;
import com.saloon.booking.repository.StaffRepository;
import com.saloon.user.model.Account;
import com.saloon.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.stream.Collectors;

@Service
public class BookingService {

    @Autowired
    private ServiceItemRepository serviceItemRepository;

    @Autowired
    private StaffRepository staffRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private UserRepository userRepository; // To get the current authenticated user

    public List<ServiceItem> getAllServices() {
        return serviceItemRepository.findAll();
    }

    public List<Staff> getAllStaff() {
        return staffRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<LocalTime> getAvailableTimeSlots(AvailabilityRequestDto request) {
        
        // 1. Define working hours
        LocalTime startTime = LocalTime.of(9, 0);
        LocalTime endTime = LocalTime.of(17, 0); // 5 PM
        int intervalMinutes = 30;

        List<LocalTime> potentialSlots = new ArrayList<>();
        LocalTime currentSlot = startTime;
        while (currentSlot.isBefore(endTime)) {
            potentialSlots.add(currentSlot);
            currentSlot = currentSlot.plusMinutes(intervalMinutes);
        }

        // Fetch service duration
        ServiceItem requestedService = serviceItemRepository.findById(request.getServiceId()).orElse(null);
        int requestedDuration = requestedService != null ? requestedService.getDuration() : 30;

        // If 'Anyone Available' is selected (staffId is null or a special value), 
        // we would need a more complex query to find ANY staff with free time.
        // For this implementation, if a specific staff member is requested, we filter their slots.
        if (request.getStaffId() != null) {
            Staff staff = staffRepository.findById(request.getStaffId()).orElse(null);
            
            if (staff != null) {
                // Fetch existing appointments for this staff on this date
                LocalDateTime startOfDay = request.getDate().atStartOfDay();
                LocalDateTime endOfDay = request.getDate().plusDays(1).atStartOfDay();
                
                List<Appointment> existingAppointments = appointmentRepository.findAppointmentsByStaffAndDate(staff, startOfDay, endOfDay);
                
                // Remove booked slots from potential slots
                for (Appointment appointment : existingAppointments) {
                    LocalTime bookedTime = appointment.getAppointmentDateTime().toLocalTime();
                    // Basic removal: this assumes services are 30 mins. 
                    // For longer services, you'd remove multiple slots.
                    potentialSlots.remove(bookedTime);
                    
                    // If service duration > 30, remove subsequent slots too.
                    // Example: if duration is 60, remove bookedTime AND bookedTime.plusMinutes(30)
                    int duration = appointment.getService().getDuration();
                    if (duration > 30) {
                         int extraSlots = (duration - 30) / 30;
                         LocalTime nextSlot = bookedTime.plusMinutes(30);
                         for(int i=0; i<extraSlots; i++){
                             potentialSlots.remove(nextSlot);
                             nextSlot = nextSlot.plusMinutes(30);
                         }
                    }
                }
            }
        }

        // After removing taken slots, we also need to ensure that the REMAINING slots
        // can accommodate the REQUESTED service's duration.
        // For example, if we need 60 mins (2 slots), and only 1 slot is free before a booking,
        // we shouldn't return that 1 slot.
        List<LocalTime> finalSlots = new ArrayList<>();
        int requiredSlots = (int) Math.ceil((double) requestedDuration / intervalMinutes);

        for (int i = 0; i < potentialSlots.size(); i++) {
            boolean hasEnoughConsecutiveSlots = true;
            LocalTime checkSlot = potentialSlots.get(i);
            
            for (int j = 1; j < requiredSlots; j++) {
                LocalTime nextRequiredSlot = checkSlot.plusMinutes(intervalMinutes * j);
                if (!potentialSlots.contains(nextRequiredSlot) || nextRequiredSlot.isAfter(endTime) || nextRequiredSlot.equals(endTime)) {
                    hasEnoughConsecutiveSlots = false;
                    break;
                }
            }
            if (hasEnoughConsecutiveSlots) {
                finalSlots.add(checkSlot);
            }
        }
        
        // Ensure we don't return slots in the past for today
        if (request.getDate().isEqual(LocalDate.now())) {
            LocalTime now = LocalTime.now();
            finalSlots.removeIf(slot -> slot.isBefore(now));
        }

        return finalSlots;
    }

    @Transactional
    public Appointment createAppointment(BookingRequestDto request) {
        // 1. Get authenticated user (customer)
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Account customer = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));

        // 2. Get ServiceItem
        ServiceItem service = serviceItemRepository.findById(request.getServiceId())
                .orElseThrow(() -> new RuntimeException("Service not found"));

        // 3. Get Staff (handle "Anyone Available" case)
        Staff staff = null;
        if (request.getStaffId() != null) {
            staff = staffRepository.findById(request.getStaffId())
                    .orElseThrow(() -> new RuntimeException("Staff not found"));
        } else {
            // Logic to assign "Anyone Available" staff. For now, just pick the first one.
            staff = staffRepository.findAll().stream().findFirst()
                    .orElseThrow(() -> new RuntimeException("No staff available"));
        }

        // 4. Double check availability right before booking (Concurrency check)
        // In a high-traffic app, you'd lock the row or use database constraints to prevent double booking.
        LocalDateTime startOfDay = request.getAppointmentDateTime().toLocalDate().atStartOfDay();
        LocalDateTime endOfDay = request.getAppointmentDateTime().toLocalDate().plusDays(1).atStartOfDay();
        List<Appointment> existingAppointments = appointmentRepository.findAppointmentsByStaffAndDate(staff, startOfDay, endOfDay);
        
        boolean isSlotTaken = false;
        
        // Need to check if the requested time overlaps with any existing appointments
        // considering the duration of both the new request and existing ones.
        LocalDateTime newStart = request.getAppointmentDateTime();
        LocalDateTime newEnd = newStart.plusMinutes(service.getDuration());

        for (Appointment existing : existingAppointments) {
            LocalDateTime existStart = existing.getAppointmentDateTime();
            LocalDateTime existEnd = existStart.plusMinutes(existing.getService().getDuration());

            // Check for overlap
            if (newStart.isBefore(existEnd) && newEnd.isAfter(existStart)) {
                isSlotTaken = true;
                break;
            }
        }
            
        if (isSlotTaken) {
             throw new RuntimeException("This time slot is no longer available.");
        }


        // 5. Create and save Appointment
        Appointment appointment = new Appointment();
        appointment.setCustomer(customer);
        appointment.setService(service);
        appointment.setStaff(staff);
        appointment.setAppointmentDateTime(request.getAppointmentDateTime());
        appointment.setStatus(AppointmentStatus.SCHEDULED); // Default status

        return appointmentRepository.save(appointment);
    }

    @Transactional(readOnly = true)
    public List<AppointmentDto> getMyAppointments() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Account customer = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));

        List<Appointment> appointments = appointmentRepository.findByCustomer(customer);

        return appointments.stream().map(appointment -> new AppointmentDto(
                appointment.getId(),
                appointment.getService().getName(),
                appointment.getStaff().getName(),
                appointment.getAppointmentDateTime(),
                appointment.getStatus(),
                appointment.getService().getPrice(),
                appointment.getService().getDuration()
        )).collect(Collectors.toList());
    }
}
