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

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.time.LocalDate;
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

    public List<LocalTime> getAvailableTimeSlots(AvailabilityRequestDto request) {
        // In a real application, this would involve complex logic:
        // 1. Fetch staff schedule for the given date
        // 2. Fetch service duration
        // 3. Fetch existing appointments for the staff on that date
        // 4. Calculate available slots based on working hours, breaks, and existing bookings
        
        // For now, return some mock slots
        List<LocalTime> mockSlots = new ArrayList<>();
        LocalTime startTime = LocalTime.of(9, 0);
        LocalTime endTime = LocalTime.of(17, 0); // 5 PM

        while (startTime.isBefore(endTime)) {
            mockSlots.add(startTime);
            startTime = startTime.plusMinutes(30); // 30-minute intervals
        }
        
        // Simulate some slots being taken
        if (request.getDate().isEqual(LocalDate.now().plusDays(1))) { // Tomorrow
            mockSlots.remove(LocalTime.of(9, 30));
            mockSlots.remove(LocalTime.of(11, 0));
        }
        
        return mockSlots;
    }

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

        // 4. Create and save Appointment
        Appointment appointment = new Appointment();
        appointment.setCustomer(customer);
        appointment.setService(service);
        appointment.setStaff(staff);
        appointment.setAppointmentDateTime(request.getAppointmentDateTime());
        appointment.setStatus(AppointmentStatus.SCHEDULED); // Default status

        return appointmentRepository.save(appointment);
    }

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
