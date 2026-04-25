package com.smartcampus.smart_campus_api.util;

import com.smartcampus.smart_campus_api.model.auth.Role;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Collection;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Utility class for role-based operations
 */
public class RoleUtil {

    /**
     * Get the current authenticated user's roles
     */
    public static Set<String> getCurrentUserRoles() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return Set.of();
        }
        
        return authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .map(authority -> authority.startsWith("ROLE_") ? authority.substring(5) : authority)
                .collect(Collectors.toSet());
    }

    /**
     * Check if current user has the specified role
     */
    public static boolean hasRole(String role) {
        return getCurrentUserRoles().contains(role);
    }

    /**
     * Check if current user has any of the specified roles
     */
    public static boolean hasAnyRole(String... roles) {
        Set<String> userRoles = getCurrentUserRoles();
        return Set.of(roles).stream().anyMatch(userRoles::contains);
    }

    /**
     * Check if current user has all of the specified roles
     */
    public static boolean hasAllRoles(String... roles) {
        Set<String> userRoles = getCurrentUserRoles();
        return Set.of(roles).stream().allMatch(userRoles::contains);
    }

    /**
     * Check if current user has admin role
     */
    public static boolean isAdmin() {
        return hasRole(Role.ADMIN.name());
    }

    /**
     * Check if current user has technician role
     */
    public static boolean isTechnician() {
        return hasRole(Role.TECHNICIAN.name());
    }

    /**
     * Check if current user has user role
     */
    public static boolean isUser() {
        return hasRole(Role.USER.name());
    }

    /**
     * Get the current authenticated username
     */
    public static String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }
        return authentication.getName();
    }

    /**
     * Check if the current user is the owner of the resource or has admin role
     */
    public static boolean isOwnerOrAdmin(String resourceOwnerId) {
        String currentUsername = getCurrentUsername();
        return currentUsername != null && 
               (currentUsername.equals(resourceOwnerId) || isAdmin());
    }
}
