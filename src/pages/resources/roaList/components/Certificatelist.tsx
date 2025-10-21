import { token } from "@/utils/theme";
import { MoreOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons-vue";
import styled, { tw } from "@vue-styled-components/core";
import { Button, Col, Divider, Dropdown, Input, Menu, Row, Select, Space } from "ant-design-vue";
import { computed, defineComponent, reactive, ref, Ref, watchEffect } from "vue";
import { RecycleScroller } from "vue-virtual-scroller";
import AddCertificate from "./AddCertificate";
import { CaFileType } from "@/services/roa/interface";
import EditCertificate from "./EditCertificate";

const Certificatelist = defineComponent<{
  value: Ref<CaFileType | undefined>;
  onFresh: () => void;
  fileList: Ref<CaFileType[]>;
}>(
  ({ value, fileList, onFresh }) => {
    const open = ref(false);
    const editOpen = ref(false);
    const info = ref<CaFileType>();

    const param = reactive<{
      caFileName: string | undefined;
    }>({ caFileName: undefined });

    const onClose = (flag?: boolean) => {
      open.value = false;
      editOpen.value = false;
      if (flag) {
        onFresh();
      }
    };

    const lastFileList = computed(() => {
      return fileList.value.filter((item) =>
        item.caFileName.toLowerCase().includes(param.caFileName?.toLowerCase() || ""),
      );
    });

    return () => (
      <div class="h-full flex flex-col" style={{ borderRight: `1px solid ${token.colorBorder}` }}>
        <div style={{ borderBottom: `1px solid ${token.colorBorder}` }} class="h-12 py-2 px-3 flex gap-2">
          <div class="flex-1">
            <Input placeholder="请输入地址证书名称" allowClear class="w-full" v-model={[param.caFileName, "value"]} />
          </div>
          <Button onClick={() => (open.value = true)} type="primary" icon={<UploadOutlined />}></Button>
        </div>
        <div class="flex-1 overflow-y-hidden pb-2">
          <RecycleScroller
            class="scroller"
            style={{ height: "100%" }}
            items={lastFileList.value}
            itemSize={47}
            keyField="id"
            v-slots={{
              default: ({ item }: { item: CaFileType }) => {
                return (
                  <div class="pt-2 px-3 h-[47px]">
                    <Item onClick={() => (value.value = item)} checked={item.id === value.value?.id}>
                      <div class="flex-1 truncate">{item.caFileName}</div>
                      <Dropdown
                        overlay={
                          <Menu>
                            <Menu.Item
                              onClick={() => {
                                info.value = item;
                                editOpen.value = true;
                              }}
                            >
                              编辑
                            </Menu.Item>
                          </Menu>
                        }
                      >
                        <a class="invisible" style={{ color: token.colorText }}>
                          <MoreOutlined />
                        </a>
                      </Dropdown>
                    </Item>
                  </div>
                );
              },
            }}
          />
        </div>
        {open.value && <AddCertificate fileList={fileList.value} onClose={onClose} />}
        {editOpen.value && <EditCertificate info={info} onClose={onClose} />}
      </div>
    );
  },
  { props: ["value", "fileList", "onFresh"] },
);

export default Certificatelist;

const Item = styled("div", { checked: Boolean })`
  ${tw`h-full rounded flex items-center px-2 cursor-pointer justify-between gap-2`}
  background-color: ${({ checked }) => (checked ? token.colorPrimary : token.colorFillQuaternary)};
  &:hover {
    background-color: ${({ checked }) => (checked ? undefined : token.colorPrimaryBgHover)};
    > a {
      visibility: visible;
    }
  }
`;
