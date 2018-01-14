import { Sprite, Container, Graphics, loader, filters, BLEND_MODES } from 'pixi.js'
import layers from './layers'
const rgbDimmer = require('../computation/rgbColor').rgbDimmer;
let resources = loader.resources;

// const COLORS = [
//     0xff0000,
//     0xffff00,
//     0xff00ff,
//     0x00ff00,
//     0x00ffff,
//     0x0000ff,
//     0x80ffff,
//     0xff80ff,
//     0xffff80,
//     0xffffff,
//     //0xffcad4
//     0xFF8C00 // orange
// ];
//
// const FLASHING_SPEED = 0.0117647;

const ROAD_WIDTH = 160;
const ROAD_LINE_WIDTH = 12;

class NPCS {
    constructor(gameContext) {
        this.gameContext = gameContext;
        this.container = new Container();

        this.gameContext.communication.subject.subscribe(msg => {
            if (msg.hasPlayerstartresponse()) {
                this.handlePlayerStartResponse(msg.getPlayerstartresponse());
            }
        });
    }

    // eatPositions(positions) {
    //     const removals = new Set();
    //     positions.forEach(position => {
    //         const key = `${position.getX()},${position.getY()}`;
    //         removals.add(key);
    //     });
    //
    //     for (let i = this.container.children.length - 1; i >= 0; i--) {
    //         const sprite = this.container.children[i];
    //         // let x = sprite.x, y = sprite.y;
    //         // let key = `${x},${y}`;
    //         if (removals.has(sprite._key)) {
    //             delete this.dots[sprite._key];
    //             this.container.removeChild(sprite);
    //         }
    //     }
    // }
    //
    // addPositions(positions) {
    //     positions.forEach(position => {
    //         let key = `${position.getX()},${position.getY()}`;
    //         if (!(key in this.dots)) {
    //             const color = this.translateColor(position.getColor());
    //
    //             const outer = new Sprite(resources['images/spritesheet.json'].textures['myfood-outer.png']);
    //             outer._key = key;
    //             outer._type = 'circle';
    //             outer.position.set(position.getX(), position.getY());
    //             outer.anchor.set(0.5, 0.5);
    //             outer.scale.set(1.5, 1.5);
    //             outer.tint = color;
    //             outer.alpha = 0.02;
    //             // dot.intensity = (Math.random() * 0.5) + 0.5;
    //             // dot.tintDir = [-FLASHING_SPEED, FLASHING_SPEED][Math.floor((Math.random() * 2))];
    //             outer.blendMode = BLEND_MODES.ADD;
    //             outer.displayGroup = layers.npcLayer;
    //             this.container.addChild(outer);
    //
    //             const dot = new Sprite(resources['images/spritesheet.json'].textures['myfood.png']);
    //             dot._key = key;
    //             dot._type = 'dot';
    //             dot.position.set(position.getX(), position.getY());
    //             dot.anchor.set(0.5, 0.5);
    //             dot.scale.set(0.15, 0.15);
    //             dot.baseColor = color;
    //             dot.intensity = (Math.random() * 0.5) + 0.5;
    //             dot.tintDir = [-FLASHING_SPEED, FLASHING_SPEED][Math.floor((Math.random() * 2))];
    //             dot.blendMode = BLEND_MODES.ADD;
    //             //dot.blendMode = BLEND_MODES.ADD_NPM;
    //             //dot.blendMode = BLEND_MODES.SCREEN_NPM;
    //             dot.displayGroup = layers.npcLayer;
    //             this.container.addChild(dot);
    //             this.dots[key] = dot;
    //         }
    //     });
    //
    //     const viewPortDots = new Set();
    //     positions.forEach(position => {
    //         const key = `${position.getX()},${position.getY()}`;
    //         viewPortDots.add(key);
    //     });
    //
    //     for (let i = this.container.children.length - 1; i >= 0; i--) {
    //         const sprite = this.container.children[i];
    //         // let x = sprite.x, y = sprite.y;
    //         // let key = `${x},${y}`;
    //         if (!viewPortDots.has(sprite._key)) {
    //             //console.info('')
    //             delete this.dots[sprite._key];
    //             this.container.removeChild(sprite);
    //         }
    //     }
    // }
    //
    // translateColor(color) {
    //     return COLORS[color];
    // }

