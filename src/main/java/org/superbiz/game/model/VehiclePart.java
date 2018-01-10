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
    private float rotation;
    private Msg.VehiclePart.PartType partType;

    private String partId;
    private int pivotX;
    private int pivotY;
}
