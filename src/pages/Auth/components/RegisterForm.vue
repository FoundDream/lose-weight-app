<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { authService } from "../../../services/auth";
import { useOnboardingStore } from "../../../stores";

interface RegisterForm {
  username: string;
  password: string;
}

const router = useRouter();

const form = reactive<RegisterForm>({
  username: "",
  password: "",
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
  return Object.keys(formErrors.value).length === 0;
};

// 提交注册
const handleSubmit = async () => {
  if (!validateForm()) return;

  try {
    const onboardingStore = useOnboardingStore();
    const onboardingData = onboardingStore.onboardingData;
    const response = await authService.register({
      ...form,
      ...onboardingData,
    });
    if (response) {
      // 注册成功，跳转到原页面或首页
      const redirect = router.currentRoute.value.query.redirect as string;
      router.push(redirect || "/");
      console.log(response);
    }
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

      <!-- 提交按钮 -->
      <button
        type="submit"
        class="submit-btn"
        :disabled="false"
        :class="{ 'submit-btn--loading': false }"
      >
        <span v-if="false">注册中...</span>
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
