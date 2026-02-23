package org.example.final4.filter;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerRequestFilter;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.Provider;
import java.io.IOException;

@Provider
public class AuthFilter implements ContainerRequestFilter {

    @Context
    private HttpServletRequest request;

    private static final String[] PUBLIC_PATHS = {
            "auth/login",
            "auth/register",
            "auth/check"
    };

    @Override
    public void filter(ContainerRequestContext requestContext) throws IOException {
        String path = requestContext.getUriInfo().getPath();


        for (String publicPath : PUBLIC_PATHS) {
            if (path.contains(publicPath)) {
                return;
            }
        }

        String login = (String) request.getSession().getAttribute("login");

        if (login == null || login.trim().isEmpty()) {
            requestContext.abortWith(
                    Response.status(Response.Status.UNAUTHORIZED)
                            .entity("{\"error\": \"Authentication required\"}")
                            .build()
            );
        }
    }
}