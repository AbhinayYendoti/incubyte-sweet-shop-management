package com.abhi.sweetshop.service;

import com.abhi.sweetshop.model.User;
import com.abhi.sweetshop.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthenticationService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public AuthenticationService(UserRepository userRepository, JwtService jwtService, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
    }

    public String login(String email, String password) {
        // Find user by email
        Optional<User> userOptional = userRepository.findByEmail(email);
        
        // If user not found, throw exception
        if (userOptional.isEmpty()) {
            throw new IllegalArgumentException("Invalid email or authentication failed");
        }

        User user = userOptional.get();

        // Verify password using PasswordEncoder
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new IllegalArgumentException("Invalid password or authentication failed");
        }

        // Generate and return JWT token
        return jwtService.generateToken(user);
    }
}

