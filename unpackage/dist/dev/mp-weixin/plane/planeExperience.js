"use strict";
var common_vendor = require("../common/vendor.js");
var composables_useThree = require("../composables/useThree.js");
var gl_index = require("../gl/index.js");
const NEAR = 0.1;
const FAR = 1e3;
class PlaneExperience {
  constructor(canvas, loading, callback, errorCallback) {
    this.canvas = canvas;
    this.loading = loading;
    this.errorCallback = errorCallback;
    this.loadedModels = [];
    this.reticle = null;
    this.initTHREE();
    this.initVKSession();
    this.callback = callback;
  }
  initTHREE() {
    const {
      camera,
      scene,
      renderer,
      THREE,
      destroy
    } = composables_useThree.useThree(this.canvas);
    this.THREE = THREE;
    this.camera = camera;
    this.scene = scene;
    this.GL = new gl_index.GL(renderer);
    this.renderer = renderer;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = this.THREE.PCFSoftShadowMap;
    this.renderer.setClearAlpha(0);
    this.threeDestroy = function() {
      if (this.renderer) {
        this.renderer.dispose();
        this.renderer = null;
      }
      if (this.scene) {
        this.scene.dispose();
        this.scene = null;
      }
      if (this.mixers) {
        this.mixers.forEach((mixer) => mixer.uncacheRoot(mixer.getRoot()));
        this.mixers = null;
      }
      if (this.THREE)
        this.THREE = null;
      if (this.camera)
        this.camera = null;
      if (this.clock)
        this.clock = null;
      if (this.canvas)
        this.canvas = null;
      if (this.GL)
        this.GL = null;
      if (this.session)
        this.session = null;
    };
  }
  downloadModel(item) {
    const fs = wx.getFileSystemManager();
    return new Promise((resolve) => {
      const filePath = `${common_vendor.index.env.USER_DATA_PATH}/${item.modelMd5}.glb`;
      console.log(filePath);
      fs.getFileInfo({
        filePath,
        success: (res) => {
          const content = fs.readFileSync(filePath);
          console.log(content);
          resolve(content);
        },
        fail: (e) => {
          console.log(e);
          console.log(item.modelUrl);
          wx.downloadFile({
            url: item.modelUrl,
            success: (res) => {
              fs.saveFile({
                filePath,
                tempFilePath: res.tempFilePath,
                success: (data) => {
                  const content = fs.readFileSync(filePath);
                  console.log(content);
                  resolve(content);
                }
              });
            }
          });
        }
      });
    });
  }
  async initReticleAssetFiles() {
    const item = {
      id: "reticle",
      modelUrl: "https://miuss.icu/ar-furniture-assets/models/reticle.glb",
      modelMd5: "1111"
    };
    const modelPath = await this.downloadModel(item);
    const gltfLoader = new common_vendor.GLTFLoader();
    gltfLoader.parse(modelPath, `${item.modelMd5}.glb`, (gltf) => {
      const loadedModel = gltf;
      loadedModel.scene.traverse((child) => {
        if (child.material) {
          child.material.transparent = true;
          child.castShadow = true;
          child.material.depthTest = true;
          child.material.emissiveMap = child.material.map;
        }
      });
      this.reticle = loadedModel.scene;
      this.reticle.visible = false;
      this.scene.add(this.reticle);
    }, (error) => {
      console.log(error);
    });
  }
  async loadModel(modelInfo) {
    const item = modelInfo;
    const modelPath = await this.downloadModel(item);
    const gltfLoader = new common_vendor.GLTFLoader();
    return new Promise((resolve, reject) => {
      gltfLoader.parse(modelPath, `${item.modelMd5}.glb`, (gltf) => {
        const loadedModel = gltf;
        loadedModel.scene.traverse((child) => {
          if (child.material) {
            child.material.transparent = true;
            child.castShadow = true;
            child.material.depthTest = true;
            child.material.emissiveMap = child.material.map;
          }
        });
        resolve(loadedModel);
      }, (error) => {
        console.log(error);
        reject(error);
      });
    });
  }
  initVKSession(config) {
    const isSupportV2 = wx.isVKSupport("v2");
    this.session = wx.createVKSession({
      track: {
        plane: {
          mode: 3
        }
      },
      version: isSupportV2 ? "v2" : "v1",
      gl: this.GL.gl
    });
    this.initReticleAssetFiles();
    this.session.start((error) => {
      if (error)
        return console.error("VK error: ", error);
      console.log("VKSession.version", this.session.version);
      this.loading.value = 100;
      this.initLights();
      this.session.on("addAnchors", (anchors) => {
        anchors.forEach((anchor) => {
          anchor.size;
        });
      });
      this.clock = new this.THREE.Clock();
      const onFrame = (timestamp) => {
        const frame = this.session.getVKFrame(this.canvas.width, this.canvas.height);
        if (frame) {
          this.render(frame);
        }
        this.session.requestAnimationFrame(onFrame);
      };
      this.session.requestAnimationFrame(onFrame);
    });
  }
  render(frame) {
    this.GL.render(frame);
    const camera = frame.camera;
    this.GL.gl.enable(this.GL.gl.DEPTH_TEST);
    const reticle = this.reticle;
    if (reticle) {
      const hitTestRes = this.session.hitTest(0.5, 0.5);
      if (hitTestRes.length) {
        reticle.matrixAutoUpdate = false;
        reticle.matrix.fromArray(hitTestRes[0].transform);
        reticle.matrix.decompose(reticle.position, reticle.quaternion, reticle.scale);
        reticle.visible = true;
      } else {
        reticle.visible = false;
      }
    }
    const dt = this.clock.getDelta();
    if (this.mixers) {
      this.mixers.forEach((mixer) => mixer.update(dt));
    }
    if (camera) {
      this.camera.matrixAutoUpdate = false;
      this.camera.matrixWorldInverse.fromArray(camera.viewMatrix);
      this.camera.matrixWorld.copy(this.camera.matrixWorldInverse).invert();
      const projectionMatrix = camera.getProjectionMatrix(NEAR, FAR);
      this.camera.projectionMatrix.fromArray(projectionMatrix);
      this.camera.projectionMatrixInverse.copy(this.camera.projectionMatrix).invert();
    }
    this.renderer.autoClearColor = false;
    this.renderer.render(this.scene, this.camera);
    this.renderer.state.setCullFace(this.THREE.CullFaceNone);
  }
  initShadowPlane(object) {
    const planeMaterial = new this.THREE.ShadowMaterial();
    planeMaterial.opacity = 0.6;
    const plane = new this.THREE.Mesh(new this.THREE.PlaneGeometry(1e3, 1e3), planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    plane.position.set(0, 0, 0);
    plane.receiveShadow = true;
    object.add(plane);
  }
  addModel(object, model) {
    model.scene.scale.set(0.07, 0.07, 0.07);
    object.add(this.addAnimation(model));
  }
  addAnimation(model) {
    const mixer = new this.THREE.AnimationMixer(model.scene);
    if (model.animations.length > 0) {
      const clip = model.animations[0];
      const action = mixer.clipAction(clip);
      action.play();
    }
    this.mixers = this.mixers || [];
    this.mixers.push(mixer);
    model.scene._mixer = mixer;
    return model.scene;
  }
  initLights() {
    this.renderer.outputEncoding = this.THREE.sRGBEncoding;
    const pointLight = new this.THREE.PointLight(16777215, 0.9);
    pointLight.position.set(-8.272, 4.227, -2.468);
    this.scene.add(pointLight);
    const ambientLight = new this.THREE.AmbientLight(2500134, -1.26);
    this.scene.add(ambientLight);
    const hemiLight = new this.THREE.HemisphereLight(16119285, 16760658, 0.5);
    hemiLight.position.set(-4.082, -11.102, -9.873);
    this.scene.add(hemiLight);
  }
  async onTouchEnd(id, modelUrl, modelMd5, modelScale) {
    console.log("\u70B9\u51FB\u4E86\u5C4F\u5E55");
    if (this.scene && this.reticle) {
      const model = await this.loadModel({
        id,
        modelUrl,
        modelMd5
      });
      model.scene.position.copy(this.reticle.position);
      model.scene.rotation.copy(this.reticle.rotation);
      model.scene.scale.set(modelScale, modelScale, modelScale);
      this.addAnimation(model);
      this.scene.add(model.scene);
    }
  }
  removeVkSession() {
    this.session.stop();
  }
}
exports.PlaneExperience = PlaneExperience;
