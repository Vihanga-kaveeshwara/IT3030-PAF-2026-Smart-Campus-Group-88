package com.smartcampus.smart_campus_api.service.resource;

import com.smartcampus.smart_campus_api.model.resource.Facility;
import com.smartcampus.smart_campus_api.repository.resource.FacilityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FacilityService {

    @Autowired
    private FacilityRepository facilityRepository;

    // 1. Aluth facility ekak system ekata add kirima (POST)
    public Facility addFacility(Facility facility) {
        return facilityRepository.save(facility);
    }

    // 2. System eke thiyena okkoma facilities balima (GET)
    public List<Facility> getAllFacilities() {
        return facilityRepository.findAll();
    }

    // 3. Facility ekak update kirima (PUT endpoint eka wenuwen)
    public Facility updateFacility(String id, Facility facilityDetails) {
        return facilityRepository.findById(id).map(existingFacility -> {
            existingFacility.setName(facilityDetails.getName());
            existingFacility.setType(facilityDetails.getType());
            existingFacility.setCapacity(facilityDetails.getCapacity());
            existingFacility.setLocation(facilityDetails.getLocation());
            existingFacility.setAvailabilityWindows(facilityDetails.getAvailabilityWindows());
            existingFacility.setStatus(facilityDetails.getStatus());
            return facilityRepository.save(existingFacility);
        }).orElseThrow(() -> new RuntimeException("Facility not found with id: " + id)); 
    }

    // 4. Facility ekak delete kirima (DELETE endpoint eka wenuwen)
    public void deleteFacility(String id) {
        facilityRepository.deleteById(id);
    }
}