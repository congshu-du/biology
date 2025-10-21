import * as d3 from "d3";
import { interactivity, handleMouseOver, handleMouseOut } from "./common-tool";
import new_nodes1 from "./asn100.csv?url";
import output from "./asn100-links.csv?url";
import { continentObj } from "./config";
import { countryContinentMap } from "@/assets/data/contry";
import { token } from "@/utils/theme";

async function drawLinkCluster(click, width, height) {
  let clickedNode: string = "";

  const as_rank = await d3.csv(new_nodes1);
  const new_as_rel = await d3.csv(output);

  const svg = d3.select("#coreSvg");
  const coreLayer = d3.select("#core-layer");
  const { Tooltip } = interactivity(svg);

  const linkLayer = coreLayer.append("g").attr("id", "link-layer");
  const nodeLayer = coreLayer.append("g").attr("id", "node-layer");

  //FDEB
  const lineGenerator = d3
    .line()
    .x((d) => d.x)
    .y((d) => d.y)
    .curve(d3.curveLinear);

  const sizeScale = d3.scaleLinear().domain([0, 60000]).range([6, 15]);

  // 力引导绘制节点
  const nodes = nodeLayer
    .selectAll(".node")
    .data(as_rank)
    .join("circle")
    .attr("id", (d) => `AS${d.id}`)
    .attr("class", "node")
    .attr("r", (d) => {
      if (d.id === "30987" || d.id === "37559") {
        return 0;
      }
      return sizeScale(+d.cone);
    })
    .attr("fill", (d) => {
      const continent = countryContinentMap[d.country]?.continent;
      if (!continent) {
        console.log(d.country, "d.country");
      }
      return continentObj[continent];
    })
    .on("contextmenu", function (event, d) {
      // d3.event.preventDefault();
      d3.selectAll("#clink-layer").remove();
      d3.selectAll("#link-layer").attr("display", "null");
    })
    .on("mouseover", function (event, d) {
      const node1 = d3.select(this);
      const originalRadius = +node1.attr("r");
      node1.attr("data-original-radius", originalRadius);
      const newRadius = originalRadius * 1.5;
      node1.attr("r", newRadius);

      const originalOpacity = +node1.attr("fill-opacity");
      node1.attr("data-original-opacity", originalOpacity);
      node1.attr("stroke", "white");
      handleMouseOver(event, d, Tooltip);
    })
    .on("mouseout", function (event, d) {
      const node1 = d3.select(this);
      const originalRadius = +node1.attr("data-original-radius");
      node1.attr("r", originalRadius);
      handleMouseOut(event, node1, Tooltip);
    });

  nodes.on("click", function (node, d) {
    const clickId = node.target.id;
    if (clickedNode) {
      const links = document.querySelectorAll(".link");

      links.forEach((link) => {
        link.setAttribute("stroke", token.colorBorderSecondary);
        link.setAttribute("stroke-width", "0.6");
        link.setAttribute("stroke-opacity", "0.6");
      });
    }

    if (clickedNode !== clickId) {
      clickedNode = clickId;
      d3.selectAll(`[source-id='${clickId}'], [target-id='${clickId}']`)
        .attr("stroke", "red")
        .attr("stroke-width", "1.2")
        .attr("stroke-opacity", "0.5")
        .raise();
    } else {
      clickedNode = "";
    }
  });

  // 创建力模拟
  d3.forceSimulation(as_rank)
    .force("charge", d3.forceManyBody().strength(-120)) // 轻微的排斥力
    .force("collide", d3.forceCollide().radius(10)) // 轻微的碰撞力，防止重叠
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("x", d3.forceX())
    .force("y", d3.forceY())
    .alphaDecay(0.1)
    .on("tick", ticked)
    .on("end", simulationEnded); // 监听模拟结束事件

  // 更新节点位置
  function ticked() {
    nodes.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
  }

  function simulationEnded() {
    function drawDirectLine(rel, layer, as_rank) {
      rel.forEach((d) => {
        const sourceNode = as_rank.find((node) => node.id === d.source);
        const targetNode = as_rank.find((node) => node.id === d.target);
        layer
          .append("path")
          .attr("class", "link")
          .attr("fill", "none")
          .attr("stroke", (d1) => {
            return token.colorBorderSecondary;
          })
          .attr("stroke-opacity", (d) => {
            return 0.7;
          })
          .attr("stroke-width", (d1) => {
            return 0.7;
          })
          .attr("d", `M ${sourceNode.x} ${sourceNode.y} L ${targetNode.x} ${targetNode.y}`)
          .attr("source-id", `AS${d.source}`) // 添加 data-source-id 属性
          .attr("target-id", `AS${d.target}`);
      });
    }

    drawDirectLine(new_as_rel, linkLayer, as_rank);
  }
}

