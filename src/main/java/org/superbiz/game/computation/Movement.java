package org.superbiz.game.computation;

import org.superbiz.game.model.MoveVehicleResult;
import org.superbiz.game.model.VehicleData;
import org.superbiz.game.model.VehiclePart;

import java.util.Collection;

public interface Movement {
    float computeAllowedAngle(float orientationRequested, float orientationLast, long time, float speedMultiplier);

    MoveVehicleResult moveVehicle(float orientation, float distance, Collection<VehiclePart> parts);
}
