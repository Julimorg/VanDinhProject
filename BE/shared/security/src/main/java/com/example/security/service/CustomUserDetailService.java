//package com.example.security.service;
//
//import com.example.common.interfaces.user.UserInternalService;
//import com.example.persistence.entity.User;
//import com.example.security.config.CustomUserDetails;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.security.core.GrantedAuthority;
//import org.springframework.security.core.authority.SimpleGrantedAuthority;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.security.core.userdetails.UsernameNotFoundException;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//
//@Slf4j
//@Service
//@RequiredArgsConstructor
//public class CustomUserDetailService implements UserDetailsService {
//
//    private final UserInternalService userInternalService;
//
//    @Override
//    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
//
//        User user = userInternalService.findByUserName(username);
//
//        List<GrantedAuthority> authorities = List.of(
//                new SimpleGrantedAuthority("ROLE_" + user.getRoles())
//        );
//
//        return new CustomUserDetails(
//                user.getId(),
//                user.getUserName(),
//                user.getPassword(),
//                authorities
//        );
//
//    }
//}
