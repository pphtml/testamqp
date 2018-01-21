package org.superbiz.game.model;

import static org.superbiz.util.TextUtil.slugify;

public enum ModelType {
    TRUCK(PartDefinition.TRUCK_FRONT);
    //TRUCK_SMALL(PartDefinition.SMALL_TRUCK_FRONT);

    private String code;
    private PartDefinition frontPartDefinition;

    ModelType(PartDefinition ...partDefinitions) {
        code = slugify(name());
        frontPartDefinition = partDefinitions[0];
    }

    public String getCode() {
        return code;
    }

    public PartDefinition getFrontPartDefinition() {
        return frontPartDefinition;
    }
}
