package org.superbiz.game;

import java.util.Collection;

public class World {

    private final WorldGeometry worldGeometry;
    private final Collection<Dot> dots;

    public World(WorldGeometry worldGeometry, Collection<Dot> dots) {
        this.worldGeometry = worldGeometry;
        this.dots = dots;
    }

    public WorldGeometry getWorldGeometry() {
        return worldGeometry;
    }

    public Collection<Dot> getDots() {
        return dots;
    }
}
