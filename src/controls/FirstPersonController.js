const Component = require('#/system/Component');
const THREE = window.THREE;
const config = require('#/config');

const PI_2 = Math.PI / 2;
const gravity = 9.8;

const KeyCodes = {
    W: 87,
    A: 65,
    S: 83,
    D: 68,
    E: 69,
    Q: 81,
    SPACE: 32
};

class FirstPersonController extends Component{
    constructor(){
        super();

        //是否激活控制（当用户按下 Esc 键时失去控制）
        this.active = false;

        //该组件是否被挂起
        this.suspended = false;

        //记录哪些键被按下
        this.keyState = {};

        //当前人物的移动速度
        this.velocity = new THREE.Vector3();

        //人物质量
        this.mass = 0.6;

        // 人物（摄影机）高度
        this.height = 6.0;

        // 摄像机
        const aspect = window.innerWidth / window.innerHeight;
        this._camera = new THREE.PerspectiveCamera(config.camera.fov, aspect, config.camera.near, config.camera.far);
    }

    onCreate(){
        this._camera.rotation.set( 0, 0, 0 );

        // 视角旋转（竖直方向）
        this.pitchObject = new THREE.Object3D();
        this.pitchObject.add( this._camera );
        // 摄影机高度
        this.pitchObject.position.y = this.height;

        //视角旋转（水平方向）
        this.yawObject = new THREE.Object3D();
        this.yawObject.add( this.pitchObject );
        
        //整个 Player 对象
        this.player = new THREE.Group();
        this.player.add(this.yawObject);
        //人物出生在空中
        this.player.position.y = 9;

        this.setObject(this.player);

        // 加载控制
        this.$dom.addEventListener('mousemove', this._onMouseMove.bind(this), false);
        document.addEventListener('keydown', this._onKeyDown.bind(this), false);
        document.addEventListener('keyup', this._onKeyUp.bind(this), false);
        this.setupPointerLockControls();
    }

    onSuspend() {
        super.onSuspend();
        this.active = false;
        this.keyState = {};
        document.exitPointerLock();
        this.suspended = true;
    }

    onAwake() {
        super.onAwake();
        this.suspended = false;
    }

    setupPointerLockControls(){
        // 开启鼠标指针锁定
        if(typeof this.$dom.requestPointerLock === 'function'){
            //按下鼠标左键时锁定
            this.$dom.addEventListener('click', () => {
                if(!this.suspended){
                    this.active = true;
                    this.$dom.requestPointerLock();
                    this.$ui.hide();
                }
            });

            //锁定时激活控制
            document.addEventListener('pointerlockchange', () => {
                if(document.pointerLockElement !== this.$dom){
                    this.active = false;
                    this.keyState = {};
                }
            })
        }
    }

    onRender(deltaTime){
        super.onRender(deltaTime);

        const inAir = this.inAir;

        //处理跳跃动作
        if(this.keyState[KeyCodes.SPACE] && !inAir){
            this.velocity.y = 1.2;
        }


        //处理在地面的移动方向
        let groundVelocity = new THREE.Vector3(this.velocity.x, 0, this.velocity.z);
        this.velocity.x = this.velocity.z = 0;

        // 判断 W, A, S, D 移动方向
        let direction = new THREE.Vector3();
        if(this.keyState[KeyCodes.W])
            direction.add(this.yawObject.forward());
        if(this.keyState[KeyCodes.A])
            direction.add(this.yawObject.left());
        if(this.keyState[KeyCodes.S])
            direction.add(this.yawObject.backward());
        if(this.keyState[KeyCodes.D])
            direction.add(this.yawObject.right());

        // 把方向乘以移动速度
        if(direction.length() > 0){
            groundVelocity.copy(direction.normalize().multiplyScalar(deltaTime * config.player.moveSpeed));
        }

        //处理水平方向的阻力
        if(groundVelocity.length() > 0)
            groundVelocity.lerp(new THREE.Vector3(), config.player.frictionFactor * this.mass * deltaTime);

        //处理竖直方向的重力
        if(inAir)
            this.velocity.y -= gravity * this.mass * deltaTime;

        if(this.player.position.y < 0){
            this.velocity.y = 0;
            this.player.position.y = 0;
        }

        //计算速度
        this.velocity.add(groundVelocity);

        if(this.velocity.length() > 0){
            this.player.position.add(this.velocity);
        }
    }

    getCamera() {
        return this._camera;
    }

// 判断人物是否在空中
    get inAir(){
        // return false;
        return this.player.position.y > 0;
    }

    _onMouseMove(event){
        if(this.active){
            let movementX = event.movementX || 0;
            let movementY = event.movementY || 0;

            this.yawObject.rotation.y -= movementX * config.player.horizontalSensitivity;
            this.pitchObject.rotation.x -= movementY * config.player.verticalSensitivity;

            this.pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, this.pitchObject.rotation.x ));
        }
    }

    _onKeyDown(event){
        if(this.active){
            this.keyState[event.keyCode] = true;
        }
    }

    _onKeyUp(event){
        if(this.active){
            const code = event.keyCode;
            this.keyState[code] = false;


            if(code === KeyCodes.E){
                this.$ui.show();
                this.active = false;
                document.exitPointerLock();

            }
        }
    }
}


module.exports = FirstPersonController;