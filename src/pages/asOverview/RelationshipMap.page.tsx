import { defineComponent } from "vue";
import RelationshipMap from "./components/RelationshipMap";

const Relationship = defineComponent(() => {
  return () => (
    <div class="flex-1 pb-4" style={{ minHeight: "800px" }}>
      <RelationshipMap />
    </div>
  );
});

export default Relationship;
