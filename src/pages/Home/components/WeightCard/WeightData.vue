<template>
  <div class="weight-data">
    <div class="weight-data-item">
      <div class="weight-data-item-title">
        <div>BMI</div>
        <div class="weight-data-item-title-tag">正常</div>
      </div>
      <div class="weight-data-item-value">22.4</div>
    </div>
    <div class="weight-data-item">
      <div class="weight-data-item-title">
        <div>目标体重</div>
      </div>
      <div class="weight-data-item-value">70kg</div>
    </div>
    <div class="weight-data-item">
      <div class="weight-data-item-title">
        <div>昨日体重</div>
      </div>
      <div class="weight-data-item-value">90kg</div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="less">
.weight-data {
  height: 64px;
  border-radius: @border-radius-md;
  background: @color-primary-dark;
  display: flex;
  justify-content: space-around;

  .weight-data-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: @color-text-inverse;
    font-size: @font-size-base;
    font-weight: @font-weight-normal;
  }

  .weight-data-item-title {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: @spacing-xs;

    .weight-data-item-title-tag {
      font-size: @font-size-xs;
      text-align: center;
      font-weight: @font-weight-normal;
      color: @color-primary;
      background: @color-text-inverse;
      border-radius: @border-radius-sm;
      padding: 2px @spacing-xs;
      line-height: 1;
    }
  }
}
</style>
