require('../../../lib/threebsp');
const THREE = window.THREE;
const Component = require("#/system/Component");
const floorImg = require("#/assets/textures/room/room2.jpg");

const Floor = require('#/environment/hall/Floor');
const loader = new THREE.TextureLoader();
const texture = loader.load(floorImg);
texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
const Wall = require('#/environment/hall/Wall');
const Roof = require('#/environment/hall/Roof');
const DoorFrame = require('#/environment/hall/DoorFrame');
const Painting = require('#/environment/hall/Painting');
const PaintingFrame=require('#/environment/hall/PaintingFrame');

class RoomTwo extends Component {
    constructor() {
        super();
        let frontWall = new THREE.BoxGeometry(0, 0, 0);
        let materials = new THREE.MeshPhongMaterial({map: texture});
        let result1 = new THREE.Mesh(frontWall, materials);


        this.setObject(result1);
        this.wall1 = new Wall();
        this.wall2 = new Wall();
        this.wall3 = new Wall();
        this.wall4 = new Wall();

        this.roof = new Roof();

        this.doorFrame = new DoorFrame();
        this.paintings = [];
        this.paintingFrames = [];


        this.addRoof(materials);

        this.addWall(materials);

        this.addDoor(materials);

        this.addPainting();
    }

    addPainting(){
        let paints = [];
        let paintFrames=[];
        for (let i = 0; i < 11; i++) {
            this.paintings[i] = new Painting();
            paints[i] = this.paintings[i].getObject();
            this.paintingFrames[i]=new PaintingFrame();
            paintFrames[i]=this.paintingFrames[i].getObject();
        }
        paints[0].rotation.y=Math.PI/2;
        paints[0].translateX(120);
        paints[0].translateZ(-61);

        paints[1].rotation.y=Math.PI/2;
        paints[1].translateZ(-61);
        paints[1].translateX(80);

        paintFrames[0].rotation.y=Math.PI/2;
        paintFrames[0].translateX(120);
        paintFrames[0].translateZ(-61);

        paintFrames[1].rotation.y=Math.PI/2;
        paintFrames[1].translateZ(-61);
        paintFrames[1].translateX(80);
        

        for (let i = 2; i < 5; i++) {
            paints[i].translateX(-60 - 8.75 * (i - 1) - 15 * (i - 3 / 2));
            paints[i].translateZ(-61);
            paintFrames[i].translateX(-60 - 8.75 * (i - 1) - 15 * (i - 3 / 2));
            paintFrames[i].translateZ(-61);
        }
        for (let i = 5; i < 8; i++) {
            paints[i].rotation.y = Math.PI / 2;
            paints[i].translateZ(-139);
            paints[i].translateX(140-8.75*(i-4)-15*(i-9/2));

            paintFrames[i].rotation.y = Math.PI / 2;
            paintFrames[i].translateZ(-139);
            paintFrames[i].translateX(140-8.75*(i-4)-15*(i-9/2));
        }
        for (let i = 8; i < 11; i++) {
            paints[i].translateZ(-139);
            paints[i].translateX(-140 + 8.75 * (i - 7) + 15 * (i - 15 / 2));

            paintFrames[i].translateZ(-139);
            paintFrames[i].translateX(-140 + 8.75 * (i - 7) + 15 * (i - 15 / 2));
        }
        for (let i = 0; i < 11; i++) {
            this.paintings[i].setObject(paints[i]);
            this.paintingFrames[i].setObject(paintFrames[i]);
        }
    }

    addRoof(materials){
        let roof = this.roof.getObject();
        // roof.translate(100,100,50);
        roof.translateX(-100);
        roof.translateY(-100);
        roof.translateZ(-50);
        roof.material = materials;
        this.roof.setObject(roof);
    }


    addWall(materials) {
        let aa = this.wall1.getObject();
        aa.translateZ(-140);
        aa.translateX(-100);
        aa.material = materials;
        this.wall1.setObject(aa);

        let bb = this.wall2.getObject();
        bb.translateZ(-60);
        bb.translateX(-100);
        bb.material = materials;
        this.wall2.setObject(bb);

        let a = this.wall3.getObject();
        a.rotation.y = Math.PI / 2;
        a.translateX(100);
        a.translateZ(-140);
        a.material = materials;
        this.wall3.setObject(a);
    }

    addDoor(materials) {

        let b = this.wall4.getObject();
        b.rotation.y = Math.PI / 2;
        b.translateX(100);
        b.translateZ(-60);
        let door = new THREE.BoxGeometry(10, 20, 0);
        let doors = new THREE.Mesh(door);
        doors.rotation.y = Math.PI / 2;
        doors.translateZ(-60);
        doors.translateX(100);
        doors.translateY(10);
        let meshH4Door = new ThreeBSP(doors);
        let meshH4Wall = new ThreeBSP(b);
        let resultBSP = meshH4Wall.subtract(meshH4Door);
        b = resultBSP.toMesh();
        b.material = materials;

        let d = this.doorFrame.getObject();
        d.rotation.y = Math.PI / 2;
        d.translateX(100);
        d.translateZ(-60);
        this.doorFrame.setObject(d);

        this.wall4.setObject(b);


    }

    onCreate() {
        super.onCreate();
        this.use(this.wall1);
        this.use(this.wall2);
        this.use(this.wall3);
        this.use(this.wall4);
        this.use(this.roof);
        this.use(this.doorFrame);
        for (let i = 0; i < 11; i++) {
            this.use(this.paintings[i]);
            this.use(this.paintingFrames[i]);
        }
    }

}

module.exports = RoomTwo;