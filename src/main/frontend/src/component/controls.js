import rx from 'rxjs'
const withinPiBounds = require('../computation/movements').withinPiBounds;

class MoveEvent {
    constructor(type, value, source) {
        this.type = type;
        this.value = value;
        this.source = source;
    }

    toString(){
        return `MoveEvent<source: ${source}, type: ${type}, value: ${value}>`;
    }
}

const MOUSE_SENSITIVITY = 10;

class Controls {
    constructor(gameContext) {
        this.gameContext = gameContext;
        /*document.body.onmousedown = () => this.mouseDown++;
        document.body.onmouseup = () => this.mouseDown--;*/
        this.coordinates = {x: 0.0, y: 0.0};
        this.skin = 'SET ME UP!';
        this.speed = 0.0;
        this.direction = 0;
        this.baseSpeed = 1.0;
        this.baseSpeedReverse = this.baseSpeed / 4;
        this.speedAccelerator = false;
        this.speedBrake = false;
        this.turningRight = false;
        this.turningLeft = false;
        this.turningWithKeysAngle = 0.000001;
        this.lastMouseMoveEvent = undefined;


        const mouseDowns = rx.Observable.fromEvent(document, 'mousedown');
        const mouseUps = rx.Observable.fromEvent(document, 'mouseup');
        const mouseMove = rx.Observable.fromEvent(document, 'mousemove');
        this.hideMouseCursor = (hide) => {
            if (!hide) {
                this.turningWithKeysAngle = undefined;
            }
            document.getElementsByTagName('body')[0].style.cursor = (hide ? 'none' : '');
        };
        mouseMove.subscribe(event => {
            if (this.lastMouseMoveEvent) {
                const xDiff = this.lastMouseMoveEvent.x - event.x;
                const yDiff = this.lastMouseMoveEvent.y - event.y;
                const squareLength = xDiff * xDiff + yDiff * yDiff;
                if (squareLength > MOUSE_SENSITIVITY) {
                    this.hideMouseCursor(false);
                }
            }
            this.lastMouseMoveEvent = event;
        });
        this.mouseActions = rx.Observable.merge(mouseDowns, mouseUps);
        this.mouseMoveEvents = this.mouseActions.map(event => {
            const value = event.type == 'mousedown';
            if (event.button == 0) {
                return new MoveEvent('forward', value, 'mouse');
            } else if (event.button == 2) {
                return new MoveEvent('back', value, 'mouse');
            }
        }).filter(event => event != undefined);

        let keyDowns = rx.Observable.fromEvent(document, 'keydown');
        let keyUps = rx.Observable.fromEvent(document, 'keyup');
        this.keyActions = rx.Observable.merge(keyDowns, keyUps);
        this.keyMoveEvents = this.keyActions.map(event => {
            const value = event.type == 'keydown';
            if (event.code == 'ArrowUp') {
                return new MoveEvent('forward', value, 'key');
            } else if (event.code == 'ArrowDown') {
                return new MoveEvent('back', value, 'key');
            } else if (event.code == 'ArrowLeft') {
                return new MoveEvent('left', value, 'key');
            } else if (event.code == 'ArrowRight') {
                return new MoveEvent('right', value, 'key');
            }
        }).filter(event => event != undefined);

        this.moveEvents = rx.Observable.merge(this.mouseMoveEvents, this.keyMoveEvents);

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

        this.moveEvents.subscribe(event => {
            if (event.type == 'forward') {
                this.speedAccelerator = event.value;
            }
            if (event.type == 'back') {
                this.speedBrake = event.value;
            }
            if (event.type == 'right') {
                this.turningRight = event.value;
            }
            if (event.type == 'left') {
                this.turningLeft = event.value;
            }

            // this.speedAccelerator = (event.buttons & 1) > 0;
            // this.speedBrake = (event.buttons & 2) > 0;
        });

        this.mouseActions.subscribe(event => {
            //console.info(event);
            // https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons
            //this.mouseDown = event.buttons > 0;
            //console.info(`buttons: ${event.buttons}, acc: ${this.speedAccelerator}, brake: ${this.speedBrake}`);
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

    angle(ignoreKeys = false) {
        if (ignoreKeys || !this.turningWithKeysAngle) {
            const mousePosition = this.gameContext.renderer.plugins.interaction.mouse.global;
            const cursorDiffX = mousePosition.x - this.gameContext.middle.x;
            const cursorDiffY = mousePosition.y - this.gameContext.middle.y;
            let angle = -Math.atan2(cursorDiffX, cursorDiffY) + this.piHalf;
            if (angle < 0) {
                angle += this.piDouble;
            }
            return withinPiBounds(angle);
        } else {
            return this.turningWithKeysAngle;
        }
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
        const maxElapsedTime = Math.min(elapsedTime, 100);

        // shifting
        if (this.speed == 0.0 && this.direction == 0) {
            if (this.speedAccelerator) {
                this.direction = 1;
            } else if (this.speedBrake) {
                this.direction = -1;
            }
        }

        // friction
        if (!this.speedBrake && !this.speedAccelerator && this.speed != 0.0) {
            if (this.direction > 0) {
                this.speed = Math.max(0, this.speed - elapsedTime * 0.0005);
            } else {
                this.speed = Math.min(0, this.speed + elapsedTime * 0.0005);
            }
        }

        if (this.direction == 1) {
            if (this.speedAccelerator) {
                let accelerationTimeFrom0 = Math.pow(this.speed, 2) / this.baseSpeed;
                accelerationTimeFrom0 += maxElapsedTime / 1000;
                this.speed = Math.sqrt(accelerationTimeFrom0 * this.baseSpeed);
            }
            if (this.speedBrake) {
                const deceleration = 2.0 * this.baseSpeed * elapsedTime / 1000;
                this.speed = Math.max(0.0, this.speed - deceleration);
            }
        } else if (this.direction == -1) {
            if (this.speedBrake) {
                let accelerationTimeFrom0 = Math.pow(-this.speed, 2) / this.baseSpeedReverse;
                accelerationTimeFrom0 += maxElapsedTime / 1000;
                this.speed = -Math.sqrt(accelerationTimeFrom0 * this.baseSpeedReverse);
            }
            if (this.speedAccelerator) {
                const deceleration = 2.0 * -this.baseSpeed * elapsedTime / 1000;
                this.speed = Math.min(0.0, -this.speed - deceleration);
            }
        }

        // vehicle stop
        if (!this.speedBrake && !this.speedAccelerator && this.speed == 0.0 && this.direction != 0) {
            this.direction = 0;
        }
    }

    update(elapsedTime) {
        if (this.turningLeft || this.turningRight) {
            if (!this.turningWithKeysAngle) {
                this.turningWithKeysAngle = this.angle(true);
            }

            const turningAngle = (this.turningLeft ? -1 : 1) * elapsedTime * 0.06 * 0.02;
            this.turningWithKeysAngle += turningAngle;
            this.hideMouseCursor(true);
        }

        this.updateSpeed(elapsedTime);
    }
}

export default Controls