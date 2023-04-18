"use strict";
var common_vendor = require("../common/vendor.js");
function useThree(canvas) {
  const platform = new common_vendor.WechatPlatform(canvas);
  platform.enableDeviceOrientation("game");
  common_vendor.PLATFORM.set(platform);
  const renderer = new common_vendor.WebGL1Renderer({
    canvas,
    antialias: true,
    alpha: true
  });
  renderer.gammaFactor = 2.2;
  const camera = new common_vendor.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1e3);
  const scene = new common_vendor.Scene();
  function destroy() {
    scene.dispose();
    renderer.dispose();
    this.disposing = true;
    PLATFORM.dispose();
  }
  return {
    THREE: common_vendor.THREE,
    renderer,
    camera,
    scene,
    destroy
  };
}
exports.useThree = useThree;
