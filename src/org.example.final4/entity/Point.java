package org.example.final4.entity;

import jakarta.persistence.*;
import jakarta.json.bind.annotation.JsonbTransient;
import java.time.LocalDateTime;

@Entity
@Table(name = "points")
@NamedQueries({
        @NamedQuery(name = "Point.findByUserLogin",
                query = "SELECT p FROM Point p WHERE p.user.login = :login ORDER BY p.createdAt DESC")
})
public class Point {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private float x;

    @Column(nullable = false)
    private float y;

    @Column(nullable = false)
    private float r;

    @Column(nullable = false)
    private boolean hit;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @JsonbTransient
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, referencedColumnName = "id")
    private User user;

    public Point() {
        this.createdAt = LocalDateTime.now();
    }

    public Point(float x, float y, float r, boolean hit, User user) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.hit = hit;
        this.user = user;
        this.createdAt = LocalDateTime.now();
    }


    public Long getId() { return id; }
    public float getX() { return x; }
    public float getY() { return y; }
    public float getR() { return r; }
    public boolean isHit() { return hit; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public User getUser() { return user; }


    public void setX(float x) { this.x = x; }
    public void setY(float y) { this.y = y; }
    public void setR(float r) { this.r = r; }
    public void setHit(boolean hit) { this.hit = hit; }
    public void setUser(User user) { this.user = user; }


    public java.util.Map<String, Object> toMap() {
        java.util.Map<String, Object> map = new java.util.HashMap<>();
        map.put("id", this.id);
        map.put("x", this.x);
        map.put("y", this.y);
        map.put("r", this.r);
        map.put("hit", this.hit);
        map.put("createdAt", this.createdAt.toString());
        return map;
    }

    @Override
    public String toString() {
        return "Point{x=" + x + ", y=" + y + ", r=" + r + ", hit=" + hit +
                ", user=" + (user != null ? user.getLogin() : "null") + "}";
    }
}