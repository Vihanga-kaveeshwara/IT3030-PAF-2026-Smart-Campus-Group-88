package com.smartcampus.smart_campus_api.repository.resource;

import com.smartcampus.smart_campus_api.model.resource.Facility;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FacilityRepository extends MongoRepository<Facility, String> {
    // MongoRepository eken apita auto database eke save, delete, find karana okkoma wada tika karanawa. 
    // Eka nisa meke athule danata mokuthma liyanna oni naha!
}