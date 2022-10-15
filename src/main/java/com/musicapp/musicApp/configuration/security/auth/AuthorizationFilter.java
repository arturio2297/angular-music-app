package com.musicapp.musicApp.configuration.security.auth;

import com.musicapp.musicApp.core.contracts.AuthenticationService;
import com.musicapp.musicApp.core.message.auth.TokenType;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

import static com.musicapp.musicApp.configuration.security.auth.AuthConstants.AUTH_HEADER;
import static com.musicapp.musicApp.configuration.security.auth.AuthConstants.AUTH_HEADER_TYPE;

@Slf4j
public class AuthorizationFilter extends BasicAuthenticationFilter {
    private final AuthenticationService authService;

    public AuthorizationFilter(
            AuthenticationManager authenticationManager,
            AuthenticationService authService
    ) {
        super(authenticationManager);
        this.authService = authService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain chain
    ) throws IOException, ServletException {
        String header = request.getHeader(AUTH_HEADER);

        if (header == null || !header.startsWith(AUTH_HEADER_TYPE)) {
            log.debug("No authorization header");
            chain.doFilter(request, response);
            return;
        }

        UsernamePasswordAuthenticationToken authentication = getAuthentication(header);

        if (authentication != null)
            SecurityContextHolder.getContext().setAuthentication(authentication);

        chain.doFilter(request, response);
    }

    private UsernamePasswordAuthenticationToken getAuthentication(String header) {
        if (StringUtils.isBlank(header)) {
            return null;
        }

        final String token = header.replace(AUTH_HEADER_TYPE + " ", "");
        return authService.verify(token, TokenType.Access);
    }
}
