package org.superbiz.game;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.github.davidmoten.rtree.geometry.Point;
import org.superbiz.game.proto.Msg;

import static com.github.davidmoten.rtree.geometry.Geometries.point;

public class Dot {
    private int x;
    private int y;
    private int c;
    private int l;

    private Dot(int x, int y, int c, int l) {
        this.x = x;
        this.y = y;
        this.c = c;
        this.l = l;
    }

    public Dot() {
    }

    @Override
    public String toString() {
        final StringBuilder sb = new StringBuilder("Dot{");
        sb.append("x=").append(x);
        sb.append(", y=").append(y);
        sb.append(", c=").append(c);
        sb.append(", l=").append(l);
        sb.append('}');
        return sb.toString();
    }

    public int getX() {
        return x;
    }

    public int getY() {
        return y;
    }

    public int getC() {
        return c;
    }

    public int getL() {
        return l;
    }

    public static Dot create(int x, int y, int c, int l) {
        return new Dot(x, y, c, l);
    }

    @JsonIgnore
    public String getKey() {
        return String.format("%d_%d", x, y);
    }

    @JsonIgnore
    public Point getPoint() {
        return point(x, y);
    }

    public Msg.Dot getProtoDot() {
        return Msg.Dot.newBuilder()
                .setX(x)
                .setY(y)
                .setColor(c)
                .setSize(l)
                .build();
    }
}
