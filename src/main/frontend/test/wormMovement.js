let expect = require("chai").expect;
//let converter = require("../src/app/converter");
//let Worm = require('../src/component/worm');
let moveSnake = require('../src/component/wormMovement').moveSnake;

let distanceCheck = (path, distance) => {
    var ok = true;
    for (var index = 0; index < path.length - 1; index++) {
        let left = path[index], right = path[index + 1];
        let xDiff = Math.abs(left.x - right.x), yDiff = Math.abs(left.y - right.y);
        let square = xDiff * xDiff + yDiff * yDiff;
        let diff = Math.sqrt(square);
        let distanceOk = Math.abs(diff - distance) < 0.0001;
        if (!distanceOk) {
            console.info(`${JSON.stringify(left)} -> ${JSON.stringify(right)}, diff: ${diff}`);
            ok = false;
        }
    }
    return ok;
};

describe("Worm Movements", () => {
    describe("Frame Update Calculations", () => {
        it("moves snake a frame step", () => {
            let snakePath = [{x: 500.0, y: 100.0, rotation: 0},
                {x: 490.0, y: 100.0, rotation: 0},
                {x: 480.0, y: 100.0, rotation: 0},
                {x: 470.0, y: 100.0, rotation: 0},
                {x: 470.0, y: 110.0, rotation: 0}
            ];
            //let angle = 0, distance = 10.0, moveDistance = 5.0;
            let angle = Math.PI / 2, distance = 10.0, moveDistance = 10.0;

            expect(distanceCheck(snakePath, distance)).to.equal(true);

            let newPath = moveSnake(snakePath, angle, moveDistance, distance);
            console.info(JSON.stringify(newPath));

            expect(distanceCheck(newPath, distance)).to.equal(true);
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
