import rx from 'rxjs'
const withinPiBounds = require('./wormMovement').withinPiBounds;

class Controls {
    constructor(gameContext) {
        this.gameContext = gameContext;
        this.mouseDown = false;
        /*document.body.onmousedown = () => this.mouseDown++;
        document.body.onmouseup = () => this.mouseDown--;*/
        this.coordinates = {x: 0.0, y: 0.0};
        this.skin = 'SET ME UP!';

        let mouseDowns = rx.Observable.fromEvent(document, 'mousedown');
        let mouseUps = rx.Observable.fromEvent(document, 'mouseup');
        this.mouseActions = rx.Observable.merge(mouseDowns, mouseUps);

        let keyDowns = rx.Observable.fromEvent(document, 'keydown');
        let keyUps = rx.Observable.fromEvent(document, 'keyup');
        this.keyActions = rx.Observable.merge(keyDowns, keyUps);
        this.piHalf = Math.PI / 2;
        this.piDouble = Math.PI * 2;

        let resizeStream = rx.Observable.fromEvent(window, 'resize');
        rx.Observable.merge(resizeStream.debounceTime(500), resizeStream.throttleTime(500)).distinct().subscribe(event => { this.resizedHandler(); });
        //.debounceTime(1000).subscribe(event => { this.resizedHandler(); });

        this.fpsSubject = new rx.Subject();
        this.scoreUpdateSubject = new rx.Subject();

        // TODO mozna pridat filter
        this.gameContext.communication.subject.subscribe(msg => {
            if (msg.hasClientdisconnect()) {
                console.info('vyhodit hada z top ten');

                this.scoreUpdateSubject.next({id: msg.getClientdisconnect().getId(), type: 'remove'});
            }
            if (msg.hasPlayerresp()) {
                this.handlePlayerResp(msg.getPlayerresp());
            }
        });

        this.mouseActions.subscribe(event => {
            //console.info(event);
            this.mouseDown = event.buttons > 0;
        });
    }

    resizedHandler() {
        //console.info('resized handler');
        this.gameContext.width = window.innerWidth;
        this.gameContext.height = window.innerHeight;
        this.gameContext.middle = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
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

        // var message2 = MyMessage.deserializeBinary(bytes);
        //
        // this.gameContext.communication.subject.next(JSON.stringify({ resize:
        //     {width: this.gameContext.width, height: this.gameContext.height}}));
    }

    isMouseDown() {
        return this.mouseDown;
    }

    angle() {
        let mousePosition = this.gameContext.renderer.plugins.interaction.mouse.global;
        let cursor_diff_x = mousePosition.x - this.gameContext.middle.x;
        let cursor_diff_y = mousePosition.y - this.gameContext.middle.y;
        var angle = -Math.atan2(cursor_diff_x, cursor_diff_y) + this.piHalf;
        if (angle < 0) {
            angle += this.piDouble;
        }
        return withinPiBounds(angle);
    }

    // static computeAllowedAngle(askedAngle, lastAngle, time, gameContext, baseSpeed, speed) {
    //     let allowedDiff = Math.PI / 4200 * time * speed / baseSpeed;
    //     let lower = lastAngle - allowedDiff;
    //     let upper = lastAngle + allowedDiff;
    //     //console.info(lower, upper, askedAngle);
    //     let asked2 = askedAngle - Math.PI * 2;
    //     let asked3 = askedAngle + Math.PI * 2;
    //     //gameContext.gameInfo.message.text = `lower: ${lower.toFixed(2)}, upper: ${upper.toFixed(2)}, asked: ${askedAngle.toFixed(2)}, a2: ${asked2.toFixed(2)}, a3: ${asked3.toFixed(2)}`;
    //     if ((lower <= askedAngle && upper >= askedAngle) || (lower <= asked2 && upper >= asked2) || (lower <= asked3 && upper >= asked3)) {
    //         return askedAngle;
    //     } else {
    //         let fromLower = Math.min(Math.abs(lower - askedAngle), Math.abs(lower - asked2), Math.abs(lower - asked3));
    //         let fromUpper = Math.min(Math.abs(upper - askedAngle), Math.abs(upper - asked2), Math.abs(upper - asked3))
    //         //gameContext.gameInfo.message.text = `fromLower: ${fromLower.toFixed(2)}, fromUpper: ${fromUpper.toFixed(2)}`;
    //         if (fromLower < fromUpper) {
    //             return Controls.withinPiBounds(lower);
    //         } else {
    //             return Controls.withinPiBounds(upper);
    //         }
    //     }
    //     // let lower = Controls.withinPiBounds(lastAngle - allowedDiff);
    //     // let upper = Controls.withinPiBounds(lastAngle + allowedDiff);
    //     // if (lower < upper) {
    //     //     if (lower <= askedAngle && upper >= askedAngle) {
    //     //         return askedAngle;
    //     //     } else {
    //     //
    //     //     }
    //     // } else {
    //     //
    //     // }
    // }
    //
    // static withinPiBounds(angle) {
    //     // while (angle < 0.0) {
    //     //     angle += Math.PI * 2;
    //     // }
    //     // return angle % Math.PI * 2;
    //     return angle < 0.0 ? angle + Math.PI * 2 :   // TODO pouzij konstantu
    //         angle >= Math.PI * 2 ? angle - Math.PI * 2 : angle;
    //
    // }

    handlePlayerResp(playerResp) {
        this.coordinates = {x: playerResp.getX(), y: playerResp.getY()};

        const roundTrip = Date.now() - playerResp.getTimeinfo().getInitiated();
        this.gameContext.gameInfo.roundTrip = roundTrip;
    }
}

export default Controls