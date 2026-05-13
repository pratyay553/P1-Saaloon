package com.saloon.booking.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class BookingRequestDto {
    @NotNull(message = "Service ID is required")
    private Long serviceId;

    @NotNull(message = "Staff ID is required")
    private Long staffId; // Can be null if "Anyone Available" is selected

    @NotNull(message = "Appointment date and time is required")
    private LocalDateTime appointmentDateTime;

    // Getters and Setters
    public Long getServiceId() {
        return serviceId;
    }

    public void setServiceId(Long serviceId) {
        this.serviceId = serviceId;
    }

    public Long getStaffId() {
        return staffId;
    }

    public void setStaffId(Long staffId) {
        this.staffId = staffId;
    }

    public LocalDateTime getAppointmentDateTime() {
        return appointmentDateTime;
    }

    public void setAppointmentDateTime(LocalDateTime appointmentDateTime) {
        this.appointmentDateTime = appointmentDateTime;
    }
}
