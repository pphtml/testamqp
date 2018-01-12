package org.superbiz.game.model;

import static org.superbiz.util.TextUtil.slugify;

public enum PartDefinition {
    SMALL_TRUCK_FRONT(264, 113, 0.8f, 0.6f);

    private final int width;
    private final int height;
    private int pivotX;
    private int pivotY;
    private final float frontAxis;
    private final float rearAxis;


    PartDefinition(int width, int height, float frontAxis, float rearAxis) {
        this.width = width;
        this.height = height;
        this.frontAxis = frontAxis;
        this.rearAxis = rearAxis;
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
}
