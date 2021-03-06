package ch.amphytrion.project.authentication.utils;

import ch.amphytrion.project.authentication.SecurityConstants;
import ch.amphytrion.project.authentication.google_authentication.GoogleAuthenticationToken;
import ch.amphytrion.project.entities.databaseentities.User;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;

import javax.servlet.FilterChain;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Writer;
import java.util.Date;
import java.util.stream.Collectors;

/**
 *
 *
 * @author Alexis Allemann, Hakim Balestieri, Aloïs Christen, Christian Gomes, Alexandre Mottier, Johann Werkle
 */
public class JwtUtils {



    public static void AddTokenWithSuccessfullAuthentication(HttpServletRequest req,
                                                             HttpServletResponse response,
                                                             FilterChain chain,
                                                             Authentication auth){
        if(auth == null || auth.getPrincipal() == null){
            return;
        }
        String token = makeHeaderToken(((User) auth.getPrincipal()).getId());

        response.addHeader(SecurityConstants.HEADER_STRING, SecurityConstants.TOKEN_PREFIX + token);
    }

    public static String makeHeaderToken(String userID){
        return JWT.create()
                .withSubject(userID)
                .withExpiresAt(new Date(System.currentTimeMillis() + SecurityConstants.EXPIRATION_TIME))
                .sign(Algorithm.HMAC512(SecurityConstants.SECRET.getBytes()));
    }
}
