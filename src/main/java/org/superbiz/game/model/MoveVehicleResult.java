package org.superbiz.game.model;

import java.util.Collection;

public class MoveVehicleResult {
    Collection<VehiclePart> parts;

    public Collection<VehiclePart> getParts() {
        return parts;
    }

    public void setParts(Collection<VehiclePart> parts) {
        this.parts = parts;
    }

    @Override
    public String toString() {
        final StringBuilder sb = new StringBuilder("MoveVehicleResult{");
        sb.append("parts=").append(parts);
        sb.append('}');
        return sb.toString();
    }
}
