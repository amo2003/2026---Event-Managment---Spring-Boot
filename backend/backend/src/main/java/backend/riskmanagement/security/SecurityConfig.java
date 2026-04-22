package backend.riskmanagement.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final CustomUserDetailsService customUserDetailsService;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider =
                new DaoAuthenticationProvider(customUserDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    @Order(1)
    public SecurityFilterChain riskSecurityFilterChain(HttpSecurity http) throws Exception {
        http
                .securityMatcher(
                        "/api/auth/**",
                        "/api/incidents/**",
                        "/api/alerts/**",
                        "/api/analytics/**",
                        "/api/officers/**",
                        "/api/place-areas/**",
                        "/api/resolution-reports/**",
                        "/api/chat/**"
                )
                .csrf(csrf -> csrf.disable())
                .cors(Customizer.withDefaults())
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authenticationProvider(authenticationProvider())
                .authorizeHttpRequests(auth -> auth
                        // Preflight
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // Public auth endpoints
                        .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/auth/officer/register").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/auth/forgot-password").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/auth/reset-password").permitAll()

                        // Public incident endpoints
                        .requestMatchers(HttpMethod.POST, "/api/incidents").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/incidents/track").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/incidents/*/evidence").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/place-areas").permitAll()

                        // Public reporter chat endpoints
                        .requestMatchers(HttpMethod.GET, "/api/chat/public/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/chat/public/**").permitAll()

                        // Officer chat endpoints
                        .requestMatchers("/api/chat/officer/**").hasRole("OFFICER")

                        // Officer-only risk module endpoints
                        .requestMatchers("/api/analytics/**").hasRole("OFFICER")
                        .requestMatchers("/api/alerts/**").hasRole("OFFICER")
                        .requestMatchers("/api/resolution-reports/**").hasRole("OFFICER")
                        .requestMatchers("/api/incidents/**").hasRole("OFFICER")
                        .requestMatchers("/api/officers/**").hasRole("OFFICER")

                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
            .securityMatcher(
                "/api/auth/**",
                "/api/incidents/**",
                "/api/alerts/**",
                "/api/analytics/**",
                "/api/officers/**",
                "/api/place-areas/**",
                "/api/resolution-reports/**"
            )
            .csrf(csrf -> csrf.disable())
            .cors(Customizer.withDefaults())
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authenticationProvider(authenticationProvider())
            .authorizeHttpRequests(auth -> auth
                // Public endpoints — no token needed
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/auth/officer/register").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/auth/forgot-password").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/auth/reset-password").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/incidents").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/incidents/track").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/place-areas").permitAll()
                // Officer-only
                .requestMatchers("/api/analytics/**").hasRole("OFFICER")
                .requestMatchers("/api/alerts/**").hasRole("OFFICER")
                .requestMatchers("/api/resolution-reports/**").hasRole("OFFICER")
                .requestMatchers("/api/incidents/**").hasRole("OFFICER")
                .requestMatchers("/api/officers/**").hasRole("OFFICER")
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
