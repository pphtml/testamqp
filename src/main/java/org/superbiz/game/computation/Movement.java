package org.superbiz.game.computation;

import org.superbiz.game.model.MoveVehicleResult;
import org.superbiz.game.model.VehicleData;

public interface Movement {
    float computeAllowedAngle(float orientationRequested, float orientationLast, long time, float speedMultiplier);

    MoveVehicleResult moveVehicle(VehicleData vehicleData);
}
