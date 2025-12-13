package com.abhi.sweetshop.controller;

import com.abhi.sweetshop.dto.auth.LoginRequest;
import com.abhi.sweetshop.dto.auth.LoginResponse;
import com.abhi.sweetshop.dto.auth.RegisterRequest;
import com.abhi.sweetshop.model.User;
import com.abhi.sweetshop.service.AuthenticationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationService authService;

    public AuthController(AuthenticationService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}
