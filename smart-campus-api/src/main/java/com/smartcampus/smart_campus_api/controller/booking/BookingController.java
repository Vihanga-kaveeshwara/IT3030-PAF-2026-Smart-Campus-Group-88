package com.smartcampus.smart_campus_api.controller.booking;


import com.smartcampus.smart_campus_api.dto.request.CreateBookingRequest;
import com.smartcampus.smart_campus_api.dto.request.RejectBookingRequest;
import com.smartcampus.smart_campus_api.dto.response.booking.BookingResponse;
import com.smartcampus.smart_campus_api.model.booking.Booking;
import com.smartcampus.smart_campus_api.model.booking.BookingStatus;
import com.smartcampus.smart_campus_api.service.booking.BookingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.time.LocalDate;
import java.util.List;

/**
 * REST Controller for managing booking operations in the Smart Campus system.
 * 
 * This controller handles all booking-related endpoints including:
 * - Creating new bookings for campus resources
 * - Retrieving booking information (personal and admin view)
 * - Managing booking lifecycle (approve, reject, cancel)
 * 
 * Base URL: /api/bookings
 * All endpoints follow RESTful conventions and return BookingResponse objects
 */
@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    // Service layer dependency for booking business logic
    @Autowired
    private BookingService bookingService;

    /**
     * Creates a new booking for a campus resource.
     * 
     * @param request {@link CreateBookingRequest} containing booking details
     *                (resource ID, requested date/time, requestor info, etc.)
     * @return ResponseEntity with {@link BookingResponse} and HTTP 201 (CREATED)
     * @throws ValidationException if request is invalid
     * @throws ResourceNotFoundException if resource not found
     * @throws BookingConflictException if time slot is unavailable
     */
    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(@Valid @RequestBody CreateBookingRequest request) {
        Booking booking = bookingService.createBooking(request);
        return new ResponseEntity<>(BookingResponse.fromEntity(booking), HttpStatus.CREATED);
    }

    /**
     * Retrieves a specific booking by its unique identifier.
     * 
     * @param id the unique booking ID
     * @return ResponseEntity with {@link BookingResponse} and HTTP 200 (OK)
     * @throws BookingNotFoundException if booking with given ID not found
     */
    @GetMapping("/{id}")
    public ResponseEntity<BookingResponse> getBookingById(@PathVariable String id) {
        Booking booking = bookingService.getBookingById(id);
        return new ResponseEntity<>(BookingResponse.fromEntity(booking), HttpStatus.OK);
    }

    /**
     * Retrieves all bookings made by a specific requester/user.
     * Used by students/staff to view their own bookings.
     * 
     * @param requesterId the ID of the user requesting their bookings
     * @return ResponseEntity with List of {@link BookingResponse} and HTTP 200 (OK)
     */
    @GetMapping("/my")
    public ResponseEntity<List<BookingResponse>> getMyBookings(@RequestParam String requesterId) {
        // Fetch bookings for the requester and convert to response DTOs
        List<BookingResponse> responses = bookingService.getBookingsByRequester(requesterId)
            .stream()
            .map(BookingResponse::fromEntity)
            .toList();
        return new ResponseEntity<>(responses, HttpStatus.OK);
    }

    /**
     * Retrieves all bookings with optional filtering (admin/staff only).
     * Allows filtering by booking status, resource, requester, and date range.
     * 
     * @param status optional booking status to filter by
     * @param resourceId optional resource ID to filter bookings
     * @param requesterId optional requester ID to filter bookings
     * @param fromDate optional start date for date range filter (ISO format)
     * @param toDate optional end date for date range filter (ISO format)
     * @return ResponseEntity with List of filtered {@link BookingResponse} and HTTP 200 (OK)
     */
    @GetMapping("/admin")
    public ResponseEntity<List<BookingResponse>> getAllBookings(@RequestParam(required = false) BookingStatus status,
                                                                @RequestParam(required = false) String resourceId,
                                                                @RequestParam(required = false) String requesterId,
                                                                @RequestParam(required = false)
                                                                @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
                                                                LocalDate fromDate,
                                                                @RequestParam(required = false)
                                                                @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
                                                                LocalDate toDate) {
        // Retrieve filtered bookings and map to response objects
        List<BookingResponse> responses = bookingService.getAllBookingsFiltered(status, resourceId, requesterId, fromDate, toDate)
            .stream()
            .map(BookingResponse::fromEntity)
            .toList();

        return new ResponseEntity<>(responses, HttpStatus.OK);
    }

    /**
     * Approves a pending booking request.
     * Changes booking status from PENDING to APPROVED.
     * 
     * @param id the unique booking ID to approve
     * @return ResponseEntity with updated {@link BookingResponse} and HTTP 200 (OK)
     * @throws BookingNotFoundException if booking not found
     * @throws InvalidBookingStateException if booking cannot be approved from current state
     */
    @PutMapping("/{id}/approve")
    public ResponseEntity<BookingResponse> approveBooking(@PathVariable String id) {
        Booking booking = bookingService.approveBooking(id);
        return new ResponseEntity<>(BookingResponse.fromEntity(booking), HttpStatus.OK);
    }

    /**
     * Rejects a pending booking request.
     * Changes booking status from PENDING to REJECTED with reason provided.
     * 
     * @param id the unique booking ID to reject
     * @param request {@link RejectBookingRequest} containing rejection reason
     * @return ResponseEntity with updated {@link BookingResponse} and HTTP 200 (OK)
     * @throws BookingNotFoundException if booking not found
     * @throws InvalidBookingStateException if booking cannot be rejected from current state
     */
    @PutMapping("/{id}/reject")
    public ResponseEntity<BookingResponse> rejectBooking(@PathVariable String id,
                                                         @Valid @RequestBody RejectBookingRequest request) {
        Booking booking = bookingService.rejectBooking(id, request.getReason());
        return new ResponseEntity<>(BookingResponse.fromEntity(booking), HttpStatus.OK);
    }

    /**
     * Cancels an approved booking.
     * Changes booking status from APPROVED to CANCELLED.
     * Typically called by the requester to cancel their own booking.
     * 
     * @param id the unique booking ID to cancel
     * @return ResponseEntity with updated {@link BookingResponse} and HTTP 200 (OK)
     * @throws BookingNotFoundException if booking not found
     * @throws InvalidBookingStateException if booking cannot be cancelled from current state
     */
    @PutMapping("/{id}/cancel")
    public ResponseEntity<BookingResponse> cancelBooking(@PathVariable String id) {
        Booking booking = bookingService.cancelBooking(id);
        return new ResponseEntity<>(BookingResponse.fromEntity(booking), HttpStatus.OK);
    }
}
