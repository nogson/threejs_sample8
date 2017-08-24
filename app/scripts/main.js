(() => {

    window.addEventListener('load', () => {

        // 汎用変数の宣言
        let width = window.innerWidth; // ブラウザのクライアント領域の幅
        let height = window.innerHeight; // ブラウザのクライアント領域の高さ
        let targetDOM = document.getElementById('webgl'); // スクリーンとして使う DOM

        // three.js 定義されているオブジェクトに関連した変数を宣言
        let scene; // シーン
        let camera; // カメラ
        let renderer; // レンダラ
        let axis; //ガイド
        let grid; //ガイド
        let directional;
        let ambient;


        // 各種パラメータを設定するために定数オブジェクトを定義
        let CAMERA_PARAMETER = { // カメラに関するパラメータ
            fovy: 90,
            aspect: width / height,
            near: 0.1,
            far: 100.0,
            x: 0.0, // + 右 , - 左
            y: 2, // + 上, - 下
            z: 8.5, // + 手前, - 奥
            lookAt: new THREE.Vector3(0.0, 0.0, 0.0) //x,y,z
        };
        let RENDERER_PARAMETER = { // レンダラに関するパラメータ
            clearColor: 0x000000, //背景のリセットに使う色
            width: width,
            height: height
        };

        let LIGHT_PARAMETER = {
            directional: {
                positionX: 10,
                positionY: 4,
                positionZ: 3
            },
            ambient: {
                positionY: 1
            }
        };

        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(
            CAMERA_PARAMETER.fovy,
            CAMERA_PARAMETER.aspect,
            CAMERA_PARAMETER.near,
            CAMERA_PARAMETER.far
        );

        camera.position.x = CAMERA_PARAMETER.x;
        camera.position.y = CAMERA_PARAMETER.y;
        camera.position.z = CAMERA_PARAMETER.z;
        camera.lookAt(CAMERA_PARAMETER.lookAt); //注視点（どこをみてるの？）

        renderer = new THREE.WebGLRenderer();
        renderer.setClearColor(new THREE.Color(RENDERER_PARAMETER.clearColor));
        renderer.setPixelRatio(window.devicePixelRatio); //Retina対応
        renderer.setSize(RENDERER_PARAMETER.width, RENDERER_PARAMETER.height);

        targetDOM.appendChild(renderer.domElement); //canvasを挿入する

        let controls = new THREE.OrbitControls(camera, render.domElement);

        //ライト
        directional = new THREE.DirectionalLight(0xffffff);
        ambient = new THREE.AmbientLight(0xffffff, 0.25);

        directional.castShadow = true;

        directional.position.y = LIGHT_PARAMETER.directional.positionY;
        directional.position.z = LIGHT_PARAMETER.directional.positionZ;
        directional.position.x = LIGHT_PARAMETER.directional.positionX;
        ambient.position.y = LIGHT_PARAMETER.ambient.positionY;

        directional.castShadow = true;
        directional.shadow.mapSize.width = 800;
        directional.shadow.mapSize.height = 800;
        scene.add(directional);
        scene.add(ambient);

        //GPUParticleSystemクラスを作成
        let particleSystem = new THREE.GPUParticleSystem({
            //パーティクル数をコンストラクタに渡す
            maxParticles: 300000
        });
        scene.add(particleSystem);

        //オプションを設定
        let options = {
            position: new THREE.Vector3(),
            positionRandomness: 2,
            velocity: new THREE.Vector3(),
            velocityRandomness: 6,
            color: 0xFFFFFF,
            colorRandomness: 0.2,
            turbulence: 0.5,
            lifetime: 5,
            size: 6,
            sizeRandomness: 1,
            containerCount: 1,
            smoothPosition: false

        };

        let clock = new THREE.Clock();

        //パーティクルの周りに飛ぶキラキラの数？
        let spawnRate = 20000;
        //横方向のスピード
        let horizontalSpeed = 0.1;
        //縦方向のスピード
        let verticalSpeed = 0.1;
        //加算値
        let tick = 0;

        render();


        //描画
        function render() {

            // rendering
            renderer.render(scene, camera);

            let delta = clock.getDelta();

            tick += delta;

            if (tick < 0) {
                tick = 0;
            }

            //前フレームからの間隔が0以上の場合のみ実行
            if (delta > 0) {
                options.position.x = -5;
                options.position.y = 8;
                options.position.z = Math.sin(tick * horizontalSpeed + verticalSpeed) * 5;
                for (var x = 0; x < spawnRate * delta; x++) {
                    //キラキラを描画
                    particleSystem.spawnParticle(options);
                }
            }

            particleSystem.update(tick);

            // animation
            requestAnimationFrame(render);
        }



    }, false);
})();