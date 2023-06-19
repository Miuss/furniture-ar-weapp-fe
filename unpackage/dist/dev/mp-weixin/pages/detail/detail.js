"use strict";
var common_vendor = require("../../common/vendor.js");
var api_furniture = require("../../api/furniture.js");
require("../../utils/fetch.js");
require("../../utils/index.js");
require("../../store/userStore.js");
require("../../api/user.js");
if (!Array) {
  const _component_van_icon = common_vendor.resolveComponent("van-icon");
  const _component_van_nav_bar = common_vendor.resolveComponent("van-nav-bar");
  (_component_van_icon + _component_van_nav_bar)();
}
if (!Math) {
  common_vendor.unref(ModelRender)();
}
const ModelRender = () => "../../components/ModelRender.js";
const _sfc_main = {
  props: {
    id: {
      type: String,
      default: ""
    }
  },
  setup(__props) {
    const props = __props;
    const material = common_vendor.ref(null);
    const data = common_vendor.ref(null);
    const fetchData = async () => {
      const res = await api_furniture.getFurnitureDetail({
        id: props.id
      });
      data.value = res.data;
      material.value = res.data.materials.rows[0];
    };
    const toBack = () => {
      wx.navigateBack();
    };
    const changeMaterial = (item) => {
      material.value = null;
      setTimeout(() => {
        material.value = item;
      }, 1);
    };
    common_vendor.onMounted(() => {
      fetchData();
    });
    console.log(props);
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          name: "arrow-left"
        }),
        b: common_vendor.t(data.value != null ? data.value.name : "\u661F\u7A9D"),
        c: common_vendor.o(toBack),
        d: common_vendor.s(_ctx.scrollTop < 140 ? "width: 100%;color: #fff;font-size: 20px;font-weight: 600;" : "width: 100%;color: #000;font-size: 20px;font-weight: 600;"),
        e: common_vendor.p({
          zIndex: 99,
          customStyle: _ctx.scrollTop < 140 ? "background: #ffffff00" : "background: #ffffff",
          fixed: false,
          border: false
        }),
        f: material.value != null
      }, material.value != null ? {
        g: common_vendor.p({
          material: material.value,
          modelUrl: material.value.modelUrl,
          modelScale: material.value.modelScale,
          modelY: material.value.modelY
        })
      } : {}, {
        h: material.value != null
      }, material.value != null ? {
        i: common_vendor.f(data.value.materials.rows, (item, index, i0) => {
          return {
            a: common_vendor.t(item.name),
            b: common_vendor.o(($event) => changeMaterial(item)),
            c: common_vendor.n(item.id == material.value.id ? "is-active" : "")
          };
        })
      } : {}, {
        j: data.value != null
      }, data.value != null ? common_vendor.e({
        k: material.value != null
      }, material.value != null ? {
        l: common_vendor.t(material.value.price)
      } : {}, {
        m: common_vendor.t(data.value.name),
        n: common_vendor.t(data.value.content),
        o: material.value != null
      }, material.value != null ? {
        p: common_vendor.t(material.value.content)
      } : {}) : {});
    };
  }
};
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "/Users/miuss/Documents/HBuilderProjects/furniture-ar-weapp-fe/pages/detail/detail.vue"]]);
wx.createPage(MiniProgramPage);
