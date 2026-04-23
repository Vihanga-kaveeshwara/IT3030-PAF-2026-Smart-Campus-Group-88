package com.smartcampus.smart_campus_api.dto.responce;

import com.smartcampus.smart_campus_api.model.auth.Role;
import lombok.Builder;
import lombok.Data;

import java.util.Set;

@Data
@Builder
public class AuthResponse {
    private String token;
    private String id;
    private String email;
    private String name;
    private String profilePictureUrl;
    private Set<Role> roles;
}
