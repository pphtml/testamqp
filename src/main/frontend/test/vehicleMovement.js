const expect = require("chai").expect;
const move = require('../src/computation/movements').move;

describe("Movements", () => {
    describe("Step Update Calculations", () => {
        it("move vehicle a bit to the east", () => {
            const frontPart = {
                axisHalfLength: 100,
                orientation: 0.0,
                frontAxis: 0.8,
                rearAxis: -0.6,
                x: 0.0,
                y: 0.0
            };
            const orientation = 0.0;
            const distance = 1000.0;

            const movedVehicleParts = move(orientation, distance, [frontPart]);
            //console.info(JSON.stringify(movedVehicleParts));

            //expect(distanceCheck(newPath, distance)).to.equal(true);
            expect(movedVehicleParts.length).to.equal(1);
            const frontPartResult = movedVehicleParts[0];
            expect(frontPartResult.x).to.be.closeTo(1000, 0.000001);
            expect(frontPartResult.y).to.be.closeTo(0, 0.000001);
            expect(frontPartResult.orientation).to.be.closeTo(0, 0.000001);
        });

        it("move vehicle a bit to the west", () => {
            const frontPart = {
                axisHalfLength: 100,
                orientation: Math.PI,
                frontAxis: 0.8,
                rearAxis: -0.6,
                x: 0.0,
                y: 0.0
            };
            const orientation = Math.PI;
            const distance = 1000.0;

            const movedVehicleParts = move(orientation, distance, [frontPart]);
            //console.info(JSON.stringify(movedVehicleParts));

            //expect(distanceCheck(newPath, distance)).to.equal(true);
            expect(movedVehicleParts.length).to.equal(1);
            const frontPartResult = movedVehicleParts[0];
            expect(frontPartResult.x).to.be.closeTo(-1000, 0.000001);
            expect(frontPartResult.y).to.be.closeTo(0, 0.000001);
            expect(frontPartResult.orientation).to.be.closeTo(Math.PI, 0.000001);
        });

        it("move vehicle a bit to the south", () => {
            const frontPart = {
                axisHalfLength: 100,
                orientation: Math.PI / 2,
                frontAxis: 0.8,
                rearAxis: -0.6,
                x: 0.0,
                y: 0.0
            };
            const orientation = Math.PI / 2;
            const distance = 1000.0;

            const movedVehicleParts = move(orientation, distance, [frontPart]);
            //console.info(JSON.stringify(movedVehicleParts));

            //expect(distanceCheck(newPath, distance)).to.equal(true);
            expect(movedVehicleParts.length).to.equal(1);
            const frontPartResult = movedVehicleParts[0];
            expect(frontPartResult.x).to.be.closeTo(0, 0.000001);
            expect(frontPartResult.y).to.be.closeTo(1000, 0.000001);
            expect(frontPartResult.orientation).to.be.closeTo(Math.PI / 2, 0.000001);
        });

        it("move vehicle a bit to the north", () => {
            const frontPart = {
                axisHalfLength: 100,
                orientation: Math.PI / 2 * 3,
                frontAxis: 0.8,
                rearAxis: -0.6,
                x: 0.0,
                y: 0.0
            };
            const orientation = Math.PI / 2 * 3;
            const distance = 1000.0;

            const movedVehicleParts = move(orientation, distance, [frontPart]);
            //console.info(JSON.stringify(movedVehicleParts));

            //expect(distanceCheck(newPath, distance)).to.equal(true);
            expect(movedVehicleParts.length).to.equal(1);
            const frontPartResult = movedVehicleParts[0];
            expect(frontPartResult.x).to.be.closeTo(0, 0.000001);
            expect(frontPartResult.y).to.be.closeTo(-1000, 0.000001);
            expect(frontPartResult.orientation).to.be.closeTo(Math.PI / 2 * 3, 0.000001);
        });

        it("move vehicle a small bit to the south-east", () => {
            const frontPart = {
                axisHalfLength: 100,
                orientation: 0.0,
                frontAxis: 0.8,
                rearAxis: -0.6,
                x: 0.0,
                y: 0.0
            };
            const orientation = Math.PI / 2 / 2;
            const distance = 10.0;

            const movedVehicleParts = move(orientation, distance, [frontPart]);
            //console.info(JSON.stringify(movedVehicleParts));

            //expect(distanceCheck(newPath, distance)).to.equal(true);
            expect(movedVehicleParts.length).to.equal(1);
            const frontPartResult = movedVehicleParts[0];
            expect(frontPartResult.x).to.be.closeTo(7.163372415070981, 0.000001);
            expect(frontPartResult.y).to.be.closeTo(3.2291651096737755, 0.000001);
            expect(frontPartResult.orientation).to.be.closeTo(0.04804226237391673, 0.000001);
        });
    });
});

/*    let baseSpeed = 1.0;
let speed = 5.0 * (this.gameContext.controls.isMouseDown() ? baseSpeed * 2 : baseSpeed); // * elapsedTime * 0.06;
let angle = Controls.computeAllowedAngle(askedAngle, this.lastAngle, elapsedTime, this.gameContext, baseSpeed, speed);
this.lastAngle = angle;
let x_step = Math.cos(angle) * speed;
let y_step = Math.sin(angle) * speed;

//console.info(`angle: ${angle}, speed: ${speed}, x_step: ${x_step}, y_step: ${y_step}`);
this.coordinates.x += x_step;
this.coordinates.y += y_step;

this.spriteHead.rotation = angle;
this.path.splice(0, 0, {x: x_step, y: y_step, speed: speed, angle: angle});
this.path.splice(200, 200);

var x = 0, y = 0, steps = 0, stepsTotal = 0, index_sprite = 0;
this.path.forEach(value => {
    x -= value.x;
    y -= value.y;
    steps += value.speed;
    stepsTotal += value.speed;
    if (steps >= 20) {
        steps -= 20;
        if (stepsTotal <= 199) { // stop iteration
            if (this.spritesTail.length <= index_sprite) {
                // console.info('adding sprite');
                let tail = this.tail_sprite_factory();
                tail.x = x;
                tail.y = y;
                tail.zOrder = stepsTotal;
                tail.rotation = value.angle;
                tail.displayGroup = layers.tailLayer;
                this.spritesTail.push(tail);
                this.container.addChild(tail);
            } else {
                let tail = this.spritesTail[index_sprite];
                tail.x = x;
                tail.y = y;
                tail.rotation = value.angle;
            }
            index_sprite++;
        } else if (index_sprite < this.spritesTail.length) {
            console.info(`zbyvajici..., index_sprite: ${index_sprite}, tail_sprites: ${this.spritesTail.length}`);
            let forRemoval = this.spritesTail.splice(index_sprite, 1000);
            forRemoval.forEach(sprite => this.container.removeChild(sprite));
        }
    }
});
}*/
