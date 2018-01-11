package org.superbiz.game.model;

import org.superbiz.game.proto.Msg;

import java.util.List;
import java.util.stream.Collectors;

public class VehicleData {
//    message VehicleData {
//        uint64 lastProcessedOnServer = 1;
//        repeated VehiclePart vehicleParts = 2;
//        float orientationRequested = 3;
//        float orientation = 4;
//        float speedMultiplier = 5;
//    }
//
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

    private long lastProcessedOnServer;
    private List<VehiclePart> vehicleParts;
    private float orientationRequested;
    private float orientation;
    private float speedMultiplier;
    private ModelType modelType;

    public long getLastProcessedOnServer() {
        return lastProcessedOnServer;
    }

    public VehicleData setLastProcessedOnServer(long lastProcessedOnServer) {
        this.lastProcessedOnServer = lastProcessedOnServer;
        return this;
    }

    public List<VehiclePart> getVehicleParts() {
        return vehicleParts;
    }

    public VehicleData setVehicleParts(List<VehiclePart> vehicleParts) {
        this.vehicleParts = vehicleParts;
        return this;
    }

    public float getOrientationRequested() {
        return orientationRequested;
    }

    public VehicleData setOrientationRequested(float orientationRequested) {
        this.orientationRequested = orientationRequested;
        return this;
    }

    public float getOrientation() {
        return orientation;
    }

    public VehicleData setOrientation(float orientation) {
        this.orientation = orientation;
        return this;
    }

    public float getSpeedMultiplier() {
        return speedMultiplier;
    }

    public VehicleData setSpeedMultiplier(float speedMultiplier) {
        this.speedMultiplier = speedMultiplier;
        return this;
    }

    public ModelType getModelType() {
        return modelType;
    }

    public VehicleData setModelType(ModelType modelType) {
        this.modelType = modelType;
        return this;
    }

    public Msg.VehicleData asProtobufFull() {
//    message VehicleData {
//        uint64 lastProcessedOnServer = 1;
//        repeated VehiclePart vehicleParts = 2;
//        float orientationRequested = 3;
//        float orientation = 4;
//        float speedMultiplier = 5;
        return Msg.VehicleData.newBuilder()
                .setLastProcessedOnServer(this.lastProcessedOnServer)
                .setOrientationRequested(this.orientationRequested)
                .setOrientation(this.orientation)
                .setSpeedMultiplier(this.speedMultiplier)
                .addAllVehicleParts(this.getAllVehiclePartsAsProtobufsFull())
                .build();
    }

    @Override
    public String toString() {
        final StringBuilder sb = new StringBuilder("VehicleData{");
        sb.append("lastProcessedOnServer=").append(lastProcessedOnServer);
        sb.append(", vehicleParts=").append(vehicleParts);
        sb.append(", orientationRequested=").append(orientationRequested);
        sb.append(", orientation=").append(orientation);
        sb.append(", speedMultiplier=").append(speedMultiplier);
        sb.append('}');
        return sb.toString();
    }

    public Iterable<? extends Msg.VehiclePart> getAllVehiclePartsAsProtobufsFull() {
        return this.vehicleParts.stream().map(vp -> vp.asProtobufFull().build()).collect(Collectors.toList());
    }

    public Iterable<? extends Msg.VehiclePart> getAllVehiclePartsAsProtobufs() {
        return this.vehicleParts.stream().map(vp -> vp.asProtobuf().build()).collect(Collectors.toList());
    }

    public Msg.VehicleData asProtobuf() {
        return Msg.VehicleData.newBuilder()
                .setLastProcessedOnServer(this.lastProcessedOnServer)
                .setOrientationRequested(this.orientationRequested)
                .setOrientation(this.orientation)
                .setSpeedMultiplier(this.speedMultiplier)
                .addAllVehicleParts(this.getAllVehiclePartsAsProtobufs())
                .build();
    }

//
//    public Iterable<? extends Msg.VehiclePart> getAllVehiclePartsAsProtobufs() {
//        return this.vehicleParts.stream().map(vp -> vp.asProtobuf()).collect(Collectors.toList());
//    }
}
