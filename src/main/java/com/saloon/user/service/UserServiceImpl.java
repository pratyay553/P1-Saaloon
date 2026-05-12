package com.saloon.user.service;

import com.saloon.user.dto.ProfileDto;
import com.saloon.user.model.Account;
import com.saloon.user.model.Role;
import com.saloon.user.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    private static final Logger log = LoggerFactory.getLogger(UserServiceImpl.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public Account createAccount(Account account) {
        log.debug("Attempting to create account for username: {}", account.getUsername());
        if (userRepository.findByUsername(account.getUsername()).isPresent()) {
            log.warn("Signup failed: Username {} already exists.", account.getUsername());
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.findByEmail(account.getEmail()).isPresent()) {
            log.warn("Signup failed: Email {} already exists.", account.getEmail());
            throw new RuntimeException("Email already exists");
        }
        
        // Ensure a default role is set if none is provided
        if (account.getRole() == null) {
            account.setRole(Role.CUSTOMER);
            log.debug("No role provided for user {}. Defaulting to CUSTOMER.", account.getUsername());
        }

        String hashedPassword = passwordEncoder.encode(account.getPassword());
        account.setPassword(hashedPassword);
        log.info("Password hashed for user: {}", account.getUsername());
        
        Account savedAccount = userRepository.save(account);
        log.info("Successfully created and saved account for username: {}", savedAccount.getUsername());
        return savedAccount;
    }

    @Override
    public Optional<Account> login(String username, String password) {
        log.debug("Attempting login for username: {}", username);
        Optional<Account> accountOpt = userRepository.findByUsername(username);
        
        if (accountOpt.isEmpty()) {
            log.warn("Login failed: User {} not found.", username);
            return Optional.empty();
        }
        
        Account account = accountOpt.get();
        if (passwordEncoder.matches(password, account.getPassword())) {
            log.info("Login successful for user: {}", username);
            return accountOpt;
        } else {
            log.warn("Login failed: Invalid password for user: {}", username);
            return Optional.empty();
        }
    }
    
    @Override
    public Account getUserById(Long id) {
        log.debug("Fetching user by ID: {}", id);
        return userRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("User not found with ID: {}", id);
                    return new RuntimeException("User not found with id: " + id);
                });
    }

    @Override
    public Optional<Account> getUserByUsername(String username) {
        log.debug("Fetching user by username: {}", username);
        return userRepository.findByUsername(username);
    }

    @Override
    public Account updateUser(String currentUsername, ProfileDto profileDto) {
        log.debug("Attempting to update profile for user: {}", currentUsername);
        Account account = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> {
                    log.error("Profile update failed: User {} not found.", currentUsername);
                    return new RuntimeException("User not found");
                });
        
        if (profileDto.getEmail() != null && !profileDto.getEmail().equals(account.getEmail())) {
            userRepository.findByEmail(profileDto.getEmail()).ifPresent(existing -> {
                log.warn("Profile update failed: Email {} is already in use.", profileDto.getEmail());
                throw new RuntimeException("Email already in use");
            });
            account.setEmail(profileDto.getEmail());
            log.info("User {} email updated to: {}", currentUsername, profileDto.getEmail());
        }

        if (profileDto.getUsername() != null && !profileDto.getUsername().equals(account.getUsername())) {
             userRepository.findByUsername(profileDto.getUsername()).ifPresent(existing -> {
                 log.warn("Profile update failed: Username {} is already in use.", profileDto.getUsername());
                 throw new RuntimeException("Username already in use");
             });
             account.setUsername(profileDto.getUsername());
             log.info("Username for user {} updated to: {}", currentUsername, profileDto.getUsername());
        }
        
        Account updatedAccount = userRepository.save(account);
        log.info("Successfully updated and saved profile for user: {}", updatedAccount.getUsername());
        return updatedAccount;
    }
}
