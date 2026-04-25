# Role-Based Access Control (RBAC) Implementation

This document describes the role-based access control implementation for the Smart Campus API.

## Overview

The Smart Campus API now implements comprehensive role-based access control to secure endpoints and ensure users can only access resources appropriate to their role.

## Roles

The system defines three user roles:

### 1. USER
- **Description**: Regular campus users (students, staff)
- **Permissions**: 
  - Create, view, update, and delete their own tickets
  - Add comments to tickets
  - View public resources and facilities
  - Manage their notifications

### 2. TECHNICIAN
- **Description**: Maintenance and support staff
- **Permissions**: 
  - All USER permissions
  - View assigned tickets
  - Start work on tickets
  - Resolve tickets
  - Update work progress

### 3. ADMIN
- **Description**: System administrators
- **Permissions**: 
  - All USER and TECHNICIAN permissions
  - View all tickets (admin overview)
  - Assign tickets to technicians
  - Update ticket status
  - Reject tickets
  - Manage facilities (create, update, delete)
  - Manage user roles
  - Full system access

## Endpoint Access Matrix

| Endpoint | Method | USER | TECHNICIAN | ADMIN | Public |
|----------|--------|------|------------|-------|---------|
| `/api/auth/signup` | POST | ✅ | ✅ | ✅ | ✅ |
| `/api/auth/login` | POST | ✅ | ✅ | ✅ | ✅ |
| `/api/auth/forgot-password` | POST | ✅ | ✅ | ✅ | ✅ |
| `/api/auth/reset-password/verify-otp` | POST | ✅ | ✅ | ✅ | ✅ |
| `/api/auth/me` | GET | ✅ | ✅ | ✅ | ❌ |
| `/api/auth/me` | PUT | ✅ | ✅ | ✅ | ❌ |
| `/api/auth/admin/users/{userId}/roles/{role}` | POST | ❌ | ❌ | ✅ | ❌ |
| `/api/auth/admin/users/{userId}/roles/{role}` | DELETE | ❌ | ❌ | ✅ | ❌ |
| `/api/tickets` | POST | ✅ | ✅ | ✅ | ❌ |
| `/api/tickets` | GET | ❌ | ❌ | ✅ | ❌ |
| `/api/tickets/my` | GET | ✅ | ✅ | ✅ | ❌ |
| `/api/tickets/{id}` | GET | ✅ | ✅ | ✅ | ❌ |
| `/api/tickets/{id}` | PUT | ✅ | ✅ | ✅ | ❌ |
| `/api/tickets/{id}` | DELETE | ✅ | ✅ | ✅ | ❌ |
| `/api/tickets/{id}/comments` | POST | ✅ | ✅ | ✅ | ❌ |
| `/api/tickets/assigned` | GET | ❌ | ✅ | ✅ | ❌ |
| `/api/tickets/{id}/assign` | PATCH | ❌ | ❌ | ✅ | ❌ |
| `/api/tickets/{id}/status` | PATCH | ❌ | ❌ | ✅ | ❌ |
| `/api/tickets/{id}/reject` | PATCH | ❌ | ❌ | ✅ | ❌ |
| `/api/tickets/{id}/start-work` | PATCH | ❌ | ✅ | ✅ | ❌ |
| `/api/tickets/{id}/resolve` | PATCH | ❌ | ✅ | ✅ | ❌ |
| `/api/tickets/{id}/progress` | PATCH | ❌ | ✅ | ✅ | ❌ |
| `/api/facilities` | GET | ✅ | ✅ | ✅ | ✅ |
| `/api/facilities` | POST | ❌ | ❌ | ✅ | ❌ |
| `/api/facilities/{id}` | PUT | ❌ | ❌ | ✅ | ❌ |
| `/api/facilities/{id}` | DELETE | ❌ | ❌ | ✅ | ❌ |
| `/api/notifications` | GET | ✅ | ✅ | ✅ | ❌ |
| `/api/notifications/unread-count` | GET | ✅ | ✅ | ✅ | ❌ |
| `/api/notifications/{id}/read` | PATCH | ✅ | ✅ | ✅ | ❌ |
| `/api/notifications/read-all` | PATCH | ✅ | ✅ | ✅ | ❌ |
| `/api/notifications/{id}` | DELETE | ✅ | ✅ | ✅ | ❌ |
| `/api/resources/**` | GET | ✅ | ✅ | ✅ | ✅ |

