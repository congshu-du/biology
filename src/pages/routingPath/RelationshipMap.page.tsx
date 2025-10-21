import { token } from "@/utils/theme";
import styled, { tw } from "@vue-styled-components/core";
import { Col, Row } from "ant-design-vue";
import { defineComponent } from "vue";
import PeerRelation from "./components/PeerRelation";
import ProviderBar from "./components/ProviderBar";
import PeerBar from "./components/PeerBar";
import CustomerBar from "./components/CustomerBar";
import AsTable from "./components/AsTable";
import RelationshipMap from "./components/RelationshipMap";

const Relationship = defineComponent(() => {
  return () => (
    <div style={{ height: "calc(100vh - 170px)", minHeight: "800px" }}>
      <RelationshipMap />
    </div>
  );
});

export default Relationship;

const SContainer = styled.div`
  border-radius: 8px;
  border: 1px solid ${token.colorBorderSecondary};
  background-color: ${token.colorBgBase};
`;
