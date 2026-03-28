package com.edutech.educationalresourcedistributionsystem.config;

import com.edutech.educationalresourcedistributionsystem.jwt.JwtRequestFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;

@Configuration
public class SecurityConfig {

    @Autowired
    private JwtRequestFilter jwtAuthFilter;

    // Keep only one PasswordEncoder bean in the project
    // @Bean
    // public PasswordEncoder passwordEncoder() {
    //     return new BCryptPasswordEncoder();
    // }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.and())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Public endpoints
                .antMatchers("/api/user/register", "/api/user/login").permitAll()

                // Institution endpoints
                .antMatchers("/api/institution/event",
                                 "/api/institution/events",
                                 "/api/institution/resource",
                                 "/api/institution/resources",
                                 "/api/institution/event/allocate-resources").hasRole("INSTITUTION")

                // Educator endpoints
                .antMatchers("/api/educator/agenda",
                                 "/api/educator/update-material/**").hasRole("EDUCATOR")

                // Student endpoints
                .antMatchers("/api/student/register/**",
                                 "/api/student/registration-status/**").hasRole("STUDENT")

                // Any other route requires authentication
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}

// package com.edutech.educationalresourcedistributionsystem.config;

// import com.edutech.educationalresourcedistributionsystem.jwt.JwtRequestFilter;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.security.authentication.AuthenticationManager;
// import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
// import org.springframework.security.config.http.SessionCreationPolicy;
// import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
// import org.springframework.security.crypto.password.PasswordEncoder;
// import org.springframework.security.web.SecurityFilterChain;
// import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
// import org.springframework.security.config.annotation.web.builders.HttpSecurity;

// @Configuration
// public class SecurityConfig {

//     @Autowired
//     private JwtRequestFilter jwtAuthFilter;

//     @Bean
//     public PasswordEncoder passwordEncoder() {
//         return new BCryptPasswordEncoder();
//     }

//     @Bean
//     public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
//         return config.getAuthenticationManager();
//     }

//     @Bean
//     public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
//         http
//             .csrf(csrf -> csrf.disable())
//             .cors(cors -> cors.and())
//             .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
//             .authorizeHttpRequests(auth -> auth
//                 // Public endpoints
//                 .antMatchers("/api/user/register", "/api/user/login").permitAll()

//                 // Institution endpoints
//                 .antMatchers("/api/institution/event",
//                                  "/api/institution/events",
//                                  "/api/institution/resource",
//                                  "/api/institution/resources",
//                                  "/api/institution/event/allocate-resources").hasRole("INSTITUTION")

//                 // Educator endpoints
//                 .antMatchers("/api/educator/agenda",
//                                  "/api/educator/update-material/**").hasRole("EDUCATOR")

//                 // Student endpoints
//                 .antMatchers("/api/student/register/**",
//                                  "/api/student/registration-status/**").hasRole("STUDENT")

//                 // Any other route requires authentication
//                 .anyRequest().authenticated()
//             )
//             .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

//         return http.build();
//     }
// }





// // package com.edutech.educationalresourcedistributionsystem.config;

// // import org.springframework.beans.factory.annotation.Autowired;
// // import org.springframework.context.annotation.Bean;
// // import org.springframework.context.annotation.Configuration;
// // import org.springframework.http.HttpMethod;
// // import org.springframework.security.authentication.AuthenticationManager;
// // import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
// // import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
// // import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
// // import org.springframework.security.config.annotation.web.builders.HttpSecurity;
// // import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
// // import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
// // import org.springframework.security.config.http.SessionCreationPolicy;
// // import org.springframework.security.core.userdetails.UserDetailsService;
// // import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
// // import org.springframework.security.crypto.password.PasswordEncoder;
// // import org.springframework.security.web.SecurityFilterChain;
// // import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

// // import com.edutech.educationalresourcedistributionsystem.jwt.JwtRequestFilter;

// // @Configuration
// // @EnableWebSecurity
// // public class SecurityConfig {
// //    @Autowired
// //    private JwtRequestFilter jwtAuthFilter;
// //    @Bean
// //    public PasswordEncoder passwordEncoder() {
// //        return new BCryptPasswordEncoder();
// //    }
// //    @Bean
// //    public AuthenticationManager authenticationManager(
// //            AuthenticationConfiguration config) throws Exception {
// //        return config.getAuthenticationManager();
// //    }
// //    @Bean
// //    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
// //        http
// //            .csrf(csrf -> csrf.disable())
// //            .cors(cors -> cors.and())
// //            .sessionManagement(session ->
// //                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
// //            .authorizeHttpRequests(auth -> auth
// //                .antMatchers("/api/user/register", "/api/user/login").permitAll()
// //                .antMatchers("/api/student/**").hasRole("STUDENT")
// //                .antMatchers("/api/institution/**").hasRole("INSTITUTION")
// //                .antMatchers("/api/educator/**").hasRole("EDUCATOR")
// //                .anyRequest().authenticated()
// //            )
// //            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
// //        return http.build();
// //    }
// // }


// // //public class SecurityConfig  {

// //         // TODO: implement the security configuration

// //         // configure CORS and CSRF
// //         // configure the routes that are accessible without authentication
// //         // configure the routes that are accessible with specific authority
// //         // set the permission w.r.t to authorities
// //         // - /api/user/register: accessible to everyone
// //         // - /api/user/login: accessible to everyone
// //         // - /api/institution/event: accessible to INSTITUTION authority
// //         // - /api/institution/events: accessible to INSTITUTION authority
// //         // - /api/institution/resource: accessible to INSTITUTION authority
// //         // - /api/institution/resources: accessible to INSTITUTION authority
// //         // - /api/institution/event/allocate-resources: accessible to INSTITUTION authority
// //         // - /api/educator/agenda: accessible to EDUCATOR authority
// //         // - /api/educator/update-material/{eventId}: accessible to EDUCATOR authority
// //         // - /api/student/register/{eventId}: accessible to STUDENT authority
// //         // - /api/student/registration-status/{studentId}: accessible to STUDENT authority
// //         // - any other route: accessible to authenticated users
// //         // configure the session management
// //         // add the jwtRequestFilter before the UsernamePasswordAuthenticationFilter
    
// // //}