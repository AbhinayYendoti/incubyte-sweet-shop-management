package com.abhi.sweetshop.order;

import com.abhi.sweetshop.model.Order;
import com.abhi.sweetshop.repository.OrderRepository;
import com.abhi.sweetshop.service.OrderService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Integration tests for OrderService using Testcontainers with PostgreSQL.
 * 
 * Why Testcontainers improves reliability:
 * - Tests run against a real PostgreSQL database, not mocks
 * - Catches database-specific issues (constraints, transactions, SQL syntax)
 * - Ensures JPA mappings work correctly with actual database
 * - Validates repository methods against real database behavior
 * - Provides isolated test environment that's automatically cleaned up
 * 
 * Docker Availability Handling:
 * - Uses @Testcontainers(disabledWithoutDocker = true) for automatic Docker detection
 * - Tests are automatically skipped (not failed) if Docker is unavailable
 * - CI-friendly: builds don't fail when Docker is missing
 * - Reviewer-friendly: clear intent, no manual Docker checks needed
 */
@Testcontainers(disabledWithoutDocker = true)
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(OrderService.class)
@DisplayName("Order Service Integration Tests")
class OrderServiceIntegrationTests {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15-alpine")
            .withDatabaseName("testdb")
            .withUsername("test")
            .withPassword("test");

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderService orderService;

    @BeforeEach
    void setUp() {
        orderRepository.deleteAll();
    }

    @Test
    @DisplayName("Should create and persist order in database")
    void shouldCreateAndPersistOrderInDatabase() {
        String customerName = "John Doe";
        double totalAmount = 125.75;

        Order createdOrder = orderService.createOrder(customerName, totalAmount);

        assertNotNull(createdOrder.getId(), "Order should have an ID assigned by database");
        assertEquals(customerName, createdOrder.getCustomerName());
        assertEquals(totalAmount, createdOrder.getTotalAmount(), 0.01);
        assertNotNull(createdOrder.getCreatedAt(), "CreatedAt should be set automatically");

        Order persistedOrder = orderRepository.findById(createdOrder.getId()).orElse(null);
        assertNotNull(persistedOrder, "Order should be persisted in database");
        assertEquals(customerName, persistedOrder.getCustomerName());
    }

    @Test
    @DisplayName("Should fetch order by ID from database")
    void shouldFetchOrderByIdFromDatabase() {
        Order order = new Order();
        order.setCustomerName("Jane Smith");
        order.setTotalAmount(250.50);
        order.setCreatedAt(LocalDateTime.now());
        Order savedOrder = orderRepository.save(order);

        Order foundOrder = orderService.getOrderById(savedOrder.getId());

        assertNotNull(foundOrder);
        assertEquals(savedOrder.getId(), foundOrder.getId());
        assertEquals("Jane Smith", foundOrder.getCustomerName());
        assertEquals(250.50, foundOrder.getTotalAmount(), 0.01);
    }

    @Test
    @DisplayName("Should throw exception when order not found in database")
    void shouldThrowExceptionWhenOrderNotFoundInDatabase() {
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            orderService.getOrderById(999L);
        });

        assertTrue(exception.getMessage().toLowerCase().contains("order") ||
                   exception.getMessage().toLowerCase().contains("not found"));
    }

    @Test
    @DisplayName("Should list all orders from database")
    void shouldListAllOrdersFromDatabase() {
        Order order1 = new Order();
        order1.setCustomerName("Customer 1");
        order1.setTotalAmount(100.0);
        order1.setCreatedAt(LocalDateTime.now());
        orderRepository.save(order1);

        Order order2 = new Order();
        order2.setCustomerName("Customer 2");
        order2.setTotalAmount(200.0);
        order2.setCreatedAt(LocalDateTime.now());
        orderRepository.save(order2);

        List<Order> allOrders = orderService.listAllOrders();

        assertEquals(2, allOrders.size());
        assertTrue(allOrders.stream().anyMatch(o -> o.getCustomerName().equals("Customer 1")));
        assertTrue(allOrders.stream().anyMatch(o -> o.getCustomerName().equals("Customer 2")));
    }

    @Test
    @DisplayName("Should delete order from database")
    void shouldDeleteOrderFromDatabase() {
        Order order = new Order();
        order.setCustomerName("To Delete");
        order.setTotalAmount(50.0);
        order.setCreatedAt(LocalDateTime.now());
        Order savedOrder = orderRepository.save(order);

        orderService.deleteOrder(savedOrder.getId());

        assertFalse(orderRepository.existsById(savedOrder.getId()), 
                   "Order should be deleted from database");
    }

    @Test
    @DisplayName("Should throw exception when deleting non-existent order")
    void shouldThrowExceptionWhenDeletingNonExistentOrder() {
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            orderService.deleteOrder(999L);
        });

        assertTrue(exception.getMessage().toLowerCase().contains("order") ||
                   exception.getMessage().toLowerCase().contains("not found"));
    }

    @Test
    @DisplayName("Should validate customer name cannot be empty")
    void shouldValidateCustomerNameCannotBeEmpty() {
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            orderService.createOrder("", 100.0);
        });

        assertTrue(exception.getMessage().toLowerCase().contains("customer name"));
    }

    @Test
    @DisplayName("Should validate total amount must be non-negative")
    void shouldValidateTotalAmountMustBeNonNegative() {
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            orderService.createOrder("Customer", -10.0);
        });

        assertTrue(exception.getMessage().toLowerCase().contains("amount"));
    }
}

