package com.smartcampus.smart_campus_api.repository.booking;

import com.smartcampus.smart_campus_api.model.booking.Booking;
import com.smartcampus.smart_campus_api.model.booking.BookingStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface BookingRepository extends MongoRepository<Booking, String> {

    List<Booking> findByRequesterId(String requesterId);

    @Query("{ 'resourceId': ?0, 'date': ?1, 'status': { $in: ?4 }, 'startTime': { $lt: ?3 }, 'endTime': { $gt: ?2 } }")
    List<Booking> findOverlappingBookings(String resourceId,
                                          LocalDate date,
                                          LocalTime startTime,
                                          LocalTime endTime,
                                          List<BookingStatus> activeStatuses);
}
