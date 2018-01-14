package org.superbiz.game;

public class WorldGeometry {
    private final int sectorWidth = 2048;
    private final int sectorHeight = 2048;
    private final int worldWidth = sectorWidth * 18;
    private final int worldHeight = sectorHeight * 9;

    private final float baseSpeed = 10.0f;

    public int getSectorWidth() {
        return sectorWidth;
    }

    public int getSectorHeight() {
        return sectorHeight;
    }

    public int getWorldWidth() {
        return worldWidth;
    }

    public int getWorldHeight() {
        return worldHeight;
    }

    public float getBaseSpeed() {
        return baseSpeed;
    }
}
