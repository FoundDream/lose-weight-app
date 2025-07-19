<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { authService } from "../../../services/auth";

interface LoginForm {
  username: string;
  password: string;
}

const router = useRouter();

const form = reactive<LoginForm>({
  username: "",
  password: "",
});

const formErrors = ref<Record<string, string>>({});

// 表单验证
const validateForm = (): boolean => {
  formErrors.value = {};

  if (!form.username.trim()) {
    formErrors.value.username = "请输入用户名";
  }

  if (!form.password.trim()) {
    formErrors.value.password = "请输入密码";
  } else if (form.password.length < 6) {
    formErrors.value.password = "密码至少6位";
  }

  return Object.keys(formErrors.value).length === 0;
};

// 提交登录
const handleSubmit = async () => {
  if (!validateForm()) return;

  try {
    const response = await authService.login(form);
    if (response) {
      // 登录成功，跳转到原页面或首页
      const redirect = router.currentRoute.value.query.redirect as string;
      router.push(redirect || "/");
    }
  } catch (error) {
    console.error("Login failed:", error);
  }
};
</script>

<template>
  <div class="login-form">
    <form @submit.prevent="handleSubmit" class="form">
      <!-- 用户名输入 -->
      <div class="form-field">
        <label for="username" class="field-label">用户名</label>
        <input
          id="username"
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
        <label for="password" class="field-label">密码</label>
        <input
          id="password"
          v-model="form.password"
          type="password"
          class="field-input"
          :class="{ 'field-input--error': formErrors.password }"
          placeholder="请输入密码"
          autocomplete="current-password"
        />
        <span v-if="formErrors.password" class="field-error">
          {{ formErrors.password }}
        </span>
      </div>

      <!-- 提交按钮 -->
      <button
        type="submit"
        class="submit-btn"
        :disabled="false"
        :class="{ 'submit-btn--loading': false }"
      >
        <span v-if="false">登录中...</span>
        <span v-else>登录</span>
      </button>
    </form>
  </div>
</template>

<style scoped lang="less">
.login-form {
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
  margin-bottom: @spacing-sm;
}

.field-input {
  width: 100%;
  padding: @spacing-sm;
  font-size: @font-size-base;
  color: @color-text-primary;
  background: @color-bg-primary;
  border: @border-width solid @color-border;
  border-radius: @border-radius-md;
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
  background: @color-primary;
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