    update() {
        let middleCoordinates = this.gameContext.middleCoordinates();
        this.container.position.set(middleCoordinates.x, middleCoordinates.y);
        //
        // for (let i = this.container.children.length - 1; i >= 0; i--) {
        //     const dot = this.container.children[i];
        //     if (dot.hasOwnProperty('intensity')) {
        //         dot.intensity += dot.tintDir;
        //         if (dot.intensity >= 1.0) {
        //             dot.tintDir = -FLASHING_SPEED;
        //         } else if (dot.intensity <= 0.5) {
        //             dot.tintDir = FLASHING_SPEED;
        //         }
        //         dot.tint = rgbDimmer(dot.baseColor, dot.intensity);
        //     }
        // }
    }

    handlePlayerStartResponse(playerStartResponse) {
        // TimeInfo timeInfo = 1;
        // int32 worldWidth = 2;
        // int32 worldHeight = 3;
        // int32 sectorWidth = 4;
        // int32 sectorHeight = 5;
        // map <string, SectorData> sectorMap = 6;
        // float birthLocationX = 7;
        // float birthLocationY = 8;
        // float birthOrientation = 9;
        // float baseSpeed = 10;
        // VehicleData vehicleData = 11;
        this.worldWidth = playerStartResponse.getWorldwidth();
        this.worldHeight = playerStartResponse.getWorldheight();
        this.worldOffsetX = this.worldWidth / 2;
        this.worldOffsetY = this.worldHeight / 2;
        this.sectorWidth = playerStartResponse.getSectorwidth();
        this.sectorHeight = playerStartResponse.getSectorheight();
        this.sectorWidthHalf = this.sectorWidth / 2;
        this.sectorHeightHalf = this.sectorHeight / 2;
        this.sectorMap = {};
        this.sectorHorizontalCount = this.worldWidth / this.sectorWidth;
        this.sectorVerticalCount = this.worldHeight / this.sectorHeight;
        for (let y = 0; y < this.sectorVerticalCount; y++) {
            for (let x = 0; x < this.sectorHorizontalCount; x++) {
                const key = `${x},${y}`;
                this.sectorMap[key] = playerStartResponse.getSectormapMap().get(key);
                this.drawSectorRoads({x, y});
            }
        }
        //this.sectorMap = playerStartResponse.getSectormapMap();
        //const sectorIndexes = this.translateToSector(playerStartResponse.getBirthlocationx(), playerStartResponse.getBirthlocationy());
        // this.drawSectorRoads(sectorIndexes);
        // this.drawSectorRoads({x: sectorIndexes.x - 1, y: sectorIndexes.y});
/*        this.drawSectorRoads({x: sectorIndexes.x - 2, y: sectorIndexes.y});
        this.drawSectorRoads({x: sectorIndexes.x - 3, y: sectorIndexes.y});
        this.drawSectorRoads({x: sectorIndexes.x - 1, y: sectorIndexes.y + 1});
        this.drawSectorRoads({x: sectorIndexes.x - 2, y: sectorIndexes.y + 1});
        this.drawSectorRoads({x: sectorIndexes.x - 3, y: sectorIndexes.y + 1});
        this.drawSectorRoads({x: sectorIndexes.x - 1, y: sectorIndexes.y + 2});
        this.drawSectorRoads({x: sectorIndexes.x - 2, y: sectorIndexes.y + 2});
        this.drawSectorRoads({x: sectorIndexes.x - 3, y: sectorIndexes.y + 2});*/
    }

    translateToSector(worldX, worldY) {
        const sectorX = Math.floor((worldX + this.worldOffsetX) / this.sectorWidth);
        const sectorY = Math.floor((worldY + this.worldOffsetY) / this.sectorHeight);
        return {x: sectorX, y: sectorY};
    }

    translateToWorld(sectorX, sectorY) {
        const worldX = sectorX * this.sectorWidth - this.worldOffsetX;
        const worldY = sectorY * this.sectorHeight - this.worldOffsetY;
        return {x: worldX, y: worldY};
    }

    sectorKey(coordinates) {
        return `${coordinates.x},${coordinates.y}`;
    }

