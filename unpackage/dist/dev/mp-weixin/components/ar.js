"use strict";
var common_vendor = require("../common/vendor.js");
var plane_planeExperience = require("../plane/planeExperience.js");
var store_userStore = require("../store/userStore.js");
var api_furniture = require("../api/furniture.js");
require("../composables/useThree.js");
require("../gl/index.js");
require("../api/user.js");
require("../utils/fetch.js");
require("../utils/index.js");
const _sfc_main = {
  setup(__props) {
    const instance = common_vendor.getCurrentInstance();
    common_vendor.ref(null);
    const info = wx.getSystemInfoSync();
    const cw = info.windowWidth;
    const ch = info.windowHeight;
    const safeArea = info.safeArea;
    const pixelRatio = info.pixelRatio;
    const exprience = common_vendor.ref(null);
    const loading = common_vendor.ref(0);
    store_userStore.useUserStore();
    const activeItem = common_vendor.ref(null);
    const hideList = common_vendor.ref(true);
    const furnitureList = common_vendor.ref([]);
    const fetchData = async () => {
      const res = await api_furniture.getFurnitureList({
        pageIndex: 0,
        pageSize: 1e3
      });
      furnitureList.value = res.data.rows;
      activeItem.value = res.data.rows[0];
    };
    const selectFurniture = (item) => {
      activeItem.value = item;
      hideList.value = true;
    };
    const showFurnitureList = () => {
      hideList.value = false;
    };
    common_vendor.onMounted(() => {
      fetchData();
      wx.createSelectorQuery().in(instance).select("#webgl").node().exec((res) => {
        console.log(res);
        const canvas = res[0].node;
        console.log(cw * pixelRatio, ch * pixelRatio);
        canvas.width = cw * pixelRatio / 2;
        canvas.height = ch * pixelRatio / 2;
        exprience.value = new plane_planeExperience.PlaneExperience(canvas, loading);
        console.log(res, "canvas123");
      });
    });
    const onTouchEnd = (e) => {
      console.log(e);
      const x = e.changedTouches[0].clientX;
      const y = e.changedTouches[0].clientY;
      const safeAreaBottom = ch - safeArea.bottom;
      console.log(x, y);
      console.log("\u70B9\u51FB\u5566");
      if (y <= ch - safeAreaBottom && y >= ch - safeAreaBottom - 58 && x <= cw - 16 && x >= 16) {
        return;
      }
      const model = activeItem.value.materials.rows[0];
      console.log(model);
      exprience.value.onTouchEnd(model.id, model.modelUrl, model.md5, model.modelArScale);
    };
    common_vendor.onUnmounted(() => {
      exprience.value.removeVkSession();
      exprience.value.threeDestroy();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: loading.value < 100
      }, loading.value < 100 ? {} : {}, {
        b: common_vendor.o(onTouchEnd),
        c: common_vendor.o(($event) => showFurnitureList()),
        d: common_vendor.f(furnitureList.value, (item, index, i0) => {
          return common_vendor.e({
            a: item.coverUrl
          }, activeItem.value != null ? {
            b: common_vendor.n(item.id == activeItem.value.id ? "active" : "")
          } : {}, {
            c: index,
            d: common_vendor.o(($event) => selectFurniture(item))
          });
        }),
        e: activeItem.value != null,
        f: common_vendor.n(hideList.value ? "furniture-menu-active" : ""),
        g: common_vendor.unref(cw) + "px",
        h: common_vendor.unref(ch) + "px"
      });
    };
  }
};
var Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "/Users/miuss/Documents/HBuilderProjects/furniture-ar-weapp-fe/components/ar.vue"]]);
wx.createComponent(Component);
