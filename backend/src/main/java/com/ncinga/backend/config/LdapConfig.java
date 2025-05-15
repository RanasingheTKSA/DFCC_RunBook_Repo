package com.ncinga.backend.config;

//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.http.HttpMethod;
//import org.springframework.ldap.core.support.LdapContextSource;
//import org.springframework.security.authentication.AuthenticationManager;
//import org.springframework.security.authentication.ProviderManager;
//import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
//import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
//import org.springframework.security.config.http.SessionCreationPolicy;
//import org.springframework.security.ldap.authentication.BindAuthenticator;
//import org.springframework.security.ldap.authentication.LdapAuthenticationProvider;
//import org.springframework.security.ldap.userdetails.DefaultLdapAuthoritiesPopulator;
//import org.springframework.security.web.SecurityFilterChain;

//@Configuration
//@EnableWebSecurity
//@EnableMethodSecurity
public class LdapConfig {
//    @Bean
//    public LdapContextSource ldapContextSource() {
//        LdapContextSource contextSource = new LdapContextSource();
//        contextSource.setUrl("ldap.forumsys.com:389");
//        contextSource.setBase("dc=example,dc=com");
//        contextSource.setUserDn("cn=read-only-admin,dc=example,dc=com");
//        contextSource.setPassword("password");
//        return contextSource;
//    }
//
//    @Bean
//    public LdapAuthenticationProvider ldapAuthenticationProvider(LdapContextSource ldapContextSource) {
//        BindAuthenticator bindAuthenticator = new BindAuthenticator(ldapContextSource);
//        bindAuthenticator.setUserDnPatterns(new String[]{
//                "uid={0},ou=mathematicians,dc=example,dc=com",
//                "uid={0},ou=scientists,dc=example,dc=com"
//        });
//
//        DefaultLdapAuthoritiesPopulator authoritiesPopulator =
//                new DefaultLdapAuthoritiesPopulator(ldapContextSource, "ou=groups,dc=example,dc=com");
//        authoritiesPopulator.setGroupSearchFilter("uniqueMember={0}");
//
//        return new LdapAuthenticationProvider(bindAuthenticator, authoritiesPopulator);
//    }
//
//    @Bean
//    public AuthenticationManager authenticationManager(LdapAuthenticationProvider ldapAuthProvider) {
//        return new ProviderManager(ldapAuthProvider);
//    }
//
//    @Bean
//    public SecurityFilterChain securityFilterChain(HttpSecurity http, LdapAuthenticationProvider ldapAuthenticationProvider) throws Exception {
//        http
//                .csrf(AbstractHttpConfigurer::disable
//                )
//                .sessionManagement(session -> session
//                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
//                )
//                .authorizeHttpRequests(authorize -> authorize
//                        .requestMatchers(HttpMethod.GET, "/user/*").permitAll()
//                        .requestMatchers( HttpMethod.GET, "/activities/*").permitAll()
//                        .requestMatchers( HttpMethod.GET,"/records/*").permitAll()
//                        .requestMatchers(HttpMethod.POST, "/user/*").permitAll()
//                        .requestMatchers( HttpMethod.POST, "/activities/*").permitAll()
//                        .requestMatchers( HttpMethod.POST,"/records/*").permitAll()
//                        .anyRequest().authenticated()
//                )
//                .authenticationProvider(ldapAuthenticationProvider);
//        return http.build();
//    }
}
