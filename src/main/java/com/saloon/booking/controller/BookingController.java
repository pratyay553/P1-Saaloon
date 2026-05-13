package com.saloon.booking.controller;

import com.saloon.booking.model.ServiceItem;
import com.saloon.booking.service.BookingService;
import com.saloon.common.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
