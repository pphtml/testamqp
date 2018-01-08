import * as PIXI from 'pixi.js' // for pixi-display import
import 'pixi-display'
import 'pixi-filters'
import { Container, autoDetectRenderer, CanvasRenderer, loader, DisplayList, DisplayGroup } from 'pixi.js'
import Player from './component/player'
import GameInfo from './component/gameInfo'
import Controls from './component/controls'
import Background from './component/background'
import NPCS from './component/npcs'
import Worms from './component/worms'
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

const COLORS = [894661, 15773325, 5698477, 10066394, 13414733, 12674379, 14893446, 10793534, 14813475, 8733555,
    11047750, 2009991, 16019053, 4033523, 14338485];
let color = COLORS[Math.floor(Math.random() * COLORS.length)];

PIXI.utils.skipHello();
let stage = new Container();
let renderOptions = {antialias: false, transparent: false, resolution: 1};
//let rendererFc = forceCanvas ? CanvasRenderer : autoDetectRenderer;
let renderer;
if (!featureMatrix.webGl) {
    console.info(`Using canvas renderer...`);
    renderer = new CanvasRenderer(256, 256, renderOptions);
} else {
    renderer = new autoDetectRenderer(256, 256, renderOptions);
}
renderer.view.style.position = "absolute";
renderer.view.style.display = "block";
renderer.autoResize = true;
renderer.backgroundColor = 0x061639;

let gameContext = {
    // width: window.innerWidth,
    // height: window.innerHeight,
    // middle: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
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
    //.add("images/sprites.json")
    .add('images/spritesheet.json')
    // .add("images/myfood.png")
    // .add("images/myfood-outer.png")
    // .add("images/tail-basic-white.png")
    // .add("images/tail-mod1-white.png")
    // .add("images/tail-mod2-white.png")
    // .add("images/eye.png")
    .load(setup);

function setup() {
    gameContext.communication = new Communication(gameContext);
    gameContext.controls = new Controls(gameContext);
    gameContext.controls.resizedHandler();
    let background = new Background(gameContext);
    gameContext.background = background;

    // let colorIndex = 0; //Math.floor(Math.random() * 10);
    // let color = ['ble', 'blue', 'darkblue', 'darkgreen', 'darkred', 'green', 'lime', 'orange', 'purple', 'yellow'][colorIndex];

    let player = new Player(gameContext, color);
    gameContext.player = player;

    //stage.addChild(player.container);
    let npcs = new NPCS(gameContext);
    stage.addChild(npcs.container);
    let worms = new Worms(gameContext);
    stage.addChild(worms.container);
    //worms.updateWorms({"HJlnnghGz":{"path":[{"x":29.85,"y":2.78,"r":0.11},{"x":9.9,"y":1.29,"r":0.07},{"x":-10.08,"y":0.53,"r":0.04},{"x":-30.08,"y":0.19,"r":0.02},{"x":-50.08,"y":0.07,"r":0.01},{"x":-70.08,"y":0.02,"r":0.0},{"x":-90.08,"y":0.01,"r":0.0},{"x":-110.08,"y":0.0,"r":0.0},{"x":-130.08,"y":0.0,"r":0.0},{"x":-150.08,"y":0.0,"r":0.0},{"x":-170.08,"y":0.0,"r":0.0},{"x":-190.08,"y":0.0,"r":0.0},{"x":-210.08,"y":0.0,"r":0.0},{"x":-230.08,"y":0.0,"r":0.0},{"x":-250.08,"y":0.0,"r":0.0}],"skin":"ble","rotation":0.0,"speed":0.05}});

    let gameInfo = new GameInfo(gameContext, 10, 10);
    stage.addChild(gameInfo.container);

    // var numFramesToAverage = 16;
    // var frameTimeHistory = [];
    // var frameTimeIndex = 0;
    // var totalTimeForFrames = 0;
    var before = Date.now();
    function gameLoop() {
        var now = Date.now();
        var elapsedTime = now - before;
        before = now;
        gameContext.controls.fpsSubject.next('a');

/*        totalTimeForFrames += elapsedTime - (frameTimeHistory[frameTimeIndex] || 0);
        frameTimeHistory[frameTimeIndex] = elapsedTime;
        frameTimeIndex = (frameTimeIndex + 1) % numFramesToAverage;
        var averageElapsedTime = totalTimeForFrames / numFramesToAverage;
        var fps = 1000 / averageElapsedTime;*/

        let angle = gameContext.controls.angle();

        player.update(angle, elapsedTime);
        gameInfo.update(angle);
        background.update();
        npcs.update();
        worms.update(elapsedTime);

        renderer.render(stage);

        requestAnimationFrame(gameLoop);
    }
    gameLoop();
}

