package com.saloon.booking.repository;

import com.saloon.booking.model.Appointment;
import com.saloon.booking.model.Staff;
import com.saloon.user.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByCustomer(Account customer);

    // Find all appointments for a specific staff member within a given date range
    @Query("SELECT a FROM Appointment a WHERE a.staff = :staff AND a.appointmentDateTime >= :startOfDay AND a.appointmentDateTime < :endOfDay AND a.status != 'CANCELLED'")
    List<Appointment> findAppointmentsByStaffAndDate(
            @Param("staff") Staff staff, 
            @Param("startOfDay") LocalDateTime startOfDay, 
            @Param("endOfDay") LocalDateTime endOfDay);
}
