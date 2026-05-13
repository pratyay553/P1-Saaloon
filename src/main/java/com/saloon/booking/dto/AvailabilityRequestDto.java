package com.saloon.booking.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class AvailabilityRequestDto {
    @NotNull(message = "Service ID is required")
    private Long serviceId;

    @NotNull(message = "Staff ID is required")
    private Long staffId; // Use a specific staff ID, or a special ID for "Anyone Available"

    @NotNull(message = "Date is required")
    private LocalDate date;

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

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }
}
