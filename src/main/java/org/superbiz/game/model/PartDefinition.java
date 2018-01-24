package org.superbiz.game.model;

import static org.superbiz.util.TextUtil.slugify;

public enum PartDefinition {
    TRUCK_FRONT("truck", 1.2f, 216, 89, 0.66f, -0.44f, (float)(Math.PI / 4)),
    TRAILER_LONG("trailer-long", 1.3f, 382, 90, 0.9f, -0.5f, 0f);
    //SMALL_TRUCK_FRONT(264, 113, 0.66f, -0.5f, (float)(Math.PI / 4));

    private final int width;
    private final int height;
    private final String sprite;
    private final float scale;
    private int pivotX;
    private int pivotY;
    private final float frontAxis;
    private final float rearAxis;
    private final float wheelDeflection;


    PartDefinition(String sprite, float scale, int width, int height, float frontAxis, float rearAxis, float wheelDeflection) {
        this.sprite = sprite;
        this.scale = scale;
        this.width = width;
        this.height = height;
        this.frontAxis = frontAxis;
        this.rearAxis = rearAxis;
        this.wheelDeflection = wheelDeflection;
        computePivots();
    }

    private void computePivots() {
        this.pivotX = this.width / 2;
        this.pivotY = this.height / 2;
    }

    public String getCode() {
        return slugify(name());
    }

    public int getPivotX() {
        return pivotX;
    }

    public int getPivotY() {
        return pivotY;
    }

    public int getAxisHalfLength() {
        return this.width / 2;
    }

    public float getFrontAxis() {
        return frontAxis;
    }

    public float getRearAxis() {
        return rearAxis;
    }

    public float getWheelDeflection() {
        return wheelDeflection;
    }

    public String getSprite() {
        return sprite;
    }

    public float getScale() {
        return scale;
    }
}
