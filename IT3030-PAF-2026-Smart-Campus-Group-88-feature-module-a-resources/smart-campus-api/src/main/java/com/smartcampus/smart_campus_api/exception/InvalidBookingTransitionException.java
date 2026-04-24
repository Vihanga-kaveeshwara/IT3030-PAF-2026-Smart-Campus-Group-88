package com.smartcampus.smart_campus_api.exception;

public class InvalidBookingTransitionException extends RuntimeException {
    public InvalidBookingTransitionException(String message) {
        super(message);
    }
}
