package com.smartcampus.smart_campus_api.security;

import com.smartcampus.smart_campus_api.controller.ticket.TicketController;
import com.smartcampus.smart_campus_api.controller.resource.FacilityController;
import com.smartcampus.smart_campus_api.controller.notification.NotificationController;
import com.smartcampus.smart_campus_api.model.auth.Role;
import com.smartcampus.smart_campus_api.util.RoleUtil;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
class RoleBasedAccessTest {

    @Test
    @WithMockUser(roles = {"USER"})
    void testUserRoleAccess() {
        assertTrue(RoleUtil.hasRole("USER"));
        assertFalse(RoleUtil.hasRole("ADMIN"));
        assertFalse(RoleUtil.hasRole("TECHNICIAN"));
        assertTrue(RoleUtil.hasAnyRole("USER", "ADMIN"));
        assertTrue(RoleUtil.isUser());
        assertFalse(RoleUtil.isAdmin());
        assertFalse(RoleUtil.isTechnician());
    }

    @Test
    @WithMockUser(roles = {"ADMIN"})
    void testAdminRoleAccess() {
        assertTrue(RoleUtil.hasRole("ADMIN"));
        assertFalse(RoleUtil.hasRole("USER"));
        assertFalse(RoleUtil.hasRole("TECHNICIAN"));
        assertTrue(RoleUtil.hasAnyRole("USER", "ADMIN"));
        assertTrue(RoleUtil.isAdmin());
        assertFalse(RoleUtil.isUser());
        assertFalse(RoleUtil.isTechnician());
    }

    @Test
    @WithMockUser(roles = {"TECHNICIAN"})
    void testTechnicianRoleAccess() {
        assertTrue(RoleUtil.hasRole("TECHNICIAN"));
        assertFalse(RoleUtil.hasRole("USER"));
        assertFalse(RoleUtil.hasRole("ADMIN"));
        assertTrue(RoleUtil.hasAnyRole("USER", "TECHNICIAN"));
        assertTrue(RoleUtil.isTechnician());
        assertFalse(RoleUtil.isUser());
        assertFalse(RoleUtil.isAdmin());
    }

    @Test
    @WithMockUser(roles = {"USER", "ADMIN"})
    void testMultipleRolesAccess() {
        assertTrue(RoleUtil.hasRole("USER"));
        assertTrue(RoleUtil.hasRole("ADMIN"));
        assertTrue(RoleUtil.hasAllRoles("USER", "ADMIN"));
        assertFalse(RoleUtil.hasAllRoles("USER", "TECHNICIAN"));
    }

    @Test
    void testUnauthenticatedUser() {
        // This test simulates an unauthenticated user
        // In a real test, you'd use SecurityContextHolder to set up the context
        assertTrue(RoleUtil.getCurrentUserRoles().isEmpty());
        assertFalse(RoleUtil.hasRole("USER"));
        assertFalse(RoleUtil.isAdmin());
        assertFalse(RoleUtil.isTechnician());
    }
}
