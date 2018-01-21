package org.superbiz.game;

import org.superbiz.game.model.ModelType;
import org.superbiz.game.model.PartDefinition;
import org.superbiz.game.model.VehicleData;
import org.superbiz.game.model.VehiclePart;
import org.superbiz.game.proto.Msg;

import java.util.Arrays;

public class VehicleFactory {
    private final ModelType modelType;
    private final String design;
    private final float x;
    private final float y;
    private final float orientation;

    public VehicleFactory(String type, String design, float x, float y, float orientation) {
        //this.type = type;
        this.design = design;
        this.x = x;
        this.y = y;
        this.orientation = orientation;

        this.modelType = matchModelType(type);
    }

    private ModelType matchModelType(String type) {
        for (ModelType modelType : ModelType.values()) {
            if (modelType.getCode().equals(type)) {
                return modelType;
            }
        }
        throw new IllegalArgumentException(String.format("Model Type %s does not exist", type));
    }

    public VehicleData createVehicle() {
// message VehicleData {
//    uint64 lastProcessedOnServer = 1;
//    repeated VehiclePart vehicleParts = 2;
//    float orientationRequested = 3;
//    float orientation = 4;
//    float speedMultiplier = 5;
//}
//
        final VehicleData vehicleData = new VehicleData();
        vehicleData.setLastProcessedOnServer(System.currentTimeMillis());
        vehicleData.setOrientation(this.orientation);
        vehicleData.setOrientationRequested(this.orientation);
        vehicleData.setSpeedMultiplier(0.0f);
        vehicleData.setModelType(this.modelType);

        VehiclePart frontVehiclePart = makeFrontVehiclePart();
        vehicleData.setVehicleParts(Arrays.asList(frontVehiclePart));
        return vehicleData;
    }

    private VehiclePart makeFrontVehiclePart() {
//message VehiclePart {
//    float x = 1;
//    float y = 2;
//    float rotation = 3;
//    PartType partType = 4;
//
//    // following needed only once
//    string partId = 11;
//    int32 pivotX = 12;
//    int32 pivotY = 13;
//
//    enum PartType {
//        HEAD = 0;
//        TRAILER = 1;
//        FRONT_WHEEL = 2;
//    }
//}
        final VehiclePart vehiclePart = new VehiclePart();
        vehiclePart.setX(x);
        vehiclePart.setY(y);
        vehiclePart.setOrientation(orientation);
        vehiclePart.setPartType(Msg.VehiclePart.PartType.FRONT);

        PartDefinition partDefinition = modelType.getFrontPartDefinition();
//    string partId = 11;
//    int32 pivotX = 12;
//    int32 pivotY = 13;
        vehiclePart.setPartId(partDefinition.getCode())
            .setAxisHalfLength(partDefinition.getAxisHalfLength())
            .setSprite(partDefinition.getSprite())
            .setScale(partDefinition.getScale())
            .setFrontAxis(partDefinition.getFrontAxis())
            .setRearAxis(partDefinition.getRearAxis())
            .setWheelDeflection(partDefinition.getWheelDeflection());


//        vehiclePart.setPivotX(partDefinition.getPivotX());
//        vehiclePart.setPivotY(partDefinition.getPivotY());

        return vehiclePart;
    }
}
