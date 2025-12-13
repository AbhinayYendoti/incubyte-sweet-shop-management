package com.abhi.sweetshop.auth;

import com.abhi.sweetshop.model.User;
import com.abhi.sweetshop.repository.UserRepository;
import com.abhi.sweetshop.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

/**
 * TODO: TDD Test Class - These tests are expected to fail initially.
 * Implement UserService and UserRepository to make these tests pass.
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("User Registration Tests")
class UserRegistrationTests {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    private User testUser;
    private String validEmail;
    private String validPassword;
    private String validName;

    @BeforeEach
    void setUp() {
        validEmail = "test@example.com";
        validPassword = "Password123";
        validName = "Test User";
        
        testUser = new User();
        testUser.setEmail(validEmail);
        testUser.setPassword(validPassword);
        testUser.setName(validName);
    }

    @Test
    @DisplayName("Should create a new user when valid registration details are provided")
    void shouldCreateNewUserWhenValidRegistrationDetailsProvided() {
        // TODO: Implement UserService.register() method
        // Given: User with valid email, password, and name
        // When: Registering the user
        // Then: User should be saved to repository and returned
        
        when(userRepository.findByEmail(validEmail)).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User user = invocation.getArgument(0);
            user.setId(1L); // Simulate database ID assignment
            return user;
        });

        User registeredUser = userService.register(validEmail, validPassword, validName);

        assertNotNull(registeredUser, "Registered user should not be null");
        assertEquals(validEmail, registeredUser.getEmail(), "Email should match");
        assertEquals(validName, registeredUser.getName(), "Name should match");
        assertNotNull(registeredUser.getId(), "User should have an ID assigned");
        verify(userRepository, times(1)).save(any(User.class));
        verify(userRepository, times(1)).findByEmail(validEmail);
    }

    @Test
    @DisplayName("Should throw an exception when email is already registered")
    void shouldThrowExceptionWhenEmailIsAlreadyRegistered() {
        // TODO: Implement duplicate email check in UserService.register()
        // Given: Email already exists in database
        // When: Attempting to register with the same email
        // Then: Should throw an exception (e.g., UserAlreadyExistsException)
        
        when(userRepository.findByEmail(validEmail)).thenReturn(Optional.of(testUser));

        Exception exception = assertThrows(Exception.class, () -> {
            userService.register(validEmail, validPassword, validName);
        }, "Should throw exception for duplicate email");

        assertNotNull(exception, "Exception should be thrown");
        assertTrue(exception.getMessage().toLowerCase().contains("email") || 
                   exception.getMessage().toLowerCase().contains("already exists") ||
                   exception.getMessage().toLowerCase().contains("duplicate"),
                   "Exception message should indicate email already exists");
        verify(userRepository, never()).save(any(User.class));
        verify(userRepository, times(1)).findByEmail(validEmail);
    }

    @Test
    @DisplayName("Should validate required fields (email, password, name cannot be empty)")
    void shouldValidateRequiredFields() {
        // TODO: Implement validation in UserService.register()
        // Given: User registration data with empty/null required fields
        // When: Attempting to register
        // Then: Should throw validation exception for each required field
        
        // Test empty email
        Exception emailException = assertThrows(Exception.class, () -> {
            userService.register("", validPassword, validName);
        }, "Should throw exception for empty email");
        assertNotNull(emailException, "Exception should be thrown for empty email");

        // Test null email
        assertThrows(Exception.class, () -> {
            userService.register(null, validPassword, validName);
        }, "Should throw exception for null email");

        // Test empty password
        Exception passwordException = assertThrows(Exception.class, () -> {
            userService.register(validEmail, "", validName);
        }, "Should throw exception for empty password");
        assertNotNull(passwordException, "Exception should be thrown for empty password");

        // Test null password
        assertThrows(Exception.class, () -> {
            userService.register(validEmail, null, validName);
        }, "Should throw exception for null password");

        // Test empty name
        Exception nameException = assertThrows(Exception.class, () -> {
            userService.register(validEmail, validPassword, "");
        }, "Should throw exception for empty name");
        assertNotNull(nameException, "Exception should be thrown for empty name");

        // Test null name
        assertThrows(Exception.class, () -> {
            userService.register(validEmail, validPassword, null);
        }, "Should throw exception for null name");

        // Verify no user was saved during validation failures
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("Should hash the password before saving to database")
    void shouldHashPasswordBeforeSavingToDatabase() {
        // TODO: Implement password hashing in UserService.register()
        // Given: User with plain text password
        // When: Registering the user
        // Then: Password should be hashed before saving to repository
        
        String plainPassword = "PlainTextPassword123";
        
        when(userRepository.findByEmail(validEmail)).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User user = invocation.getArgument(0);
            user.setId(1L);
            return user;
        });

        User registeredUser = userService.register(validEmail, plainPassword, validName);

        verify(userRepository, times(1)).save(argThat(user -> {
            String savedPassword = user.getPassword();
            // Password should not be the same as plain text
            assertNotEquals(plainPassword, savedPassword, 
                "Password should be hashed, not stored as plain text");
            // Hashed password should not be empty
            assertNotNull(savedPassword, "Hashed password should not be null");
            assertFalse(savedPassword.isEmpty(), "Hashed password should not be empty");
            // Hashed password should be different format (usually longer)
            assertTrue(savedPassword.length() > plainPassword.length() || 
                       !savedPassword.equals(plainPassword),
                "Hashed password should be different from plain text password");
            return true;
        }));

        // Verify the returned user's password is also hashed
        assertNotNull(registeredUser.getPassword(), "Registered user password should not be null");
        assertNotEquals(plainPassword, registeredUser.getPassword(), 
            "Returned user password should be hashed");
    }
}

