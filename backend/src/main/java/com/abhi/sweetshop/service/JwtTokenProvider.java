package com.abhi.sweetshop.service;

import org.springframework.security.core.userdetails.UserDetails;

public interface JwtTokenProvider {
    String generateToken(UserDetails userDetails);
    String extractUsername(String token);
    Boolean validateToken(String token);
}

