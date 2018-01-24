import * as PIXI from 'pixi.js'
import {Sprite, Container, Graphics, loader, filters, BLEND_MODES} from 'pixi.js' // , default as PIXI
import layers from './layers'
import 'babel-polyfill';

//const rgbDimmer = require('../computation/rgbColor').rgbDimmer;
let resources = loader.resources;
let TilingSprite = PIXI.extras.TilingSprite;

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
const ROAD_MIDDLE_LINE_DOUBLE = 24;
const ROAD_MIDDLE_LINE_DOUBLE_THICKNESS = 8;
const ROAD_MIDDLE_LINE_STRIPE_INTERVAL = 341.3333333333;
const ROAD_MIDDLE_LINE_STRIPE_RATIO = 0.5;
const XING_WIDENESS = 140;
const XING_WIDENESS_PADDED = 170;
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
        function* stripingLines(totalLength, length, fullRatio) {
            let x = 0;
            while (x < totalLength) {
                const start = x + length * ((1 - fullRatio) / 2);
                const end = x + length * (1 - (1 - fullRatio) / 2);
                if (start < totalLength) {
                    yield [start, Math.min(end, totalLength)];
                }
                x += length;
            }
        }

        const sectorKey = this.sectorKey(sectorIndexes);
        const sectorData = this.sectorMap[sectorKey];

        const north = sectorData.getNorth();
        const east = sectorData.getEast();
        const south = sectorData.getSouth();
        const west = sectorData.getWest();

        const topLeft = this.translateToWorld(sectorIndexes.x, sectorIndexes.y);

        const drawSectorQuadrant = (currentRoadType, leftRoadType, rightRoadType, oppositeRoadType, rotate, offsetX, offsetY,
                                    sectorWidth, sectorHeight) => {
            const sectorContainer = new Container();
            const gContext = new Graphics();
            gContext.beginFill(0xffffff);

            const currentRoadWidth = sectorHeight / 2 - ROAD_WIDTH * currentRoadType;
            const leftRoadWidth = sectorWidth / 2 - ROAD_WIDTH * leftRoadType;
            const rightRoadWidth = sectorWidth / 2 - ROAD_WIDTH * rightRoadType;
            //const opositeRoadWidth = sectorHeight / 2 - ROAD_WIDTH * oppositeRoadType;

            const leftRoadWidthWORounding = leftRoadWidth - ((leftRoadType < 1) ? 0 : ROAD_ROUNDING_RADIUS);
            const rightRoadWidthWORounding = rightRoadWidth - ((rightRoadType < 1) ? 0 : ROAD_ROUNDING_RADIUS);
            const binarySum  = Math.min(currentRoadType, 1) + Math.min(oppositeRoadType, 1) +
                Math.min(leftRoadType, 1) + Math.min(rightRoadType, 1);
            const mergedRoadWidth = Math.min(leftRoadWidthWORounding, rightRoadWidthWORounding);
            const mergedRoadWidthWOXing = mergedRoadWidth - (binarySum > 2 ? XING_WIDENESS_PADDED : 0);

            const mainRoadMiddleLine = () => {
                const stripesWidth = currentRoadType > 1 ? ROAD_MIDDLE_LINE_DOUBLE : ROAD_MIDDLE_LINE_BASIC;
                const top = (sectorHeight - stripesWidth) / 2;
                if (stripesWidth == ROAD_MIDDLE_LINE_DOUBLE) {
                    gContext.drawRect(0, top, mergedRoadWidthWOXing, ROAD_MIDDLE_LINE_DOUBLE_THICKNESS);
                    gContext.drawRect(0, top + stripesWidth - ROAD_MIDDLE_LINE_DOUBLE_THICKNESS, mergedRoadWidthWOXing, ROAD_MIDDLE_LINE_DOUBLE_THICKNESS);
                    const redContext = new Graphics();
                    redContext.beginFill(0xff0000);
                    redContext.drawRect(0, currentRoadWidth, mergedRoadWidthWOXing, (sectorHeight - ROAD_MIDDLE_LINE_DOUBLE) / 2 - currentRoadWidth);
                    redContext.endFill();
                    redContext.alpha = 0.15;
                    redContext.displayGroup = layers.npcLayer;
                    redContext._sector = sectorKey;
                    sectorContainer.addChild(redContext);
                } else {
                    for (let [start, end] of stripingLines(mergedRoadWidthWOXing, ROAD_MIDDLE_LINE_STRIPE_INTERVAL, ROAD_MIDDLE_LINE_STRIPE_RATIO)) {
                        gContext.drawRect(start, top, end - start, stripesWidth);
                    }
                }
            };

            const innerXing = (x, y, width, height) => {
                const count = Math.floor(height / XING_MINIMAL_DISTANCE);
                const partHeight = height / count;
                const stripeHeight = partHeight * XING_STRIPE_RATIO;
                const paddingHeight = partHeight - stripeHeight;
                const paddingHeightHalf = paddingHeight / 2;
                for (let i = 0; i < count; i++) {
                    const top = y + partHeight * i + paddingHeightHalf;
                    gContext.drawRect(x, top, width, stripeHeight);
                }
            };

            const grass = (x, y, width, height) => {
                const grassSprite = new TilingSprite(resources['images/spritesheet.json'].textures['grass-tile.png'], width, height);
                //const grassSprite = new TilingSprite(resources['images/grass-tile.png'].texture, width, height);
                grassSprite.position.set(x, y);
                grassSprite.displayGroup = layers.npcLayer;
                grassSprite._sector = sectorKey;
                sectorContainer.addChild(grassSprite);
            };

            if (currentRoadType > 0) {
                gContext.drawRect(0, currentRoadWidth - ROAD_LINE_WIDTH, leftRoadWidthWORounding, ROAD_LINE_WIDTH);
                gContext.drawRect(0, sectorHeight - currentRoadWidth, rightRoadWidthWORounding, ROAD_LINE_WIDTH);

                // let minWidth = Math.min(northWidth, southWidth) - Math.max(roadRounding(north), Math.max(roadRounding(south)));
                if (binarySum > 2) {
                    //gContext.drawRect(mergedRoadWidth - XING_WIDENESS, leftRoadWidth, XING_WIDENESS, sectorHeight - leftRoadWidth - rightRoadWidth);
                    innerXing(mergedRoadWidth - XING_WIDENESS, currentRoadWidth, XING_WIDENESS, sectorHeight - 2 * currentRoadWidth);
                }
                mainRoadMiddleLine();
            }

            gContext.endFill();
            gContext.alpha = 0.5;
            gContext.displayGroup = layers.npcLayer;
            gContext._sector = sectorKey;
            // gContext.x = topLeft.x + offsetX;
            // gContext.y = topLeft.y + offsetY;
            //gContext.rotation = rotate;
            sectorContainer.rotation = rotate;
            sectorContainer.x = topLeft.x + offsetX;
            sectorContainer.y = topLeft.y + offsetY;
            sectorContainer._sector = sectorKey;
            sectorContainer.addChild(gContext);

            if (currentRoadType > 0 && leftRoadType > 0) {
                grass(0, 0, leftRoadWidth - ROAD_LINE_WIDTH, currentRoadWidth - ROAD_LINE_WIDTH);

                const arc = new Graphics();
                arc.lineStyle(ROAD_LINE_WIDTH, 0xffffff, 0.5);
                arc.arc(leftRoadWidth - ROAD_ROUNDING_RADIUS, currentRoadWidth - ROAD_ROUNDING_RADIUS, ROAD_ROUNDING_RADIUS - ROAD_LINE_WIDTH / 2, 0, Math.PI / 2, false);
                arc.displayGroup = layers.npcLayer;
                arc._sector = sectorKey;
                sectorContainer.addChild(arc);
            } else if (currentRoadType == 0 && binarySum == 2 && oppositeRoadType == 0) {
                //grass(0, 0, sectorWidth, currentRoadWidth - ROAD_LINE_WIDTH);
                grass(0, 0, leftRoadWidth - ROAD_LINE_WIDTH, sectorHeight / 2);
                grass(0, sectorHeight / 2, rightRoadWidth - ROAD_LINE_WIDTH, sectorHeight / 2);
            } else if (currentRoadType == 0 && binarySum >= 2 && oppositeRoadType > 0) {
                grass(0, 0, Math.min(leftRoadWidth, rightRoadWidth) - ROAD_LINE_WIDTH, sectorHeight);
            }


            this.container.addChild(sectorContainer);
        };

        drawSectorQuadrant(west, north, south, east, 0, 0, 0, this.sectorWidth, this.sectorHeight);
        drawSectorQuadrant(north, east, west, south, -Math.PI * 3 / 2, this.sectorWidth, 0, this.sectorHeight, this.sectorWidth);
        drawSectorQuadrant(east, south, north, west, -Math.PI, this.sectorHeight, this.sectorWidth, this.sectorWidth, this.sectorHeight);
        drawSectorQuadrant(south, west, east, north, -Math.PI / 2, 0, this.sectorHeight, this.sectorHeight, this.sectorWidth);

        // const middleY = topLeft.y + this.sectorHeightHalf;
        // const middleX = topLeft.x + this.sectorWidthHalf;

        // let circle = new Graphics();
        // circle.beginFill(0xFF9933);
        // circle.drawCircle(0, 0, 16);
        // circle.endFill();
        // circle.x = middleX;
        // circle.y = middleY;
        // circle.alpha = 0.15;
        // circle.displayGroup = layers.npcLayer;
        // circle._sector = sectorKey;
        // this.container.addChild(circle);
    }

    removeSectorRoads(sectorKeysEligibleForActive) {
        for (let i = this.container.children.length - 1; i >= 0; i--) {
            const child = this.container.children[i];
            if (!sectorKeysEligibleForActive.has(child._sector)) {
                //console.info(`removing sprite for sector ${sprite._sector}`);
                this.container.removeChild(child);
                if (child.constructor.name == 'Container') {
                    for (let j = child.children.length - 1; j >= 0; j--) {
                        const sprite = child.children[j];
                        child.removeChild(sprite);
                        //delete sprite;
                    }
                }
                //delete child;
            }
        }
    }
}

export default NPCS;
