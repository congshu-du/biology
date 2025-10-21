<script setup lang="ts">
import { theme } from "ant-design-vue";
import { reactive } from "vue";
import { useRouter } from "vue-router";

const { token } = theme.useToken();
const router = useRouter();
const formState = reactive({
  username: "",
  password: "",
  confirmpassword: "",
});

const onFinish = () => {};
</script>

<template>
  <div :style="{ background: token.colorBgLayout, color: token.colorText }" class="h-full relative warpper">
    <div class="container">
      <div class="right">
        <div class="text-center mb-3 text-base font-semibold">注册账号</div>
        <a-form layout="vertical" :model="formState" name="basic" @finish="onFinish">
          <a-form-item label="用户名" name="username" :rules="[{ required: true, message: '请输入用户名' }]">
            <a-input v-model:value="formState.username" />
          </a-form-item>

          <a-form-item label="密码" name="password" :rules="[{ required: true, message: '请输入密码' }]">
            <a-input-password v-model:value="formState.password" />
          </a-form-item>
          <a-form-item label="确认密码" name="confirmpassword" :rules="[{ required: true, message: '请输入密码' }]">
            <a-input-password v-model:value="formState.password" />
          </a-form-item>
          <a-col>
            <a-form-item>已有账号？<a @click="router.push('/login')">去登录</a></a-form-item>
          </a-col>
          <a-form-item>
            <a-button type="primary" block html-type="submit">注册</a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.warpper {
  background-color: v-bind("token.colorFillTertiary");
}
.container {
  @apply absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2  flex;
  height: 500px;
  width: 360px;
}

.right {
  @apply rounded-lg py-6 px-10;
  flex: 1 0 0;
  background-color: v-bind('token["colorBgContainer"]');
}
</style>
