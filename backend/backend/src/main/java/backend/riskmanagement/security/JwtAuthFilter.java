package backend.riskmanagement.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final CustomUserDetailsService customUserDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        // Only apply this filter to risk management API paths
        String path = request.getRequestURI();
        boolean isRiskPath = path.startsWith("/api/auth/")
                || path.startsWith("/api/incidents")
                || path.startsWith("/api/alerts")
                || path.startsWith("/api/analytics")
                || path.startsWith("/api/officers")
                || path.startsWith("/api/place-areas")
                || path.startsWith("/api/resolution-reports");

        if (!isRiskPath) {
            filterChain.doFilter(request, response);
            return;
        }

        // Public risk endpoints — skip token check
        boolean isPublicRiskPath = path.equals("/api/auth/login")
                || path.equals("/api/auth/officer/register")
                || path.equals("/api/auth/forgot-password")
                || path.equals("/api/auth/reset-password")
                || (path.startsWith("/api/incidents") && request.getMethod().equals("POST") && !path.contains("/status") && !path.contains("/evidence"))
                || path.equals("/api/place-areas");

        if (isPublicRiskPath) {
            filterChain.doFilter(request, response);
            return;
        }

        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        jwt = authHeader.substring(7);

        try {
            userEmail = jwtService.extractUsername(jwt);
        } catch (Exception e) {
            // Token not signed by risk secret — skip
            filterChain.doFilter(request, response);
            return;
        }

        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = customUserDetailsService.loadUserByUsername(userEmail);

            if (jwtService.isTokenValid(jwt, userDetails)) {
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );

                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        filterChain.doFilter(request, response);
    }
}