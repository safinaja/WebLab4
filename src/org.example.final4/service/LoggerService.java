package org.example.final4.service;

import jakarta.enterprise.context.ApplicationScoped;
import java.util.logging.Logger;

@ApplicationScoped
public class LoggerService {

    private final Logger logger = Logger.getLogger(LoggerService.class.getName());

    public void info(String message) {
        logger.info(message);
    }
    public void error(String message) {
        logger.severe(message);
    }
}