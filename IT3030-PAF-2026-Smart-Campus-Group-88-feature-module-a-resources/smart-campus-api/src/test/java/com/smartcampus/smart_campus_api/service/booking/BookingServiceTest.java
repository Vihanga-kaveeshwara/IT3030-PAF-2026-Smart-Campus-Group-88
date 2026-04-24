package com.smartcampus.smart_campus_api.service.booking;

import com.smartcampus.smart_campus_api.dto.request.booking.CreateBookingRequest;
import com.smartcampus.smart_campus_api.exception.BookingConflictException;
import com.smartcampus.smart_campus_api.exception.InvalidBookingTransitionException;
import com.smartcampus.smart_campus_api.model.booking.Booking;
import com.smartcampus.smart_campus_api.model.booking.BookingStatus;
import com.smartcampus.smart_campus_api.repository.booking.BookingRepository;
import com.smartcampus.smart_campus_api.repository.resource.FacilityRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BookingServiceTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private FacilityRepository facilityRepository;

    @InjectMocks
    private BookingService bookingService;

    @Test
    void createBooking_shouldThrowConflict_whenOverlapExists() {
        CreateBookingRequest request = new CreateBookingRequest();
        request.setResourceId("facility-1");
        request.setRequesterId("user-1");
        request.setDate(LocalDate.of(2026, 4, 30));
        request.setStartTime(LocalTime.of(10, 0));
        request.setEndTime(LocalTime.of(11, 0));
        request.setPurpose("Club meeting");
        request.setExpectedAttendees(15);

        when(facilityRepository.existsById("facility-1")).thenReturn(true);
        when(bookingRepository.findOverlappingBookings(any(), any(), any(), any(), any())).thenReturn(List.of(new Booking()));

        assertThrows(BookingConflictException.class, () -> bookingService.createBooking(request));
    }

    @Test
    void rejectBooking_shouldMovePendingToRejected_withReason() {
        Booking existing = new Booking();
        existing.setId("booking-1");
        existing.setStatus(BookingStatus.PENDING);

        when(bookingRepository.findById("booking-1")).thenReturn(Optional.of(existing));
        when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Booking result = bookingService.rejectBooking("booking-1", "Not available for maintenance");

        assertEquals(BookingStatus.REJECTED, result.getStatus());
        assertEquals("Not available for maintenance", result.getRejectionReason());
    }

    @Test
    void cancelBooking_shouldThrow_whenStatusIsNotApproved() {
        Booking existing = new Booking();
        existing.setId("booking-2");
        existing.setStatus(BookingStatus.PENDING);

        when(bookingRepository.findById("booking-2")).thenReturn(Optional.of(existing));

        assertThrows(InvalidBookingTransitionException.class, () -> bookingService.cancelBooking("booking-2"));
    }

    @Test
    void approveBooking_shouldSetApproved_whenPendingAndNoConflict() {
        Booking existing = new Booking();
        existing.setId("booking-3");
        existing.setResourceId("facility-1");
        existing.setDate(LocalDate.of(2026, 5, 2));
        existing.setStartTime(LocalTime.of(9, 0));
        existing.setEndTime(LocalTime.of(10, 0));
        existing.setStatus(BookingStatus.PENDING);

        when(bookingRepository.findById("booking-3")).thenReturn(Optional.of(existing));
        when(bookingRepository.findOverlappingBookings(any(), any(), any(), any(), any())).thenReturn(List.of(existing));
        when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Booking result = bookingService.approveBooking("booking-3");

        assertEquals(BookingStatus.APPROVED, result.getStatus());
        verify(bookingRepository).save(existing);
    }
}
