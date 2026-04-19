package com.smartcampus.smart_campus_api.model.resource;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "facilities")
public class Facility {

    @Id
    private String id;

    private String name;
    private String type;
    private int capacity;
    private String location;
    private String availabilityWindows;
    private String status;
}