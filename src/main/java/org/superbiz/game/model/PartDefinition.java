package org.superbiz.game.model;

import static org.superbiz.util.TextUtil.slugify;

public enum PartDefinition {
    SMALL_TRUCK_FRONT(263, 113);

    private final int width;
    private final int height;
    private int pivotX;
    private int pivotY;


    PartDefinition(int width, int height) {
        this.width = width;
        this.height = height;
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
}
