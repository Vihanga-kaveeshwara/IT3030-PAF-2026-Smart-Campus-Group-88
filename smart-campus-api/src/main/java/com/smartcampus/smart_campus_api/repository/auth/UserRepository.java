package com.smartcampus.smart_campus_api.repository.auth;

import com.smartcampus.smart_campus_api.model.auth.AuthProvider;
import com.smartcampus.smart_campus_api.model.auth.Role;
import com.smartcampus.smart_campus_api.model.auth.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    Optional<User> findByProviderIdAndProvider(String providerId, AuthProvider provider);

    List<User> findByRolesContaining(Role role);
}
