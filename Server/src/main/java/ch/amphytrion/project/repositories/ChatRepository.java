package ch.amphytrion.project.repositories;

import ch.amphytrion.project.entities.databaseentities.Chat;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

/**
 * Add CRUD methods to Chat collection in database
 *
 * @author Alexis Allemann, Hakim Balestieri, Aloïs Christen, Christian Gomes, Alexandre Mottier, Johann Werkle
 */
@Repository
public interface ChatRepository extends MongoRepository<Chat, String> {
}