    drawSectorRoads(sectorIndexes) {
        const sectorData = this.sectorMap[this.sectorKey(sectorIndexes)];

        const north = sectorData.getNorth();
        const east = sectorData.getEast();
        const south = sectorData.getSouth();
        const west = sectorData.getWest();

        const northWidth = this.sectorWidthHalf - ROAD_WIDTH * north;
        const southWidth = this.sectorWidthHalf - ROAD_WIDTH * south;
        const eastWidth = this.sectorHeightHalf - ROAD_WIDTH * east;
        const westWidth = this.sectorHeightHalf - ROAD_WIDTH * west;

        const topLeft = this.translateToWorld(sectorIndexes.x, sectorIndexes.y);

        const middleY = topLeft.y + this.sectorHeightHalf;
        const middleX = topLeft.x + this.sectorWidthHalf;

        const rectangle = new Graphics();
        rectangle.beginFill(0xffffff);

        if (west > 0) {
            //rectangle.drawRect(topLeft.x, topLeft.y + westWidth - ROAD_LINE_WIDTH, northWidth, ROAD_LINE_WIDTH);

            // const outer = new Sprite(resources['images/road-line.png'].texture);
            // //outer._key = key;
            // //outer._type = 'circle';
            // outer.position.set(topLeft.x, topLeft.y + this.sectorHeight - westWidth);
            // outer.anchor.set(0.0, 0.0);
            // //outer.scale.set(1.5, 1.5);
            // //outer.tint = color;
            // outer.alpha = 0.5;
            // // dot.intensity = (Math.random() * 0.5) + 0.5;
            // // dot.tintDir = [-FLASHING_SPEED, FLASHING_SPEED][Math.floor((Math.random() * 2))];
            // //outer.blendMode = BLEND_MODES.ADD;
            // outer.displayGroup = layers.npcLayer;
            // this.container.addChild(outer);

            //rectangle.drawRect(topLeft.x, topLeft.y + this.sectorHeight - westWidth, southWidth, ROAD_LINE_WIDTH);
        }
        // if (east > 0) {
        //     rectangle.drawRect(topLeft.x + this.sectorWidth - northWidth, topLeft.y + eastWidth - ROAD_LINE_WIDTH, northWidth, ROAD_LINE_WIDTH);
        //     rectangle.drawRect(topLeft.x + this.sectorWidth - southWidth, topLeft.y + this.sectorHeight - eastWidth, southWidth, ROAD_LINE_WIDTH);
        // }
        // if (north > 0) {
        //     rectangle.drawRect(topLeft.x + northWidth, topLeft.y, ROAD_LINE_WIDTH, westWidth); // nema by 2. northWidth?
        //     rectangle.drawRect(topLeft.x + this.sectorWidth - northWidth, topLeft.y, ROAD_LINE_WIDTH, eastWidth);
        // }
        // if (south > 0) {
        //     rectangle.drawRect(topLeft.x + southWidth, topLeft.y + this.sectorHeight - westWidth, ROAD_LINE_WIDTH, westWidth);
        //     rectangle.drawRect(topLeft.x + this.sectorWidth - southWidth, topLeft.y + this.sectorHeight - eastWidth, ROAD_LINE_WIDTH, eastWidth);
        // }



        if (west > 0) {
            rectangle.drawRect(topLeft.x, topLeft.y + westWidth - ROAD_LINE_WIDTH, northWidth, ROAD_LINE_WIDTH);
            rectangle.drawRect(topLeft.x, topLeft.y + this.sectorHeight - westWidth, southWidth, ROAD_LINE_WIDTH);
        }
        if (east > 0) {
            rectangle.drawRect(topLeft.x + this.sectorWidth - northWidth, topLeft.y + eastWidth - ROAD_LINE_WIDTH, northWidth, ROAD_LINE_WIDTH);
            rectangle.drawRect(topLeft.x + this.sectorWidth - southWidth, topLeft.y + this.sectorHeight - eastWidth, southWidth, ROAD_LINE_WIDTH);
        }
        if (north > 0) {
            rectangle.drawRect(topLeft.x + northWidth, topLeft.y, ROAD_LINE_WIDTH, westWidth); // nema by 2. northWidth?
            rectangle.drawRect(topLeft.x + this.sectorWidth - northWidth, topLeft.y, ROAD_LINE_WIDTH, eastWidth);
        }
        if (south > 0) {
            rectangle.drawRect(topLeft.x + southWidth, topLeft.y + this.sectorHeight - westWidth, ROAD_LINE_WIDTH, westWidth);
            rectangle.drawRect(topLeft.x + this.sectorWidth - southWidth, topLeft.y + this.sectorHeight - eastWidth, ROAD_LINE_WIDTH, eastWidth);
        }

        rectangle.endFill();
        rectangle.alpha = 0.5;

        let circle = new Graphics();
        circle.beginFill(0xFF9933);
        circle.drawCircle(0, 0, 16);
        circle.endFill();
        circle.x = middleX;
        circle.y = middleY;
        circle.alpha = 0.15;
        circle.displayGroup = layers.npcLayer;
        this.container.addChild(circle);

        rectangle.displayGroup = layers.npcLayer;
        this.container.addChild(rectangle);
    }
}

export default NPCS;
