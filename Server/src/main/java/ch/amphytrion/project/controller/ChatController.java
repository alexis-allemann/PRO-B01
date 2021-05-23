package ch.amphytrion.project.controller;

import ch.amphytrion.project.entities.databaseentities.Chat;
import ch.amphytrion.project.entities.databaseentities.Message;
import ch.amphytrion.project.entities.databaseentities.User;
import ch.amphytrion.project.services.ChatService;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * RESTful chat controller. Used to map HTML requests to the corresponding methods
 *
 * @author Alexis Allemann, Hakim Balestieri, Aloïs Christen, Christian Gomes, Alexandre Mottier, Johann Werkle
 */
@RestController
public class ChatController extends BaseController implements IGenericController<Chat> {

    @Autowired
    private ChatService chatService;

    /**
     * Constructor of the chat controller
     * @param chatService corresponding chat service to the chat controller
     */
    @Autowired
    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    /**
     * Let user add a message to a chat
     * @param chatId The id of the chat
     * @param message The content of message
     * @throws CustomException
     * @return ResponseEntity<Chat> The chat that received the message
     */
    //X
    @SneakyThrows
    @PostMapping("/chat/createMessage/{chatId}")
    public ResponseEntity<Chat> createMessage(@PathVariable String chatId, @RequestBody Message message) {
        checkUserIsStudent();
        User currentUser = getCurrentUser();
        Chat chat = chatService.findById(chatId);
        try {
            message.setUsername(currentUser.getUsername());
            chat.getMessages().add(message);
            return ResponseEntity.ok(chatService.save(chat));
        } catch (Exception e) {
            throw new CustomException("Le message n'a pas pu être créé", HttpStatus.NOT_ACCEPTABLE, null);
        }
    }

    /**
     * Get a chat by its id
     * @param chatId The id of the chat
     * @throws CustomException
     * @return ResponseEntity<Chat> the chat with corresponding id
     */
    //X
    @SneakyThrows
    @GetMapping("/chat/{chatId}")
    public ResponseEntity<Chat> getById(@PathVariable String chatId) {
        try {
            return ResponseEntity.ok(chatService.findById(chatId));
        } catch (Exception e) {
            throw new CustomException("Le chat n'existe pas", HttpStatus.NOT_ACCEPTABLE, null);
        }
    }

    @ApiOperation(value = "Retrieve chatController")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Successfully reached chatController"),
            @ApiResponse(code = 401, message = "You are not authorized to view this resource"),
            @ApiResponse(code = 403, message = "Access to this resource is forbidden")
    })
    //TODO : Check if still relevant
/**
 * Test method of the controller
 * @return the name of the class
 */
    @GetMapping("/chatController")
    private String testController() {
        return this.getClass().getSimpleName();
    }
    
}
