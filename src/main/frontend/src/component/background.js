import * as PIXI from 'pixi.js'
import 'pixi-display'
import { loader, Graphics } from 'pixi.js'
import layers from './layers'

let TilingSprite = PIXI.extras.TilingSprite,
    resources = loader.resources;

class Background {
    constructor(gameContext) {
        this.gameContext = gameContext;
        this.sprite = undefined;
        this.initSprite(this.gameContext.width, this.gameContext.height);
        // this.gameContext.communication.subject.filter(msg => msg.hasWorldinfo()).map(msg => msg.getWorldinfo()).subscribe(worldInfo => {
        //     let circle = new Graphics();
        //     circle.lineStyle(4, 0x006600, 1);
        //     circle.drawCircle(0, 0, worldInfo.getRadius());
        //     circle.endFill();
        //     circle.displayGroup = layers.borderLayer;
        //     this.circle = circle;
        //     this.gameContext.stage.addChild(this.circle);
        // });
    }

    initSprite(width, height) {
        let lastSprite = this.sprite;
        if (lastSprite) {
            //console.info('prekresleni velikosti');
            this.gameContext.stage.removeChild(lastSprite);
            this.sprite.width = width + 256;
            this.sprite.height = height + 256;
        } else {
            //this.sprite = new TilingSprite(resources["images/background-blur.png"].texture, width + 256, height + 256);
            this.sprite = new TilingSprite(resources['images/spritesheet.json'].textures['background-blur.png'], width + 256, height + 256);
            //this.sprite.tileScale.set(0.5, 0.5);
            //this.sprite.zOrder = -2000;
            //this.sprite.displayGroup = layers.backgroundLayer;

            // this.endOfWorldCircle = new Graphics();
            // this.endOfWorldCircle.lineStyle(4, 0x660000, 1);
            // this.endOfWorldCircle.arc(0, 0, 504, 0, Math.PI, false);
            // this.endOfWorldCircle.displayGroup = layers.borderLayer;
        }
        this.gameContext.stage.addChild(this.sprite);
    }

    update() {
        //let x = -Math.floor(this.gameContext.controls.coordinates.x) % 256;
        let x = -this.gameContext.controls.coordinates.x % 256;
        x = x <= 0 ? x : x - 256;
        //let y = -Math.floor(this.gameContext.controls.coordinates.y) % 256;
        let y = -this.gameContext.controls.coordinates.y % 256;
        y = y <= 0 ? y : y - 256;

        // if (this.circle) {
        //     this.circle.position.set(this.gameContext.middle.x - this.gameContext.controls.coordinates.x,
        //         this.gameContext.middle.y - this.gameContext.controls.coordinates.y);
        // }

        this.sprite.position.set(x, y);
    }
}

export default Background;