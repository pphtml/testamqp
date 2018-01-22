package org.superbiz.game.model;

import static org.superbiz.util.TextUtil.slugify;

public enum ModelType {
    TRUCK(PartDefinition.TRUCK_FRONT, PartDefinition.TRAILER_LONG);
    //TRUCK_SMALL(PartDefinition.SMALL_TRUCK_FRONT);

    private final PartDefinition[] partDefinitions;
    private String code;
    //private PartDefinition frontPartDefinition;

    ModelType(PartDefinition ...partDefinitions) {
        code = slugify(name());
        //frontPartDefinition = partDefinitions[0];
        this.partDefinitions = partDefinitions;
    }

    public String getCode() {
        return code;
    }

//    public PartDefinition getFrontPartDefinition() {
//        return partDefinitions[0];
//    }

    public PartDefinition[] getPartDefinitions() {
        return partDefinitions;
    }
}
