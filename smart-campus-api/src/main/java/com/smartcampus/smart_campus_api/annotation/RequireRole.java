package com.smartcampus.smart_campus_api.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Custom annotation for role-based access control
 * This provides a cleaner way to specify required roles on endpoints
 */
@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface RequireRole {
    
    /**
     * The roles that are allowed to access this endpoint
     */
    String[] value();
    
    /**
     * Whether all specified roles are required (AND) or any role is sufficient (OR)
     * Default is false (OR logic)
     */
    boolean requireAll() default false;
}
