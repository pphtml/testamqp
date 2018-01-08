// import Worm from './worm'
// import Controls from './controls'
// const moveSnake = require('./wormMovement').moveSnake;

class Player {
    constructor(gameContext, skin) {
        this.gameContext = gameContext;
        // this.gameContext.controls.skin = skin;
        //
        // const playerStartReq = new proto.PlayerStartReq();
        // playerStartReq.setSkin(`${skin}`);
        // playerStartReq.setInitiated(Date.now());
        // const message = new proto.Message();
        // message.setPlayerstartreq(playerStartReq);
        // const msgBytes = message.serializeBinary();
        // this.gameContext.communication.subject.next(msgBytes);
    }

    update(askedAngle, elapsedTime) {
        // let baseSpeed = 1.0;
        // this.speed = 5.0 * (this.gameContext.controls.isMouseDown() ? baseSpeed * 2 : baseSpeed); // * elapsedTime * 0.06;
        // this.angle = Controls.computeAllowedAngle(askedAngle, this.angle, elapsedTime, this.gameContext, baseSpeed, this.speed);
        const distance = 2.0;
        const angle = this.gameContext.controls.angle();
        const xStep = Math.cos(angle) * distance;
        const yStep = Math.sin(angle) * distance;

        this.gameContext.controls.coordinates.x += xStep;
        this.gameContext.controls.coordinates.y += yStep;

        // const playerUpdateReq = new proto.PlayerUpdateReq();
        // playerUpdateReq.setRotationasked(askedAngle);
        // playerUpdateReq.setSpeedmultiplier(this.gameContext.controls.isMouseDown() ? 2.0 : 1.0);
        // playerUpdateReq.setInitiated(Date.now());
        // const message = new proto.Message();
        // message.setPlayerupdatereq(playerUpdateReq);
        // const msgBytes = message.serializeBinary();
        // this.gameContext.communication.subject.next(msgBytes);
    }
}

export default Player
