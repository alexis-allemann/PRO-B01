package ch.amphytrion.project.controller;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class HostProfilControllerTest {

    HostRepository hostRepository;
    HostService hostService = new HostService(hostRepository);
    HostController hostController = new HostController(hostService);

    @Test
    void name() {
        assertEquals(HostController.class.getCanonicalName(),
                hostController.controllerName());
    }
}
