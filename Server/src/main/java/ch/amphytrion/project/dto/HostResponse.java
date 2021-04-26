package ch.amphytrion.project.dto;

import ch.amphytrion.project.entities.databaseentities.Address;
import ch.amphytrion.project.entities.databaseentities.Tag;
import ch.amphytrion.project.entities.databaseentities.User;

import java.util.List;

public class HostResponse implements InterfaceDTO {
    public String id;
    public String name;
    public Address address;
    public String description;
    public List<Tag> tags;

    public HostResponse(User user) {
        this.id = user.getId();
        this.name = user.getUsername();
        this.address = user.getHostProfil().getAddress();
        this.description = user.getHostProfil().getDescription();
        this.tags = user.getHostProfil().getTags();
    }
}
