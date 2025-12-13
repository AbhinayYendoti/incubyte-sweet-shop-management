package com.abhi.sweetshop.sweet;

import com.abhi.sweetshop.model.SweetItem;
import com.abhi.sweetshop.repository.SweetRepository;
import com.abhi.sweetshop.service.SweetService;
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
 * Implement SweetService, SweetRepository, and SweetItem to make these tests pass.
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("Sweet Service Tests")
class SweetServiceTests {

    @Mock
    private SweetRepository sweetRepository;

    @InjectMocks
    private SweetService sweetService;

    private SweetItem testSweet;
    private String sweetName;
    private String sweetDescription;
    private double sweetPrice;

    @BeforeEach
    void setUp() {
        sweetName = "Gulab Jamun";
        sweetDescription = "Deep-fried dumpling soaked in sugar syrup";
        sweetPrice = 25.50;

        testSweet = new SweetItem();
        testSweet.setId(1L);
        testSweet.setName(sweetName);
        testSweet.setDescription(sweetDescription);
        testSweet.setPrice(sweetPrice);
    }

    @Test
    @DisplayName("Should create and return a new sweet item")
    void shouldCreateAndReturnNewSweetItem() {
        // TODO: Implement SweetService.createSweet() method
        // Given: Valid sweet details (name, description, price)
        // When: Creating a new sweet item
        // Then: Should save and return the created sweet

        when(sweetRepository.save(any(SweetItem.class))).thenAnswer(invocation -> {
            SweetItem sweet = invocation.getArgument(0);
            sweet.setId(1L); // Simulate database ID assignment
            return sweet;
        });

        SweetItem createdSweet = sweetService.createSweet(sweetName, sweetDescription, sweetPrice);

        assertNotNull(createdSweet, "Created sweet should not be null");
        assertEquals(sweetName, createdSweet.getName(), "Sweet name should match");
        assertEquals(sweetDescription, createdSweet.getDescription(), "Sweet description should match");
        assertEquals(sweetPrice, createdSweet.getPrice(), 0.01, "Sweet price should match");
        assertNotNull(createdSweet.getId(), "Sweet should have an ID assigned");
        verify(sweetRepository, times(1)).save(any(SweetItem.class));
    }

