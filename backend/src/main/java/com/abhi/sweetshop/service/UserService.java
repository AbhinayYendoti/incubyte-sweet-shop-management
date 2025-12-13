package com.abhi.sweetshop.service;

import com.abhi.sweetshop.exception.UserAlreadyExistsException;
import com.abhi.sweetshop.model.User;
import com.abhi.sweetshop.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User register(String email, String password, String name) {
        // Validate required fields
        if (email == null || email.isEmpty()) {
            throw new IllegalArgumentException("Email cannot be empty");
        }
        if (password == null || password.isEmpty()) {
            throw new IllegalArgumentException("Password cannot be empty");
        }
        if (name == null || name.isEmpty()) {
            throw new IllegalArgumentException("Name cannot be empty");
        }

        // Check if email already exists
        if (userRepository.findByEmail(email).isPresent()) {
            throw new UserAlreadyExistsException("Email already exists");
        }

        // Create new user
        User user = new User();
        user.setEmail(email);
        user.setName(name);
        
        // Hash password before saving
        String hashedPassword = passwordEncoder.encode(password);
        user.setPassword(hashedPassword);

        // Save and return user
        return userRepository.save(user);
    }
}

