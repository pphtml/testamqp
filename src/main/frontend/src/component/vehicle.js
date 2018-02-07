import { Sprite, Container, loader, BLEND_MODES } from 'pixi.js'
import layers from './layers'
const move = require('../computation/movements').move;
const allowedAngle = require('../computation/movements').allowedAngle;


let resources = loader.resources;

// message VehicleData {
//     uint64 lastProcessedOnServer = 1;
//     repeated VehiclePart vehicleParts = 2;
//     float orientationRequested = 3;
//     float orientation = 4;
//     float speedMultiplier = 5;
// }
//
// message VehiclePart {
//     float x = 1;
//     float y = 2;
//     float orientation = 3;
//     PartType partType = 4;
//
//     // following needed only once
//     string partId = 11;
//     int32 pivotX = 12;
//     int32 pivotY = 13;
//
// enum PartType {
//         FRONT = 0;
//         TRAILER = 1;
//         FRONT_WHEEL = 2;
//     }
// }

class Vehicle {
    constructor({id, vehicleData, gameContext} = {}) { // co kdyz se vymaze {} ?
        this.gameContext = gameContext;
        this.frameUpdatedFromServer = true;
        this.vehicleData = vehicleData;
        this.vehicleParts = vehicleData.vehicleParts;
        //this.coordinates = {x: frontPart.getX(), y: frontPart.getY()};
        // this.skinColor = skin;
        // this.angle = rotation;
        // this.partDistance = 20.0;
        // this.path = path;
        // this.speed = speed;
        // this.gameContext = gameContext;
        // this.length = length;
        this.id = id;
        this.container = new Container();

        for (let index = 0; index < this.vehicleParts.length; index++) {
            const vehiclePart = this.vehicleParts[index];
            const spriteName = `${vehiclePart.sprite}.png`;
            const vehiclePartSprite = new Sprite(resources['images/spritesheet.json'].textures[spriteName]);
            //frontPartSprite.tint = 0x802020;
            //frontPart.metaInf = 'eye';
            //frontPart.scale.set(0.4, 0.4);
            //frontPart.pivot.set(-5, -4);
            // TODO orientation ?
            vehiclePartSprite.anchor.set(0.5, 0.5);
            vehiclePartSprite.scale.set(vehiclePart.scale, vehiclePart.scale);
            vehiclePartSprite.displayGroup = layers.tailLayer;
            vehiclePartSprite.position.set(vehiclePart.x, vehiclePart.y);
            vehiclePartSprite.rotation = vehiclePart.orientation;
            if (vehiclePart.design) {
                vehiclePartSprite.tint = vehiclePart.design;
            }
            vehiclePartSprite._partIndex = index;
            this.container.addChild(vehiclePartSprite);
        }
    }

    update(elapsedTime) {
        // const frontPart = {
        //     axisHalfLength: 100,
        //     orientation: 0.0,
        //     frontAxis: 0.8,
        //     rearAxis: -0.6,
        //     x: 0.0,
        //     y: 0.0
        // };

        if (this.gameContext.communication.commId == this.id) {
            const wheelDeflection = this.vehicleParts[0].wheelDeflection;
            const originalFrontPart = this.vehicleParts[0];
            const askedAngle = this.gameContext.controls.angle();
            const orientation = allowedAngle(askedAngle, originalFrontPart.orientation, wheelDeflection);
            let turningSpeed = Math.abs(originalFrontPart.orientation - orientation);
            turningSpeed = Math.min(turningSpeed, Math.abs(Math.PI * 2 - turningSpeed));
            this.gameContext.controls.turningSpeed = turningSpeed;
            const distance = 0.06 * elapsedTime * this.gameContext.controls.speed;

            this.vehicleParts = move(orientation, distance, this.vehicleParts);

            for (let i = this.container.children.length - 1; i >= 0; i--) {
                const sprite = this.container.children[i];
                if (sprite.hasOwnProperty('_partIndex')) {
                    const spriteIndex = sprite._partIndex;
                    const vehiclePart = this.vehicleParts[spriteIndex];
                    let x = vehiclePart.x, y = vehiclePart.y;
                    sprite.position.set(x, y);
                    sprite.rotation = vehiclePart.orientation;
                    if (spriteIndex == 0) {
                        x = Math.floor(x), y = Math.floor(y);
                        sprite.position.set(x, y);
                        this.gameContext.controls.coordinates = {x, y};
                    }
                }
            }
        }


        // if (this.gameContext.communication.commId == this.id) {
        //     this.path[0].x = 0.0, this.path[0].y = 0.0;
        //     debugger;
        //}
        // const missingParts = Math.floor(this.length / LENGTH_PER_PART) - this.path.length;
        // if (missingParts > 0) {
        //     //console.info(`nesedi delka -> musi se pridat ${missingParts}`);
        //     const originalLength = this.path.length;
        //     for (let index = 0; index < missingParts; index++) {
        //         const endPart = this.path[this.path.length-1];
        //         const part = JSON.parse(JSON.stringify(endPart));
        //         this.path.push(part);
        //
        //         const sprite = this.sprite_factory();
        //         sprite.pathIndex = index + originalLength;
        //         sprite.position.set(part.x, part.y);
        //         sprite.rotation = part.r;
        //         sprite.tint = this.skinColor;
        //         this.container.addChildAt(sprite, 0);
        //     }
        // }

        // if (!this.frameUpdatedFromServer) {
        //     let distance = this.speed * 0.06 * elapsedTime;
        //     //if (this.gameContext.communication.commId != this.id) {
        //         //distance = distance * 0.5;
        //         //console.info(this.speed);
        //     //}
        //     const newPath = moveSnake(this.path, this.angle, distance, this.partDistance);
        //     this.path = newPath.path;
        //
        //     this.coordinates = {x: this.path[0].x, y: this.path[0].y};
        //     this.applyPathToSpriteCoordinates();
        // }
        //
        // this.frameUpdatedFromServer = false;
    }

    // applyPathToSpriteCoordinates() {
    //     for (let indexSprite=this.container.children.length-1; indexSprite>=0; indexSprite--) {
    //         //console.info(indexSprite, indexPath);
    //         const sprite = this.container.children[indexSprite];
    //         //debugger;
    //         if (sprite.hasOwnProperty('pathIndex')) {
    //             const part = this.path[sprite.pathIndex];
    //             sprite.position.set(part.x, part.y);
    //             sprite.rotation = part.r;
    //             //sprite.zOrder = indexSprite;
    //         } else if (sprite.hasOwnProperty('metaInf')) {
    //             const part = this.path[0];
    //             sprite.position.set(part.x, part.y);
    //             sprite.rotation = part.r;
    //         }
    //     }
    // }

    // updateFromServer({speed, rotation, path = []} = {}) {
    //     // if (this.gameContext.communication.commId != this.id) {
    //     //     //console.info(`updateFromServer for ${this.id}, ${JSON.stringify(path)}`);
    //     //     //debugger;
    //     // }
    //     //if (this.gameContext.communication.commId != this.id) {
    //         this.coordinates = {x: path[0].x, y: path[0].y};
    //         this.angle = rotation;
    //         //this.partDistance = 20.0;
    //         this.path = path;
    //         this.speed = speed;
    //
    //         this.applyPathToSpriteCoordinates(); // TODO vyhodit - update() by mel byt normalne volany
    //         this.frameUpdatedFromServer = true;
    //     //}
    // }
}

export default Vehicle;