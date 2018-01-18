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

//const PADDING_SECTOR_COUNT = 0;
const PADDING_SECTOR_COUNT = 1;
const ROAD_WIDTH = 180;
const ROAD_ROUNDING_RADIUS = 40;
const ROAD_LINE_WIDTH = 12;
const ROAD_MIDDLE_LINE_BASIC = 12;
const ROAD_MIDLLE_LINE_DOUBLE = 24;
const ROAD_MIDLLE_LINE_DOUBLE_THICKNESS = 8;
const XING_WIDENESS = 200;
const XING_WIDENESS_PADDED = 240;
const XING_MINIMAL_DISTANCE = 50;
const XING_STRIPE_RATIO = 0.6;

class NPCS {
    constructor(gameContext) {
        this.gameContext = gameContext;
        this.container = new Container();
        this.sectorMap = {};
        this.sectorActiveSet = new Set();
        this.isSetsEqual = (a, b) => a.size === b.size && [...a].every(value => b.has(value));

        this.gameContext.communication.subject.subscribe(msg => {
            if (msg.hasPlayerstartresponse()) {
                this.handlePlayerStartResponse(msg.getPlayerstartresponse());
            }
        });
    }

    update() {
        let middleCoordinates = this.gameContext.middleCoordinates();
        this.container.position.set(middleCoordinates.x, middleCoordinates.y);

        if (this.worldOffsetX) {
            const sectorCoordinates = this.translateToSector(this.gameContext.controls.coordinates.x, this.gameContext.controls.coordinates.y);
            //const sectorKey = sectorKey(sectorCoordinates);
            const sectorKeysEligibleForActive = this.sectorKeysEligibleForActive(sectorCoordinates);
            if (!this.isSetsEqual(this.sectorActiveSet, sectorKeysEligibleForActive)) {
                const sectorUpdateStart = Date.now();
                //const removalSet = new Set();
                let removalRequested = false;
                for (let existingSectorKey of this.sectorActiveSet) {
                    if (!sectorKeysEligibleForActive.has(existingSectorKey)) {
                        //console.info(`candidate for deletion: ${existingSectorKey}`);
                        // this.sectorActiveSet.delete(existingSectorKey);
                        // console.info(`after delete ${existingSectorKey}`);
                        removalRequested = true;
                    }
                }

                // let additionRequested = false;
                // for (let eligibleKey of sectorKeysEligibleForActive) {
                //     if (!this.sectorActiveSet.has(eligibleKey)) {
                //         additionRequested = true;
                //         break;
                //     }
                // }

                if (removalRequested) {
                    this.removeSectorRoads(sectorKeysEligibleForActive);
                }
                for (let eligibleKey of sectorKeysEligibleForActive) {
                    if (!this.sectorActiveSet.has(eligibleKey)) {
                        //console.info(`drawing sector ${eligibleKey}`);
                        const sectorIndexes = this.sectorIndexes(eligibleKey);
                        this.drawSectorRoads(sectorIndexes);
                    }
                }

                this.sectorActiveSet = sectorKeysEligibleForActive;

                const sectorUpdateEnd = Date.now();
                const sectorUpdateTimeSpent = sectorUpdateEnd - sectorUpdateStart;
                console.info(`Sector updates took ${sectorUpdateTimeSpent} ms`);
            }
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
    }

    sectorKeysEligibleForActive(sectorCoordinates) {
        const result = new Set();
        for (let yOffset = -PADDING_SECTOR_COUNT; yOffset <= PADDING_SECTOR_COUNT; yOffset++) {
            for (let xOffset = -PADDING_SECTOR_COUNT; xOffset <= PADDING_SECTOR_COUNT; xOffset++) {
                const x = sectorCoordinates.x + xOffset;
                const y = sectorCoordinates.y + yOffset;
                if (x >= 0 && x < this.sectorHorizontalCount &&
                        y >= 0 && y < this.sectorVerticalCount) {
                    const sectorKey = this.sectorKey({x, y});
                    result.add(sectorKey);
                }
            }
        }
        return result;
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
        this.sectorHorizontalCount = this.worldWidth / this.sectorWidth;
        this.sectorVerticalCount = this.worldHeight / this.sectorHeight;
        for (let y = 0; y < this.sectorVerticalCount; y++) {
            for (let x = 0; x < this.sectorHorizontalCount; x++) {
                const key = this.sectorKey({x, y});
                this.sectorMap[key] = playerStartResponse.getSectormapMap().get(key);
            }
        }
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

    sectorIndexes(key) {
        const regex = /(\d+),(\d+)/;
        const match = regex.exec(key);
        return {x: parseInt(match[1], 10), y: parseInt(match[2], 10)};
    }

    drawSectorRoads(sectorIndexes) {
        const sectorKey = this.sectorKey(sectorIndexes);
        const sectorData = this.sectorMap[sectorKey];

        const north = sectorData.getNorth();
        const east = sectorData.getEast();
        const south = sectorData.getSouth();
        const west = sectorData.getWest();

        //const subtractRoadWidthWithCornerRadius = (roadWidth) => { roadWidth == 0 ? 0 : ROAD_WIDTH * roadWidth + ROAD_ROUNDING_RADIUS };

        const northWidth = this.sectorWidthHalf - ROAD_WIDTH * north;
        const southWidth = this.sectorWidthHalf - ROAD_WIDTH * south;
        const eastWidth = this.sectorHeightHalf - ROAD_WIDTH * east;
        const westWidth = this.sectorHeightHalf - ROAD_WIDTH * west;

        const topLeft = this.translateToWorld(sectorIndexes.x, sectorIndexes.y);

        const middleY = topLeft.y + this.sectorHeightHalf;
        const middleX = topLeft.x + this.sectorWidthHalf;

        const xingGraphics = new Graphics(); // TODO mozna znovupouzit standardni barvu car
        xingGraphics.beginFill(0xffdddd);

        const rectangle = new Graphics(); // TODO prejmenovat rectangle
        rectangle.beginFill(0xffffff);

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

        const innerXing = (x, y, width, height, type) => {
            if (type == 'H') {
                const count = Math.floor(height / XING_MINIMAL_DISTANCE);
                const partHeight = height / count;
                const stripeHeight = partHeight * XING_STRIPE_RATIO;
                const paddingHeight = partHeight - stripeHeight;
                const paddingHeightHalf = paddingHeight / 2;
                for (let i = 0; i < count; i++) {
                    const top = y + partHeight * i + paddingHeightHalf;
                    rectangle.drawRect(x, top, width, stripeHeight);
                }
            } else {
                const count = Math.floor(width / XING_MINIMAL_DISTANCE);
                const partWidth = width / count;
                const stripeWidth = partWidth * XING_STRIPE_RATIO;
                const paddingWidth = partWidth - stripeWidth;
                const paddingWidthHalf = paddingWidth / 2;
                for (let i = 0; i < count; i++) {
                    const left = x + partWidth * i + paddingWidthHalf;
                    rectangle.drawRect(left, y, stripeWidth, height);
                }
            }
        };

        const xing = (width, height, type) => {
            let left = topLeft.x;
            let top = topLeft.y;
            if (type == 'H') {
                let rectWidth = XING_WIDENESS;
                let rectHeight = this.sectorHeight - 2 * height;
                top += height;
                if (width > 0) {
                    left += width - XING_WIDENESS;
                } else {
                    left += this.sectorWidth + width;
                }
                //xingGraphics.drawRect(left, top, rectWidth, rectHeight); // TODO refactor na hoisting
                innerXing(left, top, rectWidth, rectHeight, type);
            } else {
                let rectWidth = this.sectorWidth - 2 * width;
                let rectHeight = XING_WIDENESS;
                left += width;
                if (height > 0) {
                    top += height - XING_WIDENESS;
                } else {
                    top += this.sectorHeight + height;
                }
                innerXing(left, top, rectWidth, rectHeight, type);
                //xingGraphics.drawRect(left, top, rectWidth, rectHeight); // TODO refactor na hoisting
            }
        };

        const innerRoadLine = (x, y, width, height, type) => {
            if (type == 'H') {
                if (height == ROAD_MIDLLE_LINE_DOUBLE) {
                    rectangle.drawRect(x, y, width, ROAD_MIDLLE_LINE_DOUBLE_THICKNESS);
                    rectangle.drawRect(x, y + height - ROAD_MIDLLE_LINE_DOUBLE_THICKNESS, width, ROAD_MIDLLE_LINE_DOUBLE_THICKNESS);
                } else {
                    rectangle.drawRect(x, y, width, height);
                }
            } else {
                if (width == ROAD_MIDLLE_LINE_DOUBLE) {
                    rectangle.drawRect(x, y, ROAD_MIDLLE_LINE_DOUBLE_THICKNESS, height);
                    rectangle.drawRect(x + width - ROAD_MIDLLE_LINE_DOUBLE_THICKNESS, y, ROAD_MIDLLE_LINE_DOUBLE_THICKNESS, height);
                } else {
                    rectangle.drawRect(x, y, width, height);
                }
            }
        };

        const mainRoadMiddleLine = (size, roadWidth, type) => {
            const stripesWidth = roadWidth > 1 ? ROAD_MIDLLE_LINE_DOUBLE : ROAD_MIDDLE_LINE_BASIC;
            const stripesWidthHalf = stripesWidth / 2;
            if (type == 'H') {
                let top = topLeft.y + this.sectorHeightHalf - stripesWidthHalf;
                let left = topLeft.x;
                let width = Math.abs(size);
                if (size < 0) {
                    left += this.sectorWidth + size;
                }
                //xingGraphics.drawRect(left, top, width, stripesWidth);
                innerRoadLine(left, top, width, stripesWidth, type);
            } else {
                let top = topLeft.y;
                let left = topLeft.x + this.sectorWidthHalf - stripesWidthHalf;
                let height = Math.abs(size);
                if (size < 0) {
                    top += this.sectorHeight + size;
                }
                //xingGraphics.drawRect(left, top, stripesWidth, height);
                innerRoadLine(left, top, stripesWidth, height, type);
            }
        };

        const mainRoadSide = (width, height, type) => {
            let left = topLeft.x;
            let top = topLeft.y;
            if (type == 'H') {
                //rectangle.drawRect(topLeft.x, topLeft.y + westWidth - ROAD_LINE_WIDTH, northWidth, ROAD_LINE_WIDTH);
                let rectWidth = Math.abs(width);
                let rectHeight = ROAD_LINE_WIDTH;
                if (height > 0) {
                    top += height - ROAD_LINE_WIDTH;
                } else {
                    top += this.sectorHeight + height;
                }
                if (width < 0) {
                    left += this.sectorWidth + width;
                }
                rectangle.drawRect(left, top, rectWidth, rectHeight); // TODO refactor na hoisting
            } else {
                let rectWidth = ROAD_LINE_WIDTH;
                let rectHeight = Math.abs(height);
                if (width > 0) {
                    left += width - ROAD_LINE_WIDTH;
                } else {
                    left += this.sectorWidth + width;
                }
                if (height < 0) {
                    top += this.sectorHeight + height;
                }
                rectangle.drawRect(left, top, rectWidth, rectHeight);
            }
        };

        const binaryNorth = Math.min(north, 1);
        const binarySouth = Math.min(south, 1);
        const binaryWest = Math.min(west, 1);
        const binaryEast = Math.min(east, 1);
        const binarySum  = binaryNorth + binarySouth + binaryWest + binaryEast;
        if (west > 0) {
            mainRoadSide(northWidth, westWidth, 'H');
            mainRoadSide(southWidth, -westWidth, 'H');
            let minWidth = Math.min(northWidth, southWidth);
            if (binarySum > 2) {
                xing(minWidth, westWidth, 'H');
                minWidth -= XING_WIDENESS_PADDED;
            }
            mainRoadMiddleLine(minWidth, west, 'H');
        }
        if (east > 0) {
            mainRoadSide(-northWidth, eastWidth, 'H');
            mainRoadSide(-southWidth, -eastWidth, 'H');
            let minWidth  = -Math.min(northWidth, southWidth);
            if (binarySum > 2) {
                xing(minWidth, eastWidth, 'H');
                minWidth += XING_WIDENESS_PADDED;
            }
            mainRoadMiddleLine(minWidth, east, 'H');
        }
        if (north > 0) {
            mainRoadSide(northWidth, westWidth, 'V');
            mainRoadSide(-northWidth, eastWidth, 'V');
            let minHeight = Math.min(westWidth, eastWidth);
            if (binarySum > 2) {
                xing(northWidth, minHeight, 'V');
                minHeight -= XING_WIDENESS_PADDED;
            }
            mainRoadMiddleLine(minHeight, north, 'V');
        }
        if (south > 0) {
            mainRoadSide(southWidth, -westWidth, 'V');
            mainRoadSide(-southWidth, -eastWidth, 'V');
            let minHeight = -Math.min(westWidth, eastWidth);
            if (binarySum > 2) {
                xing(southWidth, minHeight, 'V');
                minHeight += XING_WIDENESS_PADDED;
            }
            mainRoadMiddleLine(minHeight, south, 'V');
        }


        rectangle.endFill();
        rectangle.alpha = 0.5;
        rectangle.displayGroup = layers.npcLayer;
        rectangle._sector = sectorKey;
        this.container.addChild(rectangle);

        xingGraphics.endFill();
        xingGraphics.alpha = 0.15;
        xingGraphics.displayGroup = layers.npcLayer;
        xingGraphics._sector = sectorKey;
        this.container.addChild(xingGraphics);

        let circle = new Graphics();
        circle.beginFill(0xFF9933);
        circle.drawCircle(0, 0, 16);
        circle.endFill();
        circle.x = middleX;
        circle.y = middleY;
        circle.alpha = 0.15;
        circle.displayGroup = layers.npcLayer;
        circle._sector = sectorKey;
        this.container.addChild(circle);
    }

    removeSectorRoads(sectorKeysEligibleForActive) {
        for (let i = this.container.children.length - 1; i >= 0; i--) {
            const sprite = this.container.children[i];
            if (!sectorKeysEligibleForActive.has(sprite._sector)) {
                //console.info(`removing sprite for sector ${sprite._sector}`);
                this.container.removeChild(sprite);
            }
        }
    }
}

export default NPCS;
