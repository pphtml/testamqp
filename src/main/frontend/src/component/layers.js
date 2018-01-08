import { DisplayGroup } from 'pixi.js'

export default {
    infoLayer: new DisplayGroup(40, false),
    headLayer: new DisplayGroup(30, false),
    tailLayer: new DisplayGroup(20, true),
    npcLayer: new DisplayGroup(10, false),
    borderLayer: new DisplayGroup(5, false),
    backgroundLayer: new DisplayGroup(0, false)

}
