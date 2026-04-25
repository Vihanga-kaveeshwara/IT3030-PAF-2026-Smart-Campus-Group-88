package com.smartcampus.smart_campus_api.service.booking;

import com.smartcampus.smart_campus_api.dto.request.booking.CreateBookingRequest;
import com.smartcampus.smart_campus_api.exception.BookingConflictException;
import com.smartcampus.smart_campus_api.exception.BookingNotFoundException;
import com.smartcampus.smart_campus_api.exception.InvalidBookingTransitionException;
import com.smartcampus.smart_campus_api.model.booking.Booking;
import com.smartcampus.smart_campus_api.model.booking.BookingStatus;
import com.smartcampus.smart_campus_api.repository.booking.BookingRepository;
import com.smartcampus.smart_campus_api.repository.resource.FacilityRepository;
import com.smartcampus.smart_campus_api.service.notification.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private FacilityRepository facilityRepository;

    @Autowired
    private NotificationService notificationService;

    private static final List<BookingStatus> BLOCKING_STATUSES = List.of(BookingStatus.PENDING, BookingStatus.APPROVED);

    public Booking createBooking(CreateBookingRequest request) {
        validateTimeRange(request.getStartTime().isBefore(request.getEndTime()));
        if (request.getDate().isBefore(LocalDate.now())) {
            throw new InvalidBookingTransitionException("Booking date cannot be in the past");
        }

        if (!facilityRepository.existsById(request.getResourceId())) {
            throw new BookingNotFoundException("Resource not found with id: " + request.getResourceId());
        }

        ensureNoConflict(
            request.getResourceId(),
            request.getDate(),
            request.getStartTime(),
            request.getEndTime()
        );

        Booking booking = new Booking();
        booking.setResourceId(request.getResourceId());
        booking.setRequesterId(request.getRequesterId());
        booking.setDate(request.getDate());
        booking.setStartTime(request.getStartTime());
        booking.setEndTime(request.getEndTime());
        booking.setPurpose(request.getPurpose());
        booking.setExpectedAttendees(request.getExpectedAttendees());
        booking.setStatus(BookingStatus.PENDING);
        booking.setCreatedAt(LocalDateTime.now());
        booking.setUpdatedAt(LocalDateTime.now());

        return bookingRepository.save(booking);
    }

    public Booking approveBooking(String bookingId) {
        Booking booking = getBookingById(bookingId);
        ensureStatus(booking, BookingStatus.PENDING, "Only PENDING bookings can be approved");

        ensureNoConflict(booking.getResourceId(), booking.getDate(), booking.getStartTime(), booking.getEndTime(), booking.getId());

        booking.setStatus(BookingStatus.APPROVED);
        booking.setRejectionReason(null);
        booking.setUpdatedAt(LocalDateTime.now());
        Booking savedBooking = bookingRepository.save(booking);
        
        // Send notification to booking requester about approval
        if (booking.getRequesterId() != null) {
            notificationService.notifyBookingApproved(booking.getRequesterId(), booking.getId());
        }
        
        return savedBooking;
    }

    public Booking rejectBooking(String bookingId, String reason) {
        Booking booking = getBookingById(bookingId);
        ensureStatus(booking, BookingStatus.PENDING, "Only PENDING bookings can be rejected");

        booking.setStatus(BookingStatus.REJECTED);
        booking.setRejectionReason(reason);
        booking.setUpdatedAt(LocalDateTime.now());
        Booking savedBooking = bookingRepository.save(booking);
        
        // Send notification to booking requester about rejection
        if (booking.getRequesterId() != null) {
            notificationService.notifyBookingRejected(booking.getRequesterId(), booking.getId(), reason != null ? reason : "No reason provided");
        }
        
        return savedBooking;
    }

    public Booking cancelBooking(String bookingId) {
        Booking booking = getBookingById(bookingId);
        ensureStatus(booking, BookingStatus.APPROVED, "Only APPROVED bookings can be cancelled");

        booking.setStatus(BookingStatus.CANCELLED);
        booking.setUpdatedAt(LocalDateTime.now());
        Booking savedBooking = bookingRepository.save(booking);
        
        // Send notification to booking requester about cancellation
        if (booking.getRequesterId() != null) {
            notificationService.notifyBookingCancelled(booking.getRequesterId(), booking.getId());
        }
        
        return savedBooking;
    }

    public Booking getBookingById(String bookingId) {
        return bookingRepository.findById(bookingId)
            .orElseThrow(() -> new BookingNotFoundException("Booking not found with id: " + bookingId));
    }

    public List<Booking> getBookingsByRequester(String requesterId) {
        return bookingRepository.findByRequesterId(requesterId);
    }

    public List<Booking> getAllBookingsFiltered(BookingStatus status,
                                                String resourceId,
                                                String requesterId,
                                                LocalDate fromDate,
                                                LocalDate toDate) {
        validateDateRange(fromDate, toDate);

        return bookingRepository.findAll().stream()
            .filter(booking -> status == null || booking.getStatus() == status)
            .filter(booking -> resourceId == null || resourceId.isBlank() || resourceId.equals(booking.getResourceId()))
            .filter(booking -> requesterId == null || requesterId.isBlank() || requesterId.equals(booking.getRequesterId()))
            .filter(booking -> fromDate == null || !booking.getDate().isBefore(fromDate))
            .filter(booking -> toDate == null || !booking.getDate().isAfter(toDate))
            .toList();
    }

    private void ensureNoConflict(String resourceId,
                                  LocalDate date,
                                  java.time.LocalTime startTime,
                                  java.time.LocalTime endTime) {
        List<Booking> conflicts = bookingRepository.findOverlappingBookings(resourceId, date, startTime, endTime, BLOCKING_STATUSES);
        if (!conflicts.isEmpty()) {
            throw new BookingConflictException("Booking conflict detected for the selected resource and time range");
        }
    }

    private void ensureNoConflict(String resourceId,
                                  LocalDate date,
                                  java.time.LocalTime startTime,
                                  java.time.LocalTime endTime,
                                  String excludeBookingId) {
        List<Booking> conflicts = bookingRepository.findOverlappingBookings(resourceId, date, startTime, endTime, BLOCKING_STATUSES)
            .stream()
            .filter(conflict -> !conflict.getId().equals(excludeBookingId))
            .toList();

        if (!conflicts.isEmpty()) {
            throw new BookingConflictException("Booking conflict detected for the selected resource and time range");
        }
    }

    private void ensureStatus(Booking booking, BookingStatus expectedStatus, String message) {
        if (booking.getStatus() != expectedStatus) {
            throw new InvalidBookingTransitionException(message);
        }
    }

    private void validateTimeRange(boolean validRange) {
        if (!validRange) {
            throw new InvalidBookingTransitionException("startTime must be before endTime");
        }
    }

    private void validateDateRange(LocalDate fromDate, LocalDate toDate) {
        if (fromDate != null && toDate != null && fromDate.isAfter(toDate)) {
            throw new InvalidBookingTransitionException("fromDate must be before or equal to toDate");
        }
    }
}
