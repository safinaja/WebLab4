package org.example.final4.ejb;

import org.example.final4.entity.Point;
import org.example.final4.entity.User;
import jakarta.ejb.Stateless;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.example.final4.service.AreaChecker;
import java.util.List;

@Stateless
public class PointService {

    @Inject
    private DataBaseService dataBaseService;

    @Inject
    private AreaChecker areaChecker;

    @PersistenceContext(unitName = "dbPu")
    private EntityManager em;


    public Point savePointFromForm(String login, float x, float y, float r) {
        System.out.println("PointService.savePointFromForm");
        System.out.println("Login: " + login + ", X: " + x + ", Y: " + y + ", R: " + r);


        if (!areaChecker.isValidInputForForm(x, y, r)) {
            throw new RuntimeException("Некорректные входные данные для формы");
        }

        return savePointInternal(login, x, y, r);
    }


    public Point savePointFromGraph(String login, float x, float y, float r) {
        System.out.println("PointService.savePointFromGraph");
        System.out.println("Login: " + login + ", X: " + x + ", Y: " + y + ", R: " + r);


        if (!areaChecker.isValidInputForGraph(x, y, r)) {
            throw new RuntimeException("Некорректное значение R");
        }

        return savePointInternal(login, x, y, r);
    }


    private Point savePointInternal(String login, float x, float y, float r) {
        try {

            TypedQuery<User> userQuery = em.createQuery(
                    "SELECT u FROM User u WHERE u.login = :login", User.class);
            userQuery.setParameter("login", login);
            User user = userQuery.getSingleResult();

            if (user == null) {
                System.err.println("ERROR: User not found: " + login);
                throw new RuntimeException("User not found: " + login);
            }

            System.out.println("User found: " + user.getLogin() + ", ID: " + user.getId());


            boolean hit = areaChecker.checkHit(x, y, r);
            System.out.println("Hit result: " + hit);


            Point point = new Point(x, y, r, hit, user);
            System.out.println("Point created: " + point);


            em.persist(point);
            em.flush();
            System.out.println("Point persisted with ID: " + point.getId());

            return point;

        } catch (jakarta.persistence.NoResultException e) {
            System.err.println("ERROR: User not found in database: " + login);
            throw new RuntimeException("User not found: " + login);
        } catch (Exception e) {
            System.err.println("ERROR in savePoint: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }



    public List<Point> getPointsByUser(String login) {
        System.out.println("Getting points for user: " + login);

        try {
            TypedQuery<Point> query = em.createQuery(
                    "SELECT p FROM Point p WHERE p.user.login = :login ORDER BY p.createdAt DESC",
                    Point.class
            );
            query.setParameter("login", login);
            List<Point> points = query.getResultList();
            System.out.println("Found " + points.size() + " points");
            return points;
        } catch (Exception e) {
            System.err.println("ERROR in getPointsByUser: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }


    public boolean validateInputForForm(float x, float y, float r) {
        return areaChecker.isValidInputForForm(x, y, r);
    }


    public boolean validateInputForGraph(float x, float y, float r) {
        return areaChecker.isValidInputForGraph(x, y, r);
    }
}