import rx from 'rxjs'
const withinPiBounds = require('../computation/movements').withinPiBounds;

class Controls {
    constructor(gameContext) {
        this.gameContext = gameContext;
        /*document.body.onmousedown = () => this.mouseDown++;
        document.body.onmouseup = () => this.mouseDown--;*/
        this.coordinates = {x: 0.0, y: 0.0};
        this.skin = 'SET ME UP!';
        this.speed = 0.0;
        this.baseSpeed = 1.0;
        this.speedAccelerator = false;
        this.speedBrake = false;

        let mouseDowns = rx.Observable.fromEvent(document, 'mousedown');
        let mouseUps = rx.Observable.fromEvent(document, 'mouseup');
        this.mouseActions = rx.Observable.merge(mouseDowns, mouseUps);

        let keyDowns = rx.Observable.fromEvent(document, 'keydown');
        let keyUps = rx.Observable.fromEvent(document, 'keyup');
        this.keyActions = rx.Observable.merge(keyDowns, keyUps);
        this.piHalf = Math.PI / 2;
        this.piDouble = Math.PI * 2;

        let resizeStream = rx.Observable.fromEvent(window, 'resize');
        rx.Observable.merge(resizeStream.debounceTime(500), resizeStream.throttleTime(500)).distinct().subscribe(event => {
            this.resizedHandler();
        });
        //.debounceTime(1000).subscribe(event => { this.resizedHandler(); });

        this.fpsSubject = new rx.Subject();
        this.scoreUpdateSubject = new rx.Subject();

        // TODO mozna pridat filter
        this.gameContext.communication.subject.subscribe(msg => {
            if (msg.hasClientdisconnect()) {
                console.info('vyhodit hada z top ten');

                this.scoreUpdateSubject.next({id: msg.getClientdisconnect().getId(), type: 'remove'});
            } else if (msg.hasPlayerupdateresponse()) {
                this.handlePlayerUpdateResponse(msg.getPlayerupdateresponse());
            } else if (msg.hasPlayerstartresponse()) {
                this.handlePlayerStartResponse(msg.getPlayerstartresponse());
            }
        });

        this.mouseActions.subscribe(event => {
            //console.info(event);
            // https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons
            //this.mouseDown = event.buttons > 0;
            this.speedAccelerator = (event.buttons & 1) > 0;
            this.speedBrake = (event.buttons & 2) > 0;
            console.info(`buttons: ${event.buttons}, acc: ${this.speedAccelerator}, brake: ${this.speedBrake}`);
        });
    }

    resizedHandler() {
        //console.info('resized handler');
        this.gameContext.width = window.innerWidth;
        this.gameContext.height = window.innerHeight;
        this.gameContext.middle = {x: window.innerWidth / 2, y: window.innerHeight / 2};
        this.gameContext.renderer.resize(this.gameContext.width, this.gameContext.height);
        if (this.gameContext.background) {
            this.gameContext.background.initSprite(this.gameContext.width, this.gameContext.height);
        }

        if (this.gameContext.worms) {
            this.gameContext.worms.resize();
        }

        if (this.gameContext.gameInfo) {
            this.gameContext.gameInfo.resize();
        }

        let resize = new proto.Resize();
        resize.setWidth(this.gameContext.width);
        resize.setHeight(this.gameContext.height);
        let message = new proto.Message();
        message.setResize(resize);
        let bytes = message.serializeBinary();
        //this.gameContext.communication.socket.send(bytes);
        this.gameContext.communication.subject.next(bytes);
    }

    angle() {
        const mousePosition = this.gameContext.renderer.plugins.interaction.mouse.global;
        const cursorDiffX = mousePosition.x - this.gameContext.middle.x;
        const cursorDiffY = mousePosition.y - this.gameContext.middle.y;
        let angle = -Math.atan2(cursorDiffX, cursorDiffY) + this.piHalf;
        if (angle < 0) {
            angle += this.piDouble;
        }
        return withinPiBounds(angle);
    }

    handlePlayerUpdateResponse(response) {
        this.coordinates = {x: response.getX(), y: response.getY()};

        const roundTrip = Date.now() - response.getTimeinfo().getInitiated();
        this.gameContext.gameInfo.roundTrip = roundTrip;
    }

    handlePlayerStartResponse(response) {
        this.baseSpeed = response.getBasespeed();
    }

    updateSpeed(elapsedTime) {
        if (this.speedAccelerator) {
            const maxElapsedTime = Math.min(elapsedTime, 100);
            let accelerationTimeFrom0 = Math.pow(this.speed, 2) / this.baseSpeed;
            accelerationTimeFrom0 += maxElapsedTime / 1000;
            this.speed = Math.sqrt(accelerationTimeFrom0 * this.baseSpeed);
        }
        if (this.speedBrake) {
            const deceleration = 2.0 * this.baseSpeed * elapsedTime / 1000;
            this.speed = Math.max(0.0, this.speed - deceleration);
        }
    }

    update(elapsedTime) {
        this.updateSpeed(elapsedTime);
    }
}

export default Controls