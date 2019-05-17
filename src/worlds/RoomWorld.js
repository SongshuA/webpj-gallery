const initCanvas = require('#/assets/textures/canvas/canvas-1.jpg');

const THREE = window.THREE;
const World = require('#/system/World');

//controls
const FirstPersonController = require('#/controls/FirstPersonController');

//environment
const SkyBox = require('#/environment/room/SkyBox');
const Floor = require('#/environment/room/Floor');
const Comment = require('#/environment/room/Comment');
const Canvas = require('#/environment/room/Canvas');

class RoomWorld extends World{
    constructor(){
        super();
        this.skyBox = new SkyBox();
        this.comments = [];
        this.floor = new Floor();
        this.canvas = null;
        this.controller = new FirstPersonController({
            horizontalSensitivity: 0.002,
            verticalSensitivity: 0.002,
            moveSpeed: 50.0,
            frictionFactor: 10.0,
            height: 10
        });

    }

    onCreate() {
        super.onCreate();
        this.use(this.skyBox);
        this.use(this.floor);
        this.canvas = this.setCanvas(initCanvas);

        this.use(this.canvas);

        const comment1 = new Comment("测试评论", 0, 10);
        this.comments.push(comment1);

        this.useAll(this.comments);
        this.use(this.controller);
        this.setCamera(this.controller.getCamera());
    }

    setCanvas(url) {
        return new Canvas(url);
    }

}

module.exports = RoomWorld;