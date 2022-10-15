package com.musicapp.musicApp.configuration.security;

import com.musicapp.musicApp.configuration.security.auth.AuthorizationFilter;
import com.musicapp.musicApp.core.contracts.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;

import static com.musicapp.musicApp.data.model.user.UserRole.ADMIN;
import static com.musicapp.musicApp.data.model.user.UserRole.MODERATOR;
import static org.springframework.http.HttpMethod.*;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {

    private final AuthenticationManager authenticationManager;
    private final AuthenticationService authService;

    @Bean
    public AuthorizationFilter authorizationFilter() {
        return new AuthorizationFilter(authenticationManager, authService);
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .cors().and()
                .csrf().disable()
                .httpBasic().disable()
                .authorizeRequests()

                //Public matchers >>>
                .antMatchers(POST, "/api/v1/token").permitAll()
                .antMatchers( "/api/v1/registration/**").permitAll()
                .antMatchers(
                        GET,
                        "/api/v1/account/{id}/avatar",
                        "/api/v1/groups/{id}/image",
                        "/api/v1/albums/{id}/image",
                        "/api/v1/track-lists/{id}/image",
                        "/api/v1/tracks/{id}/audio"
                ).permitAll()
                //Public matchers <<<

                //Matchers based on ROLE >>>
                //Groups matchers >>>
                .antMatchers(DELETE, "/api/v1/groups/**").hasAnyAuthority(ADMIN, MODERATOR)
                .antMatchers(POST, "/api/v1/groups/**").hasAnyAuthority(ADMIN, MODERATOR)
                .antMatchers(GET, "/api/v1/groups/check/**").hasAnyAuthority(ADMIN, MODERATOR)
                //Groups matchers <<<
                //Album matchers >>>
                .antMatchers(DELETE, "/api/v1/albums/**").hasAnyAuthority(ADMIN, MODERATOR)
                .antMatchers(POST, "/api/v1/albums/**").hasAnyAuthority(ADMIN, MODERATOR)
                .antMatchers(GET, "/api/v1/albums/check/**").hasAnyAuthority(ADMIN, MODERATOR)
                //Album matchers <<<
                //Track matchers >>>
                .antMatchers(DELETE, "/api/v1/tracks/**").hasAnyAuthority(ADMIN, MODERATOR)
                .antMatchers(POST, "/api/v1/tracks/**").hasAnyAuthority(ADMIN, MODERATOR)
                .antMatchers(GET, "/api/v1/tracks/check/**").hasAnyAuthority(ADMIN, MODERATOR)
                //Track matchers <<<
                //Matchers based on ROLE <<<

                .antMatchers("/api/**").authenticated()

                .anyRequest().permitAll()
                .and()
                .addFilter(authorizationFilter())
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);
    }

}
