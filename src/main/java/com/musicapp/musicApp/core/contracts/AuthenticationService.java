package com.musicapp.musicApp.core.contracts;

import com.musicapp.musicApp.core.ApplicationException;
import com.musicapp.musicApp.core.message.auth.TokenResponse;
import com.musicapp.musicApp.core.message.auth.TokenType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

public interface AuthenticationService {
    TokenResponse authenticate(String username, String password) throws ApplicationException;
    TokenResponse create(String name, String role);
    UsernamePasswordAuthenticationToken verify(String token, TokenType tokenType);
    TokenResponse refresh(String token) throws ApplicationException;
}
