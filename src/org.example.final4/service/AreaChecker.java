package org.example.final4.service;

import jakarta.ejb.Stateless;

@Stateless
public class AreaChecker {


    public boolean isValidInputForForm(float x, float y, float r) {

        boolean validX = x >= -5 && x <= 3 && x == Math.floor(x);

        boolean validY = y > -3 && y < 5;

        boolean validR = r >= 1 && r <= 3 && r == Math.floor(r);

        return validX && validY && validR;
    }


    public boolean isValidInputForGraph(float x, float y, float r) {
        boolean validR = r >= 1 && r <= 3 && r == Math.floor(r);
        return validR;
    }


    public boolean checkHit(float x, float y, float r) {
        boolean inRectangle = (x >= 0 && x <= r && y >= 0 && y <= r / 2.0f);

        boolean inTriangle = (x <= 0 && y >= 0 && (-x + y) <= r);

        boolean inCircle = (x <= 0 && y <= 0 && (x * x + y * y) <= (r / 2.0f) * (r / 2.0f));

        return inRectangle || inTriangle || inCircle;
    }
}