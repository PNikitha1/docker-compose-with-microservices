package com.example.Usermicroservice.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    public JwtAuthFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String header = request.getHeader("Authorization");
        if (!StringUtils.hasText(header) || !header.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = header.substring(7);

        try {
            Claims claims = jwtService.parseClaims(token);
            String username = claims.getSubject();

            // Authorities expected as array/string list under "roles" claim
            Object rolesClaim = claims.get("roles");
            Collection<SimpleGrantedAuthority> authorities = List.of();

            if (rolesClaim instanceof Collection<?> roles) {
                authorities = roles.stream()
                        .map(String::valueOf)
                        .map(SimpleGrantedAuthority::new)
                        .collect(Collectors.toList());
            } else if (rolesClaim instanceof String s) {
                authorities = List.of(new SimpleGrantedAuthority(s));
            }

            
            UsernamePasswordAuthenticationToken auth =
                    new UsernamePasswordAuthenticationToken(username, null, authorities);

            SecurityContextHolder.getContext().setAuthentication(auth);

        } catch (JwtException ex) {
            // Invalid token -> clear context; let entry point produce 401 JSON
            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response);
    }
}

