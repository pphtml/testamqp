package org.superbiz.game.model;

import java.util.List;

public class MoveSnakeResult {
    private List<Part> path;
    private float x;
    private float y;

    public List<Part> getPath() {
        return path;
    }

    public void setPath(List<Part> path) {
        this.path = path;
    }

    public float getX() {
        return x;
    }

    public void setX(float x) {
        this.x = x;
    }

    public float getY() {
        return y;
    }

    public void setY(float y) {
        this.y = y;
    }

    @Override
    public String toString() {
        final StringBuilder sb = new StringBuilder("MoveSnakeResult{");
        sb.append("path=").append(path);
        sb.append(", x=").append(x);
        sb.append(", y=").append(y);
        sb.append('}');
        return sb.toString();
    }
}
