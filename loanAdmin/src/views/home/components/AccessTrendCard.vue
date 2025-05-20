<template>
  <div ref="capture">
    <a-spin :loading="loading" style="width: 100%">
      <a-card :bordered="false" class="gi_card_title">
        <div class="con">
          <a-radio-group :model-value="dateRange" type="button" size="small" @change="onChange"
            style="margin-right: 20px">
            <a-radio value="a">交易额</a-radio>
            <a-radio value="b">交易笔数</a-radio>
          </a-radio-group>
          <a-radio-group :model-value="dateRange1" type="button" size="small" @change="onChangeOne"
            style="margin-right: 20px">
            <a-radio value="a">日维度</a-radio>
            <a-radio value="b">周维度</a-radio>
            <a-radio value="c">月维度</a-radio>
          </a-radio-group>
          <div class="title_b">
            <img style="margin-right: 20px" src="../../../assets/images/baocun.png" alt="" @click="takeScreenshot" />
            <img src="../../../assets/images/shuaxin.png" alt="" @click="
              getChartData({
                type: 'a'
              })
              " />
          </div>
        </div>
        <VCharts :option="option" autoresize :style="{ height: '230px' }"></VCharts>
      </a-card>
    </a-spin>
  </div>
</template>

<script lang="ts" setup>
import { listDashboardAccessTrend, type DashboardAccessTrendResp } from '@/apis'
import html2canvas from 'html2canvas'
import VCharts from 'vue-echarts'
import { graphic } from 'echarts'
import { useChart } from '@/hooks'
import { getStoreStatistics } from '@/apis'
const xData = ref<string[]>([])
const pvStatisticsData = ref<number[]>([])
const ipStatisticsData = ref<number[]>([])
const date = ref([])
const compare = ref([])
const value = ref([])

// const { option } = useChart((isDark) => {
//   return {
//     grid: {
//       left: '38',
//       right: '0',
//       top: '10',
//       bottom: '50'
//     },
//     legend: {
//       bottom: -3,
//       icon: 'circle',
//       textStyle: {
//         color: '#4E5969'
//       }
//     },
//     xAxis: {
//       type: 'category',
//       offset: 2,
//       data: xData.value,
//       boundaryGap: false,
//       axisLabel: {
//         color: '#4E5969',
//         formatter(value: number, idx: number) {
//           if (idx === 0) return ''
//           if (idx === xData.value.length - 1) return ''
//           return `${value}`
//         }
//       },
//       axisLine: {
//         show: false
//       },
//       axisTick: {
//         show: false
//       },
//       splitLine: {
//         show: true,
//         interval: (idx: number) => {
//           if (idx === 0) return false
//           return idx !== xData.value.length - 1
//         },
//         lineStyle: {
//           color: isDark ? '#3F3F3F' : '#E5E8EF'
//         }
//       },
//       axisPointer: {
//         show: true,
//         lineStyle: {
//           color: '#23ADFF',
//           width: 2
//         }
//       }
//     },
//     yAxis: {
//       type: 'value',
//       axisLabel: {
//         formatter(value: any, idx: number) {
//           if (idx === 0) return value
//           if (value >= 1000) {
//             return `${value / 1000}k`
//           }
//           return `${value}`
//         }
//       },
//       axisLine: {
//         show: false
//       },
//       splitLine: {
//         lineStyle: {
//           type: 'dashed',
//           color: isDark ? '#3F3F3F' : '#E5E8EF'
//         }
//       }
//     },
//     tooltip: {
//       show: true,
//       trigger: 'axis',
//       formatter(params) {
//         const [firstElement] = params
//         return `<div>
//             <p class="tooltip-title">${firstElement.axisValueLabel}</p>
//             ${tooltipItemsHtmlString(params)}
//           </div>`
//       },
//       className: 'echarts-tooltip-diy'
//     },
//     series: [
//       {
//         name: '浏览量(PV)',
//         data: pvStatisticsData.value,
//         type: 'line',
//         smooth: true,
//         showSymbol: false,
//         color: '#246EFF',
//         symbol: 'circle',
//         symbolSize: 10,
//         emphasis: {
//           focus: 'series',
//           itemStyle: {
//             borderWidth: 2,
//             borderColor: '#E0E3FF'
//           }
//         },
//         areaStyle: {
//           opacity: 0.8,
//           color: new graphic.LinearGradient(0, 0, 0, 1, [
//             {
//               offset: 0,
//               color: 'rgba(17, 126, 255, 0.16)'
//             },
//             {
//               offset: 1,
//               color: 'rgba(17, 128, 255, 0)'
//             }
//           ])
//         }
//       },
//       {
//         name: 'IP数',
//         data: ipStatisticsData.value,
//         type: 'line',
//         smooth: true,
//         showSymbol: false,
//         color: '#00B2FF',
//         symbol: 'circle',
//         symbolSize: 10,
//         emphasis: {
//           focus: 'series',
//           itemStyle: {
//             borderWidth: 2,
//             borderColor: '#E2F2FF'
//           }
//         },
//         areaStyle: {
//           opacity: 0.8,
//           color: new graphic.LinearGradient(0, 0, 0, 1, [
//             {
//               offset: 0,
//               color: 'rgba(17, 126, 255, 0.16)'
//             },
//             {
//               offset: 1,
//               color: 'rgba(17, 128, 255, 0)'
//             }
//           ])
//         }
//       }
//     ]
//   }
// })

