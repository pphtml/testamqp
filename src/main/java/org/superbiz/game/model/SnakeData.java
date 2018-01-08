package org.superbiz.game.model;

import org.superbiz.game.proto.Msg;

import java.util.Collection;
import java.util.stream.Collectors;

public class SnakeData {
//    string id = 1;
//    float x = 2;
//    float y = 3;
//    float rotation = 4;
//    float rotationAsked = 5;
//    uint32 length = 6;
//    repeated Part parts = 7;
//    float speed = 8;
//    string skin = 9;
//    uint64 lastProcessedOnServer = 10;


    private float x;
    private float y;
    private float speed;
    private float rotation;
    private float rotationAsked;
    private int length;
    private Collection<Part> path;
    //private float speedMultiplier;
    private String skin;
    private long lastProcessed;
    private Iterable<? extends Msg.Part> pathAsProtobuf;
    private boolean aiDriven = false;

    public float getX() {
        return x;
    }

    public SnakeData setX(float x) {
        this.x = x;
        return this;
    }

    public float getY() {
        return y;
    }

    public SnakeData setY(float y) {
        this.y = y;
        return this;
    }

    public float getSpeed() {
        return speed;
    }

    public SnakeData setSpeed(float speed) {
        this.speed = speed;
        return this;
    }

    public float getRotation() {
        return rotation;
    }

    public SnakeData setRotation(float rotation) {
        this.rotation = rotation;
        return this;
    }

    public float getRotationAsked() {
        return rotationAsked;
    }

    public SnakeData setRotationAsked(float rotationAsked) {
        this.rotationAsked = rotationAsked;
        return this;
    }

    public int getLength() {
        return length;
    }

    public SnakeData setLength(int length) {
        this.length = length;
        return this;
    }

    public Collection<Part> getPath() {
        return path;
    }

    public Collection<Msg.Part> getPathAsProtobuf() {
        return this.path.stream()
                .map(part -> Msg.Part.newBuilder()
                        .setX(part.getX())
                        .setY(part.getY())
                        .setRotation(part.getR()).build())
                .collect(Collectors.toList());
    }

    public SnakeData setPath(Collection<Part> path) {
        this.path = path;
        return this;
    }

    public String getSkin() {
        return skin;
    }

    public SnakeData setSkin(String skin) {
        this.skin = skin;
        return this;
    }

    public long getLastProcessed() {
        return lastProcessed;
    }

    public SnakeData setLastProcessed(long lastProcessed) {
        this.lastProcessed = lastProcessed;
        return this;
    }

    public boolean isAiDriven() {
        return aiDriven;
    }

    public void setAiDriven(boolean aiDriven) {
        this.aiDriven = aiDriven;
    }
}
