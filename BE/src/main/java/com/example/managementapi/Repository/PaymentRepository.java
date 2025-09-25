package com.example.managementapi.Repository;


import com.example.managementapi.Entity.OrderItem;
import com.example.managementapi.Entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, String> {


}
