package org.example.final4.ejb;


import org.example.final4.entity.User;
import jakarta.ejb.Stateless;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.example.final4.service.LoggerService;


@Stateless
public class DataBaseService {

    @Inject
    private LoggerService loggerService;

    @PersistenceContext(unitName = "dbPu")
    private EntityManager entityManager;


    public void saveUser(User user) {
        if (user != null) {
            loggerService.info("Saving user: " + user.getLogin());
            entityManager.persist(user);
        }
    }

    public User findUserByLogin(String login) {
        try {
            TypedQuery<User> query = entityManager.createQuery(
                    "SELECT u FROM User u WHERE u.login = :login", User.class);
            query.setParameter("login", login);
            return query.getSingleResult();
        } catch (Exception e) {
            loggerService.info("User not found: " + login);
            return null;
        }
    }

}