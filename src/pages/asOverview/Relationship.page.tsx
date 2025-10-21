import { defineComponent } from "vue";
import RelationshipForMap from "./components/RelationshipForMap";

const Relationship = defineComponent(
  (props) => {
    return () => (
      <div style={{ minHeight: "800px" }} class="relative flex-1 pb-4">
        <RelationshipForMap value={props.value} />
      </div>
    );
  },
  {
    props: ["value"],
  },
);

export default Relationship;
