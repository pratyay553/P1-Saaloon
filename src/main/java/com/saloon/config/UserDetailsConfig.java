package com.saloon.config;

import com.saloon.user.model.Account;
import com.saloon.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Collections;
import java.util.Optional;

@Configuration
public class UserDetailsConfig {

    @Autowired
    private UserRepository userRepository;

    @Bean
    public UserDetailsService userDetailsService() {
        return username -> {
            Optional<Account> accountOpt = userRepository.findByUsername(username);
            if (accountOpt.isEmpty()) {
                throw new UsernameNotFoundException("User not found with username: " + username);
            }
            Account account = accountOpt.get();
            
            // Map the Account Role to Spring Security Authorities
            // The "ROLE_" prefix is a convention used by Spring Security's hasRole() method
            SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + account.getRole().name());
            
            return new User(account.getUsername(), account.getPassword(), Collections.singletonList(authority));
        };
    }
}
