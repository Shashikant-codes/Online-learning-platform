package com.learnhub.controller;
import com.learnhub.model.User;
import com.learnhub.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;
@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {
    @Autowired
    private UserService userService;
    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(userService.findByEmail(email));
    }
    @PutMapping("/me")
    public ResponseEntity<User> updateProfile(
            @RequestBody Map<String, String> updates,
            Authentication authentication) {
        String email = authentication.getName();
        User user = userService.findByEmail(email);

        String name = updates.get("name");
        String bio = updates.get("bio");
        String profilePicture = updates.get("profilePicture");

        User updated = userService.updateUser(user.getId(), name, bio, profilePicture);
        return ResponseEntity.ok(updated);
    }
    @GetMapping("/instructors")
    public ResponseEntity<?> getInstructors() {
        return ResponseEntity.ok(userService.getInstructors());
    }
}