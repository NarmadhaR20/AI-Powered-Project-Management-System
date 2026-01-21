package com.example.projectmanagement.service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.projectmanagement.dto.LoginRequest;
import com.example.projectmanagement.dto.LoginResponse;
import com.example.projectmanagement.dto.RegisterRequest;
import com.example.projectmanagement.entity.User;
import com.example.projectmanagement.repository.UserRepository;
import com.example.projectmanagement.security.JwtUtil;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository,
            BCryptPasswordEncoder passwordEncoder,
            JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public void register(RegisterRequest request) {

    System.out.println("ROLE FROM FRONTEND = " + request.role);

    String role = request.role;

    // fallback safety
    if (role == null || role.isBlank()) {
        role = "USER";
    }

    role = role.toUpperCase();

    // allow only USER or GUEST at signup
    if (!role.equals("USER") && !role.equals("GUEST")) {
        throw new RuntimeException("Invalid role");
    }

    User user = new User();
    user.setName(request.name);
    user.setEmail(request.email);
    user.setPassword(passwordEncoder.encode(request.password));
    user.setRole(role);

    userRepository.save(user);
}


    public LoginResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());

        return new LoginResponse(token);
    }

}
