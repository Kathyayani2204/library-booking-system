package com.library.librarybookingsystem.service;

import com.library.librarybookingsystem.dto.AuthResponse;
import com.library.librarybookingsystem.dto.LoginRequest;
import com.library.librarybookingsystem.dto.RegisterRequest;
import com.library.librarybookingsystem.entity.Role;
import com.library.librarybookingsystem.entity.User;
import com.library.librarybookingsystem.repository.UserRepository;
import com.library.librarybookingsystem.security.JwtUtil;

import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    // Register a new user
    public String register(RegisterRequest request) {

        // Check if email is already registered
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        // Create new user
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .build();

        // Save user to database
        userRepository.save(user);

        return "User registered successfully";
    }

    // Login user
    public AuthResponse login(LoginRequest request) {

        // Find user by email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("Invalid email or password")
                );

        // Check password
        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword()
        )) {
            throw new RuntimeException("Invalid email or password");
        }

        // Generate JWT token
        String token = jwtUtil.generateToken(
                user.getEmail(),
                user.getRole().name()
        );

        // Return token and user information
        return new AuthResponse(
                token,
                user.getId(),
                user.getName(),
                user.getRole().name()
        );
    }
}