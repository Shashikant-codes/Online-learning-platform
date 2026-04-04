package com.learnhub.service;
//import com.learnhub.dto.AuthRequest;
import com.learnhub.dto.AuthResponse;
import com.learnhub.model.User;
import com.learnhub.repository.UserRepository;
import com.learnhub.security.BcryptPasswordEncoderImpl;
import com.learnhub.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private BcryptPasswordEncoderImpl passwordEncoder;
    @Autowired
    private JwtTokenProvider tokenProvider;
    public AuthResponse register(String name, String email, String password, String role) {

        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        if (!"INSTRUCTOR".equals(role) && !"STUDENT".equals(role)) {
            role = "STUDENT";
        }

        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(role);
        user.setActive(true);
        user.setCreatedAt(LocalDateTime.now());

        user = userRepository.save(user);

        String token = tokenProvider.generateToken(user.getEmail());

        AuthResponse response = new AuthResponse();
        response.setToken(token);
        response.setUser(user);

        return response;
    }
    public AuthResponse login(String email, String password) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        if (!user.isActive()) {
            throw new RuntimeException("Account is deactivated");
        }

        String token = tokenProvider.generateToken(user.getEmail());

        AuthResponse response = new AuthResponse();
        response.setToken(token);
        response.setUser(user);

        return response;
    }
}