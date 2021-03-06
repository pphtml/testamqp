import * as PIXI from 'pixi.js' // for pixi-display import
import 'pixi-display'
//import 'pixi-filters'
import { Container, autoDetectRenderer, CanvasRenderer, loader, DisplayList, DisplayGroup } from 'pixi.js'
import Player from './component/player'
import GameInfo from './component/gameInfo'
import Controls from './component/controls'
import Background from './component/background'
import NPCS from './component/npcs'
import Vehicles from './component/vehicles'
import Communication from "./component/communication"
import FeatureMatrix from './component/featureMatrix'

const featureMatrix = new FeatureMatrix();

/*let WebFontConfig = {
    custom: {
        families: ["Abel", "Lato"],
    },
    active: function() {
        // do something
        console.info('ABC');
        init();
    }
};*/

// (function() {
//     var wf = document.createElement('script');
//     wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
//         '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
//     wf.type = 'text/javascript';
//     wf.async = 'true';
//     var s = document.getElementsByTagName('script')[0];
//     s.parentNode.insertBefore(wf, s);
// })();

PIXI.utils.skipHello();
let stage = new Container();
let renderOptions = {antialias: false, transparent: false, resolution: 1};
let renderer;
if (!featureMatrix.webGl) {
    console.info(`Using canvas renderer...`);
    renderer = new CanvasRenderer(window.innerWidth, window.innerHeight, renderOptions);
} else {
    renderer = new autoDetectRenderer(window.innerWidth, window.innerHeight, renderOptions);
}
renderer.view.style.position = "absolute";
renderer.view.style.display = "block";
renderer.autoResize = true;

let gameContext = {
    stage: stage,
    renderer: renderer,
    middleCoordinates: function() {
        let x = this.middle.x - this.controls.coordinates.x;
        let y = this.middle.y - this.controls.coordinates.y;
        return {x: x, y: y};
    },
    featureMatrix
};

stage.displayList = new DisplayList(); // zOrder

document.body.appendChild(renderer.view);

loader
    .add('images/spritesheet.json')
    //.add('images/grass-tile.png')
    // .add('images/background-blur.png')
    // .add('images/truck-small.png')
    // .add('images/transp.png')
    // .add('images/road-line.png')
    //.add("images/background2.png")
    .load(setup);

function setup() {
    gameContext.communication = new Communication(gameContext);
    gameContext.controls = new Controls(gameContext);
    gameContext.controls.resizedHandler();
    let background = new Background(gameContext);
    gameContext.background = background;

    let player = new Player(gameContext);
    gameContext.player = player;

    // //stage.addChild(player.container);
    let npcs = new NPCS(gameContext);
    stage.addChild(npcs.container);
    let vehicles = new Vehicles(gameContext);
    stage.addChild(vehicles.container);

    let gameInfo = new GameInfo(gameContext, 10, 10);
    stage.addChild(gameInfo.container);

    // var numFramesToAverage = 16;
    // var frameTimeHistory = [];
    // var frameTimeIndex = 0;
    // var totalTimeForFrames = 0;
    let before = 0;
    function gameLoop(now) {
        let elapsedTime = (now - before);
        before = now;
        gameContext.controls.fpsSubject.next('a');

        let angle = gameContext.controls.angle();

        gameContext.controls.update(elapsedTime);
        vehicles.update(elapsedTime);
        player.update(angle, elapsedTime);
        gameInfo.update(angle);
        background.update();
        npcs.update();

        renderer.render(stage);

        requestAnimationFrame(gameLoop);
    }
    gameLoop(0);
}

