"use strict";
var common_vendor = require("../../../../common/vendor.js");
var api_furniture = require("../../../../api/furniture.js");
require("../../../../utils/fetch.js");
require("../../../../utils/index.js");
require("../../../../store/userStore.js");
require("../../../../api/user.js");
if (!Array) {
  const _component_van_nav_bar = common_vendor.resolveComponent("van-nav-bar");
  const _component_van_col = common_vendor.resolveComponent("van-col");
  const _component_van_loading = common_vendor.resolveComponent("van-loading");
  const _component_van_row = common_vendor.resolveComponent("van-row");
  (_component_van_nav_bar + _component_van_col + _component_van_loading + _component_van_row)();
}
const _sfc_main = {
  setup(__props) {
    const loading = common_vendor.ref(true);
    const covers = common_vendor.ref([{
      id: 1,
      url: "https://mp-content.store-companion.ikea.cn/static/design-wrd-banner-pc-1.jpg"
    }, {
      id: 2,
      url: "https://mp-content.store-companion.ikea.cn/static/design-wrd-banner-pc-2.jpg"
    }, {
      id: 3,
      url: "https://mp-content.store-companion.ikea.cn/static/design-wrd-banner-pc-3.jpg"
    }]);
    const scrollTop = common_vendor.ref(0);
    const list = common_vendor.ref([]);
    const fetchData = async () => {
      loading.value = true;
      try {
        const res = await api_furniture.getFurnitureList({
          pageIndex: 0,
          pageSize: 100
        });
        list.value = res.data.rows;
      } catch (e) {
        console.error(e);
      } finally {
        loading.value = false;
      }
    };
    common_vendor.onMounted(() => {
      fetchData();
    });
    const toDetailPage = (item) => {
      wx.vibrateShort();
      wx.navigateTo({
        url: "/pages/detail/detail?id=" + item.id
      });
    };
    const onPageScroll = (e) => {
      scrollTop.value = e.detail.scrollTop;
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.s(scrollTop.value < 140 ? "width: 100%;color: #fff;font-size: 20px;font-weight: 600;" : "width: 100%;color: #000;font-size: 20px;font-weight: 600;"),
        b: common_vendor.p({
          zIndex: 99,
          customStyle: scrollTop.value < 140 ? "background: #ffffff00" : "background: #ffffff",
          fixed: true,
          border: false
        }),
        c: common_vendor.f(covers.value, (item, index, i0) => {
          return {
            a: item.url,
            b: index
          };
        }),
        d: common_vendor.f(list.value, (item, index, i0) => {
          return {
            a: item.coverUrl,
            b: common_vendor.t(item.name),
            c: common_vendor.o(($event) => toDetailPage(item)),
            d: index,
            e: "1d2acd94-2-" + i0 + ",1d2acd94-1"
          };
        }),
        e: common_vendor.p({
          span: "12"
        }),
        f: loading.value
      }, loading.value ? {
        g: common_vendor.p({
          type: "spinner"
        })
      } : {}, {
        h: common_vendor.p({
          span: "24"
        }),
        i: common_vendor.p({
          gutter: "12"
        }),
        j: common_vendor.o(onPageScroll)
      });
    };
  }
};
var Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "/Users/miuss/Documents/HBuilderProjects/furniture-ar-weapp-fe/pages/index/basic/home/home.vue"]]);
wx.createComponent(Component);
