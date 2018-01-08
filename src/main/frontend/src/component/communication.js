import rx from 'rxjs'
import shortid from 'shortid';

// import { QueueingSubject } from 'queueing-subject'
// import websocketConnect from 'rxjs-websockets'

class Communication {
    constructor(gameContext) {
        this.gameContext = gameContext;
        //this.input = new QueueingSubject();
        this.commId = shortid.generate();

        let originalUrlChunk = /http(s?:\/\/.*?\/)/g.exec(window.location.href)[1];
        let wsUrl = `ws${originalUrlChunk}dot?id=${this.commId}`;
        // console.info(wsUrl);
        // debugger;
        // let zz = rx;
        // let z1 = rx.Observable;
        // let z2 = rx.Observable.webSocket;
        // this.subject = rx.Observable.webSocket(wsUrl);
        this.subject = rx.Observable.webSocket({url: wsUrl, binaryType: 'arraybuffer'});
        this.subject.resultSelector = e => {
            const message = proto.Message.deserializeBinary(e.data);
            return message;
        };
        //this.subject = new rx.Subject(); // DUMMY TODO vyhodit


        // this.socket = new WebSocket(wsUrl);
        // //this.socket.binaryType = 'blob';
        // this.socket.binaryType = "arraybuffer";
        // this.socket.onopen = function() {
        //     //send(ctx);
        //     console.info('on open');
        // }
        // this.socket.onmessage = function(msg){
        //     console.info('on message');
        //     //var bytes = Array.prototype.slice.call(msg.data, 0);
        //     //var message = proto.Message.decode(msg.data);
        //     //debugger;
        //     let message = proto.Message.deserializeBinary(msg.data);
        //     let worldInfo = message.getWorldinfo();
        //     console.log(message);
        //     debugger;
        // };


        // subject.subscribe(
        //     (msg) => console.log('message received: ' + JSON.stringify(msg)),
        //     (err) => console.log(err),
        //     () => console.log('complete')
        // );

        //this.subject.next(JSON.stringify({ op: 'hello' }));


        // const { messages, connectionStatus } = websocketConnect(wsUrl, this.input);
        // this.input.next('ahoj abc 123');

        // let keyDowns = rx.Observable.fromEvent(document, 'keydown');
        // let keyUps = rx.Observable.fromEvent(document, 'keyup');
        // this.keyActions = rx.Observable.merge(keyDowns, keyUps);
    }
}

export default Communication