function drawContinent(layer, width, height) {
  const arc1 = { inner: 400, outer: 420 },
    arc2 = { inner: 410, outer: 430 },
    arcData1 = [
      {
        startAngle: (-1 * -24 * Math.PI) / 180 + Math.PI / 2,
        endAngle: (-1 * 26.05 * Math.PI) / 180 + Math.PI / 2,
        color: continentObj.Europe,
        text: "Europe",
      },
      {
        startAngle: (-1 * 26.05 * Math.PI) / 180 + Math.PI / 2,
        endAngle: (-1 * 190.33 * Math.PI) / 180 + Math.PI / 2,
        color: continentObj.Asia,
        text: "Asia",
      },
      {
        startAngle: (-1 * -167 * Math.PI) / 180 + Math.PI / 2,
        endAngle: (-1 * -52 * Math.PI) / 180 + Math.PI / 2,
        color: continentObj.NorthAmerica,
        text: "North-America",
      },
    ],
    arcData2 = [
      {
        startAngle: (-1 * 110 * Math.PI) / 180 + Math.PI / 2,
        endAngle: (-1 * 178 * Math.PI) / 180 + Math.PI / 2,
        color: continentObj.Oceania,
        text: "Oceania",
      },
      {
        startAngle: (-1 * -81 * Math.PI) / 180 + Math.PI / 2,
        endAngle: (-1 * -34 * Math.PI) / 180 + Math.PI / 2,
        color: continentObj.SouthAmerica,
        text: "South-America",
      },
      {
        startAngle: (-1 * -17.55 * Math.PI) / 180 + Math.PI / 2,
        endAngle: (-1 * 51.4 * Math.PI) / 180 + Math.PI / 2,
        color: continentObj.Africa,
        text: "Africa",
      },
    ];

  const arcGenerator1 = d3.arc().innerRadius(arc1.inner).outerRadius(arc1.outer),
    arcGenerator2 = d3.arc().innerRadius(arc2.inner).outerRadius(arc2.outer);

  layer
    .selectAll(".arc1")
    .data(arcData1)
    .join("g")
    .attr("class", "arc1")
    .attr("transform", `translate(${width / 2},${height / 2})`)
    .append("path")
    .attr("d", (d) => arcGenerator1(d))
    .attr("fill", (d) => d.color);

  d3.selectAll(".arc1")
    .append("text")
    .attr("transform", (d) => `translate(${arcGenerator1.centroid(d)})`)
    .attr("id", (d) => d.text)
    .attr("color", token.colorText)
    .attr("text-anchor", "middle")
    .text((d) => d.text)
    .attr("fill", token.colorText);

  layer
    .selectAll(".arc2")
    .data(arcData2)
    .join("g")
    .attr("class", "arc2")
    .attr("transform", `translate(${width / 2},${height / 2})`)
    .append("path")
    .attr("d", (d) => arcGenerator2(d))
    .attr("fill", (d) => d.color);

  d3.selectAll(".arc2")
    .append("text")
    .attr("transform", (d) => `translate(${arcGenerator2.centroid(d)})`)
    .attr("id", (d) => d.text)
    .attr("text-anchor", "middle")
    .text((d) => d.text)
    .attr("fill", token.colorText);

  d3.selectAll("#Europe").attr("dx", "50");
  d3.selectAll("#North-America").attr("dx", "-110");
}

export { drawContinent, drawLinkCluster };
