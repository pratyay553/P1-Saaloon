package com.saloon.user.controller;

import com.saloon.common.ApiResponse;
import com.saloon.config.JwtUtil;
import com.saloon.user.dto.ProfileDto;
import com.saloon.user.dto.SignupRequestDto;
import com.saloon.user.model.Account;
import com.saloon.user.service.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.userdetails.User;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private static final Logger log = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<ProfileDto>> signup(@Valid @RequestBody SignupRequestDto signupRequestDto) {
        log.info("Received signup request for username: {}", signupRequestDto.getUsername());
        Account account = new Account();
        account.setUsername(signupRequestDto.getUsername());
        account.setEmail(signupRequestDto.getEmail());
        account.setPassword(signupRequestDto.getPassword());
        
        Account createdAccount = userService.createAccount(account);
        ProfileDto profileDto = new ProfileDto(createdAccount.getId(), createdAccount.getUsername(), createdAccount.getEmail(), createdAccount.getRole().name());
        
        return ApiResponse.created("User registered successfully", profileDto);
    }

    @PostMapping("/signin")
    public ResponseEntity<ApiResponse<Map<String, Object>>> signin(@RequestBody Account account, HttpServletResponse response) {
        log.info("Received signin request for username: {}", account.getUsername());
        Optional<Account> loggedInUser = userService.login(account.getUsername(), account.getPassword());
        if (loggedInUser.isPresent()) {
            Account user = loggedInUser.get();
            UserDetails userDetails = User.builder()
                .username(user.getUsername())
                .password(user.getPassword())
                .roles(user.getRole().name())
                .build();
            String jwtToken = jwtUtil.generateToken(userDetails);
            log.info("JWT generated for user: {}", user.getUsername());
            
            // Set JWT in an HttpOnly cookie
            Cookie jwtCookie = new Cookie("jwt_token", jwtToken);
            jwtCookie.setHttpOnly(true);
            jwtCookie.setSecure(false); // Set to true in production with HTTPS
            jwtCookie.setPath("/");
            jwtCookie.setMaxAge((int) (jwtUtil.getJwtExpiration() / 1000)); // MaxAge in seconds, cast to int
            response.addCookie(jwtCookie);

            // Also set a simple cookie for Next.js middleware
            Cookie authFlagCookie = new Cookie("is_auth", "true");
            authFlagCookie.setHttpOnly(false); // Accessible by JS for logout, but not sensitive
            authFlagCookie.setSecure(false); // Set to true in production with HTTPS
            authFlagCookie.setPath("/");
            authFlagCookie.setMaxAge((int) (jwtUtil.getJwtExpiration() / 1000)); // MaxAge in seconds, cast to int
            response.addCookie(authFlagCookie);
            
            ProfileDto profileDto = new ProfileDto(user.getId(), user.getUsername(), user.getEmail(), user.getRole().name());
            
            Map<String, Object> data = new HashMap<>();
            data.put("token", jwtToken); // Still send token in response for frontend convenience (e.g., Zustand)
            data.put("profile", profileDto);
            
            return ApiResponse.success("Login successful", data);
        } else {
            return ApiResponse.error("Invalid credentials", HttpStatus.UNAUTHORIZED);
        }
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<ProfileDto>> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        log.info("Fetching profile for authenticated user: {}", username);
        
        Optional<Account> accountOpt = userService.getUserByUsername(username);
        
        if (accountOpt.isPresent()) {
             Account account = accountOpt.get();
             ProfileDto profileDto = new ProfileDto(account.getId(), account.getUsername(), account.getEmail(), account.getRole().name());
             return ApiResponse.success("Profile fetched successfully", profileDto);
        }

        return ApiResponse.error("User not found", HttpStatus.NOT_FOUND);
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<Map<String, Object>>> updateProfile(@Valid @RequestBody ProfileDto profileDto, HttpServletResponse response) {
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        log.info("Received profile update request for user: {}", currentUsername);
        Account updatedAccount = userService.updateUser(currentUsername, profileDto);
        ProfileDto updatedProfileDto = new ProfileDto(updatedAccount.getId(), updatedAccount.getUsername(), updatedAccount.getEmail(), updatedAccount.getRole().name());
        
        Map<String, Object> data = new HashMap<>();
        data.put("profile", updatedProfileDto);

        if (!currentUsername.equals(updatedAccount.getUsername())) {
            log.info("Username changed for user {}. Issuing new JWT.", currentUsername);
            UserDetails userDetails = org.springframework.security.core.userdetails.User.builder()
                .username(updatedAccount.getUsername())
                .password(updatedAccount.getPassword())
                .roles(updatedAccount.getRole().name())
                .build();
            String newJwtToken = jwtUtil.generateToken(userDetails);
            
            // Update JWT in HttpOnly cookie
            Cookie jwtCookie = new Cookie("jwt_token", newJwtToken);
            jwtCookie.setHttpOnly(true);
            jwtCookie.setSecure(false); // Set to true in production with HTTPS
            jwtCookie.setPath("/");
            jwtCookie.setMaxAge((int) (jwtUtil.getJwtExpiration() / 1000)); // MaxAge in seconds, cast to int
            response.addCookie(jwtCookie);

            // Update auth flag cookie
            Cookie authFlagCookie = new Cookie("is_auth", "true");
            authFlagCookie.setHttpOnly(false);
            authFlagCookie.setSecure(false);
            authFlagCookie.setPath("/");
            authFlagCookie.setMaxAge((int) (jwtUtil.getJwtExpiration() / 1000)); // MaxAge in seconds, cast to int
            response.addCookie(authFlagCookie);

            data.put("token", newJwtToken); // Still send token in response for frontend convenience (e.g., Zustand)
        }
        
        return ApiResponse.success("Profile updated successfully", data);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProfileDto>> getUserDetails(@PathVariable Long id) {
        log.info("Fetching details for user ID: {}", id);
        Account account = userService.getUserById(id);
        ProfileDto profileDto = new ProfileDto(account.getId(), account.getUsername(), account.getEmail(), account.getRole().name());
        return ApiResponse.success("User details fetched successfully", profileDto);
    }
}
