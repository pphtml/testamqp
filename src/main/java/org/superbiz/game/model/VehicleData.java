package org.superbiz.game.model;

import java.util.List;

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


}
