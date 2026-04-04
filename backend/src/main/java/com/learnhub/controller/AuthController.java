package com.learnhub.controller;
//import com.learnhub.dto.AuthRequest;
import com.learnhub.dto.AuthResponse;
import com.learnhub.dto.LoginRequest;
import com.learnhub.dto.RegisterRequest;
import com.learnhub.security.JwtTokenProvider;
import com.learnhub.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    @Autowired
    private UserService userService;
    @Autowired
    private JwtTokenProvider tokenProvider;
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {

        String role = request.getRole() != null ? request.getRole() : "STUDENT";

        if (!role.equals("INSTRUCTOR") && !role.equals("STUDENT")) {
            role = "STUDENT";
        }

        var user = userService.registerUser(
                request.getName(),
                request.getEmail(),
                request.getPassword(),
                role
        );

        String token = tokenProvider.generateToken(user.getEmail());

        AuthResponse response = new AuthResponse();
        response.setToken(token);
        response.setUser(user);

        return ResponseEntity.ok(response);
    }
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {

        var user = userService.authenticate(
                request.getEmail(),
                request.getPassword()
        );

        String token = tokenProvider.generateToken(user.getEmail());

        AuthResponse response = new AuthResponse();
        response.setToken(token);
        response.setUser(user);

        return ResponseEntity.ok(response);
    }
}
