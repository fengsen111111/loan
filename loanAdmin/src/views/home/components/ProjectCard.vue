<template>
  <div size="medium" ref="capture">
    <div>
      <a-row type=" flex" style="margin-bottom: 20px">
        <a-col :flex="2" class="card_a">
          <div class="card_a_title">本周合同签约金额 (元) / 周</div>
          <div class="card_a_num">￥{{ obj?.sign_price.week }}</div>
          <div class="card_a_bi">
            <div class="card_a_bi——left">
              <p>周环比</p>

              <span>{{ obj?.sign_price.week_compare }}</span> <img src="../../../assets/images/jc.png" alt="" />
            </div>
            <div class="card_a_bi——right">
              <p>日环比</p>

              <span>{{ obj?.sign_price.day_compare }}</span><img src="../../../assets/images/jg.png" alt="" />
            </div>
          </div>
          <div class="card_a_today">
            昨日签约金额 <span>￥{{ obj?.sign_price.yesterday }}</span>
          </div>
        </a-col>
        <a-col :flex="2" class="card_a">
          <div class="card_a_title">本周签约数量(笔)/ 周</div>
          <div class="card_a_num">￥{{ obj?.sign_number.week }}</div>
          <div class="card_a_bi">
            <div class="card_a_bi——left">
              <p>周环比</p>

              <span>{{ obj?.sign_number.week_compare }}</span> <img src="../../../assets/images/jc.png" alt="" />
            </div>
            <div class="card_a_bi——right">
              <p>日环比</p>

              <span>{{ obj?.sign_number.day_compare }}</span><img src="../../../assets/images/jg.png" alt="" />
            </div>
          </div>
          <div class="card_a_today">
            昨日签约数量 <span>￥{{ obj?.sign_number.yesterday }}</span>
          </div>
        </a-col>
        <a-col :flex="4" class="card_b">
          <div class="card_b_title">
            <div class="title_a">我的待办任务</div>
            <div class="title_b">
              <img style="margin-right: 30px" src="../../../assets/images/baocun.png" alt="" @click="takeScreenshot" />
              <img src="../../../assets/images/shuaxin.png" alt="" @click="Statistics" />
            </div>
          </div>
          <div class="card_b_con">
            <div class="card_b_con_left">
              <img src="../../../assets/images/lian.png" alt="" />
              <p>授信审批待办任务量</p>
            </div>
            <div class="card_b_con_right">
              <p>{{ obj?.wait_check_number }}</p>
              <img src="../../../assets/images/xiangxia.png" alt="" @click="navation" />
            </div>
          </div>
        </a-col>
      </a-row>
      <a-row type="flex">
        <a-col :flex="2" class="card_a">
          <div class="card_a_title">本周交易金额 (元) / 周</div>
          <div class="card_a_num">￥{{ obj?.pay_price.week }}</div>
          <div class="card_a_bi">
            <div class="card_a_bi——left">
              <p>周环比</p>

              <span>{{ obj?.pay_price.week_compare }}</span> <img src="../../../assets/images/jc.png" alt="" />
            </div>
            <div class="card_a_bi——right">
              <p>日环比</p>

              <span>{{ obj?.pay_price.day_compare }}</span><img src="../../../assets/images/jg.png" alt="" />
            </div>
          </div>
          <div class="card_a_today">
            昨日交易金额 <span>￥{{ obj?.pay_price.yesterday }}</span>
          </div>
        </a-col>
        <a-col :flex="2" class="card_a">
          <div class="card_a_title">本周交易数量 (笔) / 周</div>
          <div class="card_a_num">￥{{ obj?.pay_number.week }}</div>
          <div class="card_a_bi">
            <div class="card_a_bi——left">
              <p>周环比</p>

              <span>{{ obj?.pay_number.week_compare }}</span> <img src="../../../assets/images/jc.png" alt="" />
            </div>
            <div class="card_a_bi——right">
              <p>日环比</p>

              <span>{{ obj?.pay_number.day_compare }}</span><img src="../../../assets/images/jg.png" alt="" />
            </div>
          </div>
          <div class="card_a_today">
            昨日交易数量 <span>￥{{ obj?.pay_number.yesterday }}</span>
          </div>
        </a-col>
        <a-col :flex="4" class="card_c">
          <div class="card_c_title">
            <div class="title_a">综合统计</div>
            <div class="title_b">
              <img style="margin-right: 30px" src="../../../assets/images/baocun.png" alt="" @click="takeScreenshot" />
              <img src="../../../assets/images/shuaxin.png" @click="Statistics" alt="" />
            </div>
          </div>
          <div class="card_c_con">
            <div class="card_c_cona">
              <div class="title">累计合同签约金额 (元)</div>
              <div class="num">{{ obj?.all_sign_price }}</div>
            </div>
            <div class="card_c_cona">
              <div class="title">累计交易金额(元)</div>
              <div class="num">{{ obj?.all_pay_price }}</div>
            </div>
            <div class="card_c_cona">
              <div class="title">累计合同签约笔数 (笔)</div>
              <div class="num">{{ obj?.all_sign_number }}</div>
            </div>
            <div class="card_c_cona">
              <div class="title">累计交易笔数(笔)</div>
              <div class="num">{{ obj?.all_pay_number }}</div>
            </div>
          </div>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import html2canvas from 'html2canvas';
import { getStoreStatistics } from '@/apis'
const router = useRouter()
const obj = ref(null)

