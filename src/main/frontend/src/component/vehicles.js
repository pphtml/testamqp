import { Sprite, Container, Graphics, loader, filters, BLEND_MODES } from 'pixi.js'
import Vehicle from './vehicle'
// import layers from './layers'
// let resources = loader.resources;

class Vehicles {
    constructor(gameContext) {
        this.gameContext = gameContext;
        this.gameContext.worms = this;
        this.container = new Container();
        this.map = {};

        // let rectangle = new Graphics();
        // rectangle.beginFill(0x0033CC);
        // rectangle.lineStyle(4, 0xFF0000, 1);
        // rectangle.drawRect(0, 0, 96, 96);
        // rectangle.endFill();
        // rectangle.x = 64;
        // rectangle.y = 64;
        // rectangle.alpha = 0.5;
        // this.container.addChild(rectangle);

        // this.gameContext.communication.subject.subscribe(msg => {
        //     // if (msg.hasSnakesupdate()) {
        //     //     this.updateWorms(msg.getSnakesupdate().getSnakesList());
        //     // }
        //     if (msg.hasPlayerstartresponse()) {
        //         this.handlePlayerStartResponse(msg.getPlayerstartresponse());
        //     } else if (msg.hasClientdisconnect()) {
        //         console.info('vyhodit auto z mapy');
        //         console.info('vymazat sprity auta');
        //     }
        // });
    }

    updateWorms(worms) {
        for (const wormData of worms) {
            const id = wormData.getId();
            if (this.gameContext.communication.commId != id) {
                const path = wormData.getPathList().map(part => {
                    return { x: part.getX(), y: part.getY(), r: part.getRotation() };
                });
                //console.info(`${id} -> ${JSON.stringify(path)}`);
                const skin = wormData.getSkin();
                const rotation = wormData.getRotation();
                const speed = wormData.getSpeed();

                let existingWorm = this.map[id];
                if (!existingWorm) {
                    let worm = new Worm({skin: skin, speed: speed, rotation: rotation, path: path, id: id, gameContext: this.gameContext});
                    this.map[id] = worm;
                    this.container.addChild(worm.container);
                } else {
                    //console.info(`updateFromServer ${path[0].x}, ${path[0].y}`);
                    existingWorm.updateFromServer({speed: speed, rotation: rotation, path: path});
                }
            }
        }
    }


    updatePosition() {
        //this.container.position.set(this.gameContext.middle.x - this.coordinates.x, this.gameContext.middle.y - this.coordinates.y);
        const middleCoordinates = this.gameContext.middleCoordinates();
        this.container.position.set(middleCoordinates.x, middleCoordinates.y);
    }

    resize() {
        this.updatePosition();
    }

    update(elapsedTime) {
        for (const [id, vehicle] of Object.entries(this.map)) {
            //if (this.gameContext.communication.commId == id) {
                vehicle.update(elapsedTime);
            //}
        }
        this.updatePosition();
    }

//        this.gameContext.controls.scoreUpdateSubject.next({id, length: response.getLength(), currentPlayer: true, type: 'update'});

    // updateWorm({id, path = [], skin, rotation, speed, length} = {}) {
    //     // if (id == this.gameContext.communication.commId) {
    //     // }
    //
    //
    //     const translatedPath = path.map(part => {
    //         return { x: part.getX(), y: part.getY(), r: part.getRotation() };
    //     });
    //     // const skin = wormData.getSkin();
    //     //this.angle = rotation;
    //     //debugger;
    //     //this.speed = speed;
    //
    //     const existingWorm = this.map[id];
    //     if (!existingWorm) {
    //         const worm = new Worm({skin, speed, rotation, path: translatedPath, id, length,
    //         gameContext: this.gameContext});
    //         this.map[id] = worm;
    //         this.container.addChild(worm.container);
    //     } else {
    //         //console.info(`updateFromServer ${path[0].x}, ${path[0].y}`);
    //         existingWorm.updateFromServer({speed, rotation, path: translatedPath});
    //     }
    // }

    handlePlayerStartResponse(playerStartResponse) {
        const id = this.gameContext.communication.commId;

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

        const vehicleData = this.vehicleDataFromProtobuf(playerStartResponse.getVehicledata());

        const vehicle = new Vehicle({id, vehicleData, gameContext: this.gameContext});
        this.map[id] = vehicle;
        this.container.addChild(vehicle.container);
    }

//
// message VehiclePart {
//
// enum PartType {
//         FRONT = 0;
//         TRAILER = 1;
//         FRONT_WHEEL = 2;
//     }
// }

    //     message VehicleData {
// }


    vehicleDataFromProtobuf(source) {
        const vehicleParts = source.getVehiclepartsList().map(part => {
            return {
                x: part.getX(),
                y: part.getY(),
                orientation: part.getOrientation(),
                partType: part.getParttype(),

                partId: part.getPartid(),
                // pivotX: part.getPivotx(),
                // pivotY: part.getPivoty(),
                axisHalfLength: part.getAxishalflength(),
                frontAxis: part.getFrontaxis(),
                rearAxis: part.getRearaxis(),
                wheelDeflection: part.getWheeldeflection(),
                sprite: part.getSprite(),
                scale: part.getScale(),
                design: part.getDesign()
            };
        });

        const result = {
            lastProcessedOnServer: source.getLastprocessedonserver(),
            vehicleParts: vehicleParts,
            orientationRequested: source.getOrientationrequested(),
            orientation: source.getOrientation(),
            speedMultiplier: source.getSpeedmultiplier()
        };
        return result;
    }
}

export default Vehicles;
