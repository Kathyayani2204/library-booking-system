package com.library.librarybookingsystem.controller;

import com.library.librarybookingsystem.dto.AuthResponse;
import com.library.librarybookingsystem.dto.LoginRequest;
import com.library.librarybookingsystem.dto.RegisterRequest;
import com.library.librarybookingsystem.service.AuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public String register(
            @Valid @RequestBody RegisterRequest request
    ) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(
            @Valid @RequestBody LoginRequest request
    ) {
        return authService.login(request);
    }
}