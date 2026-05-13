package com.saloon.booking.controller;

import com.saloon.booking.dto.AppointmentDto;
import com.saloon.booking.dto.AvailabilityRequestDto;
import com.saloon.booking.dto.AvailabilityResponseDto;
import com.saloon.booking.dto.BookingRequestDto;
import com.saloon.booking.model.Appointment;
import com.saloon.booking.model.ServiceItem;
import com.saloon.booking.model.Staff;
import com.saloon.booking.service.BookingService;
import com.saloon.common.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/booking")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @GetMapping("/services")
    public ResponseEntity<ApiResponse<List<ServiceItem>>> getAllServices() {
        List<ServiceItem> services = bookingService.getAllServices();
        return ApiResponse.success("Services fetched successfully", services);
    }

    @GetMapping("/staff")
    public ResponseEntity<ApiResponse<List<Staff>>> getAllStaff() {
        List<Staff> staff = bookingService.getAllStaff();
        return ApiResponse.success("Staff fetched successfully", staff);
    }

    @PostMapping("/availability")
    public ResponseEntity<ApiResponse<AvailabilityResponseDto>> getAvailability(
            @Valid @RequestBody AvailabilityRequestDto request) {
        
        List<LocalTime> availableSlots = bookingService.getAvailableTimeSlots(request);
        AvailabilityResponseDto response = new AvailabilityResponseDto(request.getDate(), availableSlots);
        return ApiResponse.success("Available slots fetched successfully", response);
    }

    @PostMapping("/book")
    public ResponseEntity<ApiResponse<Appointment>> createBooking(
            @Valid @RequestBody BookingRequestDto request) {
        
        Appointment newAppointment = bookingService.createAppointment(request);
        return ApiResponse.created("Appointment booked successfully", newAppointment);
    }

    @GetMapping("/my-appointments")
    public ResponseEntity<ApiResponse<List<AppointmentDto>>> getMyAppointments() {
        List<AppointmentDto> appointments = bookingService.getMyAppointments();
        return ApiResponse.success("My appointments fetched successfully", appointments);
    }
}
