<script setup lang="ts">
import { ref, reactive } from "vue";
import { useUserStore } from "../../../stores/user";
import { useRouter } from "vue-router";

interface RegisterForm {
  username: string;
  password: string;
  confirmPassword: string;
}

const userStore = useUserStore();
const router = useRouter();

const form = reactive<RegisterForm>({
  username: "",
  password: "",
  confirmPassword: "",
});

const formErrors = ref<Record<string, string>>({});

// 表单验证
const validateForm = (): boolean => {
  formErrors.value = {};

  if (!form.username.trim()) {
    formErrors.value.username = "请输入用户名";
  } else if (form.username.length < 3) {
    formErrors.value.username = "用户名至少3位";
  }

  if (!form.password.trim()) {
    formErrors.value.password = "请输入密码";
  } else if (form.password.length < 6) {
    formErrors.value.password = "密码至少6位";
  }

  if (!form.confirmPassword.trim()) {
    formErrors.value.confirmPassword = "请确认密码";
  } else if (form.password !== form.confirmPassword) {
    formErrors.value.confirmPassword = "两次密码不一致";
  }

  return Object.keys(formErrors.value).length === 0;
};

// 提交注册
const handleSubmit = async () => {
  if (!validateForm()) return;

  try {
    await userStore.register({
      username: form.username,
      password: form.password,
    });

    // 注册成功，跳转到原页面或首页
    const redirect = router.currentRoute.value.query.redirect as string;
    router.push(redirect || "/");
  } catch (error) {
    // 错误已在store中处理
    console.error("Register failed:", error);
  }
};
</script>

<template>
  <div class="register-form">
    <form @submit.prevent="handleSubmit" class="form">
      <!-- 用户名输入 -->
      <div class="form-field">
        <label for="reg-username" class="field-label">用户名</label>
        <input
          id="reg-username"
          v-model="form.username"
          type="text"
          class="field-input"
          :class="{ 'field-input--error': formErrors.username }"
          placeholder="请输入用户名"
          autocomplete="username"
        />
        <span v-if="formErrors.username" class="field-error">
          {{ formErrors.username }}
        </span>
      </div>

      <!-- 密码输入 -->
      <div class="form-field">
        <label for="reg-password" class="field-label">密码</label>
        <input
          id="reg-password"
          v-model="form.password"
          type="password"
          class="field-input"
          :class="{ 'field-input--error': formErrors.password }"
          placeholder="请输入密码"
          autocomplete="new-password"
        />
        <span v-if="formErrors.password" class="field-error">
          {{ formErrors.password }}
        </span>
      </div>

      <!-- 确认密码输入 -->
      <div class="form-field">
        <label for="confirm-password" class="field-label">确认密码</label>
        <input
          id="confirm-password"
          v-model="form.confirmPassword"
          type="password"
          class="field-input"
          :class="{ 'field-input--error': formErrors.confirmPassword }"
          placeholder="请再次输入密码"
          autocomplete="new-password"
        />
        <span v-if="formErrors.confirmPassword" class="field-error">
          {{ formErrors.confirmPassword }}
        </span>
      </div>

      <!-- 全局错误提示 -->
      <div v-if="userStore.authError" class="form-error">
        {{ userStore.authError }}
      </div>

      <!-- 提交按钮 -->
      <button
        type="submit"
        class="submit-btn"
        :disabled="userStore.authLoading"
        :class="{ 'submit-btn--loading': userStore.authLoading }"
      >
        <span v-if="userStore.authLoading">注册中...</span>
        <span v-else>注册</span>
      </button>
    </form>
  </div>
</template>

<style scoped lang="less">
.register-form {
  width: 100%;
}

.form {
  width: 100%;
}

.form-field {
  margin-bottom: @spacing-md;
}

.field-label {
  display: block;
  font-size: @font-size-sm;
  font-weight: @font-weight-medium;
  color: @color-text-secondary;
}

.field-input {
  width: 100%;
  padding: @spacing-sm;
  font-size: @font-size-base;
  color: @color-text-primary;
  background: @color-bg-primary;
  border: @border-width solid @color-border;
  border-radius: 32px;
  transition: all @transition-normal;
  font-family: @font-family-primary;

  &:focus {
    outline: none;
    border-color: @color-primary;
    box-shadow: 0 0 0 3px fadeout(@color-primary, 90%);
  }

  &::placeholder {
    color: @color-text-tertiary;
    font-size: @font-size-sm;
  }

  &--error {
    border-color: @color-danger;

    &:focus {
      border-color: @color-danger;
      box-shadow: 0 0 0 3px fadeout(@color-danger, 90%);
    }
  }
}

.field-error {
  display: block;
  font-size: @font-size-xs;
  color: @color-danger;
  margin-top: @spacing-xs;
}

.form-error {
  padding: @spacing-sm @spacing-md;
  background: fadeout(@color-danger, 90%);
  border: @border-width solid @color-danger;
  border-radius: @border-radius-sm;
  color: @color-danger;
  font-size: @font-size-sm;
  margin-bottom: @spacing-lg;
  text-align: center;
}

.submit-btn {
  width: 100%;
  padding: @spacing-md;
  font-size: @font-size-base;
  font-weight: @font-weight-medium;
  color: @color-text-inverse;
  background: @gradient-primary;
  border: none;
  border-radius: 32px;
  cursor: pointer;
  transition: all @transition-normal;
  font-family: @font-family-primary;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    filter: brightness(1.05);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  &--loading {
    opacity: 0.8;
  }
}
</style>
