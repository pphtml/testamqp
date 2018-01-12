package org.superbiz.game.computation;

import org.junit.Test;
import org.superbiz.game.BaseTest;
import org.superbiz.game.model.MoveVehicleResult;
import org.superbiz.game.model.VehicleData;
import org.superbiz.game.model.VehiclePart;

import java.util.Arrays;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

public class MovementJavascriptTest extends BaseTest {
    private Movement movement = new MovementJavascript();

    @Test
    public void move() {
//                    const frontPart = {
//                axisHalfLength: 100,
//                orientation: 0.0,
//                frontAxis: 0.8,
//                rearAxis: -0.6,
//                x: 0.0,
//                y: 0.0
//            };

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

        //VehiclePart.create(20.0f, 10.0f, 0.0f, 100, 0.8f, 0.6f)
        VehiclePart vehiclePart = new VehiclePart()
                .setX(20.0f)
                .setY(10.0f)
                .setOrientation(0.0f)
                .setAxisHalfLength(100)
                .setFrontAxis(0.8f)
                .setRearAxis(0.6f);
        final VehicleData vehicleData = new VehicleData();
        vehicleData.setOrientation(0.0f);
        vehicleData.setSpeedMultiplier(1.0f);
        vehicleData.setVehicleParts(Arrays.asList(vehiclePart));

        float distance = 10.0f;
        MoveVehicleResult result = movement.moveVehicle(vehicleData.getOrientation(), distance, vehicleData.getVehicleParts());
        assertNotNull(result);
        System.out.println(result);
        assertEquals(1, result.getParts().size());
        final VehiclePart frontPart = result.getParts().iterator().next();
        assertEquals(30.0f, frontPart.getX(), ACCEPTABLE_DELTA_FLOATS);
        assertEquals(10.0f, frontPart.getY(), ACCEPTABLE_DELTA_FLOATS);
        assertEquals(0.0f, frontPart.getOrientation(), ACCEPTABLE_DELTA_FLOATS);
    }

    @Test
    public void computeAllowedAngle() {
        Float allowedAngle = movement.computeAllowedAngle(1.23f, 1.2f, 20, 1.0f);
        assertNotNull(allowedAngle);
        assertEquals(1.21496, allowedAngle.floatValue(), ACCEPTABLE_DELTA_FLOATS);
    }
}
