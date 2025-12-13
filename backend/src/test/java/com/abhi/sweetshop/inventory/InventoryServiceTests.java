package com.abhi.sweetshop.inventory;

import com.abhi.sweetshop.model.InventoryItem;
import com.abhi.sweetshop.repository.InventoryRepository;
import com.abhi.sweetshop.service.InventoryService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * TODO: TDD Test Class - These tests are expected to fail initially.
 * Implement InventoryService, InventoryRepository, and InventoryItem to make these tests pass.
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("Inventory Service Tests")
class InventoryServiceTests {

    @Mock
    private InventoryRepository inventoryRepository;

    @InjectMocks
    private InventoryService inventoryService;

    private InventoryItem testItem;
    private String itemName;
    private String itemDescription;
    private double itemPrice;
    private int itemQuantity;

    @BeforeEach
    void setUp() {
        itemName = "Gulab Jamun";
        itemDescription = "Sweet Indian dessert";
        itemPrice = 25.50;
        itemQuantity = 100;

        testItem = new InventoryItem();
        testItem.setId(1L);
        testItem.setName(itemName);
        testItem.setDescription(itemDescription);
        testItem.setPrice(itemPrice);
        testItem.setQuantity(itemQuantity);
    }

    @Test
    @DisplayName("Should create and return a new inventory item")
    void shouldCreateAndReturnNewInventoryItem() {
        // TODO: Implement InventoryService.createItem() method
        // Given: Valid item details (name, description, price, quantity)
        // When: Creating a new inventory item
        // Then: Should save and return the created item

        when(inventoryRepository.save(any(InventoryItem.class))).thenAnswer(invocation -> {
            InventoryItem item = invocation.getArgument(0);
            item.setId(1L); // Simulate database ID assignment
            return item;
        });

        InventoryItem createdItem = inventoryService.createItem(itemName, itemDescription, itemPrice, itemQuantity);

        assertNotNull(createdItem, "Created item should not be null");
        assertEquals(itemName, createdItem.getName(), "Item name should match");
        assertEquals(itemDescription, createdItem.getDescription(), "Item description should match");
        assertEquals(itemPrice, createdItem.getPrice(), 0.01, "Item price should match");
        assertEquals(itemQuantity, createdItem.getQuantity(), "Item quantity should match");
        assertNotNull(createdItem.getId(), "Item should have an ID assigned");
        verify(inventoryRepository, times(1)).save(any(InventoryItem.class));
    }

