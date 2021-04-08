package ch.amphytrion.project.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;

@AllArgsConstructor
@Data
@Document
public class Location {
    private Host host;
    private Address address;
    private ArrayList<Meeting> meetings;
    private ArrayList<Tag> tags;
    private ArrayList<OpeningHour> openingHours;
    private String name;

}