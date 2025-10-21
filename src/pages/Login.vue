<script setup lang="ts">
import { UserOutlined } from "@ant-design/icons-vue";
import { theme } from "ant-design-vue";
import { reactive } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const formState = reactive({
  username: "",
  password: "",
  remember: false,
});
const { token } = theme.useToken();

const onFinish = () => {
  router.push("/");
};
</script>

<template>
  <div :style="{ background: token.colorBgLayout, color: token.colorText }" class="h-full relative warpper">
    <div class="container">
      <div class="left">
        <div>
          <div class="text-center mb-2">
            <a-avatar :size="56">
              <template #icon><UserOutlined :style="{ transform: 'translateY(-8px)' }" /></template>
            </a-avatar>
          </div>
          <div class="font-semibold text-base">RouteSafe</div>
        </div>
      </div>
      <div class="right">
        <div class="text-center mb-3 text-base font-semibold">登录</div>
        <a-form layout="vertical" :model="formState" name="basic" @finish="onFinish">
          <a-form-item label="用户名" name="username" :rules="[{ required: true, message: '请输入用户名' }]">
            <a-input v-model:value="formState.username" />
          </a-form-item>

          <a-form-item label="密码" name="password" :rules="[{ required: true, message: '请输入密码' }]">
            <a-input-password v-model:value="formState.password" />
          </a-form-item>
          <a-row>
            <a-col flex="1">
              <a-form-item name="remember">
                <a-checkbox v-model:checked="formState.remember">记住密码</a-checkbox>
              </a-form-item>
            </a-col>
            <a-col>
              <a-form-item>没有账号？<a @click="router.push('/register')">去注册</a></a-form-item>
            </a-col>
          </a-row>

          <a-form-item>
            <a-button type="primary" block html-type="submit">登录</a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.warpper {
  /* background-color: v-bind('token.colorFillTertiary'); */
}
.container {
  @apply absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2  flex;
  height: 360px;
  width: 720px;
}
.left {
  @apply rounded-l-lg flex items-center justify-center;
  width: 360px;
  background-color: v-bind("token.colorFillSecondary");
}
.right {
  @apply rounded-r-lg py-6 px-10;
  flex: 1 0 0;
  background-color: v-bind('token["colorBgContainer"]');
}
</style>