    @Test
    @DisplayName("Should fetch an item by ID")
    void shouldFetchItemById() {
        // TODO: Implement InventoryService.getItemById() method
        // Given: Item exists in database with known ID
        // When: Fetching item by ID
        // Then: Should return the item with matching ID

        when(inventoryRepository.findById(1L)).thenReturn(Optional.of(testItem));

        InventoryItem foundItem = inventoryService.getItemById(1L);

        assertNotNull(foundItem, "Found item should not be null");
        assertEquals(testItem.getId(), foundItem.getId(), "Item ID should match");
        assertEquals(testItem.getName(), foundItem.getName(), "Item name should match");
        assertEquals(testItem.getDescription(), foundItem.getDescription(), "Item description should match");
        assertEquals(testItem.getPrice(), foundItem.getPrice(), 0.01, "Item price should match");
        assertEquals(testItem.getQuantity(), foundItem.getQuantity(), "Item quantity should match");
        verify(inventoryRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("Should throw exception when item not found")
    void shouldThrowExceptionWhenItemNotFound() {
        // TODO: Implement item not found check in InventoryService.getItemById()
        // Given: Item does not exist in database
        // When: Fetching item by non-existent ID
        // Then: Should throw an exception (e.g., ItemNotFoundException)

        when(inventoryRepository.findById(999L)).thenReturn(Optional.empty());

        Exception exception = assertThrows(Exception.class, () -> {
            inventoryService.getItemById(999L);
        }, "Should throw exception for non-existent item");

        assertNotNull(exception, "Exception should be thrown");
        assertTrue(exception.getMessage().toLowerCase().contains("item") ||
                   exception.getMessage().toLowerCase().contains("not found") ||
                   exception.getMessage().toLowerCase().contains("does not exist"),
                   "Exception message should indicate item not found");
        verify(inventoryRepository, times(1)).findById(999L);
    }

    @Test
    @DisplayName("Should update an existing item's fields")
    void shouldUpdateExistingItemsFields() {
        // TODO: Implement InventoryService.updateItem() method
        // Given: Existing item in database
        // When: Updating item fields (name, description, price, quantity)
        // Then: Should update and return the modified item

        Long itemId = 1L;
        String updatedName = "Updated Gulab Jamun";
        String updatedDescription = "Updated description";
        double updatedPrice = 30.00;
        int updatedQuantity = 150;

        when(inventoryRepository.findById(itemId)).thenReturn(Optional.of(testItem));
        when(inventoryRepository.save(any(InventoryItem.class))).thenAnswer(invocation -> {
            InventoryItem item = invocation.getArgument(0);
            return item;
        });

        // Assuming updateItem takes a map or individual parameters
        // For now, assuming it can update any combination of fields
        InventoryItem updatedItem = inventoryService.updateItem(itemId, updatedName, updatedDescription, updatedPrice, updatedQuantity);

        assertNotNull(updatedItem, "Updated item should not be null");
        assertEquals(itemId, updatedItem.getId(), "Item ID should remain the same");
        assertEquals(updatedName, updatedItem.getName(), "Item name should be updated");
        assertEquals(updatedDescription, updatedItem.getDescription(), "Item description should be updated");
        assertEquals(updatedPrice, updatedItem.getPrice(), 0.01, "Item price should be updated");
        assertEquals(updatedQuantity, updatedItem.getQuantity(), "Item quantity should be updated");
        verify(inventoryRepository, times(1)).findById(itemId);
        verify(inventoryRepository, times(1)).save(any(InventoryItem.class));
    }

    @Test
    @DisplayName("Should delete an item by ID")
    void shouldDeleteItemById() {
        // TODO: Implement InventoryService.deleteItem() method
        // Given: Item exists in database
        // When: Deleting item by ID
        // Then: Should remove the item from repository

        Long itemId = 1L;

        when(inventoryRepository.existsById(itemId)).thenReturn(true);
        doNothing().when(inventoryRepository).deleteById(itemId);

        inventoryService.deleteItem(itemId);

        verify(inventoryRepository, times(1)).existsById(itemId);
        verify(inventoryRepository, times(1)).deleteById(itemId);
    }

    @Test
    @DisplayName("Should return a list of all items")
    void shouldReturnListOfAllItems() {
        // TODO: Implement InventoryService.listAllItems() method
        // Given: Multiple items exist in database
        // When: Fetching all items
        // Then: Should return a list containing all items

        InventoryItem item1 = new InventoryItem();
        item1.setId(1L);
        item1.setName("Gulab Jamun");
        item1.setDescription("Sweet dessert");
        item1.setPrice(25.50);
        item1.setQuantity(100);

        InventoryItem item2 = new InventoryItem();
        item2.setId(2L);
        item2.setName("Rasgulla");
        item2.setDescription("Sweet Indian sweet");
        item2.setPrice(30.00);
        item2.setQuantity(75);

        List<InventoryItem> allItems = Arrays.asList(item1, item2);

        when(inventoryRepository.findAll()).thenReturn(allItems);

        List<InventoryItem> result = inventoryService.listAllItems();

        assertNotNull(result, "Result list should not be null");
        assertEquals(2, result.size(), "Should return 2 items");
        assertEquals(item1.getName(), result.get(0).getName(), "First item name should match");
        assertEquals(item2.getName(), result.get(1).getName(), "Second item name should match");
        verify(inventoryRepository, times(1)).findAll();
    }
}

