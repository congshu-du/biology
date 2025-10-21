import { token } from "@/utils/theme";
import { defineComponent, nextTick } from "vue";
import * as d3 from "d3";
import { drawedge } from "./components/edge.js";
import rankData from "./components/new_rank.csv?url";
import realData from "./components/rel.csv?url";
import { continentObj } from "./components/config.js";
import { countryContinentMap } from "@/assets/data/contry.js";

const countrys = ["United States", "China"];

const GeoRel = defineComponent(() => {
  nextTick(async () => {
    let asrank = [];
    const width = 1000;
    const height = 1000;
    let clickNode = "";

    const canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d")!;
    canvas.width = width;
    canvas.height = height;

    d3.select(".svg-overlay").attr("width", width).attr("height", height);
    const tooltip = d3
      .select("#tooltip")

      .append("div")
      .style("visibility", "hidden")
      .style("background-color", token.colorBgElevated)
      .style("border-radius", "5px")
      .style("padding", "8px")
      .style("position", "absolute")
      .style("z-index", "100")
      .style("color", token.colorText);

    d3.csv(rankData)
      .then((rank1) => {
        asrank = rank1;
        return d3.csv(realData);
      })
      .then((asrel) => {
        const startTime = performance.now();
        const maxCones = asrank[0].cone;
        const minCones = asrank[asrank.length - 1].cone;

        const xymap = new Map();
        for (let i = 0; i < asrank.length; i++) {
          xymap.set(+asrank[i].id, [asrank[i].x, asrank[i].y]);
        }

        // 创建计数器，用于追踪每个国家的绘制次数
        const countryCounters = Object.keys(continentObj).reduce((acc, country) => {
          acc[country] = 0;
          return acc;
        }, {});

        // 新增一个比例尺来设置边的宽度
        const widthScale = d3
          .scaleLinear()
          .domain([0, 200, 2000, maxCones]) // 设置 `cone` 的范围
          .range([0.01, 0.15]); // 设置边宽的范围

        // 绘制边
        asrel.forEach((d) => {
          const sou = xymap.get(+d.source);
          const tar = xymap.get(+d.target);

          if (sou !== undefined && tar !== undefined) {
            ctx.beginPath();
            ctx.moveTo(sou[0], sou[1]); // 从源点开始
            ctx.lineTo(tar[0], tar[1]); // 连接到目标点
            ctx.strokeStyle = "#cbd8ea"; // 设置颜色
            ctx.lineWidth = widthScale(d.cone); // 设置边宽
            ctx.globalAlpha = +d.cone > 2000 ? 0.5 : +d.cone > 200 && +d.cone <= 2000 ? 0.5 : 1;
            ctx.stroke(); // 绘制路径
          }
        });

        // 绘制节点
        const nodeSizeScale = d3.scaleLog().domain([minCones, maxCones]).range([1.5, 6]);

        asrank.forEach((d, i) => {
          const continent = countrys.includes(d.country) ? d.country : countryContinentMap[d.country]?.continent;
          if (continent && i < 3000) {
            const icon = d3
              .select(".svg-overlay")
              .append("circle")
              .attr("cx", d.x) // 设置图标的定位偏移量
              .attr("cy", d.y)
              .attr("r", nodeSizeScale(+d.cone))
              .attr("fill", continentObj[continent])
              .on("mouseenter", function (event) {
                const node1 = d3.select(this);
                const originalRadius = +node1.attr("r");
                node1.attr("data-original-radius", originalRadius);
                const newRadius = originalRadius * 1.5;
                node1.attr("r", newRadius);

                const originalOpacity = +node1.attr("fill-opacity");
                node1.attr("data-original-opacity", originalOpacity);
                node1.attr("stroke", "white");
                tooltip
                  .style("visibility", "visible")
                  .html(
                    `<div class='pb-2 min-w-40'>
                        <span class="inline-block w-[70px]">AS号: </span>
                        ${d.id}
                      </div>
                      <div class='pb-2'>
                        <span class="inline-block w-[70px]">AS名称:</span>
                        ${d.asnName}
                      </div>
                      <div class='pb-2'>
                        <span class="inline-block w-[70px]">国家/地区:</span>
                         ${continent}
                      </div>
                         <div class='pb-0'>
                        <span class="inline-block w-[70px]">AS CONE: </span>
                        ${d.cone}
                      </div>
                      `,
                  )
                  .style("left", event.x - 60 + "px")
                  .style("top", event.y - 124 + "px");
              })
              .on("mouseleave", function () {
                const node1 = d3.select(this);
                const originalRadius = +node1.attr("data-original-radius");
                node1.attr("r", originalRadius);
                node1.attr("stroke", "none");
                tooltip.style("visibility", "hidden");
              })
              .on("click", function (node) {
                if (clickNode !== d.id) {
                  clickNode = d.id;
                } else {
                  clickNode = "";
                }
                // const clickedNode = d3.select(`#AS${clickId}`);
                ctx.clearRect(0, 0, width, height);

                asrank.forEach((t, i) => {
                  const continent = countrys.includes(t.country)
                    ? t.country
                    : countryContinentMap[t.country]?.continent;
                  if (i >= 3000) {
                    ctx.beginPath();
                    ctx.arc(t.x, t.y, nodeSizeScale(t.cone), 0, 2 * Math.PI);
                    ctx.fillStyle = "transparent";
                    ctx.strokeStyle = continentObj[continent];
                    ctx.lineWidth = 1;
                    ctx.fill();
                    ctx.stroke();
                  }
                });

                const redRel = [];

                asrel.forEach((x) => {
                  if (clickNode && (x.source === clickNode || x.target === clickNode)) {
                    redRel.push(x);
                  } else {
                    const sou = xymap.get(+x.source);
                    const tar = xymap.get(+x.target);

                    if (sou !== undefined && tar !== undefined) {
                      ctx.beginPath();
                      ctx.moveTo(sou[0], sou[1]); // 从源点开始
                      ctx.lineTo(tar[0], tar[1]); // 连接到目标点
                      ctx.strokeStyle = "#cbd8ea"; // 设置颜色
                      ctx.lineWidth = widthScale(x.cone);
                      ctx.stroke(); // 绘制路径
                    }
                  }
                });

                if (redRel.length > 0) {
                  redRel.forEach((x) => {
                    const sou = xymap.get(+x.source);
                    const tar = xymap.get(+x.target);
                    if (sou !== undefined && tar !== undefined) {
                      ctx.beginPath();
                      ctx.moveTo(sou[0], sou[1]); // 从源点开始
                      ctx.lineTo(tar[0], tar[1]); // 连接到目标点
                      ctx.strokeStyle = "red"; // 设置颜色
                      ctx.lineWidth = 1;

                      ctx.stroke(); // 绘制路径
                    }
                  });
                }
              });

            countryCounters[continent]++; // 更新该国家的绘制次数
          } else {
            // 如果绘制次数超过 5 次，使用圆形
            ctx.beginPath();
            ctx.arc(d.x, d.y, nodeSizeScale(d.cone), 0, 2 * Math.PI);
            ctx.fillStyle = "transparent";
            // ctx.strokeStyle = (+d.cone > 200) ? "#252424" :"#8c8686";
            ctx.strokeStyle = continentObj[continent];
            ctx.lineWidth = 1;
            ctx.fill();
            ctx.stroke();
          }
        });

        const endTime = performance.now();
        console.log(`loaded time ${(endTime - startTime).toFixed(2)} milliseconds`);

        drawedge(d3.select(".svg-overlay").node(), width, height);
      });
  });

  return () => (
    <div id="div_template" class="min-h-full w-full flex justify-center items-center">
      <div id="tooltip"></div>
      <div class="relative">
        <canvas id="myCanvas"></canvas>
        <svg
          id="svg-overlay"
          class="svg-overlay absolute top-0 left-0"
          width="1000px"
          height="1000px"

          // viewBox="0 0 1880 1000"
        ></svg>
      </div>
    </div>
  );
});

export default GeoRel;
