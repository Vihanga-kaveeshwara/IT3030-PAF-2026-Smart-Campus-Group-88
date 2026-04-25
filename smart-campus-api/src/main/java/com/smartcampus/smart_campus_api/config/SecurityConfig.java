package com.smartcampus.smart_campus_api.config;

import com.smartcampus.smart_campus_api.service.auth.OAuth2UserServiceImpl;
import com.smartcampus.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import jakarta.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final OAuth2UserServiceImpl oAuth2UserService;
    private final JwtUtil jwtUtil;

    @Value("${app.oauth2.success-redirect-uri:http://localhost:5173/oauth2/callback}")
    private String oauth2SuccessRedirectUri;

    @Value("${app.oauth2.failure-redirect-uri:http://localhost:5173/login?error=oauth_failed}")
    private String oauth2FailureRedirectUri;

    @Value("${app.cors.allowed-origins:http://localhost:5173}")
    private String corsAllowedOrigins;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Public endpoints
                .requestMatchers("/api/auth/signup").permitAll()
                .requestMatchers("/api/auth/login").permitAll()
                .requestMatchers("/api/auth/forgot-password").permitAll()
                .requestMatchers("/api/auth/reset-password/verify-otp").permitAll()
                .requestMatchers("/actuator/health").permitAll()
                .requestMatchers("/login/oauth2/**").permitAll()
                .requestMatchers("/oauth2/**").permitAll()
                .requestMatchers("/api/health").permitAll()
                
                // Public read-only endpoints
                .requestMatchers(HttpMethod.GET, "/api/resources/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/facilities/**").permitAll()
                
                // User endpoints - require authentication
                .requestMatchers("/api/tickets/my").hasAnyRole("USER", "ADMIN", "TECHNICIAN")
                .requestMatchers(HttpMethod.POST, "/api/tickets").hasAnyRole("USER", "ADMIN", "TECHNICIAN")
                .requestMatchers(HttpMethod.PUT, "/api/tickets/**").hasAnyRole("USER", "ADMIN", "TECHNICIAN")
                .requestMatchers(HttpMethod.DELETE, "/api/tickets/**").hasAnyRole("USER", "ADMIN", "TECHNICIAN")
                .requestMatchers(HttpMethod.POST, "/api/tickets/*/comments").hasAnyRole("USER", "ADMIN", "TECHNICIAN")
                
                // Technician endpoints
                .requestMatchers("/api/tickets/assigned").hasAnyRole("TECHNICIAN", "ADMIN")
                .requestMatchers(HttpMethod.PATCH, "/api/tickets/*/start-work").hasAnyRole("TECHNICIAN", "ADMIN")
                .requestMatchers(HttpMethod.PATCH, "/api/tickets/*/resolve").hasAnyRole("TECHNICIAN", "ADMIN")
                .requestMatchers(HttpMethod.PATCH, "/api/tickets/*/progress").hasAnyRole("TECHNICIAN", "ADMIN")
                
                // Admin endpoints
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/tickets").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PATCH, "/api/tickets/*/assign").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PATCH, "/api/tickets/*/status").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PATCH, "/api/tickets/*/reject").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/facilities").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/facilities/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/facilities/**").hasRole("ADMIN")
                
                .anyRequest().authenticated()
            )
            .oauth2Login(oauth -> oauth
                .userInfoEndpoint(u -> u.oidcUserService(oAuth2UserService))
                .successHandler((request, response, authentication) -> {
                    OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
                    String userId = oAuth2User.getAttribute("userId");
                    String email  = oAuth2User.getAttribute("email");
                    String token  = jwtUtil.generateToken(userId, email);
                    response.sendRedirect(oauth2SuccessRedirectUri + "?token=" + token);
                })
                .failureHandler((request, response, ex) -> {
                    response.sendRedirect(oauth2FailureRedirectUri);
                })
            )
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint((req, res, e) -> {
                    res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    res.setContentType("application/json");
                    res.getWriter().write("{\"error\":\"Unauthorized\"}");
                })
                .accessDeniedHandler((req, res, e) -> {
                    res.setStatus(HttpServletResponse.SC_FORBIDDEN);
                    res.setContentType("application/json");
                    res.getWriter().write("{\"error\":\"Forbidden\"}");
                })
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Combine both sets of allowed origins
        List<String> allowedOrigins = Arrays.asList(corsAllowedOrigins.split(","));
        List<String> additionalOrigins = Arrays.asList("http://localhost:5173", "http://localhost:5174", "http://localhost:3000");
        
        // Merge the lists and remove duplicates
        List<String> allOrigins = new ArrayList<>();
        allOrigins.addAll(allowedOrigins);
        allOrigins.addAll(additionalOrigins);
        configuration.setAllowedOrigins(allOrigins.stream().distinct().toList());
        
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config)
            throws Exception {
        return config.getAuthenticationManager();
    }
}