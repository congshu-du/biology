import { token } from "@/utils/theme";
import * as d3 from "d3";
import { continentObj } from "./config";
function drawedge(svg, width, height) {
  // 欧洲   西经9°31’到东经66°10’startAngle: -1*-9.517* Math.PI / 180+Math.PI /2, endAngle: -1*66.167*Math.PI / 180+Math.PI /2,
  // 亚洲   169°40′W ~ 26°3′E
  // 北美洲 167°W——52°W

  // 示例数据

  const arcdata1 = [
    {
      startAngle: (-1 * -24 * Math.PI) / 180 + Math.PI / 2,
      endAngle: (-1 * 43.05 * Math.PI) / 180 + Math.PI / 2,
      opacity: 1,
      color: continentObj.Europe,
      text: "Europe",
    },
    {
      startAngle: (-1 * 43.05 * Math.PI) / 180 + Math.PI / 2,
      endAngle: (-1 * 138.33 * Math.PI) / 180 + Math.PI / 2,
      opacity: 1,
      color: continentObj.Asia,
      text: "Asia",
    },
    {
      startAngle: (-1 * 140.05 * Math.PI) / 180 + Math.PI / 2,
      endAngle: (-1 * 190.33 * Math.PI) / 180 + Math.PI / 2,
      opacity: 1,
      color: continentObj.Oceania,
      text: "Oceania",
    },
    {
      startAngle: (-1 * -167 * Math.PI) / 180 + Math.PI / 2,
      endAngle: (-1 * -52 * Math.PI) / 180 + Math.PI / 2,
      opacity: 1,
      color: continentObj["United States"],
      text: "United States",
    },

    // ...更多数据
  ];

  // 大洋洲 东经110°到东经178° 陆地
  // 南美洲 西经81度-西经35度
  // 非洲 17°33′W—51°24′E
  const arcdata2 = [
    {
      startAngle: (-1 * 90 * Math.PI) / 180 + Math.PI / 2,
      endAngle: (-1 * 130 * Math.PI) / 180 + Math.PI / 2,
      opacity: 1,
      color: continentObj.China,
      text: "China",
    },
    {
      startAngle: (-1 * 210 * Math.PI) / 180 + Math.PI / 2,
      endAngle: (-1 * 268 * Math.PI) / 180 + Math.PI / 2,
      opacity: 1,
      color: continentObj.NorthAmerica,
      text: "North America",
    },

    {
      startAngle: (-1 * -81 * Math.PI) / 180 + Math.PI / 2,
      endAngle: (-1 * -34 * Math.PI) / 180 + Math.PI / 2,
      opacity: 1,
      color: continentObj.SouthAmerica,
      text: "South America",
    },
    {
      startAngle: (-1 * -17.55 * Math.PI) / 180 + Math.PI / 2,
      endAngle: (-1 * 51.4 * Math.PI) / 180 + Math.PI / 2,
      opacity: 1,
      color: continentObj.Africa,
      text: "Africa",
    },

    // ...更多数据
  ];

  const radius = 350;
  // 创建一个圆环生成器
  const arcGenerator = d3
    .arc()
    .innerRadius(radius + 10)
    .outerRadius(radius + 25);

  // 创建一个圆环生成器
  const arcGenerator2 = d3
    .arc()
    .innerRadius(radius + 25)
    .outerRadius(radius + 40);

  // 绘制圆环
  const arcs = d3
    .select(svg)
    .selectAll(".arc")
    .data(arcdata1)
    .enter()
    .append("g")
    .attr("class", "arc")
    .attr("transform", `translate(${width / 2},${height / 2})`);

  arcs
    .append("path")
    .attr("d", (d) => arcGenerator(d))
    .attr("fill", (d) => d.color)
    .attr("opacity", (d) => d.opacity);

  // 绘制圆环
  const arcs2 = d3
    .select(svg)
    .selectAll(".arc2")
    .data(arcdata2)
    .enter()
    .append("g")
    .attr("class", "arc2")
    .attr("transform", `translate(${width / 2},${height / 2})`);

  arcs2
    .append("path")
    .attr("d", (d) => arcGenerator2(d))
    .attr("fill", (d) => d.color)
    .attr("opacity", (d) => d.opacity);

  // 添加文本
  arcs2
    .append("text")
    .attr("transform", (d) => `translate(${arcGenerator2.centroid(d)})`)
    .attr("text-anchor", "middle")
    .text((d) => d.text)
    .attr("fill", token.colorText);

  // 添加文本
  arcs
    .append("text")
    .attr("transform", (d) => {
      return `translate(${arcGenerator.centroid(d)})`;
    })
    .attr("text-anchor", "middle")
    .text((d) => d.text)
    .attr("fill", token.colorText);

  // arcs2
  //   .append("text")
  //   .attr("transform", (d) => `translate(367.4411944615254,-6.574086452691446)`)
  //   .attr("text-anchor", "middle")
  //   // .text("Europe")
  //   .attr("fill", token.colorText);
}

export { drawedge };
