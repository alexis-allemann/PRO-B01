package ch.amphytrion.project.dto;

import ch.amphytrion.project.entities.databaseentities.Tag;
import ch.amphytrion.project.entities.databaseentities.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
public class HostResponse implements InterfaceDTO {
    public String id;
    public String name;
    public AddressResponse address;
    public String description;
    public List<Tag> tags;

    public HostResponse(User user) {
        this.id = user.getId();
        this.name = user.getUsername();
        this.address = new AddressResponse(user.getHostProfil().getAddress());
        this.description = user.getHostProfil().getDescription();
        this.tags = user.getHostProfil().getTags();
    }
}
