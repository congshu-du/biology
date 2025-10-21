import { defineComponent, ref } from "vue";
import TrafficTrends from "./components/traffic/TrafficTrends";
import CustomDatePicker from "@/components/datePicker/Index";
import { options } from "./components/traffic/config";
import { token } from "@/utils/theme";
import HttpTraffic from "./components/traffic/HttpTraffic";
import MobileVsDesktop from "./components/traffic/MobileVsDesktop";
import BotVsHuman from "./components/traffic/BotVsHuman";

const Traffic = defineComponent(
  (props) => {
    const time = ref("now-1w~now");

    return () => (
      <div>
        <div class="h-96 rounded-lg relative" style={{ background: token.B2 }}>
          <div class="absolute right-4 top-2 z-10">
            <CustomDatePicker value={time} options={options} />
          </div>
          <TrafficTrends asn={props.value} time={time.value} />
        </div>
        <div class="h-96 rounded-lg relative mt-4" style={{ background: token.B2 }}>
          <HttpTraffic asn={props.value} time={time.value} />
        </div>
        <div class="h-96 rounded-lg relative mt-4" style={{ background: token.B2 }}>
          <MobileVsDesktop asn={props.value} time={time.value} />
        </div>
        <div class="h-96 rounded-lg relative mt-4 mb-4" style={{ background: token.B2 }}>
          <BotVsHuman asn={props.value} time={time.value} />
        </div>
      </div>
    );
  },
  { props: { value: String } },
);

export default Traffic;
