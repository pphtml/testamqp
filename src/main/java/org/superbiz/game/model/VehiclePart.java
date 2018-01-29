package org.superbiz.game.model;

import org.superbiz.game.proto.Msg;

public class VehiclePart {
//    message VehiclePart {
//        float x = 1;
//        float y = 2;
//        float rotation = 3;
//        PartType partType = 4;
//
//        // following needed only once
//        string partId = 11;
//        int32 pivotX = 12;
//        int32 pivotY = 13;
//
//        enum PartType {
//            HEAD = 0;
//            TRAILER = 1;
//            FRONT_WHEEL = 2;
//        }
//    }

    private float x;
    private float y;
    private float orientation;
    private int axisHalfLength;
    private String sprite;
    private float scale;
    private float frontAxis;
    private float rearAxis;
    private float wheelDeflection;
    private String design;

    private Msg.VehiclePart.PartType partType;

    private String partId;
//    private int pivotX;
//    private int pivotY;

    public float getX() {
        return x;
    }

    public VehiclePart setX(float x) {
        this.x = x;
        return this;
    }

    public float getY() {
        return y;
    }

    public VehiclePart setY(float y) {
        this.y = y;
        return this;
    }

    public Msg.VehiclePart.PartType getPartType() {
        return partType;
    }

    public VehiclePart setPartType(Msg.VehiclePart.PartType partType) {
        this.partType = partType;
        return this;
    }

    public String getPartId() {
        return partId;
    }

    public VehiclePart setPartId(String partId) {
        this.partId = partId;
        return this;
    }

//    public int getPivotX() {
//        return pivotX;
//    }
//
//    public VehiclePart setPivotX(int pivotX) {
//        this.pivotX = pivotX;
//    }
//
//    public int getPivotY() {
//        return pivotY;
//    }
//
//    public VehiclePart setPivotY(int pivotY) {
//        this.pivotY = pivotY;
//    }

    public float getOrientation() {
        return orientation;
    }

    public VehiclePart setOrientation(float orientation) {
        this.orientation = orientation;
        return this;
    }

    public int getAxisHalfLength() {
        return axisHalfLength;
    }

    public VehiclePart setAxisHalfLength(int axisHalfLength) {
        this.axisHalfLength = axisHalfLength;
        return this;
    }

    public float getFrontAxis() {
        return frontAxis;
    }

    public VehiclePart setFrontAxis(float frontAxis) {
        this.frontAxis = frontAxis;
        return this;
    }

    public float getRearAxis() {
        return rearAxis;
    }

    public VehiclePart setRearAxis(float rearAxis) {
        this.rearAxis = rearAxis;
        return this;
    }

    public float getWheelDeflection() {
        return wheelDeflection;
    }

    public VehiclePart setWheelDeflection(float wheelDeflection) {
        this.wheelDeflection = wheelDeflection;
        return this;
    }

    public String getSprite() {
        return sprite;
    }

    public VehiclePart setSprite(String sprite) {
        this.sprite = sprite;
        return this;
    }

    public float getScale() {
        return scale;
    }

    public VehiclePart setScale(float scale) {
        this.scale = scale;
        return this;
    }

    public String getDesign() {
        return design;
    }

    public VehiclePart setDesign(String design) {
        this.design = design;
        return this;
    }

    public Msg.VehiclePart.Builder asProtobufFull() {
        Msg.VehiclePart.Builder result = this.asProtobuf()
                .setPartId(this.getPartId())
                .setAxisHalfLength(this.axisHalfLength)
                .setFrontAxis(this.frontAxis)
                .setRearAxis(this.rearAxis)
                .setSprite(this.sprite)
                .setScale(this.scale)
                .setWheelDeflection(this.wheelDeflection);
        if (this.design != null) {
            result.setDesign(this.design);
        }
        return result;
//                .setPivotX(this.getPivotX())
//                .setPivotY(this.getPivotY());
    }

    public Msg.VehiclePart.Builder asProtobuf() {
//        float x = 1;
//        float y = 2;
//        float rotation = 3;
//        PartType partType = 4;
//
//        // following needed only once
//        string partId = 11;
//        int32 pivotX = 12;
//        int32 pivotY = 13;
        return Msg.VehiclePart.newBuilder()
                .setX(this.x)
                .setY(this.y)
                .setOrientation(this.orientation)
                .setPartType(this.getPartType());

    }

    @Override
    public String toString() {
        final StringBuilder sb = new StringBuilder("VehiclePart{");
        sb.append("x=").append(x);
        sb.append(", y=").append(y);
        sb.append(", orientation=").append(orientation);
        sb.append(", axisHalfLength=").append(axisHalfLength);
        sb.append(", frontAxis=").append(frontAxis);
        sb.append(", rearAxis=").append(rearAxis);
        sb.append(", partType=").append(partType);
        sb.append(", partId='").append(partId).append('\'');
        sb.append('}');
        return sb.toString();
    }
}
