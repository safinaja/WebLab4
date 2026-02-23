package org.example.final4.rest;

import org.example.final4.ejb.PointService;
import jakarta.ejb.EJB;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.example.final4.entity.Point;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Path("/points")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class PointResource {

    @EJB
    private PointService pointService;

    @Context
    private HttpServletRequest request;


    public static class Coordinates {
        public float x;
        public float y;
        public float r;
    }

    private String getLoginFromSession() {
        HttpSession session = request.getSession(false);
        if (session == null) {
            throw new WebApplicationException(
                    Response.status(401).entity(Map.of("error", "Не авторизован")).build()
            );
        }

        String login = (String) session.getAttribute("login");
        if (login == null) {
            throw new WebApplicationException(
                    Response.status(401).entity(Map.of("error", "Сессия недействительна")).build()
            );
        }

        return login;
    }


    private Response createPointResponse(org.example.final4.entity.Point point, String source) {
        Map<String, Object> response = new HashMap<>();
        response.put("id", point.getId());
        response.put("x", point.getX());
        response.put("y", point.getY());
        response.put("r", point.getR());
        response.put("hit", point.isHit());
        response.put("createdAt", point.getCreatedAt().toString());
        response.put("user", getLoginFromSession());
        response.put("success", true);
        response.put("source", source);

        return Response.ok(response).build();
    }

    private Response errorResponse(String message, int status) {
        return Response.status(status)
                .entity(Map.of("error", message))
                .build();
    }

    @POST
    @Path("/from-form")
    public Response addPointFromForm(Coordinates coords) {
        System.out.println("ADD POINT FROM FORM: X=" + coords.x + ", Y=" + coords.y + ", R=" + coords.r);

        try {
            String login = getLoginFromSession();

            if (!pointService.validateInputForForm(coords.x, coords.y, coords.r)) {
                return errorResponse(
                        """
                        Некорректные входные данные для формы:
                        - X должен быть целым числом от -5 до 3
                        - Y должен быть числом в диапазоне (-3, 5)
                        - R должен быть целым числом 1, 2 или 3""",
                        400
                );
            }

            var point = pointService.savePointFromForm(login, coords.x, coords.y, coords.r);
            return createPointResponse(point, "form");

        } catch (WebApplicationException e) {
            throw e;
        } catch (RuntimeException e) {
            System.err.println("ERROR in addPointFromForm: " + e.getMessage());
            return errorResponse(e.getMessage(), 400);
        } catch (Exception e) {
            System.err.println("ERROR in addPointFromForm: " + e.getMessage());
            e.printStackTrace();
            return errorResponse("Внутренняя ошибка сервера", 500);
        }
    }

    @POST
    @Path("/from-graph")
    public Response addPointFromGraph(Coordinates coords) {
        System.out.println("ADD POINT FROM GRAPH: X=" + coords.x + ", Y=" + coords.y + ", R=" + coords.r);

        try {
            String login = getLoginFromSession();

            if (!pointService.validateInputForGraph(coords.x, coords.y, coords.r)) {
                return errorResponse(
                        "Некорректное значение R. Должно быть целым числом 1, 2 или 3",
                        400
                );
            }

            var point = pointService.savePointFromGraph(login, coords.x, coords.y, coords.r);
            return createPointResponse(point, "graph");

        } catch (WebApplicationException e) {
            throw e;
        } catch (RuntimeException e) {
            System.err.println("ERROR in addPointFromGraph: " + e.getMessage());
            return errorResponse(e.getMessage(), 400);
        } catch (Exception e) {
            System.err.println("ERROR in addPointFromGraph: " + e.getMessage());
            e.printStackTrace();
            return errorResponse("Внутренняя ошибка сервера", 500);
        }
    }

    @POST
    public Response addPoint(Coordinates coords) {
        System.out.println("=== ADD POINT (legacy) ===");
        return addPointFromForm(coords);
    }

    @GET
    public Response getPoints() {
        System.out.println("=== GET POINTS REQUEST ===");

        try {
            String login = getLoginFromSession();
            List<org.example.final4.entity.Point> points = pointService.getPointsByUser(login);

            List<Map<String, Object>> pointsDto = points.stream()
                    .map(p -> {
                        Map<String, Object> map = new HashMap<>();
                        map.put("id", p.getId());
                        map.put("x", p.getX());
                        map.put("y", p.getY());
                        map.put("r", p.getR());
                        map.put("hit", p.isHit());
                        map.put("createdAt", p.getCreatedAt().toString());
                        return map;
                    })
                    .collect(Collectors.toList());

            System.out.println("Returning " + pointsDto.size() + " points for user: " + login);
            return Response.ok(pointsDto).build();

        } catch (WebApplicationException e) {
            throw e;
        } catch (Exception e) {
            System.err.println("ERROR in getPoints: " + e.getMessage());
            e.printStackTrace();
            return errorResponse("Внутренняя ошибка сервера", 500);
        }
    }

    @DELETE
    @Path("/{id}")
    public Response deletePoint(@PathParam("id") Long id) {
        System.out.println("=== DELETE POINT REQUEST (ID: " + id + ") ===");
        return Response.status(501)
                .entity(Map.of("error", "Not implemented yet"))
                .build();
    }

    @DELETE
    @Path("/clear")
    public Response clearPoints() {
        System.out.println("=== CLEAR ALL POINTS REQUEST ===");

        try {
            String login = getLoginFromSession();
            return Response.ok(Map.of(
                    "success", true,
                    "message", "Все точки пользователя " + login + " будут удалены",
                    "count", 0
            )).build();

        } catch (WebApplicationException e) {
            throw e;
        } catch (Exception e) {
            System.err.println("ERROR in clearPoints: " + e.getMessage());
            e.printStackTrace();
            return errorResponse("Внутренняя ошибка сервера", 500);
        }
    }

    @GET
    @Path("/stats")
    public Response getStats() {
        System.out.println("=== GET STATS REQUEST ===");

        try {
            String login = getLoginFromSession();
            List<org.example.final4.entity.Point> points = pointService.getPointsByUser(login);

            long total = points.size();
            long hits = points.stream().filter(Point::isHit).count();
            long misses = total - hits;

            Map<String, Object> stats = new HashMap<>();
            stats.put("total", total);
            stats.put("hits", hits);
            stats.put("misses", misses);
            stats.put("hitPercentage", total > 0 ? (double) hits / total * 100 : 0);
            stats.put("user", login);

            return Response.ok(stats).build();

        } catch (WebApplicationException e) {
            throw e;
        } catch (Exception e) {
            System.err.println("ERROR in getStats: " + e.getMessage());
            e.printStackTrace();
            return errorResponse("Внутренняя ошибка сервера", 500);
        }
    }
}