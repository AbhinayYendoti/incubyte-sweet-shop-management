package com.abhi.sweetshop.auth;

import com.abhi.sweetshop.dto.auth.LoginRequest;
import com.abhi.sweetshop.dto.auth.LoginResponse;
import com.abhi.sweetshop.model.User;
import com.abhi.sweetshop.repository.UserRepository;
import com.abhi.sweetshop.service.AuthenticationService;
import com.abhi.sweetshop.service.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

/**
 * TODO: TDD Test Class - These tests are expected to fail initially.
 * Implement AuthenticationService, JwtService, and related components to make these tests pass.
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("User Login Tests")
class UserLoginTests {

    @Mock
    private UserRepository userRepository;

    @Mock
    private JwtService jwtService;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthenticationService authenticationService;

    private User testUser;
    private String validEmail;
    private String validPassword;
    private String hashedPassword;
    private String jwtToken;

    @BeforeEach
    void setUp() {
        validEmail = "test@example.com";
        validPassword = "Password123";
        hashedPassword = "$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.Hz5Y1B1MZBJk9qEKpLd.y"; // Sample BCrypt hash
        jwtToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail(validEmail);
        testUser.setPassword(hashedPassword);
        testUser.setName("Test User");
    }

    @Test
    @DisplayName("Should authenticate and return JWT token when email and password are correct")
    void shouldAuthenticateAndReturnJwtTokenWhenEmailAndPasswordAreCorrect() {
        // TODO: Implement AuthenticationService.login() method
        // Given: User with correct email and password exists
        // When: Logging in with correct credentials
        // Then: Should return a JWT token

        when(userRepository.findByEmail(validEmail)).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches(validPassword, hashedPassword)).thenReturn(true);
        when(jwtService.generateToken(any(User.class))).thenReturn(jwtToken);

        LoginResponse result = authenticationService.login(new LoginRequest(validEmail, validPassword));

        assertNotNull(result, "LoginResponse should not be null");
        assertNotNull(result.getToken(), "JWT token should not be null");
        assertEquals(jwtToken, result.getToken(), "Returned token should match generated token");
        verify(userRepository, times(1)).findByEmail(validEmail);
        verify(passwordEncoder, times(1)).matches(validPassword, hashedPassword);
        verify(jwtService, times(1)).generateToken(testUser);
    }

    @Test
    @DisplayName("Should throw exception when email is not found")
    void shouldThrowExceptionWhenEmailIsNotFound() {
        // TODO: Implement email not found check in AuthenticationService.login()
        // Given: Email does not exist in database
        // When: Attempting to login with non-existent email
        // Then: Should throw an exception (e.g., UserNotFoundException or AuthenticationException)

        when(userRepository.findByEmail(validEmail)).thenReturn(Optional.empty());

        Exception exception = assertThrows(Exception.class, () -> {
            authenticationService.login(new LoginRequest(validEmail, validPassword));
        }, "Should throw exception for non-existent email");

        assertNotNull(exception, "Exception should be thrown");
        assertTrue(exception.getMessage().toLowerCase().contains("email") ||
                   exception.getMessage().toLowerCase().contains("not found") ||
                   exception.getMessage().toLowerCase().contains("invalid") ||
                   exception.getMessage().toLowerCase().contains("authentication"),
                   "Exception message should indicate email not found or invalid credentials");

        verify(userRepository, times(1)).findByEmail(validEmail);
        verify(passwordEncoder, never()).matches(anyString(), anyString());
        verify(jwtService, never()).generateToken(any(User.class));
    }

    @Test
    @DisplayName("Should throw exception when password does not match")
    void shouldThrowExceptionWhenPasswordDoesNotMatch() {
        // TODO: Implement password mismatch check in AuthenticationService.login()
        // Given: User exists but password is incorrect
        // When: Attempting to login with wrong password
        // Then: Should throw an exception (e.g., InvalidPasswordException or AuthenticationException)

        String wrongPassword = "WrongPassword123";

        when(userRepository.findByEmail(validEmail)).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches(wrongPassword, hashedPassword)).thenReturn(false);

        Exception exception = assertThrows(Exception.class, () -> {
            authenticationService.login(new LoginRequest(validEmail, wrongPassword));
        }, "Should throw exception for incorrect password");

        assertNotNull(exception, "Exception should be thrown");
        assertTrue(exception.getMessage().toLowerCase().contains("password") ||
                   exception.getMessage().toLowerCase().contains("invalid") ||
                   exception.getMessage().toLowerCase().contains("authentication") ||
                   exception.getMessage().toLowerCase().contains("credentials"),
                   "Exception message should indicate password mismatch or invalid credentials");

        verify(userRepository, times(1)).findByEmail(validEmail);
        verify(passwordEncoder, times(1)).matches(wrongPassword, hashedPassword);
        verify(jwtService, never()).generateToken(any(User.class));
    }

    @Test
    @DisplayName("Should ensure password comparison uses BCryptPasswordEncoder")
    void shouldEnsurePasswordComparisonUsesBcryptPasswordEncoder() {
        // TODO: Implement password verification using BCryptPasswordEncoder in AuthenticationService.login()
        // Given: User with BCrypt hashed password exists
        // When: Logging in with correct password
        // Then: PasswordEncoder.matches() should be called with plain password and hashed password

        when(userRepository.findByEmail(validEmail)).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches(validPassword, hashedPassword)).thenReturn(true);
        when(jwtService.generateToken(any(User.class))).thenReturn(jwtToken);

        authenticationService.login(new LoginRequest(validEmail, validPassword));

        // Verify that passwordEncoder.matches() is called with the correct arguments
        verify(passwordEncoder, times(1)).matches(eq(validPassword), eq(hashedPassword));
        
        // Verify the order: first find user, then verify password, then generate token
        verify(userRepository, times(1)).findByEmail(validEmail);
        verify(passwordEncoder, times(1)).matches(validPassword, hashedPassword);
        verify(jwtService, times(1)).generateToken(testUser);
    }

    @Test
    @DisplayName("Should not generate JWT if authentication fails")
    void shouldNotGenerateJwtIfAuthenticationFails() {
        // TODO: Ensure JWT generation only happens after successful authentication
        // Given: Authentication fails (either email not found or password mismatch)
        // When: Attempting to login with invalid credentials
        // Then: JwtService.generateToken() should never be called

        // Test case 1: Email not found
        when(userRepository.findByEmail("nonexistent@example.com")).thenReturn(Optional.empty());

        assertThrows(Exception.class, () -> {
            authenticationService.login(new LoginRequest("nonexistent@example.com", validPassword));
        }, "Should throw exception for non-existent email");

        verify(jwtService, never()).generateToken(any(User.class));

        // Reset mocks for second test case
        reset(jwtService);

        // Test case 2: Password mismatch
        when(userRepository.findByEmail(validEmail)).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("wrongPassword", hashedPassword)).thenReturn(false);

        assertThrows(Exception.class, () -> {
            authenticationService.login(new LoginRequest(validEmail, "wrongPassword"));
        }, "Should throw exception for incorrect password");

        verify(jwtService, never()).generateToken(any(User.class));
    }
}

