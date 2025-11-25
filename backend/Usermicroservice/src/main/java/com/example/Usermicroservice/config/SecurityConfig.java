//
//package com.example.Usermicroservice.config;
//
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.config.Customizer;
//import org.springframework.security.web.SecurityFilterChain;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.security.provisioning.InMemoryUserDetailsManager;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.core.userdetails.User;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.web.cors.CorsConfigurationSource;
//import org.springframework.web.cors.CorsConfiguration;
//import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
//
//import static org.springframework.security.config.http.SessionCreationPolicy.STATELESS;
//
//@Configuration
//public class SecurityConfig {
//
//    @Bean
//    public SecurityFilterChain api(HttpSecurity http) throws Exception {
//        http
//            .csrf(csrf -> csrf.disable())
//            .sessionManagement(sm -> sm.sessionCreationPolicy(STATELESS))
//            .authorizeHttpRequests(auth -> auth
//                // --- Springdoc/OpenAPI (custom + defaults) ---
//                .requestMatchers(
//                    "/api-docs", "/api-docs.yaml", "/api-docs/**",
//                    "/v3/api-docs", "/v3/api-docs.yaml", "/v3/api-docs/**",
//                    "/swagger-ui/**", "/swagger-ui.html","/ping"
//                ).permitAll()
//                // H2 console (dev only)
//                .requestMatchers("/h2-console/**").permitAll()
//                // Public auth endpoints
//                .requestMatchers("/api/auth/**").permitAll()
//                // Everything else requires auth
//                .anyRequest().authenticated()
//            )
//            // Needed for H2 console
//            .headers(h -> h.frameOptions(f -> f.disable()))
//            // IMPORTANT: Do NOT enable httpBasic to avoid browser pop-up
//            // .httpBasic(Customizer.withDefaults())
//            .cors(Customizer.withDefaults());
//
//        return http.build();
//    }
//
//    @Bean
//    public CorsConfigurationSource corsConfigurationSource() {
//        CorsConfiguration config = new CorsConfiguration();
//        config.setAllowCredentials(true);
//        config.addAllowedOriginPattern("*"); // use exact origins in prod
//        config.addAllowedHeader("*");
//        config.addAllowedMethod("*");
//
//        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//        source.registerCorsConfiguration("/**", config);
//        return source;
//    }
//
//    @Bean
//    public PasswordEncoder passwordEncoder() {
//        return new BCryptPasswordEncoder();
//    }
//
//}


package com.example.Usermicroservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.example.Usermicroservice.exception.RestAccessDeniedHandler;
import com.example.Usermicroservice.exception.RestAuthenticationEntryPoint;
import com.example.Usermicroservice.jwt.JwtAuthFilter;
import com.example.Usermicroservice.jwt.JwtService;

import static org.springframework.security.config.http.SessionCreationPolicy.STATELESS;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain api(HttpSecurity http, JwtService jwtService) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(sm -> sm.sessionCreationPolicy(STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/api-docs", "/api-docs.yaml", "/api-docs/**",
                    "/v3/api-docs", "/v3/api-docs.yaml", "/v3/api-docs/**",
                    "/swagger-ui/**", "/swagger-ui.html",
                    "/h2-console/**",
                    "/api/auth/**",
                    "/ping"
                ).permitAll()
                .anyRequest().authenticated()
            )
            .headers(h -> h.frameOptions(f -> f.disable()))
            .cors(Customizer.withDefaults())
            // Return JSON for 401/403 and avoid WWW-Authenticate (no browser popup)
            .exceptionHandling(e -> e
                .authenticationEntryPoint(new RestAuthenticationEntryPoint())
                .accessDeniedHandler(new RestAccessDeniedHandler())
            );

        // JWT verification filter for protected endpoints
        http.addFilterBefore(new JwtAuthFilter(jwtService), UsernamePasswordAuthenticationFilter.class);

        // DO NOT enable httpBasic() to avoid browser popup
        // .httpBasic(Customizer.withDefaults());

        return http.build();
    }

    // Simple in-memory user to test /api/auth/login
    @Bean
    public InMemoryUserDetailsManager userDetailsService(PasswordEncoder encoder) {
        UserDetails user = User.withUsername("admin")
                .password(encoder.encode("admin123"))
                .roles("USER") // will be included in token "roles"
                .build();
        return new InMemoryUserDetailsManager(user);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // CORS: open for dev; restrict origins in prod
}