const { option } = useChart((isDark) => {
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
        label: {
          show: true
        }
      }
    },
    grid: {
      left: '58',
      right: '20',
      top: '10',
      bottom: '20'
    },
    // legend: {
    //   data: ['净利润', '净资产收益率'],
    //   top: '15%',
    //   textStyle: {
    //     color: '#747474'
    //   }
    // },
    xAxis: {
      data: date.value,
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        show: true,
        textStyle: {
          color: '#393939' //X轴文字颜色
        }
      }
    },
    yAxis: [
      {
        type: 'value',
        name: '(亿元)',
        nameTextStyle: {
          color: '#393939'
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#eeeeee'
          }
        },
        axisTick: {
          show: false
        },
        axisLine: {
          show: false
        },
        axisLabel: {
          show: true,
          textStyle: {
            color: '#393939'
          }
        }
      },
      {
        type: 'value',
        name: '(%)',
        nameTextStyle: {
          color: '#393939'
        },
        position: 'right',
        splitLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLine: {
          show: false
        },
        axisLabel: {
          show: true,
          textStyle: {
            color: '#393939'
          }
        }
      },
      {
        type: 'value',
        gridIndex: 0,
        min: 50,
        max: 100,
        splitNumber: 8,
        splitLine: {
          show: false
        },
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          show: false
        },
        splitArea: {
          show: false,
          areaStyle: {
            color: ['rgba(250,250,250,0.0)', 'rgba(250,250,250,0.05)']
          }
        }
      }
    ],
    series: [
      // {
      //   name: '净资产收益率',
      //   type: 'line',
      //   yAxisIndex: 1, //使用的 y 轴的 index，在单个图表实例中存在多个 y轴的时候有用
      //   showAllSymbol: true, //显示所有图形。
      //   symbol: 'circle', //标记的图形为实心圆
      //   symbolSize: 10, //标记的大小
      //   itemStyle: {
      //     //折线拐点标志的样式
      //     color: '#feb64e',
      //     borderWidth: '2',
      //     borderColor: '#fff'
      //   },
      //   lineStyle: {
      //     color: '#feb64e'
      //   },
      //   data: compare.value
      // },
      {
        name: '净利润',
        type: 'bar',
        barWidth: 25,
        itemStyle: {
          normal: {
            color: '#4389f9'
          }
        },
        data: value.value
      }
    ]
  }
})
const loading = ref(false)
const dateRange = ref('a')
const dateRange1 = ref('a')
// 查询图表数据
const getChartData = async (obj) => {
  try {
    loading.value = true

    const res = await getStoreStatistics({
      post_params: {
        ...obj
      }
    })

    const result = res.data.pay_changes.reduce(
      (acc, item) => {
        acc.date.push(item.date)
        acc.value.push(item.value)
        acc.compare.push(item.compare)
        return acc
      },
      { date: [], value: [], compare: [] }
    )
    date.value = result.date
    compare.value = result.compare
    value.value = result.value
  } finally {
    loading.value = false
  }
}
const capture = ref(null)
// 切换
const onChange = (num) => {

  dateRange.value = num

  getChartData({
    type: dateRange.value,
    cycle: dateRange1.value
  })

}
function onChangeOne(num) {
  dateRange1.value = num
  getChartData({
    type: dateRange.value,
    cycle: dateRange1.value
  })
}
// 截图方法
const takeScreenshot = () => {
  // 使用 html2canvas 截取 DOM 元素
  if (capture.value) {
    html2canvas(capture.value).then((canvas) => {
      // 将截图转为图片
      const dataUrl = canvas.toDataURL('image/png')
      // 创建一个临时链接来触发下载
      const link = document.createElement('a')
      link.href = dataUrl
      link.download = 'screenshot1.png' // 保存的文件名
      link.click()
    })
  }
}
onMounted(() => {
  getChartData({
    type: dateRange.value,
    cycle: dateRange1.value
  })
})
</script>

<style lang="scss" scoped>
.con {
  display: flex;
  justify-content: right;
  margin-bottom: 10px;

  .title_b {
    width: 20px;
    height: 20px;
    margin-top: 2px;
    display: flex;
    margin-right: 50px;

    img {
      width: 20px;
      height: 20px;
    }
  }
}
</style>
