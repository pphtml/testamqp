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
        const frontPart = this.vehicleParts;
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


        //const frontPartSprite = new Sprite(resources['images/truck-small.png'].texture);
        const frontPartSprite = new Sprite(resources['images/transp.png'].texture);
        //frontPartSprite.tint = 0x802020;
        //frontPart.metaInf = 'eye';
        //frontPart.scale.set(0.4, 0.4);
        //frontPart.pivot.set(-5, -4);
        frontPartSprite.anchor.set(0.5, 0.5);
        frontPartSprite.displayGroup = layers.tailLayer;
        frontPartSprite.position.set(frontPart.x, frontPart.y);
        //frontPartSprite.rotation = Math.PI / 2;

        //frontPartSprite.blendMode = BLEND_MODES.NORMAL;
        //frontPartSprite.alpha = 1.0;
        this.container.addChild(frontPartSprite);


        // for (let index = this.path.length-1; index >= 0; index--) {
        //     const part = this.path[index];
        //     //const sprite = index == 0 ? this.head_sprite_factory() : this.tail_sprite_factory();
        //     const sprite = this.sprite_factory();
        //     sprite.pathIndex = index;
        //     sprite.position.set(part.x, part.y);
        //     sprite.rotation = part.r;
        //     sprite.tint = this.skinColor;
        //     //sprite.tint = 0x802020;
        //     this.container.addChild(sprite);
        //     //this.sprites.push(sprite);
        // }
        //
        // const head = this.path[0];
        //
        // const eyeLeft = new Sprite(resources['images/spritesheet.json'].textures['eye.png']);
        // eyeLeft.metaInf = 'eye';
        // eyeLeft.scale.set(0.4, 0.4);
        // eyeLeft.pivot.set(-5, 47);
        // eyeLeft.displayGroup = layers.tailLayer;
        // eyeLeft.position.set(head.x, head.y);
        // this.container.addChild(eyeLeft);


        //this.gameContext.stage.addChild(this.container);
    }
    // spriteNameHead() {
    //     return `basic_head_${this.skin}.png`;
    // }
    //
    // spriteNameTail() {
    //     return `basic_tail_${this.skin}.png`;
    // }

    // head_sprite_factory = () => {
    //     const head = new Sprite(resources['images/spritesheet.json'].textures['tail-mod2-white.png']);
    //     //let head = new Sprite(resources["images/sprites.json"].textures[this.spriteNameHead()]);
    //     head.scale.set(0.4, 0.4);
    //     head.anchor.set(0.5, 0.5);
    //     //head.displayGroup = layers.headLayer;
    //     head.displayGroup = layers.tailLayer; //layers.headLayer;
    //     return head;
    // }


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
            const distance = 0.06 * elapsedTime * this.gameContext.controls.isMouseDown() ? 5.0 : 1.0;

            const movedVehicleParts = move(orientation, distance, this.vehicleParts);
            this.vehicleParts = movedVehicleParts;
            //console.info(movedVehicleParts);
            const frontSprite = this.container.children[0];
            const x = this.vehicleParts[0].x, y = this.vehicleParts[0].y;
            frontSprite.position.set(x, y);
            frontSprite.rotation = this.vehicleParts[0].orientation;

            this.gameContext.controls.coordinates = {x, y};
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