package ch.amphytrion.project.dto;

import ch.amphytrion.project.entities.databaseentities.Tag;
import ch.amphytrion.project.entities.databaseentities.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * SignupHost RESTful response class
 *
 * @author Alexis Allemann, Hakim Balestieri, Aloïs Christen, Christian Gomes, Alexandre Mottier, Johann Werkle
 */
@AllArgsConstructor
@NoArgsConstructor
public class SignUpHostRequest implements InterfaceDTO {
    public String tokenID;
    public String name;
    public String street;
    public String streetNb;
    public String cityName;
    public String npa;
    public String description;
    public List<Tag> tags;
}