    @Test
    @DisplayName("Should fetch a sweet item by ID")
    void shouldFetchSweetItemById() {
        // TODO: Implement SweetService.getSweetById() method
        // Given: Sweet exists in database with known ID
        // When: Fetching sweet by ID
        // Then: Should return the sweet with matching ID

        when(sweetRepository.findById(1L)).thenReturn(Optional.of(testSweet));

        SweetItem foundSweet = sweetService.getSweetById(1L);

        assertNotNull(foundSweet, "Found sweet should not be null");
        assertEquals(testSweet.getId(), foundSweet.getId(), "Sweet ID should match");
        assertEquals(testSweet.getName(), foundSweet.getName(), "Sweet name should match");
        assertEquals(testSweet.getDescription(), foundSweet.getDescription(), "Sweet description should match");
        assertEquals(testSweet.getPrice(), foundSweet.getPrice(), 0.01, "Sweet price should match");
        verify(sweetRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("Should throw exception when sweet not found")
    void shouldThrowExceptionWhenSweetNotFound() {
        // TODO: Implement sweet not found check in SweetService.getSweetById()
        // Given: Sweet does not exist in database
        // When: Fetching sweet by non-existent ID
        // Then: Should throw an exception (e.g., SweetNotFoundException)

        when(sweetRepository.findById(999L)).thenReturn(Optional.empty());

        Exception exception = assertThrows(Exception.class, () -> {
            sweetService.getSweetById(999L);
        }, "Should throw exception for non-existent sweet");

        assertNotNull(exception, "Exception should be thrown");
        assertTrue(exception.getMessage().toLowerCase().contains("sweet") ||
                   exception.getMessage().toLowerCase().contains("not found") ||
                   exception.getMessage().toLowerCase().contains("does not exist"),
                   "Exception message should indicate sweet not found");
        verify(sweetRepository, times(1)).findById(999L);
    }

    @Test
    @DisplayName("Should update an existing sweet's fields")
    void shouldUpdateExistingSweetsFields() {
        // TODO: Implement SweetService.updateSweet() method
        // Given: Existing sweet in database
        // When: Updating sweet fields (name, description, price)
        // Then: Should update and return the modified sweet

        Long sweetId = 1L;
        String updatedName = "Kala Jamun";
        String updatedDescription = "Black variant of Gulab Jamun";
        double updatedPrice = 30.00;

        when(sweetRepository.findById(sweetId)).thenReturn(Optional.of(testSweet));
        when(sweetRepository.save(any(SweetItem.class))).thenAnswer(invocation -> {
            SweetItem sweet = invocation.getArgument(0);
            return sweet;
        });

        SweetItem updatedSweet = sweetService.updateSweet(sweetId, updatedName, updatedDescription, updatedPrice);

        assertNotNull(updatedSweet, "Updated sweet should not be null");
        assertEquals(sweetId, updatedSweet.getId(), "Sweet ID should remain the same");
        assertEquals(updatedName, updatedSweet.getName(), "Sweet name should be updated");
        assertEquals(updatedDescription, updatedSweet.getDescription(), "Sweet description should be updated");
        assertEquals(updatedPrice, updatedSweet.getPrice(), 0.01, "Sweet price should be updated");
        verify(sweetRepository, times(1)).findById(sweetId);
        verify(sweetRepository, times(1)).save(any(SweetItem.class));
    }

    @Test
    @DisplayName("Should delete a sweet by ID")
    void shouldDeleteSweetById() {
        // TODO: Implement SweetService.deleteSweet() method
        // Given: Sweet exists in database
        // When: Deleting sweet by ID
        // Then: Should remove the sweet from repository

        Long sweetId = 1L;

        when(sweetRepository.existsById(sweetId)).thenReturn(true);
        doNothing().when(sweetRepository).deleteById(sweetId);

        sweetService.deleteSweet(sweetId);

        verify(sweetRepository, times(1)).existsById(sweetId);
        verify(sweetRepository, times(1)).deleteById(sweetId);
    }

    @Test
    @DisplayName("Should return a list of all sweet items")
    void shouldReturnListOfAllSweetItems() {
        // TODO: Implement SweetService.listAllSweets() method
        // Given: Multiple sweets exist in database
        // When: Fetching all sweets
        // Then: Should return a list containing all sweets

        SweetItem sweet1 = new SweetItem();
        sweet1.setId(1L);
        sweet1.setName("Gulab Jamun");
        sweet1.setDescription("Deep-fried dumpling soaked in sugar syrup");
        sweet1.setPrice(25.50);

        SweetItem sweet2 = new SweetItem();
        sweet2.setId(2L);
        sweet2.setName("Rasgulla");
        sweet2.setDescription("Soft spongy balls in sugar syrup");
        sweet2.setPrice(30.00);

        SweetItem sweet3 = new SweetItem();
        sweet3.setId(3L);
        sweet3.setName("Barfi");
        sweet3.setDescription("Milk-based fudge");
        sweet3.setPrice(35.75);

        List<SweetItem> allSweets = Arrays.asList(sweet1, sweet2, sweet3);

        when(sweetRepository.findAll()).thenReturn(allSweets);

        List<SweetItem> result = sweetService.listAllSweets();

        assertNotNull(result, "Result list should not be null");
        assertEquals(3, result.size(), "Should return 3 sweets");
        assertEquals(sweet1.getName(), result.get(0).getName(), "First sweet name should match");
        assertEquals(sweet2.getName(), result.get(1).getName(), "Second sweet name should match");
        assertEquals(sweet3.getName(), result.get(2).getName(), "Third sweet name should match");
        verify(sweetRepository, times(1)).findAll();
    }
}

