<script setup lang="ts">
// import type { WeightRecord, WeightUnit } from "../../../types/weight";
// import { onMounted } from "vue";

// interface Props {
//   records: WeightRecord[];
//   unit: WeightUnit;
// }

// import * as echarts from "echarts/core";
// import { BarChart, LineChart } from "echarts/charts";
// import {
//   TitleComponent,
//   TooltipComponent,
//   GridComponent,
//   // 数据集组件
//   DatasetComponent,
//   // 内置数据转换器组件 (filter, sort)
//   TransformComponent,
// } from "echarts/components";
// import { LabelLayout, UniversalTransition } from "echarts/features";
// import { CanvasRenderer } from "echarts/renderers";
// import type {
//   // 系列类型的定义后缀都为 SeriesOption
//   BarSeriesOption,
//   LineSeriesOption,
// } from "echarts/charts";
// import type {
//   // 组件类型的定义后缀都为 ComponentOption
//   TitleComponentOption,
//   TooltipComponentOption,
//   GridComponentOption,
//   DatasetComponentOption,
// } from "echarts/components";
// import type { ComposeOption } from "echarts/core";

// // 通过 ComposeOption 来组合出一个只有必须组件和图表的 Option 类型
// type ECOption = ComposeOption<
//   | BarSeriesOption
//   | LineSeriesOption
//   | TitleComponentOption
//   | TooltipComponentOption
//   | GridComponentOption
//   | DatasetComponentOption
// >;

// // 注册必须的组件
// echarts.use([
//   TitleComponent,
//   TooltipComponent,
//   GridComponent,
//   DatasetComponent,
//   TransformComponent,
//   BarChart,
//   LineChart,
//   LabelLayout,
//   UniversalTransition,
//   CanvasRenderer,
// ]);
// const option: ECOption = {
//   xAxis: {
//     type: "category",
//     data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
//   },
//   yAxis: {
//     type: "value",
//   },
//   series: [
//     {
//       data: [120, 200, 150, 80, 70, 110, 130],
//       type: "line",
//     },
//   ],
// };
// defineProps<Props>();

// onMounted(() => {
//   const chart = echarts.init(document.getElementById("chart") as HTMLElement);
//   chart.setOption(option);
// });
</script>

<template>
  <div class="weight-chart">
    <div class="chart-header">
      <h3>📈 体重趋势</h3>
      <span class="chart-period">最近30天</span>
    </div>

    <div class="chart-container">
      <div class="chart-placeholder">
        <div id="chart" style="width: 350px; height: 200px"></div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
@primary-color: #6366f1;
@success-color: #10b981;
@bg-primary: #ffffff;
@bg-secondary: #f8fafc;
@text-primary: #1e293b;
@text-secondary: #64748b;
@text-light: #94a3b8;
@border-color: #e2e8f0;
@shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
@border-radius: 16px;

.weight-chart {
  background: @bg-primary;
  border-radius: @border-radius;
  padding: 20px;
  box-shadow: @shadow-md;

  .chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h3 {
      font-size: 18px;
      font-weight: 600;
      color: @text-primary;
      margin: 0;
    }

    .chart-period {
      font-size: 14px;
      color: @text-secondary;
      background: @bg-secondary;
      padding: 4px 12px;
      border-radius: 12px;
    }
  }

  .chart-container {
    .chart-placeholder {
      height: 180px;
      background: @bg-secondary;
      border-radius: @border-radius;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border: 2px dashed @border-color;
      position: relative;

      .chart-icon {
        font-size: 32px;
        margin-bottom: 8px;
      }

      p {
        margin: 0 0 4px 0;
        color: @text-secondary;
        font-weight: 500;
      }

      small {
        color: @text-light;
        margin-bottom: 16px;
      }

      .sample-data {
        display: flex;
        gap: 12px;
        margin-top: 16px;

        .data-point {
          text-align: center;
          padding: 8px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

          .point-date {
            font-size: 12px;
            color: @text-light;
            margin-bottom: 4px;
          }

          .point-weight {
            font-size: 14px;
            font-weight: 600;
            color: @primary-color;
          }
        }
      }
    }
  }
}
</style>
