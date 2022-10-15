package com.musicapp.musicApp.services.auth;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.musicapp.musicApp.configuration.security.auth.AuthConfiguration;
import com.musicapp.musicApp.core.ApplicationException;
import com.musicapp.musicApp.core.contracts.AuthenticationService;
import com.musicapp.musicApp.core.message.auth.TokenResponse;
import com.musicapp.musicApp.core.message.auth.TokenType;
import com.musicapp.musicApp.core.message.error.ErrorCode;
import com.musicapp.musicApp.data.model.user.UserToken;
import com.musicapp.musicApp.data.model.user.User;
import com.musicapp.musicApp.data.repositories.UserRepository;
import com.musicapp.musicApp.utils.IdUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {

    private final AuthenticationManager authenticationManager;
    private final AuthConfiguration configuration;
    private final UserRepository userRepository;

    @Override
    public TokenResponse authenticate(String username, String password) throws ApplicationException {
        final Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password, new ArrayList<>())
        );

        if (!authentication.isAuthenticated())
            throw new ApplicationException(ErrorCode.FORBIDDEN);

        return create(authentication.getName(), authentication.getAuthorities().iterator().next().getAuthority());
    }

    @Override
    public TokenResponse create(String username, String role) {
        final String accessToken = createToken(username, role, configuration.getAccessExpirationHours(), TokenType.Access);
        final String refreshToken = createToken(username, role, configuration.getRefreshExpirationHours(), TokenType.Refresh);

        final User user = userRepository.getByEmail(username);
        UserToken token = user.getToken();
        if (token == null) {
            token = new UserToken();
            token.setId(IdUtils.newId());
        }
        token.setAccessToken(accessToken);
        token.setRefreshToken(refreshToken);
        user.setToken(token);

        final TokenResponse response = new TokenResponse();
        response.setAccessToken(accessToken);
        response.setAccessExpiresAt(OffsetDateTime.now().plusHours(configuration.getAccessExpirationHours()));
        response.setRefreshToken(refreshToken);
        response.setRefreshExpiresAt(OffsetDateTime.now().plusHours(configuration.getRefreshExpirationHours()));

        return response;
    }

    @Override
    public UsernamePasswordAuthenticationToken verify(String token, TokenType tokenType) {
        try {
            DecodedJWT verify = JWT.require(getAlgorithm())
                    .build()
                    .verify(token);

            String email = verify.getSubject();
            String role = verify.getClaim("role").asString();
            String type = verify.getClaim("type").asString();
            final User user = userRepository.findByTokenAndEmail(token, email).orElse(null);

            if (user == null || !StringUtils.equals(type, tokenType.name())) {
                log.debug("Wrong token type, or token already replaced");
                return null;
            }

            if (email != null & role != null) {
                log.debug("Request authorization: username='{}', role='{}'", email, role);
                return new UsernamePasswordAuthenticationToken(
                        email,
                        null,
                        Collections.singletonList(new SimpleGrantedAuthority(role))
                        );
            }
        } catch (JWTVerificationException exception) {
            log.error("Can`t parse JWT", exception);
            return null;
        }
        log.debug("Authorization header has no data");
        return null;
    }

    @Override
    public TokenResponse refresh(String refreshToken) throws ApplicationException {
        final Authentication authentication = verify(refreshToken, TokenType.Refresh);

        if (authentication == null)
            throw new ApplicationException(ErrorCode.FORBIDDEN);

        return create(authentication.getName(), authentication.getAuthorities().iterator().next().getAuthority());
    }

    private String createToken(String email, String role, int hours, TokenType type) {
        return JWT.create()
                .withSubject(email)
                .withClaim("role", role)
                .withClaim("type", type.name())
                .withExpiresAt(new Date(System.currentTimeMillis() + (long) hours * 60 * 60 * 1000))
                .sign(getAlgorithm());
    }

    private Algorithm getAlgorithm() {
        return Algorithm.HMAC512(configuration.getSecret());
    }
}
