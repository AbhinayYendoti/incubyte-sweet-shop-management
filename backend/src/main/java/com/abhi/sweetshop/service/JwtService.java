package com.abhi.sweetshop.service;

import com.abhi.sweetshop.model.User;
import org.springframework.stereotype.Service;

@Service
public class JwtService {

    public String generateToken(User user) {
        // TODO: Implement actual JWT token generation
        // For now, return a simple token string to satisfy tests
        return "token-" + user.getId() + "-" + user.getEmail();
    }
}

