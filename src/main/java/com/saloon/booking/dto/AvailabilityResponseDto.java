package com.saloon.booking.dto;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public class AvailabilityResponseDto {
    private LocalDate date;
    private List<LocalTime> availableSlots;

    public AvailabilityResponseDto(LocalDate date, List<LocalTime> availableSlots) {
        this.date = date;
        this.availableSlots = availableSlots;
    }

    // Getters and Setters
    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public List<LocalTime> getAvailableSlots() {
        return availableSlots;
    }

    public void voidsetAvailableSlots(List<LocalTime> availableSlots) {
        this.availableSlots = availableSlots;
    }
}
