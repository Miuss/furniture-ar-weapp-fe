"use strict";
var common_vendor = require("../common/vendor.js");
var imgLoading = "/assets/images/loading.svg";
const _sfc_main = {
  props: {
    modelUrl: {
      type: String,
      default: ""
    },
    modelScale: {
      type: Number,
      default: 1
    },
    modelY: {
      type: Number,
      default: 1
    },
    material: {
      type: Object,
      default: null
    }
  },
  setup(__props) {
    const props = __props;
    const instance = common_vendor.getCurrentInstance();
    const loading = common_vendor.ref(true);
    let platformInfo = common_vendor.reactive(null);
    const frameId = common_vendor.ref(null);
    const disposing = common_vendor.ref(null);
    const info = wx.getSystemInfoSync();
    info.windowWidth;
    info.windowHeight;
    common_vendor.onMounted(() => {
      wx.createSelectorQuery().in(instance).select("#gl-model").node().exec(async (res) => {
        console.log(res);
        const canvas = res[0].node;
        platformInfo = new common_vendor.WechatPlatform(canvas);
        common_vendor.PLATFORM.set(platformInfo);
        const renderer = new common_vendor.WebGL1Renderer({
          canvas,
          antialias: true,
          alpha: true
        });
        const camera = new common_vendor.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1e3);
        const scene = new common_vendor.Scene();
        new common_vendor.GLTFLoader();
        const controls = new common_vendor.OrbitControls(camera, canvas);
        controls.enableDamping = true;
        controls.autoRotate = true;
        controls.minPolarAngle = 0;
        controls.maxPolarAngle = 1.5;
        const downloadModel = (item) => {
          const fs = wx.getFileSystemManager();
          return new Promise((resolve) => {
            const filePath = `${common_vendor.index.env.USER_DATA_PATH}/${item.md5}.glb`;
            console.log(filePath);
            fs.getFileInfo({
              filePath,
              success: (res2) => {
                const content = fs.readFileSync(filePath);
                console.log(content);
                resolve(content);
              },
              fail: (e) => {
                console.log(e);
                console.log(item.modelUrl);
                wx.downloadFile({
                  url: item.modelUrl,
                  success: (res2) => {
                    fs.saveFile({
                      filePath,
                      tempFilePath: res2.tempFilePath,
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
        };
        const loadModel = async (modelInfo) => {
          const item = modelInfo;
          const modelPath = await downloadModel(item);
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
        };
        const model = await loadModel(props.material);
        loading.value = false;
        model.parser = null;
        model.scene.scale.set(props.material.modelScale, props.material.modelScale, props.material.modelScale);
        model.scene.position.set(0, 0, 0);
        model.scene.position.y = props.material.modelY;
        scene.add(model.scene);
        const planeMaterial = new common_vendor.ShadowMaterial();
        planeMaterial.opacity = 0.3;
        const plane = new common_vendor.Mesh(new common_vendor.PlaneGeometry(1e3, 1e3), planeMaterial);
        plane.rotation.x = -Math.PI / 2;
        plane.position.set(0, 0, 0);
        plane.receiveShadow = true;
        scene.add(plane);
        camera.position.z = 10;
        renderer.outputEncoding = common_vendor.sRGBEncoding;
        scene.add(new common_vendor.AmbientLight(16777215, 0.2));
        scene.add(new common_vendor.DirectionalLight(16777215, 0.2));
        const pointLight = new common_vendor.PointLight(16777215, 0.9);
        pointLight.position.set(-8.272, 4.227, -2.468);
        scene.add(pointLight);
        renderer.setSize(canvas.width, canvas.height);
        renderer.setPixelRatio(common_vendor.$window.devicePixelRatio);
        const render = () => {
          if (!disposing.value)
            frameId.value = common_vendor.$requestAnimationFrame(render);
          controls.update();
          renderer.render(scene, camera);
        };
        render();
      });
    });
    common_vendor.onUnmounted(() => {
      console.log("\u5378\u8F7D\u573A\u666F");
      disposing.value = true;
      common_vendor.$cancelAnimationFrame(frameId.value);
      common_vendor.PLATFORM.dispose();
    });
    const onTX = (e) => {
      platformInfo.dispatchTouchEvent(e);
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: loading.value
      }, loading.value ? {
        b: common_vendor.unref(imgLoading)
      } : {}, {
        c: common_vendor.o(onTX),
        d: common_vendor.o(onTX),
        e: common_vendor.o(onTX)
      });
    };
  }
};
var Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "/Users/miuss/Documents/HBuilderProjects/furniture-ar-weapp-fe/components/ModelRender.vue"]]);
wx.createComponent(Component);
