package com.saloon.booking.repository;

import com.saloon.booking.model.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StaffRepository extends JpaxRepository<Staff, Long> {
}
