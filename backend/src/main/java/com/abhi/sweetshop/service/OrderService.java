package com.abhi.sweetshop.service;

import com.abhi.sweetshop.model.Order;
import com.abhi.sweetshop.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public Order createOrder(String customerName, double totalAmount) {
        if (customerName == null || customerName.isEmpty()) {
            throw new IllegalArgumentException("Customer name cannot be empty");
        }
        if (totalAmount < 0) {
            throw new IllegalArgumentException("Total amount must be greater than or equal to 0");
        }

        Order order = new Order();
        order.setCustomerName(customerName);
        order.setTotalAmount(totalAmount);
        order.setCreatedAt(LocalDateTime.now());
        return orderRepository.save(order);
    }

    public Order getOrderById(Long id) {
        Optional<Order> order = orderRepository.findById(id);
        if (order.isEmpty()) {
            throw new RuntimeException("Order not found");
        }
        return order.get();
    }

    public List<Order> listAllOrders() {
        return orderRepository.findAll();
    }

    public void deleteOrder(Long id) {
        if (!orderRepository.existsById(id)) {
            throw new RuntimeException("Order not found");
        }
        orderRepository.deleteById(id);
    }
}




