package org.superbiz.game.model;

public class Part {
    private float x;
    private float y;
    private float r;

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

    public float getR() {
        return r;
    }

    public void setR(float r) {
        this.r = r;
    }

    public static Part create(float x, float y, float r) {
        Part part = new Part();
        part.x = x;
        part.y = y;
        part.r = r;
        return part;
    }

    @Override
    public String toString() {
        final StringBuilder sb = new StringBuilder("Part{");
        sb.append("x=").append(x);
        sb.append(", y=").append(y);
        sb.append(", r=").append(r);
        sb.append('}');
        return sb.toString();
    }
}
