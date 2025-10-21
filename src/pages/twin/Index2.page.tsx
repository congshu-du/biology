import { defineComponent, ref, onMounted, onBeforeUnmount } from "vue";
import cytoscape, { Core } from "cytoscape";

interface Node {
  id: string;
  label: string;
  type: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
}

interface Edge {
  from: string;
  to: string;
  style?: "normal" | "dashed" | "attack" | "monitor";
}

const NetworkTopology = defineComponent(() => {
  const containerRef = ref<HTMLDivElement>();
  const cytoscapeInstance = ref<Core>();
  const selectedNode = ref<string>("");
  const hoveredNode = ref<string>("");

  // 重新设计的节点布局 - 更加对称和美观
  const nodes: Node[] = [
    // 左上角 - 真实科研用户区域

    { id: "emergency-clients", label: "科研用户", type: "emergency", x: 100, y: 100 },
    { id: "githuber", label: "某研究所", type: "research-user", x: 300, y: 100 },

    // 顶部服务层 - 均匀分布
    // { id: "startups", label: "Startups", type: "service", x: 450, y: 100 },
    // { id: "esnet", label: "Esnet", type: "service", x: 550, y: 100 },
    // { id: "internet2", label: "Internet2", type: "service", x: 650, y: 100 },
    // { id: "ibanet", label: "IBANET", type: "service", x: 750, y: 100 },
    // { id: "shbasnet", label: "SHBASNET", type: "service", x: 850, y: 100 },
    // { id: "japan", label: "日本APAN", type: "service", x: 950, y: 100 },
    // { id: "kis-host", label: "KIS-HOST", type: "service", x: 950, y: 200 },

    // 骨干网节点 - 更加对称和均匀分布
    // 上面
    { id: "ne-13", label: "新疆", type: "device", x: 200, y: 200 },
    { id: "ne-14", label: "院内汇聚1", type: "device", x: 300, y: 200 },
    { id: "ne-15", label: "中关村", type: "device", x: 400, y: 200 },
    { id: "ne-16", label: "怀柔", type: "device", x: 500, y: 200 },
    { id: "ne-17", label: "RR2", type: "device", x: 600, y: 200 },
    { id: "ne-20", label: "国际5", type: "device", x: 700, y: 200 },
    { id: "ne-21", label: "国际4", type: "device", x: 800, y: 200 },
    { id: "ne-22", label: "国际3", type: "device", x: 900, y: 200 },
    // 左边
    { id: "ne-1", label: "成都", type: "device", x: 100, y: 200 },
    { id: "ne-2", label: "合肥", type: "device", x: 100, y: 300 },
    { id: "ne-3", label: "南京", type: "device", x: 100, y: 400 },
    { id: "ne-4", label: "国家应急服务系统", type: "device", x: 100, y: 500 },
    { id: "ne-5", label: "沈阳", type: "device", x: 100, y: 600 },
    { id: "ne-6", label: "长春", type: "device", x: 100, y: 700 },
    { id: "ne-7", label: "武汉", type: "device", x: 100, y: 800 },
    // 底下一排
    { id: "ne-8", label: "西安", type: "device", x: 200, y: 800 },
    { id: "ne-9", label: "兰州", type: "device", x: 300, y: 800 },
    { id: "ne-10", label: "广州", type: "device", x: 400, y: 800 },
    { id: "ne-11", label: "昆明", type: "device", x: 500, y: 800 },
    { id: "ne-12", label: "RR1", type: "device", x: 600, y: 800 },

    // 中间一排
    { id: "ne-23", label: "地区分中心汇聚1", type: "device", x: 300, y: 300 },
    { id: "ne-24", label: "院内汇聚2", type: "device", x: 300, y: 400 },
    { id: "ne-25", label: "信息化大厦", type: "device", x: 300, y: 500 },
    { id: "ne-26", label: "院外汇聚", type: "device", x: 300, y: 600 },
    { id: "ne-27", label: "地区分中心汇聚2", type: "device", x: 300, y: 700 },

    // 中间二排
    { id: "ne-28", label: "核心201", type: "device", x: 600, y: 400 },
    { id: "ne-29", label: "核心200", type: "device", x: 600, y: 600 },

    // 右边
    { id: "ne-30", label: "国际2", type: "device", x: 900, y: 300 },
    { id: "ne-31", label: "国际1", type: "device", x: 900, y: 400 },
    { id: "ne-32", label: "Monitor", type: "monitor", x: 900, y: 500 },
    { id: "ne-33", label: "国内", type: "device", x: 900, y: 600 },

    // 外边
    { id: "ne-34", label: "StartLight", type: "system", x: 600, y: 100 },
    { id: "ne-35", label: "Esnet", type: "system", x: 700, y: 100 },
    { id: "ne-36", label: "Internet2", type: "system", x: 800, y: 100 },
    { id: "ne-37", label: "澳AANET", type: "system", x: 900, y: 100 },
    { id: "ne-38", label: "台湾APAN", type: "system", x: 1000, y: 100 },
    { id: "ne-39", label: "日本APAN", type: "system", x: 1100, y: 100 },
    { id: "ne-40", label: "韩国KISTI", type: "system", x: 1100, y: 200 },
    { id: "ne-41", label: "HKIX", type: "system", x: 1100, y: 300 },
    { id: "ne-42", label: "GEANT", type: "system", x: 1100, y: 400 },
    { id: "ne-43", label: "RRC", type: "system", x: 1100, y: 500 },
    { id: "ne-44", label: "电信", type: "system", x: 1100, y: 600 },
    { id: "ne-45", label: "联通", type: "system", x: 1100, y: 700 },
    { id: "ne-46", label: "移动", type: "system", x: 1100, y: 800 },
    { id: "ne-47", label: "Cernet", type: "system", x: 1000, y: 800 },

    // other
    { id: "ne-48", label: "EBI", type: "system", x: 1200, y: 500 },
    { id: "ne-49", label: "NCBI", type: "system", x: 1300, y: 500 },
    { id: "ne-50", label: "ME", type: "system", x: 1300, y: 400 },
    { id: "ne-51", label: "HE", type: "attacker", x: 1300, y: 300 },
    { id: "ne-52", label: "HOST", type: "device", x: 1300, y: 200 },
    // { id: "ne-34", label: "地区分中心汇聚2", type: "device", x: 900, y: 700 },
    // { id: "ne-30", label: "信息化大厦", type: "device", x: 300, y: 500 },
    // { id: "ne-31", label: "院外汇聚", type: "device", x: 300, y: 600 },
    // { id: "ne-32", label: "地区分中心汇聚2", type: "device", x: 300, y: 700 },

    // // 第2列
    // { id: "core1", label: "院内汇聚1", type: "router", x: 450, y: 300 },
    // { id: "router-2-2", label: "地区\n边界1", type: "router", x: 450, y: 370 },
    // { id: "ne-2-3", label: "NE", type: "device", x: 450, y: 440 },
    // { id: "spine-left", label: "骨架", type: "router", x: 450, y: 510 },
    // { id: "ne-2-5", label: "NE", type: "device", x: 450, y: 580 },
    // { id: "router-2-6", label: "地区\n边界2", type: "router", x: 450, y: 650 },
    // { id: "ne-2-7", label: "NE", type: "device", x: 450, y: 720 },

    // // 第3列
    // { id: "spine1", label: "骨架1", type: "router", x: 550, y: 300 },
    // { id: "ne-3-2", label: "NE", type: "device", x: 550, y: 370 },
    // { id: "ne-3-3", label: "NE", type: "device", x: 550, y: 440 },
    // { id: "access-center", label: "接入", type: "device", x: 550, y: 510 },
    // { id: "ne-3-5", label: "NE", type: "device", x: 550, y: 580 },
    // { id: "ne-3-6", label: "NE", type: "device", x: 550, y: 650 },
    // { id: "ne-3-7", label: "NE", type: "device", x: 550, y: 720 },
    // { id: "ne-3-8", label: "NE", type: "device", x: 550, y: 790 },

    // // 第4列
    // { id: "ne1", label: "NE1", type: "device", x: 650, y: 230 },
    // { id: "ne2", label: "NE2", type: "device", x: 650, y: 300 },
    // { id: "ne-4-3", label: "NE", type: "device", x: 650, y: 370 },
    // { id: "bj-g201", label: "核心201", type: "router", x: 650, y: 440 },
    // { id: "ne-4-5", label: "NE", type: "device", x: 650, y: 510 },
    // { id: "bj-g200", label: "核心200", type: "router", x: 650, y: 580 },
    // { id: "ne-4-7", label: "NE", type: "device", x: 650, y: 650 },
    // { id: "ne-4-8", label: "NE", type: "device", x: 650, y: 790 },

    // // 第5列
    // { id: "border-5-1", label: "国际1", type: "device", x: 750, y: 300 },
    // { id: "border-5-2", label: "国际2", type: "device", x: 750, y: 370 },
    // { id: "border-5-3", label: "国际3", type: "device", x: 750, y: 440 },
    // { id: "border-5-4", label: "国际4", type: "device", x: 750, y: 510 },
    // { id: "ne-5-5", label: "NE", type: "device", x: 750, y: 580 },
    // { id: "re1", label: "RE1", type: "device", x: 750, y: 790 },

    // // 底部 Cernet
    // { id: "cernetdix", label: "CernetDix", type: "service", x: 650, y: 870 },
    // { id: "cernet", label: "Cernet", type: "service", x: 750, y: 870 },

    // // Monitor区域 - 骨干网右侧
    // { id: "monitor", label: "Monitor", type: "monitor", x: 880, y: 510 },
    // { id: "switch1", label: "交换1", type: "switch", x: 820, y: 620 },
    // { id: "switch2", label: "交换2", type: "switch", x: 940, y: 620 },

    // // 右侧系统区域 - 垂直排列
    // { id: "lscu", label: "LSCU", type: "system", x: 1080, y: 250 },
    // { id: "ner", label: "NER", type: "system", x: 1080, y: 340 },
    // { id: "google1", label: "Google", type: "service", x: 1180, y: 250 },
    // { id: "google2", label: "Google", type: "service", x: 1180, y: 340 },
    // { id: "pccw", label: "PCCW", type: "service", x: 1280, y: 340 },
    // { id: "ggant", label: "GGANT", type: "service", x: 1280, y: 430 },

    // // 攻击者
    // { id: "attacker-he", label: "HE\n攻击者", type: "attacker", x: 1180, y: 450 },

    // // NCBI和监测系统 - 右下区域
    // { id: "bbc", label: "BBC", type: "system", x: 1080, y: 540 },
    // { id: "ncbi-system", label: "NCBI\n真实系统", type: "real-system", x: 1180, y: 600, width: 100, height: 60 },
    // { id: "edi", label: "EDI", type: "system", x: 1280, y: 600 },
    // {
    //   id: "monitoring-system",
    //   label: "路由断网\n监测预警系统",
    //   type: "monitoring",
    //   x: 1180,
    //   y: 750,
    //   width: 130,
    //   height: 70,
    // },
  ];

  // 连接关系 - 简化和优化
  // const edges: Edge[] = [
  //   // GitHuber连接
  //   { from: "githuber", to: "emergency-clients" },
  //   { from: "githuber", to: "core1" },

  //   // 骨干网内部垂直连接
  //   { from: "ne-1-1", to: "ne-1-2" },
  //   { from: "ne-1-2", to: "ne-1-3" },
  //   { from: "ne-1-3", to: "router-1-4" },
  //   { from: "router-1-4", to: "ne-1-5" },
  //   { from: "ne-1-5", to: "ne-1-6" },
  //   { from: "ne-1-6", to: "ne-1-7" },
  //   { from: "ne-1-7", to: "ne-1-8" },

  //   { from: "core1", to: "router-2-2" },
  //   { from: "router-2-2", to: "ne-2-3" },
  //   { from: "ne-2-3", to: "spine-left" },
  //   { from: "spine-left", to: "ne-2-5" },
  //   { from: "ne-2-5", to: "router-2-6" },
  //   { from: "router-2-6", to: "ne-2-7" },

  //   { from: "spine1", to: "ne-3-2" },
  //   { from: "ne-3-2", to: "ne-3-3" },
  //   { from: "ne-3-3", to: "access-center" },
  //   { from: "access-center", to: "ne-3-5" },
  //   { from: "ne-3-5", to: "ne-3-6" },
  //   { from: "ne-3-6", to: "ne-3-7" },
  //   { from: "ne-3-7", to: "ne-3-8" },

  //   { from: "ne1", to: "ne2" },
  //   { from: "ne2", to: "ne-4-3" },
  //   { from: "ne-4-3", to: "bj-g201" },
  //   { from: "bj-g201", to: "ne-4-5" },
  //   { from: "ne-4-5", to: "bj-g200" },
  //   { from: "bj-g200", to: "ne-4-7" },
  //   { from: "ne-4-7", to: "ne-4-8" },

  //   { from: "border-5-1", to: "border-5-2" },
  //   { from: "border-5-2", to: "border-5-3" },
  //   { from: "border-5-3", to: "border-5-4" },
  //   { from: "border-5-4", to: "ne-5-5" },
  //   { from: "ne-4-8", to: "re1" },
  //   { from: "re1", to: "cernet" },
  //   { from: "cernet", to: "cernetdix" },

  //   // 横向连接
  //   { from: "core1", to: "spine1" },
  //   { from: "router-2-2", to: "ne-3-2" },
  //   { from: "ne-1-3", to: "ne-2-3" },
  //   { from: "router-1-4", to: "spine-left" },
  //   { from: "spine-left", to: "access-center" },
  //   { from: "ne-1-6", to: "router-2-6" },
  //   { from: "spine1", to: "ne2" },
  //   { from: "ne-3-3", to: "ne-4-3" },
  //   { from: "access-center", to: "bj-g201" },
  //   { from: "ne-3-5", to: "ne-4-5" },
  //   { from: "ne-2-5", to: "ne-3-5" },
  //   { from: "router-2-6", to: "ne-3-6" },
  //   { from: "ne-3-7", to: "ne-4-7" },
  //   { from: "ne-3-8", to: "ne-4-8" },
  //   { from: "ne2", to: "border-5-1" },
  //   { from: "border-5-1", to: "ne-4-3" },

  //   // 连接到顶部服务
  //   { from: "spine1", to: "startups" },
  //   { from: "ne1", to: "esnet" },
  //   { from: "border-5-1", to: "internet2" },
  //   { from: "border-5-2", to: "ibanet" },
  //   { from: "border-5-3", to: "shbasnet" },
  //   { from: "border-5-4", to: "japan" },
  //   { from: "border-5-4", to: "kis-host" },

  //   // Monitor区域
  //   { from: "bj-g201", to: "monitor" },
  //   { from: "monitor", to: "switch1" },
  //   { from: "monitor", to: "switch2" },

  //   // 右侧系统连接
  //   { from: "kis-host", to: "lscu" },
  //   { from: "lscu", to: "ner" },
  //   { from: "lscu", to: "google1" },
  //   { from: "ner", to: "google2" },
  //   { from: "google1", to: "google2" },
  //   { from: "google2", to: "pccw" },
  //   { from: "pccw", to: "ggant" },

  //   // 攻击路径
  //   { from: "ner", to: "attacker-he", style: "dashed" },
  //   { from: "attacker-he", to: "bbc" },
  //   { from: "attacker-he", to: "ncbi-system", style: "attack" },
  //   { from: "bbc", to: "edi" },
  //   { from: "edi", to: "ncbi-system" },

  //   // 监测系统
  //   { from: "switch2", to: "monitoring-system", style: "monitor" },
  //   { from: "ncbi-system", to: "monitoring-system", style: "monitor" },
  // ];

  // http://192.168.200.80:8080/

  const edges: Edge[] = [
    { from: "emergency-clients", to: "githuber" },
    { from: "githuber", to: "ne-14" },
    { from: "ne-1", to: "ne-23" }, // 成都到地区分中心汇聚1
    { from: "ne-2", to: "ne-23" }, // 合肥到地区分中心汇聚1
    { from: "ne-1", to: "ne-23" }, // 成都到地区分中心汇聚1（重复，若需去重可移除）
    { from: "ne-13", to: "ne-23" }, // 新疆到地区分中心汇聚1
    { from: "ne-3", to: "ne-23" }, // 南京到地区分中心汇聚1

    { from: "ne-4", to: "ne-25" }, // 国家应急服务系统到信息化大厦
    { from: "ne-5", to: "ne-27" }, // 沈阳到地区分中心汇聚2
    { from: "ne-5", to: "ne-27" }, // 长春，武汉，西安，兰州，广州，昆明到地区分中心汇聚2
    { from: "ne-6", to: "ne-27" },
    { from: "ne-7", to: "ne-27" },
    { from: "ne-8", to: "ne-27" },
    { from: "ne-9", to: "ne-27" },
    { from: "ne-10", to: "ne-27" },
    { from: "ne-11", to: "ne-27" },
    //院内汇聚1到 核心200和核心201
    { from: "ne-14", to: "ne-28" },
    { from: "ne-14", to: "ne-29" },
    //怀柔到中关村
    { from: "ne-16", to: "ne-15" },
    //院内汇聚1，中关村，地区分中心汇聚1，院内汇聚2，信息化大厦，院外汇聚，地区分中心汇聚2分别到核心201，核心200
    // { from: "ne-14", to: "ne-15" },
    // { from: "ne-15", to: "ne-23" },
    { from: "ne-23", to: "ne-24" },
    { from: "ne-24", to: "ne-25" },
    { from: "ne-25", to: "ne-26" },
    { from: "ne-26", to: "ne-27" },
    { from: "ne-24", to: "ne-28" },
    { from: "ne-25", to: "ne-28" },
    { from: "ne-26", to: "ne-29" },
    { from: "ne-27", to: "ne-29" },
    // 地区分中心汇聚1 到 核心201和核心200
    { from: "ne-23", to: "ne-28" },
    { from: "ne-23", to: "ne-29" },
    // 中关村到核心201和核心200
    { from: "ne-15", to: "ne-28" },
    { from: "ne-15", to: "ne-29" },
    // 院内汇聚2到核心201和核心200
    { from: "ne-24", to: "ne-28" },
    { from: "ne-24", to: "ne-29" },
    // 信息化大厦到核心201和核心200
    { from: "ne-25", to: "ne-28" },
    { from: "ne-25", to: "ne-29" },
    // 院外汇聚到核心201和核心200
    { from: "ne-26", to: "ne-28" },
    { from: "ne-26", to: "ne-29" },
    // 地区分中心汇聚2到核心201和核心200
    { from: "ne-27", to: "ne-28" },
    { from: "ne-27", to: "ne-29" },
    // RR1到核心200
    { from: "ne-12", to: "ne-29" },
    // RR2到核心201
    { from: "ne-17", to: "ne-28" },
    // 核心200到201
    { from: "ne-29", to: "ne-28" },

    { from: "ne-28", to: "ne-31" },
    { from: "ne-28", to: "ne-33" },
    { from: "ne-29", to: "ne-31" },
    { from: "ne-29", to: "ne-33" },
    { from: "ne-29", to: "ne-32" },
    // 核心201到Monitor
    { from: "ne-28", to: "ne-32" },
    // StartLight, Esnet, Internet2 到国际5
    { from: "ne-34", to: "ne-20" },
    { from: "ne-35", to: "ne-20" },
    { from: "ne-36", to: "ne-20" },
    // Esnet, Internet2, 澳AANET 到国际4
    { from: "ne-35", to: "ne-21" },
    { from: "ne-36", to: "ne-21" },
    { from: "ne-37", to: "ne-21" },
    //台湾APAN, 日本APAN，韩国APAN 到国际3
    { from: "ne-38", to: "ne-22" },
    { from: "ne-39", to: "ne-22" },
    { from: "ne-40", to: "ne-22" },
    // HKIX 到国际2
    { from: "ne-41", to: "ne-30" },
    // 国际5到国际4，国际4到国际3，国际3到国际2，国际2到国际1
    { from: "ne-20", to: "ne-21" },
    { from: "ne-21", to: "ne-22" },
    { from: "ne-22", to: "ne-30" },
    { from: "ne-30", to: "ne-31" },
    { from: "ne-31", to: "ne-33" },
    { from: "ne-33", to: "ne-32" },
    // 国际1到geant
    { from: "ne-31", to: "ne-42" },
    // 电信，联通，移动到国内
    { from: "ne-44", to: "ne-33" },
    { from: "ne-45", to: "ne-33" },
    { from: "ne-46", to: "ne-33" },
    // Cernet到国内
    { from: "ne-47", to: "ne-33" },
    // monitor 到 RRC
    { from: "ne-32", to: "ne-43" },
    // ME到EBI和NCBI
    { from: "ne-50", to: "ne-48" },
    { from: "ne-50", to: "ne-49" },
    // HE攻击者到HOST
    { from: "ne-51", to: "ne-52" },
    // ME到HE
    { from: "ne-50", to: "ne-51" },
    // GEANT 到 Me
    { from: "ne-42", to: "ne-50" },
    // HKIX D到 HE
    { from: "ne-41", to: "ne-51" },
  ];

  const initCytoscape = () => {
    if (!containerRef.value) return;

    // 准备 Cytoscape 数据
    const cytoscapeNodes = nodes.map((node) => {
      console.log("Node data:", node); // 调试输出
      return {
        data: {
          id: node.id,
          label: node.label, // 确保label字段存在
          type: node.type,
        },
        position: { x: node.x, y: node.y },
      };
    });

    const cytoscapeEdges = edges.map((edge) => ({
      data: {
        id: `${edge.from}-${edge.to}`,
        source: edge.from,
        target: edge.to,
        style: edge.style,
      },
      classes: edge.style || "normal",
    }));

    // 创建 Cytoscape 实例
    console.log("Creating Cytoscape instance with", cytoscapeNodes.length, "nodes and", cytoscapeEdges.length, "edges");
    cytoscapeInstance.value = cytoscape({
      container: containerRef.value,
      elements: [...cytoscapeNodes, ...cytoscapeEdges],
      style: [
        // 默认节点样式
        {
          selector: "node",
          style: {
            "background-color": "#5a6c7d",
            "border-color": "#2c3e50",
            "border-width": 2,
            "text-valign": "center",
            "text-halign": "center",
            color: "#ffffff",
            "font-size": 10,
            "font-weight": "bold",
            width: 60,
            height: 40,
            shape: "round-rectangle",
            label: "data(label)",
          },
        },
        // 节点悬停样式
        {
          selector: "node:hover",
          style: {
            "border-color": "#95a5a6",
            "border-width": 3,
          },
        },
        // 节点选中样式
        {
          selector: "node:selected",
          style: {
            "border-color": "#f1c40f",
            "border-width": 4,
          },
        },
        // 不同类型节点的样式 - 设置不同大小以适应文字
        {
          selector: 'node[type="research-user"]',
          style: {
            "background-color": "#e74c3c",
            shape: "round-rectangle",
            width: 80,
            height: 50,
            "font-size": 11,
            label: "data(label)",
          },
        },
        {
          selector: 'node[type="emergency"]',
          style: {
            "background-color": "#3498db",
            shape: "round-rectangle",
            width: 110,
            height: 60,
            "font-size": 11,
            label: "data(label)",
          },
        },
        {
          selector: 'node[type="router"]',
          style: {
            "background-color": "#34495e",
            shape: "round-rectangle",
            width: 50,
            height: 35,
            "font-size": 9,
            label: "data(label)",
          },
        },
        {
          selector: 'node[type="device"]',
          style: {
            "background-color": "#5a6c7d",
            // shape: "round-rectangle",
            width: 50,
            height: 50,
            "font-size": 9,
            label: "data(label)",
          },
        },
        {
          selector: 'node[type="service"]',
          style: {
            "background-color": "#16a085",
            shape: "round-rectangle",
            width: 60,
            height: 35,
            "font-size": 9,
            label: "data(label)",
          },
        },
        {
          selector: 'node[type="monitor"]',
          style: {
            "background-color": "#e74c3c",
            shape: "round-rectangle",
            width: 70,
            height: 45,
            "font-size": 10,
            label: "data(label)",
          },
        },
        {
          selector: 'node[type="switch"]',
          style: {
            "background-color": "#f39c12",
            shape: "round-rectangle",
            width: 50,
            height: 35,
            "font-size": 9,
            label: "data(label)",
          },
        },
        {
          selector: 'node[type="system"]',
          style: {
            "background-color": "#2ecc71",
            shape: "round-rectangle",
            width: 60,
            height: 35,
            "font-size": 9,
            label: "data(label)",
          },
        },
        {
          selector: 'node[type="attacker"]',
          style: {
            "background-color": "#e74c3c",
            shape: "round-rectangle",
            width: 70,
            height: 50,
            "font-size": 10,
            label: "data(label)",
          },
        },
        {
          selector: 'node[type="real-system"]',
          style: {
            "background-color": "#e74c3c",
            shape: "round-rectangle",
            width: 100,
            height: 60,
            "font-size": 10,
            label: "data(label)",
          },
        },
        {
          selector: 'node[type="monitoring"]',
          style: {
            "background-color": "#3498db",
            shape: "round-rectangle",
            width: 130,
            height: 70,
            "font-size": 9,
            label: "data(label)",
          },
        },
        // 默认边样式
        {
          selector: "edge",
          style: {
            width: 2,
            "line-color": "#7f8c8d",
            "target-arrow-color": "#7f8c8d",
            "target-arrow-shape": "triangle",
            "curve-style": "straight",
            opacity: 0.6,
          },
        },
        // 边悬停样式
        {
          selector: "edge:hover",
          style: {
            width: 3,
            opacity: 0.8,
          },
        },
        // 不同类型边的样式
        {
          selector: "edge.attack",
          style: {
            width: 4,
            "line-color": "#e74c3c",
            "target-arrow-color": "#e74c3c",
          },
        },
        {
          selector: "edge.monitor",
          style: {
            width: 3,
            "line-color": "#e74c3c",
            "target-arrow-color": "#e74c3c",
            "line-dash-pattern": [5, 5],
          },
        },
        {
          selector: "edge.dashed",
          style: {
            width: 2,
            "line-color": "#f39c12",
            "target-arrow-color": "#f39c12",
            "line-dash-pattern": [5, 5],
          },
        },
      ],
      layout: {
        name: "preset",
        fit: true,
        padding: 50,
        animate: false,
      },
      zoom: 1,
      pan: { x: 0, y: 0 },
      minZoom: 0.1,
      maxZoom: 3,
      wheelSensitivity: 0.2,
      boxSelectionEnabled: false,
      autoungrabify: true,
      autounselectify: false,
    });

    // 事件处理
    cytoscapeInstance.value.on("tap", "node", (event) => {
      const node = event.target;
      console.log("Node clicked:", node.id(), "Label:", node.data("label"));
      selectedNode.value = node.id();
    });

    cytoscapeInstance.value.on("mouseover", "node", (event) => {
      const node = event.target;
      hoveredNode.value = node.id();
    });

    cytoscapeInstance.value.on("mouseout", "node", () => {
      hoveredNode.value = "";
    });

    cytoscapeInstance.value.on("tap", (event) => {
      if (event.target === cytoscapeInstance.value) {
        selectedNode.value = "";
      }
    });

    // 调试：检查Cytoscape实例
    console.log("Cytoscape instance created:", cytoscapeInstance.value);
    console.log(
      "All nodes:",
      cytoscapeInstance.value.nodes().map((n) => ({ id: n.id(), label: n.data("label") })),
    );

    // 添加骨干网框
    // addBackboneBox();
  };

  // 自动居中函数
  const centerGraph = () => {
    if (cytoscapeInstance.value) {
      // 使用Cytoscape的fit方法自动居中
      cytoscapeInstance.value.fit(undefined, 60);
    }
  };

  onMounted(() => {
    initCytoscape();

    // 初始化后居中
    setTimeout(() => {
      centerGraph();
    }, 200);

    // 防抖处理变量
    let resizeTimeoutId: number | null = null;

    // 添加窗口大小变化监听器
    const handleResize = () => {
      if (resizeTimeoutId) {
        clearTimeout(resizeTimeoutId);
      }
      resizeTimeoutId = setTimeout(() => {
        centerGraph();
      }, 150);
    };

    window.addEventListener("resize", handleResize);

    // 组件卸载时移除监听器
    return () => {
      window.removeEventListener("resize", handleResize);
      if (resizeTimeoutId) {
        clearTimeout(resizeTimeoutId);
      }
    };
  });

  onBeforeUnmount(() => {
    if (cytoscapeInstance.value) {
      cytoscapeInstance.value.destroy();
    }
  });

  const selectedNodeData = nodes.find((n) => n.id === selectedNode.value);

  return () => (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#0a1628",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* 标题栏 */}
      {/* <div
        style={{
          padding: "20px",
          background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
          color: "#fff",
          boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "24px", fontWeight: "bold" }}>断网检测 - 演练场景</h1>
      </div> */}

      {/* 信息面板 */}
      {selectedNodeData && (
        <div
          style={{
            position: "absolute",
            top: "100px",
            right: "20px",
            backgroundColor: "rgba(26, 54, 93, 0.95)",
            color: "#fff",
            padding: "15px 20px",
            borderRadius: "8px",
            border: "2px solid #3498db",
            boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
            zIndex: 1000,
            minWidth: "200px",
          }}
        >
          <h3
            style={{ margin: "0 0 10px 0", fontSize: "16px", borderBottom: "1px solid #3498db", paddingBottom: "8px" }}
          >
            选中节点
          </h3>
          <p style={{ margin: "5px 0", fontSize: "14px" }}>
            <strong>名称:</strong> {selectedNodeData.label}
          </p>
          <p style={{ margin: "5px 0", fontSize: "14px" }}>
            <strong>类型:</strong> {selectedNodeData.type}
          </p>
          <button
            onClick={() => (selectedNode.value = "")}
            style={{
              marginTop: "10px",
              padding: "5px 15px",
              backgroundColor: "#3498db",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            关闭
          </button>
        </div>
      )}

      {/* 图例 */}
      {/* <div
        style={{
          position: "absolute",
          bottom: "20px",
          left: "20px",
          backgroundColor: "rgba(26, 54, 93, 0.95)",
          color: "#fff",
          padding: "15px",
          borderRadius: "8px",
          border: "2px solid #3498db",
          boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
          zIndex: 1000,
        }}
      >
        <h3 style={{ margin: "0 0 12px 0", fontSize: "14px", fontWeight: "bold" }}>图例</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: 20, height: 20, backgroundColor: "#e74c3c", borderRadius: "50%" }}></div>
            <span>科研用户/攻击者</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: 20, height: 20, backgroundColor: "#3498db", borderRadius: "4px" }}></div>
            <span>应急/监测系统</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: 20, height: 20, backgroundColor: "#34495e", borderRadius: "4px" }}></div>
            <span>路由器(虚拟)</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: 20, height: 20, backgroundColor: "#16a085", borderRadius: "50%" }}></div>
            <span>外部服务</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: 30, height: 3, backgroundColor: "#e74c3c" }}></div>
            <span>攻击路径</span>
          </div>
        </div>
      </div> */}

      {/* Cytoscape 容器 */}
      <div
        ref={containerRef}
        style={{
          flex: 1,
          width: "100%",
          height: "100%",
          backgroundColor: "#18191a",
          // margin: "20px",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      />
    </div>
  );
});

export default NetworkTopology;
