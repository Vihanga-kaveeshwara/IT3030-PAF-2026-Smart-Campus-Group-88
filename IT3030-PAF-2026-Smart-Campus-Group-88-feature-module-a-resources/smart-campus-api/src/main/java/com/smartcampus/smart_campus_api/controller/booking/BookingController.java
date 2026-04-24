package com.smartcampus.smart_campus_api.controller.booking;

import com.smartcampus.smart_campus_api.dto.request.booking.CreateBookingRequest;
import com.smartcampus.smart_campus_api.dto.request.booking.RejectBookingRequest;
import com.smartcampus.smart_campus_api.dto.responce.booking.BookingResponse;
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

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(@Valid @RequestBody CreateBookingRequest request) {
        Booking booking = bookingService.createBooking(request);
        return new ResponseEntity<>(BookingResponse.fromEntity(booking), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookingResponse> getBookingById(@PathVariable String id) {
        Booking booking = bookingService.getBookingById(id);
        return new ResponseEntity<>(BookingResponse.fromEntity(booking), HttpStatus.OK);
    }

    @GetMapping("/my")
    public ResponseEntity<List<BookingResponse>> getMyBookings(@RequestParam String requesterId) {
        List<BookingResponse> responses = bookingService.getBookingsByRequester(requesterId)
            .stream()
            .map(BookingResponse::fromEntity)
            .toList();
        return new ResponseEntity<>(responses, HttpStatus.OK);
    }

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
        List<BookingResponse> responses = bookingService.getAllBookingsFiltered(status, resourceId, requesterId, fromDate, toDate)
            .stream()
            .map(BookingResponse::fromEntity)
            .toList();

        return new ResponseEntity<>(responses, HttpStatus.OK);
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<BookingResponse> approveBooking(@PathVariable String id) {
        Booking booking = bookingService.approveBooking(id);
        return new ResponseEntity<>(BookingResponse.fromEntity(booking), HttpStatus.OK);
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<BookingResponse> rejectBooking(@PathVariable String id,
                                                         @Valid @RequestBody RejectBookingRequest request) {
        Booking booking = bookingService.rejectBooking(id, request.getReason());
        return new ResponseEntity<>(BookingResponse.fromEntity(booking), HttpStatus.OK);
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<BookingResponse> cancelBooking(@PathVariable String id) {
        Booking booking = bookingService.cancelBooking(id);
        return new ResponseEntity<>(BookingResponse.fromEntity(booking), HttpStatus.OK);
    }
}
