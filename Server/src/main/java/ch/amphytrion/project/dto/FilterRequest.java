package ch.amphytrion.project.dto;

import ch.amphytrion.project.entities.databaseentities.Location;
import ch.amphytrion.project.entities.databaseentities.Tag;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.util.ArrayList;

/**
 * Class used to filter meetings
 *
 * @author Alexis Allemann, Hakim Balestieri, Aloïs Christen, Christian Gomes, Alexandre Mottier, Johann Werkle
 */
@NoArgsConstructor
@AllArgsConstructor
public class FilterRequest implements InterfaceDTO {
    public String name;
    public String startDate;
    public String endDate;
    public ArrayList<Tag> tags = new ArrayList<>();
    public Location location;
}
