package com.abhi.sweetshop.order;

import com.abhi.sweetshop.model.Order;
import com.abhi.sweetshop.repository.OrderRepository;
import com.abhi.sweetshop.service.OrderService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * TODO: TDD Test Class - These tests are expected to fail initially.
 * Implement OrderService, OrderRepository, and Order to make these tests pass.
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("Order Service Tests")
class OrderServiceTests {

    @Mock
    private OrderRepository orderRepository;

    @InjectMocks
    private OrderService orderService;

    private Order testOrder;
    private String customerName;
    private double totalAmount;
    private LocalDateTime createdAt;

    @BeforeEach
    void setUp() {
        customerName = "John Doe";
        totalAmount = 125.75;
        createdAt = LocalDateTime.now();

        testOrder = new Order();
        testOrder.setId(1L);
        testOrder.setCustomerName(customerName);
        testOrder.setTotalAmount(totalAmount);
        testOrder.setCreatedAt(createdAt);
    }

    @Test
    @DisplayName("Should create new order")
    void shouldCreateNewOrder() {
        // TODO: Implement OrderService.createOrder() method
        // Given: Valid order details (customerName, totalAmount)
        // When: Creating a new order
        // Then: Should save and return the created order with ID assigned

        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> {
            Order order = invocation.getArgument(0);
            order.setId(1L); // Simulate database ID assignment
            return order;
        });

        Order createdOrder = orderService.createOrder(customerName, totalAmount);

        assertNotNull(createdOrder, "Created order should not be null");
        assertEquals(customerName, createdOrder.getCustomerName(), "Customer name should match");
        assertEquals(totalAmount, createdOrder.getTotalAmount(), 0.01, "Total amount should match");
        assertNotNull(createdOrder.getId(), "Order should have an ID assigned");
        verify(orderRepository, times(1)).save(any(Order.class));
    }

    @Test
    @DisplayName("Should fetch order by ID")
    void shouldFetchOrderById() {
        // TODO: Implement OrderService.getOrderById() method
        // Given: Order exists in database with known ID
        // When: Fetching order by ID
        // Then: Should return the order with matching ID

        when(orderRepository.findById(1L)).thenReturn(Optional.of(testOrder));

        Order foundOrder = orderService.getOrderById(1L);

        assertNotNull(foundOrder, "Found order should not be null");
        assertEquals(testOrder.getId(), foundOrder.getId(), "Order ID should match");
        assertEquals(testOrder.getCustomerName(), foundOrder.getCustomerName(), "Customer name should match");
        assertEquals(testOrder.getTotalAmount(), foundOrder.getTotalAmount(), 0.01, "Total amount should match");
        assertEquals(testOrder.getCreatedAt(), foundOrder.getCreatedAt(), "Created at should match");
        verify(orderRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("Should throw exception when order not found")
    void shouldThrowExceptionWhenOrderNotFound() {
        // TODO: Implement order not found check in OrderService.getOrderById()
        // Given: Order does not exist in database
        // When: Fetching order by non-existent ID
        // Then: Should throw an exception with message containing "order" or "not found"

        when(orderRepository.findById(999L)).thenReturn(Optional.empty());

        Exception exception = assertThrows(Exception.class, () -> {
            orderService.getOrderById(999L);
        }, "Should throw exception for non-existent order");

        assertNotNull(exception, "Exception should be thrown");
        assertTrue(exception.getMessage().toLowerCase().contains("order") ||
                   exception.getMessage().toLowerCase().contains("not found"),
                   "Exception message should indicate order not found");
        verify(orderRepository, times(1)).findById(999L);
    }

    @Test
    @DisplayName("Should list all orders")
    void shouldListAllOrders() {
        // TODO: Implement OrderService.listAllOrders() method
        // Given: Multiple orders exist in database
        // When: Fetching all orders
        // Then: Should return a list containing all orders

        Order order1 = new Order();
        order1.setId(1L);
        order1.setCustomerName("John Doe");
        order1.setTotalAmount(125.75);
        order1.setCreatedAt(LocalDateTime.now().minusDays(2));

        Order order2 = new Order();
        order2.setId(2L);
        order2.setCustomerName("Jane Smith");
        order2.setTotalAmount(250.50);
        order2.setCreatedAt(LocalDateTime.now().minusDays(1));

        List<Order> allOrders = Arrays.asList(order1, order2);

        when(orderRepository.findAll()).thenReturn(allOrders);

        List<Order> result = orderService.listAllOrders();

        assertNotNull(result, "Result list should not be null");
        assertEquals(2, result.size(), "Should return 2 orders");
        assertEquals(order1.getCustomerName(), result.get(0).getCustomerName(), "First order customer name should match");
        assertEquals(order2.getCustomerName(), result.get(1).getCustomerName(), "Second order customer name should match");
        verify(orderRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("Should delete order by ID")
    void shouldDeleteOrderById() {
        // TODO: Implement OrderService.deleteOrder() method
        // Given: Order exists in database
        // When: Deleting order by ID
        // Then: Should remove the order from repository

        Long orderId = 1L;

        when(orderRepository.existsById(orderId)).thenReturn(true);
        doNothing().when(orderRepository).deleteById(orderId);

        orderService.deleteOrder(orderId);

        verify(orderRepository, times(1)).existsById(orderId);
        verify(orderRepository, times(1)).deleteById(orderId);
    }
}

