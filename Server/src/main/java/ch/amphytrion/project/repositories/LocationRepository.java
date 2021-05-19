package ch.amphytrion.project.repositories;

import ch.amphytrion.project.entities.databaseentities.Location;
import ch.amphytrion.project.entities.databaseentities.Meeting;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;

@Repository
public interface LocationRepository extends MongoRepository<Location, String> {
    ArrayList<Location> findByHostId(String hostId);
}
