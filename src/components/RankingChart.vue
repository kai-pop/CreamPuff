<script lang="ts">
import { Component, Mixins, Prop, Watch } from "vue-property-decorator";
import Chart from "chart.js";
import { HorizontalBar, mixins } from "vue-chartjs";
import "chartjs-plugin-colorschemes";

@Component({})
export default class RankingChart extends Mixins(
  HorizontalBar,
  mixins.reactiveProp
) {
  @Prop()
  chartData!: Chart.ChartData;

  get chartOptions(): Chart.ChartOptions {
    return {
      responsive: true,
      title: {
        display: false
      },
      legend: {
        // See https://misc.0o0o.org/chartjs-doc-ja/configuration/legend.html
        display: true,
        position: "top"
      },
      tooltips: {
        // See https://misc.0o0o.org/chartjs-doc-ja/configuration/tooltip.html
        display: true
      },
      elements: {
        // 要素に関する設定
        // See https://misc.0o0o.org/chartjs-doc-ja/configuration/elements.html
      },
      scales: {
        // X軸
        xAxes: [
          {
            scaleLabel: {
              display: true,
              fontColor: "#999",
              labelString:
                "順位による得点 (ランキング登録数が10個の場合1位が10点、10位が1点で計算)"
            },
            stacked: true,
            ticks: {
               stepSize: 1
             }
          }
        ],
        // Y軸
        yAxes: [
          {
            stacked: true
          }
        ]
      },
      plugins: {
        colorschemes: {
          scheme: "brewer.Paired12"
        }
      }
    } as Chart.ChartOptions;
  }

  public mounted() {
    this.renderChart(this.chartData, this.chartOptions);
  }

  @Watch("chartData")
  onChangeData() {
    if (this.chartData) {
      this.renderChart(this.chartData, this.chartOptions);
    }
  }
}
</script>