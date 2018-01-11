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
    private Msg.VehiclePart.PartType partType;

    private String partId;
    private int pivotX;
    private int pivotY;

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

    public Msg.VehiclePart.PartType getPartType() {
        return partType;
    }

    public void setPartType(Msg.VehiclePart.PartType partType) {
        this.partType = partType;
    }

    public String getPartId() {
        return partId;
    }

    public void setPartId(String partId) {
        this.partId = partId;
    }

    public int getPivotX() {
        return pivotX;
    }

    public void setPivotX(int pivotX) {
        this.pivotX = pivotX;
    }

    public int getPivotY() {
        return pivotY;
    }

    public void setPivotY(int pivotY) {
        this.pivotY = pivotY;
    }

    public float getOrientation() {
        return orientation;
    }

    public void setOrientation(float orientation) {
        this.orientation = orientation;
    }

    public Msg.VehiclePart.Builder asProtobufFull() {
        return this.asProtobuf()
                .setPartId(this.getPartId())
                .setPivotX(this.getPivotX())
                .setPivotY(this.getPivotY());
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
}
