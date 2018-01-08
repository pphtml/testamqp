var Container = PIXI.Container,
    autoDetectRenderer = PIXI.autoDetectRenderer,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    TextureCache = PIXI.utils.TextureCache,
    Texture = PIXI.Texture,
    Sprite = PIXI.Sprite,
    TilingSprite = PIXI.extras.TilingSprite,
    Graphics = PIXI.Graphics,
    DisplayList = PIXI.DisplayList,
    DisplayGroup = PIXI.DisplayGroup,
    Container = PIXI.Container;

// console.info(DisplayGroup);

var stage = new Container(),
    renderer = autoDetectRenderer(512, 512, {antialias: true, transparent: false, resolution: 1});
renderer.view.style.position = "absolute";
renderer.view.style.display = "block";
renderer.autoResize = true;
renderer.backgroundColor = 0x061639;
let width = window.innerWidth, height = window.innerHeight;
renderer.resize(width, height);

var infoDisplayed = true;

document.body.appendChild(renderer.view);

var mouseDown = 0;
document.body.onmousedown = function() {
    ++mouseDown;
};
document.body.onmouseup = function() {
    --mouseDown;
};
document.onkeydown = function (e) {
    e = e || window.event;

    //console.info(`keyCode=${e.keyCode}`);
    if (e.code == 'KeyI') {
        infoDisplayed = !infoDisplayed;
    }
};

loader
    .add("images/scene.json")
    .add("images/background.png")
    .load(setup);


function setup() {
    let world = {dimensions: {width: 512 * 32, height: 512 * 32}};
    var player = {coordinates: {x: world.dimensions.width / 2, y: world.dimensions.height / 2},
        head_sprite: new Sprite(resources["images/scene.json"].textures["cow_head.png"]),
        tail_sprite_factory: () => {
            let sprite = new Sprite(resources["images/scene.json"].textures["cow_tail.png"]);
            sprite.anchor.set(0.5, 0.5);
            sprite.scale.set(0.5, 0.5);
            // sprite.zOrder = zOrderBase;
            // sprite.zIndex = zOrderBase;
            return sprite;
        },
        tail_sprites: [],
        path: [],
        length: 32,
        //displayGroup: new DisplayGroup(2, true),
        container: new Container()
    };
    let scene_middle = {x: width / 2, y: height / 2};

    stage.displayList = new DisplayList();
    let headLayer = new DisplayGroup(2, false);
    let tailLayer = new DisplayGroup(1, true);

    var background = new TilingSprite(resources["images/background.png"].texture, width + 256, height + 256);
    background.x = 0;
    //background.tilePosition.set(50, 0);
    background.tileScale.set(0.5, 0.5);

    stage.addChild(background);

    /*player.spriteHead.x = scene_middle.x;
    player.spriteHead.y = scene_middle.y;*/
    player.head_sprite.anchor.set(0.5, 0.5);
    player.head_sprite.scale.set(0.5, 0.5);
    player.head_sprite.displayGroup = headLayer;

    player.container.addChild(player.head_sprite);
    player.container.x = scene_middle.x;
    player.container.y = scene_middle.y;
    stage.addChild(player.container);

    //let dot = new Sprite(resources["images/scene.json"].textures["cow_head.png"]);
    //let dot = new Sprite(resources["images/scene.json"].textures["dot.png"]);
    let dot = new Sprite(resources["images/scene.json"].textures["dot.png"]);
    dot.x = 80;
    dot.y = 150;
    dot.anchor.set(0.5, 0.5);
    dot.scale.set(0.2, 0.2);
    dot.tint = 0x66FF66;
    stage.addChild(dot);


    var message = new PIXI.Text(
        "Hello Pixi!",
        {fontFamily: "Arial", fontSize: 32, fill: "white"}
    );
    message.position.set(10, 10);
    stage.addChild(message);

    function gameLoop() {
        let mousePosition = renderer.plugins.interaction.mouse.global;
        let cursor_diff_x = mousePosition.x - scene_middle.x, cursor_diff_y = mousePosition.y - scene_middle.y;
        let angle = - (Math.atan2(cursor_diff_x, cursor_diff_y) - Math.PI / 2);

        let speed = mouseDown > 0 ? 2 : 1;

        let x_step = Math.cos(angle) * speed;
        let y_step = Math.sin(angle) * speed;

        player.coordinates.x += x_step;
        player.coordinates.y += y_step;

        // line.clear();
        // line.lineStyle(1, 0xFFFFFF, 1);
        // line.moveTo(scene_middle.x, scene_middle.y);
        // var time_x = scene_middle.x + Math.cos(angle) * scene_middle.y;
        // var time_y = scene_middle.y - Math.sin(angle) * scene_middle.y;
        // line.lineTo(time_x, time_y);

        player.head_sprite.rotation = angle;


        player.path.splice(0, 0, {x: x_step, y: y_step, speed: speed, angle: angle});
        player.path.splice(200, 200);

        var x = 0, y = 0, steps = 0, stepsTotal = 0, index_sprite = 0;
        _.forEach(player.path, (value) => {
            x -= value.x;
            y -= value.y;
            steps += value.speed;
            stepsTotal += value.speed;
            if (steps >= 20) {
                steps -= 20;
                if (stepsTotal <= 199) { // stop iteration
                    if (player.tail_sprites.length <= index_sprite) {
                        console.info('adding sprite');
                        let tail = player.tail_sprite_factory();
                        tail.x = x;
                        tail.y = y;
                        tail.zOrder = stepsTotal;
                        tail.rotation = value.angle;
                        tail.displayGroup = tailLayer;
                        player.tail_sprites.push(tail);
                        player.container.addChild(tail);
                    } else {
                        let tail = player.tail_sprites[index_sprite];
                        tail.x = x;
                        tail.y = y;
                        tail.rotation = value.angle;
                    }
                    index_sprite++;
                } else if (index_sprite < player.tail_sprites.length) {
                    console.info(`zbyvajici..., index_sprite: ${index_sprite}, tail_sprites: ${player.tail_sprites.length}`);
                    let forRemoval = player.tail_sprites.splice(index_sprite, 1000);
                    _.forEach(forRemoval, (sprite) => player.container.removeChild(sprite));
                }
            }
        });
        //console.info(steps);
        // sprite.x = scene_middle.x / 2;
        // sprite.y = scene_middle.y / 2;


        message.text = `coordinates: ${JSON.stringify(player.coordinates)}, md: ${mouseDown}, d: ${infoDisplayed}`;
        message.visible = infoDisplayed;
        //message.text = `x: ${mousePosition.x}, y: ${mousePosition.y}, angle: ${angle}`;

        background.x = -player.coordinates.x % 256;
        background.y = -player.coordinates.y % 256;

        renderer.render(stage);

        requestAnimationFrame(gameLoop);
    }

    gameLoop();
}
