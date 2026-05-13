package com.saloon.booking.service;

import com.saloon.booking.model.ServiceItem;
import com.saloon.booking.repository.ServiceItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingService {

    @Autowired
    private ServiceItemRepository serviceItemRepository;

    public List<ServiceItem> getAllServices() {
        return serviceItemRepository.findAll();
    }
}