const Statistics = async () => {
  try {
    const res = await getStoreStatistics({
      post_params: {}
    })

    obj.value = res.data
    // console.log(res, obj, '2222222222222')
    return true
  } catch (error) {
    return false
  }
}
function navation() {
  router.push('/loanManagement/approval')
}
const capture = ref(null);
// 截图方法
const takeScreenshot = () => {
  // 使用 html2canvas 截取 DOM 元素
  if (capture.value) {
    html2canvas(capture.value).then((canvas) => {
      // 将截图转为图片
      const dataUrl = canvas.toDataURL('image/png');

      // 创建一个临时链接来触发下载
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'screenshot.png';  // 保存的文件名
      link.click();
    });
  }
}

onMounted(() => {
  Statistics()
})
</script>

<style lang="scss" scoped>
:deep(.arco-card) {
  height: 100%;

  .arco-card-body {
    height: 100%;
    box-sizing: border-box;
  }
}

:deep(.arco-card-header) {
  border: none;
}

:deep(.arco-card-grid) {
  box-shadow: none !important;

  background-color: #fff;
}

.item {
  height: 100%;
  display: flex;
  flex-direction: column;

  &__header {
    display: flex;
    align-items: center;
  }

  &__name {
    margin-left: 10px;
    font-size: 1.125rem;
    line-height: 1.75rem;
    color: var(--color-text-1);

    &:hover {
      color: rgb(var(--arcoblue-6));
    }
  }

  &__middle {
    flex: 1;
  }

  &__desc {
    flex: 1;
    margin-top: 10px;
    line-height: 1.5;
    color: var(--color-text-2);
  }

  &__footer {
    font-size: 12px;
    color: var(--color-text-3);
    margin-top: 8px;
  }
}

.card_a {
  background-color: #fff;
  margin-right: 10px;
  height: 180px;
  border-radius: 10px 10px 10px 10px;
  padding: 20px 20px;

  .card_a_title {
    margin-top: 10px;
    font-family: PingFang SC, PingFang SC;
    font-weight: bold;
    font-size: 12px;
  }

  .card_a_num {
    font-family: PingFang SC, PingFang SC;
    font-weight: bold;
    font-size: 28px;
    color: #f97e39;

    margin-top: 10px;
    margin-bottom: 10px;
  }

  .card_a_bi {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    margin-bottom: 10px;
    font-family: PingFang SC, PingFang SC;
    font-weight: bold;
    font-size: 12px;
    color: #333333;

    .card_a_bi——left {
      display: flex;

      img {
        width: 16px;
        height: 14px;
        margin-top: 1px;
      }

      span {
        font-family: PingFang SC, PingFang SC;
        font-weight: bold;
        font-size: 12px;
        color: #ff0000;
        margin-left: 18px;
        margin-right: 8px;
      }
    }

    .card_a_bi——right {
      display: flex;

      img {
        width: 16px;
        height: 14px;
        margin-top: 1px;
      }

      span {
        font-family: PingFang SC, PingFang SC;
        font-weight: bold;
        font-size: 12px;
        color: #50cc7f;
        margin-left: 18px;
        margin-right: 8px;
      }
    }
  }

  .card_a_today {
    margin-top: 20px;

    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 12px;
    color: #333333;

    span {
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 12px;
      color: #f97e39;
      margin-left: 10px;
    }
  }
}

.card_c {
  background-color: #fff;
  height: 241px;
  margin-top: -61px;
  padding: 20px 20px;
  border-radius: 10px 10px 10px 10px;

  .card_c_title {
    font-family: PingFang SC, PingFang SC;
    font-weight: bold;
    font-size: 16px;
    color: #333333;
    display: flex;
    justify-content: space-between;

    img {
      width: 20px;
      height: 20px;
      margin-top: 1px;
    }
  }

  .card_c_con {
    .card_c_cona {
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
      margin-bottom: 20px;

      .title {
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        font-size: 16px;
        color: #333333;
      }

      .num {
        font-family: PingFang SC, PingFang SC;
        font-weight: 800;
        font-size: 16px;
        color: #f97e39;
      }
    }
  }
}

.card_b {
  background-color: #fff;
  height: 119px;
  padding: 20px 20px;
  border-radius: 10px 10px 10px 10px;

  .card_b_title {
    font-family: PingFang SC, PingFang SC;
    font-weight: bold;
    font-size: 16px;
    color: #333333;
    display: flex;
    justify-content: space-between;

    img {
      width: 20px;
      height: 20px;
      margin-top: 1px;
    }
  }

  .card_b_con {
    margin-top: 15px;
    display: flex;
    justify-content: space-between;
    height: 40px;
    line-height: 40px;
    background: #f1f3f7;
    padding: 0 20px;
    border-radius: 10px 10px 10px 10px;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 16px;
    color: #333333;

    .card_b_con_left {
      display: flex;

      img {
        width: 15px;
        height: 20px;
        margin-top: 10px;
        margin-right: 10px;
      }
    }

    .card_b_con_right {
      display: flex;

      p {
        font-family: Microsoft YaHei, Microsoft YaHei;
        font-weight: bold;
        font-size: 16px;
        color: #f97e39;
        margin-right: 10px;
      }

      img {
        width: 10px;
        height: 10px;
        transform: rotate(270deg);
        margin-top: 15px;
      }
    }
  }
}
</style>
