import {Text, Graphics, Sprite, loader, BLEND_MODES, Container} from 'pixi.js'
import layers from './layers'
import FeatureMatrix from './featureMatrix'
import proto from '../proto/messages_pb'
let resources = loader.resources;

const INFO_BOX_WIDTH = 180;
const INFO_BOX_HEIGHT = 220;
const INFO_BOX_PADDING = 20;
const INFO_BOX_ROUNDING = 8;
const INFO_BOX_INNER_PADDING = 10;

const TOP_TEN_COUNT = 10;

class ScoreInfo {
    constructor(gameContext, parentContainer) {
        this.freshData = true;
        this.gameContext = gameContext;
        this.infoContainer = new Container();
        this.infoContainer.position.set(this.gameContext.width - INFO_BOX_PADDING - INFO_BOX_WIDTH, INFO_BOX_PADDING);
        //this.infoContainer.y = INFO_BOX_PADDING;

        this.rectangle = new Graphics();
        this.rectangle.beginFill(0x008000);
        this.rectangle.lineStyle(4, 0x008000, 1);
        this.rectangle.drawRoundedRect(0, 0, INFO_BOX_WIDTH, INFO_BOX_HEIGHT, INFO_BOX_ROUNDING);
        this.rectangle.endFill();
        this.rectangle.alpha = 0.1;
        this.rectangle.displayGroup = layers.infoLayer;
        this.infoContainer.addChild(this.rectangle);

        parentContainer.addChild(this.infoContainer);

        this.players = {};

        this.messagesId = [];
        this.messagesScore = [];

        for (let index = 0; index < TOP_TEN_COUNT; index++) {
            const messageId = new Text(`p${index}`, this.gameContext.featureMatrix.getFontOptions());
            messageId.position.set(INFO_BOX_INNER_PADDING, index * 20 + INFO_BOX_INNER_PADDING);
            messageId.displayGroup = layers.infoLayer;
            this.infoContainer.addChild(messageId);
            this.messagesId.push(messageId);

            const scoreFontOptions = JSON.parse(JSON.stringify(this.gameContext.featureMatrix.getFontOptions()));
            // scoreFontOptions['align'] = 'right';
            const messageScore = new Text(`s${index}`, scoreFontOptions);
            messageScore.position.set(INFO_BOX_WIDTH - INFO_BOX_INNER_PADDING, index * 20 + INFO_BOX_INNER_PADDING);
            messageScore.displayGroup = layers.infoLayer;
            messageScore.anchor.set(1, 0);
            this.infoContainer.addChild(messageScore);
            this.messagesScore.push(messageScore);
        }

        this.gameContext.controls.scoreUpdateSubject.subscribe(event => this.handleScoreUpdate(event));
    }

    handleScoreUpdate(event) {
        this.freshData = true;
        // {id: this.id, length: this.length, currentPlayer: true, type: 'new'}
        if (event.type == 'new' || event.type == 'update') {
            this.players[event.id] = {score: event.length, currentPlayer: event.currentPlayer == true};
            // console.info('new player');
            // console.info(event);
        }
    }

    update() {
        if (this.freshData) {
            const topTenList = this.getTopTenList();
            for (let index = 0; index < TOP_TEN_COUNT; index++) {
                const messageId = this.messagesId[index];
                const messageScore = this.messagesScore[index];
                if (index < topTenList.length) {
                    const topTenRecord = topTenList[index];
                    messageId.text = topTenRecord.id;
                    messageScore.text = topTenRecord.score;
                } else {
                    messageId.text = '-';
                    messageScore.text = '';
                }
            }
            this.freshData = false;
        }
    }

    getTopTenList() {
        const resultList = Object.entries(this.players).map(entry => {
            const [id, player] = entry;
            return {id, score: player.score, currentPlayer: player.currentPlayer};
        });
        return resultList;
    }

    resize() {
        this.infoContainer.position.set(this.gameContext.width - INFO_BOX_PADDING - INFO_BOX_WIDTH, INFO_BOX_PADDING);
    }
}

class GameInfo {
    constructor(gameContext, x, y) {
        this.gameContext = gameContext;
        this.container = new Container();

        this.gameContext.gameInfo = this;
        this.message = new Text("Hello Pixi!", this.gameContext.featureMatrix.getFontOptions());
        this.coordinates = {x: x, y: y};
        this.message.position.set(this.coordinates.x, this.coordinates.y);
        this.message.displayGroup = layers.npcLayer;
        this.infoDisplayed = false;
        this.container.addChild(this.message);

        // this.gameContext.controls.keyActions.subscribe(event => {
        //     if (event.type == 'keydown' && event.code == 'KeyI') {
        //         this.infoDisplayed = !this.infoDisplayed;
        //     }
        // });

        this.fps = 0;
        this.roundTrip = '?';
        //this.gameContext.controls.fpsSubject.bufferTime(1000).subscribe(samples => this.fps = samples.length);

        //this.scoreInfo = new ScoreInfo(gameContext, this.container);
    }

    update(angle) {
        this.message.text = `FPS: ${this.fps}, angle: ${angle.toFixed(2)}, coords: {x: ${this.gameContext.controls.coordinates.x.toFixed(2)}, y: ${this.gameContext.controls.coordinates.y.toFixed(2)} }, roundTrip: ${this.roundTrip}`;
        this.message.visible = this.infoDisplayed;

        //this.scoreInfo.update();
    }

    resize() {
        //this.scoreInfo.resize();
    }
}

export default GameInfo