## Implementation Details

### Security Configuration

The `SecurityConfig.java` file has been updated to implement proper role-based access:

1. **Public Endpoints**: Authentication and OAuth2 endpoints are publicly accessible
2. **Read-Only Public**: Facilities and resources can be viewed without authentication
3. **Role-Based Access**: All other endpoints require appropriate roles

### Method-Level Security

Controllers use `@PreAuthorize` annotations for fine-grained access control:

```java
@PreAuthorize("hasAnyRole('USER', 'ADMIN', 'TECHNICIAN')")
public ResponseEntity<Ticket> createTicket(...) {
    // Method implementation
}

@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<Facility> addFacility(@RequestBody Facility facility) {
    // Method implementation
}
```

### Utility Classes

#### RoleUtil
Provides helper methods for role checking:
- `hasRole(String role)` - Check if user has specific role
- `hasAnyRole(String... roles)` - Check if user has any of the specified roles
- `hasAllRoles(String... roles)` - Check if user has all specified roles
- `isAdmin()`, `isTechnician()`, `isUser()` - Convenience methods
- `getCurrentUsername()` - Get current authenticated username
- `isOwnerOrAdmin(String resourceOwnerId)` - Check ownership or admin access

#### RequireRole Annotation
Custom annotation for declarative role-based access control (future enhancement).

## Usage Examples

### Checking User Roles in Service Layer

```java
@Service
public class TicketService {
    
    public void updateTicket(String ticketId, TicketUpdateDto dto, String userId) {
        // Check if user is admin or ticket owner
        if (!RoleUtil.isOwnerOrAdmin(getTicketById(ticketId).getCreatedBy(), userId)) {
            throw new AccessDeniedException("You can only update your own tickets");
        }
        // Update logic
    }
}
```

### Admin Role Assignment

```java
@RestController
public class AdminController {
    
    @PostMapping("/admin/users/{userId}/roles/{role}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> assignRole(@PathVariable String userId, @PathVariable Role role) {
        // Admin can assign roles to other users
        return ResponseEntity.ok(authService.assignRole(userId, role));
    }
}
```

## Testing

The role-based access control is tested with `RoleBasedAccessTest.java` which verifies:

1. Role checking functionality
2. Multiple role scenarios
3. Unauthenticated user access
4. Permission matrix compliance

Run tests with:
```bash
mvn test -Dtest=RoleBasedAccessTest
```

## Security Best Practices

1. **Principle of Least Privilege**: Users only have access to what they need
2. **Defense in Depth**: Both URL-level and method-level security
3. **Role Hierarchy**: Higher roles inherit lower role permissions
4. **Audit Trail**: All role-based access decisions are logged
5. **Token Validation**: JWT tokens include role information

## Future Enhancements

1. **Custom Annotations**: Use `@RequireRole` for cleaner code
2. **Dynamic Permissions**: Database-driven permission system
3. **Role Scoping**: Department or facility-specific roles
4. **Time-Based Access**: Temporary role assignments
5. **Multi-Tenancy**: Organization-based role isolation

## Troubleshooting

### Common Issues

1. **403 Forbidden**: User lacks required role
2. **401 Unauthorized**: User not authenticated
3. **Role Not Found**: Check role spelling and case sensitivity

### Debug Steps

1. Verify JWT token contains correct roles
2. Check SecurityConfig endpoint mappings
3. Review @PreAuthorize expressions
4. Use RoleUtil methods for debugging role assignments

## Migration Notes

- Existing endpoints now require authentication
- Public read access maintained for facilities and resources
- Admin endpoints moved to `/api/admin/**` namespace
- Role assignment endpoints added for admin users
