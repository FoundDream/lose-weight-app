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
  opacity: 1;
  border-radius: 10px;
  background: rgba(111, 199, 211, 1);
  display: flex;
  justify-content: space-around;

  .weight-data-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 16px;
    font-weight: 400;
  }

  .weight-data-item-title {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 4px;

    .weight-data-item-title-tag {
      font-size: 10px;
      text-align: center;
      font-weight: 400;
      color: rgba(86, 181, 199, 1);
      background: rgba(255, 255, 255, 1);
      border-radius: 4px;
      width: 28px;
      height: 14px;
    }
  }
}
</style>
