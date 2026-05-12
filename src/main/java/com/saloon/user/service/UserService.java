package com.saloon.user.service;

import com.saloon.user.dto.ProfileDto;
import com.saloon.user.model.Account;
import java.util.Optional;

public interface UserService {
    Account createAccount(Account account);
    Account getUserById(Long id);
    Optional<Account> getUserByUsername(String username);
    Optional<Account> login(String username, String password);
    Account updateUser(String username, ProfileDto profileDto);
}
