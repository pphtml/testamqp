package org.superbiz.game.model;

public class Part {
//            const frontPart = {
//        axisHalfLength: 100,
//                orientation: 0.0,
//                frontAxis: 0.8,
//                rearAxis: -0.6,
//                x: 0.0,
//                y: 0.0
//    };


    private float x;
    private float y;
    private float orientation;
    private int axisHalfLength;
    private float frontAxis;
    private float rearAxis;

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

    public float getOrientation() {
        return orientation;
    }

    public void setOrientation(float orientation) {
        this.orientation = orientation;
    }

    public int getAxisHalfLength() {
        return axisHalfLength;
    }

    public void setAxisHalfLength(int axisHalfLength) {
        this.axisHalfLength = axisHalfLength;
    }

    public float getFrontAxis() {
        return frontAxis;
    }

    public void setFrontAxis(float frontAxis) {
        this.frontAxis = frontAxis;
    }

    public float getRearAxis() {
        return rearAxis;
    }

    public void setRearAxis(float rearAxis) {
        this.rearAxis = rearAxis;
    }

    @Override
    public String toString() {
        final StringBuilder sb = new StringBuilder("Part{");
        sb.append("x=").append(x);
        sb.append(", y=").append(y);
        sb.append(", orientation=").append(orientation);
        sb.append(", axisHalfLength=").append(axisHalfLength);
        sb.append(", frontAxis=").append(frontAxis);
        sb.append(", rearAxis=").append(rearAxis);
        sb.append('}');
        return sb.toString();
    }

    public static Part create(float x, float y, float orientation, int axisHalfLength, float frontAxis, float rearAxis) {
        Part part = new Part();
        part.x = x;
        part.y = y;
        part.orientation = orientation;
        part.axisHalfLength = axisHalfLength;
        part.frontAxis = frontAxis;
        part.rearAxis = rearAxis;
        return part;
    }
}
