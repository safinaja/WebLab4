package org.example.final4.rest;

import org.example.final4.ejb.AuthService;
import jakarta.ejb.EJB;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.Map;

@Path("/auth")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AuthResource {

    @EJB
    private AuthService authService;

    @Context
    private HttpServletRequest request;

    public static class Credentials {
        public String login;
        public String password;
    }


    @POST
    @Path("/register")
    public Response register(Credentials credentials) {
        if (credentials == null ||
                credentials.login == null || credentials.login.trim().isEmpty() ||
                credentials.password == null || credentials.password.length() < 4) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(Map.of("error", "Login (non-empty) and password (min 4 chars) required"))
                    .build();
        }

        String login = credentials.login.trim();

        if (authService.userExists(login)) {
            return Response.status(Response.Status.CONFLICT)
                    .entity(Map.of("error", "Login already exists"))
                    .build();
        }


        boolean success = authService.registerUser(login, credentials.password);
        if (!success) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(Map.of("error", "Registration failed"))
                    .build();
        }

        createSession(login);
        return Response.ok(Map.of(
                "success", true,
                "login", login,
                "message", "User registered successfully"
        )).build();
    }


    @POST
    @Path("/login")
    public Response login(Credentials credentials) {
        if (credentials == null ||
                credentials.login == null || credentials.password == null) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(Map.of("error", "Login and password required"))
                    .build();
        }

        String login = credentials.login.trim();


        if (!authService.userExists(login)) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(Map.of("error", "User not found"))
                    .build();
        }


        if (!authService.authenticate(login, credentials.password)) {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity(Map.of("error", "Invalid password"))
                    .build();
        }


        createSession(login);
        return Response.ok(Map.of(
                "success", true,
                "login", login,
                "message", "Authentication successful"
        )).build();
    }


    @GET
    @Path("/check")
    public Response checkAuth() {
        HttpSession session = request.getSession(false);
        if (session != null) {
            String login = (String) session.getAttribute("login");
            if (login != null) {
                return Response.ok(Map.of(
                        "authenticated", true,
                        "login", login
                )).build();
            }
        }
        return Response.ok(Map.of("authenticated", false)).build();
    }


    @POST
    @Path("/logout")
    public Response logout() {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        return Response.ok(Map.of("success", true, "message", "Logged out")).build();
    }


    private void createSession(String login) {
        HttpSession session = request.getSession(true);
        session.setAttribute("login", login);
        session.setMaxInactiveInterval(30 * 60);
    }
}