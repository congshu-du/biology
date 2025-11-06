import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  { path: "/login", component: () => import("@/pages/Login.vue") },
  { path: "/register", component: () => import("@/pages/Register.vue") },
  {
    path: "/",
    component: () => import("@/layout/index.tsx"),
    children: [
      {
        path: "",
        component: () => import("@/pages/dashboard/Index"),
        meta: { title: "个人中心", icon: "user" },
      },
      {
        path: "alert",
        children: [
          { path: "", redirect: "/alert/list" },
          { path: "list", component: () => import("@/pages/alertList/List.page.tsx") },
          { path: "detail", component: () => import("@/pages/alertList/Detail.page.tsx") },
          {
            path: "international-detail",
            component: () => import("@/pages/alertList/InternationAlertDetail.page.tsx"),
          },
          { path: "playback", component: () => import("@/pages/alertList/Playback.page.tsx") },
        ],
      },
      {
        path: "as",
        component: () => import("@/pages/asOverview/Index.page.tsx"),
        children: [
          { path: "", redirect: "/as/base" },
          { path: "base", component: () => import("@/pages/asOverview/Base.page") },
          { path: "traffic", component: () => import("@/pages/asOverview/Traffic.page") },
          { path: "peer", component: () => import("@/pages/asOverview/Peer.page") },
          { path: "bgp", component: () => import("@/pages/asOverview/Bgp.page") },
          { path: "relationship", component: () => import("@/pages/asOverview/Relationship.page") },
          { path: "relationshipMap", component: () => import("@/pages/asOverview/RelationshipMap.page") },
          { path: "aspath", component: () => import("@/pages/asOverview/PathChart.page.tsx") },
        ],
      },
      {
        path: "dataPlatform",
        children: [
          { path: "", redirect: "/dataPlatform/bgp" },
          { path: "bgp", component: () => import("@/pages/dataPlatform/Bgp.page") },
          { path: "server", component: () => import("@/pages/dataPlatform/Server.page") },
          { path: "detection", component: () => import("@/pages/dataPlatform/Detection.page") },
        ],
      },

      // {
      //   path: "/routeData",
      //   children: [
      //     { path: "", redirect: "/routeData/data" },
      //     { path: "data", component: () => import("@/pages/routeData/Index.page.tsx") },
      //     { path: "malicious", component: () => import("@/pages/routeData/Malicious.page.tsx") },
      //     { path: "longshortmalicious", component: () => import("@/pages/routeData/Longshortmalicious.page.tsx") },
      //   ],
      // },
      // {
      //   path: "analysis",
      //   children: [
      //     { path: "", redirect: "/analysis/georel" },
      //     { path: "georel", component: () => import("@/pages/analysis/geoRel/Index.page") },
      //     { path: "spreadpath", component: () => import("@/pages/analysis/spreadPath/Index.page") },
      //     { path: "asconnection", component: () => import("@/pages/analysis/asConnection/Index.page") },
      //     { path: "ipaddrspace", component: () => import("@/pages/analysis/ipAddrspace/Index.page") },
      //     { path: "pcp", component: () => import("@/pages/analysis/pcp/Index.page") },
      //     { path: "aspath", component: () => import("@/pages/analysis/PathChart.page.tsx") },
      //   ],
      // },
      // {
      //   path: "resources",
      //   // component: () => import("@/pages/resoucre/ResourceIndex.vue"),
      //   children: [
      //     { path: "", redirect: "/resources/bgp" },
      //     { path: "bgp", component: () => import("@/pages/resources/bgpList/Index.page.tsx") },
      //     { path: "roa", component: () => import("@/pages/resources/roaList/Index.page.tsx") },
      //     { path: "prefix", component: () => import("@/pages/resources/prefixList/Index.page.tsx") },
      //   ],
      // },
      // {
      //   path: "/interconnection",
      //   component: () => import("@/pages/interconnection/Index.page.tsx"),
      // },
      {
        path: "/digital-twin",
        component: () => import("@/pages/twin/Index.page"),
      },
      {
        path: "/setting",
        children: [
          { path: "", redirect: "/setting/probe" },
          { path: "probe", component: () => import("@/pages/setting/probe/Index.page") },
          { path: "probe/setup", component: () => import("@/pages/setting/probe/Setup.page") },
          { path: "probe/detail", component: () => import("@/pages/setting/probe/Detail.page") },
          { path: "detectionSource", component: () => import("@/pages/setting/detectionSource/Index.page") },
          { path: "whitelist", component: () => import("@/pages/setting/White/Index.page") },
        ],
      },
    ],
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
