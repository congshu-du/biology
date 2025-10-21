import { countryNameMap } from "@/assets/data/contry";
import { token } from "@/utils/theme";
import * as d3 from "d3";

function interactivity(svg) {
  const Tooltip = d3
    .select("#div_template")
    .append("div")
    .style("display", "none")
    .style("background-color", token.colorBgElevated)
    .style("border-radius", "5px")
    .style("padding", "8px")
    .style("position", "absolute")
    .style("z-index", "100")
    .style("color", token.colorText);
  return { Tooltip };
}

function handleMouseOut(event, nodeSelection, astip) {
  nodeSelection.attr("stroke", "none");
  astip.style("display", "none");
}

function handleMouseOver(event, info, astip) {
  const data = event.target.getBoundingClientRect();
  astip
    .html(
      `<div class='pb-2'>
        <span class="inline-block w-[70px]">AS号: </span>
        ${info.id}
      </div>
      <div class='pb-2'>
        <span class="inline-block w-[70px]">AS名称:</span>
        ${info.asnName}
      </div>
      <div class='pb-2'>
        <span class="inline-block w-[70px]">国家/地区:</span>
        ${countryNameMap[info.country] || info.country}
      </div>
         <div class='pb-0'>
        <span class="inline-block w-[70px]">AS CONE: </span>
        ${info.cone}
      </div>
      `,
    )
    .style("left", data.x - 60 + "px")
    .style("top", data.y - 124 + "px")
    .style("display", "block");
}

export { handleMouseOut, handleMouseOver };

export { interactivity };
