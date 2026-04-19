package com.smartcampus.smart_campus_api.controller.resource;

import com.smartcampus.smart_campus_api.model.resource.Facility;
import com.smartcampus.smart_campus_api.service.resource.FacilityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/facilities") // Me API ekata yana pradhana URL eka
public class FacilityController {

    @Autowired
    private FacilityService facilityService;

    // 1. Aluth facility ekak system ekata add karana Endpoint eka (POST)
    @PostMapping
    public ResponseEntity<Facility> addFacility(@RequestBody Facility facility) {
        Facility savedFacility = facilityService.addFacility(facility);
        return new ResponseEntity<>(savedFacility, HttpStatus.CREATED);
    }

    // 2. System eke thiyena okkoma facilities balana Endpoint eka (GET)
    @GetMapping
    public ResponseEntity<List<Facility>> getAllFacilities() {
        List<Facility> facilities = facilityService.getAllFacilities();
        return new ResponseEntity<>(facilities, HttpStatus.OK);
    }

    // 3. Facility ekak update karana Endpoint eka (PUT)
    @PutMapping("/{id}")
    public ResponseEntity<Facility> updateFacility(@PathVariable String id, @RequestBody Facility facility) {
        Facility updatedFacility = facilityService.updateFacility(id, facility);
        return new ResponseEntity<>(updatedFacility, HttpStatus.OK);
    }

    // 4. Facility ekak delete karana Endpoint eka (DELETE)
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteFacility(@PathVariable String id) {
        facilityService.deleteFacility(id);
        return new ResponseEntity<>("Facility deleted successfully", HttpStatus.OK);
    }
}