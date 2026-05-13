package com.saloon.booking.dto;

import com.saloon.booking.model.AppointmentStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class AppointmentDto {
    private Long id;
    private String serviceName;
    private String staffName;
    private LocalDateTime appointmentDateTime;
    private AppointmentStatus status;
    private BigDecimal servicePrice;
    private Integer serviceDuration;

    public AppointmentDto(Long id, String serviceName, String staffName, LocalDateTime appointmentDateTime, AppointmentStatus status, BigDecimal servicePrice, Integer serviceDuration) {
        this.id = id;
        this.serviceName = serviceName;
        this.staffName = staffName;
        this.appointmentDateTime = appointmentDateTime;
        this.status = status;
        this.servicePrice = servicePrice;
        this.serviceDuration = serviceDuration;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getServiceName() {
        return serviceName;
    }

    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }

    public String getStaffName() {
        return staffName;
    }

    public void setStaffName(String staffName) {
        this.staffName = staffName;
    }

    public LocalDateTime getAppointmentDateTime() {
        return appointmentDateTime;
    }

    public void setAppointmentDateTime(LocalDateTime appointmentDateTime) {
        this.appointmentDateTime = appointmentDateTime;
    }

    public AppointmentStatus getStatus() {
        return status;
    }

    public void setStatus(AppointmentStatus status) {
        this.status = status;
    }

    public BigDecimal getServicePrice() {
        return servicePrice;
    }

    public void setServicePrice(BigDecimal servicePrice) {
        this.servicePrice = servicePrice;
    }

    public Integer getServiceDuration() {
        return serviceDuration;
    }

    public void setServiceDuration(Integer serviceDuration) {
        this.serviceDuration = serviceDuration;
    }
}
