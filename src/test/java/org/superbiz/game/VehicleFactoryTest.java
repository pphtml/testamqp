package org.superbiz.game;

import org.junit.Test;
import org.superbiz.game.model.ModelType;
import org.superbiz.game.model.VehicleData;
import org.superbiz.game.model.VehiclePart;

import static org.junit.Assert.*;

public class VehicleFactoryTest {
    private VehicleFactory vehicleFactory = new VehicleFactory("truck-small", "123456", 0.0f, 100.0f, 0.0f);

    @Test
    public void createVehicle() {
        assertNotNull(vehicleFactory);

        final VehicleData vehicle = vehicleFactory.createVehicle();
        assertNotNull(vehicle);
        assertEquals(ModelType.TRUCK_SMALL, vehicle.getModelType());

        final VehiclePart frontPart = vehicle.getVehicleParts().iterator().next();
        assertNotNull(frontPart);
//        assertEquals(131, frontPart.getPivotX());
//        assertEquals(56, frontPart.getPivotY());

    }
}