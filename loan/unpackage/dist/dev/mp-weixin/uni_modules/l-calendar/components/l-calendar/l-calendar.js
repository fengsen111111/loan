"use strict";
const common_vendor = require("../../../../common/vendor.js");
const uni_modules_lCalendar_components_lCalendar_calendar = require("./calendar.js");
const _sfc_main = {
  name: "lCalendar",
  props: {
    //双向绑定的值 用于展示/关闭日历
    visible: {
      type: Boolean,
      default: false
    },
    //是否选择范围 true是 false选择单个日期
    isRange: {
      type: Boolean,
      default: false
    },
    //可切换最大年份
    maxYear: {
      type: Number,
      default: 2100
    },
    //可切换最小年份
    minYear: {
      type: Number,
      default: 1920
    },
    //最小可选日期 不在范围内日期禁选
    minDate: {
      type: String,
      default: "1920-01-01"
    },
    //最大可选日期
    maxDate: {
      type: String,
      default: (/* @__PURE__ */ new Date()).getFullYear() + 100 + "-12-31"
    },
    //组件标题
    title: {
      type: String,
      default: "日期选择"
    },
    //月份切换箭头颜色
    monthChangeColor: {
      type: String,
      default: "#999"
    },
    //年份切换箭头颜色
    yearChangeColor: {
      type: String,
      default: "#bfbfbf"
    },
    //默认日期字体颜色
    color: {
      type: String,
      default: "#333"
    },
    //选中日期字体颜色
    activeColor: {
      type: String,
      default: "#fff"
    },
    //选中日期背景色
    activeBgColor: {
      type: String,
      default: "#55BBF9"
    },
    //范围内日期背景色
    rangeBgColor: {
      type: String,
      default: "rgba(85, 187, 249, 0.1)"
    },
    //范围内日期字体颜色
    rangeColor: {
      type: String,
      default: "#55BBF9"
    },
    //范围选择时生效 开始日期自定义文字
    startText: {
      type: String,
      default: "开始"
    },
    //范围选择时生效 结束日期自定义文字
    endText: {
      type: String,
      default: "结束"
    },
    //是否显示农历
    lunar: {
      type: Boolean,
      default: true
    },
    //初始化开始选中日期 格式： 2020-06-06 或 2020/06/06
    initStartDate: {
      type: String,
      default: ""
    },
    //初始化结束日期 格式： 2020-06-06 或 2020/06/06
    initEndDate: {
      type: String,
      default: ""
    },
    idCard: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      weekday: 1,
      // 星期几,值为1-7
      weekdayArr: [],
      days: 0,
      //当前月有多少天
      daysArr: [],
      showTitle: "",
      //当前年月标题
      year: 2020,
      month: 0,
      day: 0,
      startYear: 0,
      startMonth: 0,
      startDay: 0,
      endYear: 0,
      endMonth: 0,
      endDay: 0,
      today: "",
      //今天的日期
      activeDate: "",
      //当前选中日期
      startDate: "",
      //范围选择时的选中开始日期
      endDate: "",
      //范围选择时的选中结束日期
      isStart: true,
      min: null,
      max: null,
      dateHeight: 20
    };
  },
  computed: {
    dataChange() {
      return `${this.type}-${this.minDate}-${this.maxDate}-${this.initStartDate}-${this.initEndDate}`;
    },
    disabled() {
      return this.isRange && (!this.startDate || !this.endDate);
    }
  },
  watch: {
    dataChange(val) {
      this.init();
    }
  },
  created() {
    this.init();
  },
  methods: {
    getColor(index, type) {
      let color = type == 1 ? "" : this.color;
      let day = index + 1;
      let date = `${this.year}-${this.month}-${day}`;
      let timestamp = new Date(date.replace(/\-/g, "/")).getTime();
      let start = this.startDate.replace(/\-/g, "/");
      let end = this.endDate.replace(/\-/g, "/");
      if (this.activeDate == date || this.startDate == date || this.endDate == date) {
        color = type == 1 ? this.activeBgColor : this.activeColor;
      } else if (this.endDate && timestamp > new Date(start).getTime() && timestamp < new Date(end).getTime()) {
        color = type == 1 ? this.rangeBgColor : this.rangeColor;
      }
      return color;
    },
    getText(index, startDate, endDate) {
      let text = this.lunar ? this.getLunar(this.year, this.month, index + 1) : "";
      if (this.isRange) {
        if (this.lunar) {
          let date = `${this.year}-${this.month}-${index + 1}`;
          if (startDate == date && startDate != endDate) {
            text = this.startText;
          } else if (endDate == date) {
            text = this.endText;
          }
        }
      }
      return text;
    },
    getLunar(year, month, day) {
      let obj = uni_modules_lCalendar_components_lCalendar_calendar.calendar.solar2lunar(year, month, day);
      if (obj.IDayCn == "初一") {
        return obj.IMonthCn;
      }
      return obj.IDayCn;
    },
    init() {
      this.dateHeight = common_vendor.index.getSystemInfoSync().windowWidth / 7;
      let now = /* @__PURE__ */ new Date();
      this.year = now.getFullYear();
      this.month = now.getMonth() + 1;
      this.day = now.getDate();
      this.today = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
      this.activeDate = this.today;
      this.min = this.initDate(this.minDate);
      this.max = this.initDate(this.maxDate);
      if (this.isDisable(this.year, this.month, this.day)) {
        this.year = this.min.year;
        this.month = this.min.month;
        this.day = this.min.day;
        this.activeDate = `${this.min.year}-${this.min.month}-${this.min.day}`;
        this.max = this.initDate(this.maxDate || this.minDate);
      }
      this.startDate = "";
      this.startYear = 0;
      this.startMonth = 0;
      this.startDay = 0;
      if (this.initStartDate) {
        let start = new Date(this.initStartDate.replace(/\-/g, "/"));
        if (!this.isRange) {
          this.year = start.getFullYear();
          this.month = start.getMonth() + 1;
          this.day = start.getDate();
          this.activeDate = `${start.getFullYear()}-${start.getMonth() + 1}-${start.getDate()}`;
        } else {
          this.startDate = `${start.getFullYear()}-${start.getMonth() + 1}-${start.getDate()}`;
          this.startYear = start.getFullYear();
          this.startMonth = start.getMonth() + 1;
          this.startDay = start.getDate();
          this.activeDate = "";
        }
      }
      this.endYear = 0;
      this.endMonth = 0;
      this.endDay = 0;
      this.endDate = "";
      if (this.initEndDate && this.isRange) {
        let end = new Date(this.initEndDate.replace(/\-/g, "/"));
        this.endDate = `${end.getFullYear()}-${end.getMonth() + 1}-${end.getDate()}`;
        this.endYear = end.getFullYear();
        this.endMonth = end.getMonth() + 1;
        this.endDay = end.getDate();
        this.activeDate = "";
        this.year = end.getFullYear();
        this.month = end.getMonth() + 1;
        this.day = end.getDate();
      }
      this.isStart = true;
      this.changeData();
    },
    //日期处理
    initDate(date) {
      let dateArr = date.split("-");
      return {
        year: Number(dateArr[0] || 1920),
        month: Number(dateArr[1] || 1),
        day: Number(dateArr[2] || 1)
      };
    },
    isDisable(year, month, day) {
      let bool = true;
      let date = `${year}/${month}/${day}`;
      let min = `${this.min.year}/${this.min.month}/${this.min.day}`;
      let max = `${this.max.year}/${this.max.month}/${this.max.day}`;
      let timestamp = new Date(date).getTime();
      if (timestamp >= new Date(min).getTime() && timestamp <= new Date(max).getTime()) {
        bool = false;
      }
      return bool;
    },
    generateArray(start, end) {
      return Array.from(new Array(end + 1).keys()).slice(start);
    },
    formatNum(num) {
      return num < 10 ? "0" + num : num + "";
    },
    //一个月有多少天
    getMonthDay(year, month) {
      let days = new Date(year, month, 0).getDate();
      return days;
    },
    // 获取当前日期是星期几
    getWeekday(year, month) {
      let date = /* @__PURE__ */ new Date(`${year}/${month}/01 00:00:00`);
      return date.getDay();
    },
    changeMonth(isAdd) {
      if (isAdd) {
        let month = this.month + 1;
        let year = month > 12 ? this.year + 1 : this.year;
        if (year > this.minYear || year < this.maxYear) {
          this.month = month > 12 ? 1 : month;
          this.year = year;
          this.changeData();
        }
      } else {
        let month = this.month - 1;
        let year = month < 1 ? this.year - 1 : this.year;
        if (year > this.minYear || year < this.maxYear) {
          this.month = month < 1 ? 12 : month;
          this.year = year;
          this.changeData();
        }
      }
    },
    changeYear(isAdd) {
      let year = isAdd ? this.year + 1 : this.year - 1;
      if (year > this.minYear || year < this.maxYear) {
        this.year = year;
        this.changeData();
      }
    },
    changeData() {
      this.days = this.getMonthDay(this.year, this.month);
      this.daysArr = this.generateArray(1, this.days);
      this.weekday = this.getWeekday(this.year, this.month);
      this.weekdayArr = this.generateArray(1, this.weekday);
      this.showTitle = `${this.year}年${this.month}月`;
    },
    dateClick: function(day) {
      if (day === -1 && this.isStart)
        return;
      if (day === -1 && !this.isStart) {
        let date = `${this.year}-${this.month}-${day}`;
        if (this.isStart) {
          this.startDate = date;
          this.startYear = this.year;
          this.startMonth = this.month;
          this.startDay = this.day;
          this.endYear = 0;
          this.endMonth = 0;
          this.endDay = 0;
          this.endDate = "";
          this.activeDate = "";
          this.isStart = false;
        } else {
          this.endDate = "长期";
          this.endYear = 0;
          this.endMonth = 0;
          this.endDay = 0;
          this.isStart = true;
        }
        return;
      }
      day += 1;
      if (!this.isDisable(this.year, this.month, day)) {
        this.day = day;
        let date = `${this.year}-${this.month}-${day}`;
        if (!this.isRange) {
          this.activeDate = date;
        } else {
          let compare = new Date(date.replace(/\-/g, "/")).getTime() < new Date(this.startDate.replace(
            /\-/g,
            "/"
          )).getTime();
          if (this.isStart || compare) {
            this.startDate = date;
            this.startYear = this.year;
            this.startMonth = this.month;
            this.startDay = this.day;
            this.endYear = 0;
            this.endMonth = 0;
            this.endDay = 0;
            this.endDate = "";
            this.activeDate = "";
            this.isStart = false;
          } else {
            this.endDate = date;
            this.endYear = this.year;
            this.endMonth = this.month;
            this.endDay = this.day;
            this.isStart = true;
          }
        }
      }
    },
    hide() {
      this.$emit("cancel");
    },
    getWeekText(date) {
      date = /* @__PURE__ */ new Date(`${date.replace(/[-.]/g, "/")} 00:00:00`);
      let week = date.getDay();
      return "星期" + ["日", "一", "二", "三", "四", "五", "六"][week];
    },
    confireBtnClick(show) {
      if (this.disabled)
        return;
      if (!show) {
        this.hide();
      }
      if (!this.isRange) {
        let arr = this.activeDate.split("-");
        let year = +arr[0];
        let month = +arr[1];
        let day = +arr[2];
        let days = this.getMonthDay(year, month);
        let result = `${year}-${this.formatNum(month)}-${this.formatNum(day)}`;
        let weekText = this.getWeekText(result);
        let isToday = false;
        if (`${year}-${month}-${day}` == this.today) {
          isToday = true;
        }
        let lunar = uni_modules_lCalendar_components_lCalendar_calendar.calendar.solar2lunar(year, month, day);
        this.$emit("confirm", {
          year,
          month,
          day,
          days,
          result,
          week: weekText,
          isToday,
          lunar
        });
      } else {
        if (!this.startDate || !this.endDate)
          return;
        let startMonth = this.formatNum(this.startMonth);
        let startDay = this.formatNum(this.startDay);
        let startDate = `${this.startYear}/${startMonth}/${startDay}`;
        let startWeek = this.getWeekText(startDate);
        let startLunar = uni_modules_lCalendar_components_lCalendar_calendar.calendar.solar2lunar(this.startYear, startMonth, startDay);
        let endMonth = this.formatNum(this.endMonth);
        let endDay = this.formatNum(this.endDay);
        let endDate = "";
        if (this.endDate !== "长期") {
          endDate = `${this.endYear}/${endMonth}/${endDay}`;
        } else {
          endDate = this.endDate;
        }
        let endWeek = this.getWeekText(endDate);
        let endLunar = uni_modules_lCalendar_components_lCalendar_calendar.calendar.solar2lunar(this.endYear, endMonth, endDay);
        this.$emit("confirm", {
          startYear: this.startYear,
          startMonth: this.startMonth,
          startDay: this.startDay,
          startDate,
          startWeek,
          startLunar,
          endYear: this.endYear,
          endMonth: this.endMonth,
          endDay: this.endDay,
          endDate,
          endWeek,
          endLunar
        });
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($props.title),
    b: common_vendor.o((...args) => $options.hide && $options.hide(...args)),
    c: $props.yearChangeColor,
    d: common_vendor.o(($event) => $options.changeYear(false)),
    e: $props.monthChangeColor,
    f: common_vendor.o(($event) => $options.changeMonth(false)),
    g: common_vendor.t($data.showTitle),
    h: $props.monthChangeColor,
    i: common_vendor.o(($event) => $options.changeMonth(true)),
    j: $props.yearChangeColor,
    k: common_vendor.o(($event) => $options.changeYear(true)),
    l: $props.idCard
  }, $props.idCard ? {
    m: common_vendor.o(($event) => $options.dateClick(-1))
  } : {}, {
    n: common_vendor.f($data.weekdayArr, (item, index, i0) => {
      return {
        a: index
      };
    }),
    o: common_vendor.f($data.daysArr, (item, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(index + 1),
        b: common_vendor.t($options.getText(index, $data.startDate, $data.endDate)),
        c: $options.getColor(index, 2),
        d: !$props.lunar && $props.isRange && $data.startDate == `${$data.year}-${$data.month}-${index + 1}` && $data.startDate != $data.endDate
      }, !$props.lunar && $props.isRange && $data.startDate == `${$data.year}-${$data.month}-${index + 1}` && $data.startDate != $data.endDate ? {
        e: common_vendor.t($props.startText),
        f: $props.activeColor
      } : {}, {
        g: !$props.lunar && $props.isRange && $data.endDate == `${$data.year}-${$data.month}-${index + 1}`
      }, !$props.lunar && $props.isRange && $data.endDate == `${$data.year}-${$data.month}-${index + 1}` ? {
        h: common_vendor.t($props.endText),
        i: $props.activeColor
      } : {}, {
        j: $options.isDisable($data.year, $data.month, index + 1) ? 1 : "",
        k: $props.isRange && $data.startDate == `${$data.year}-${$data.month}-${index + 1}` || !$props.isRange ? 1 : "",
        l: $props.isRange && $data.endDate == `${$data.year}-${$data.month}-${index + 1}` || !$props.isRange ? 1 : "",
        m: $options.getColor(index, 1),
        n: index,
        o: common_vendor.o(($event) => $options.dateClick(index), index)
      });
    }),
    p: $data.dateHeight + "px",
    q: common_vendor.t($data.month),
    r: $data.dateHeight * 6 + "px",
    s: common_vendor.t(!$props.isRange ? $data.activeDate : $data.startDate),
    t: $data.endDate
  }, $data.endDate ? {
    v: common_vendor.t($data.endDate)
  } : {}, {
    w: $options.disabled ? ".5" : "1",
    x: $options.disabled,
    y: common_vendor.o(($event) => $options.confireBtnClick(false)),
    z: $props.visible ? 1 : "",
    A: common_vendor.n($props.visible ? "mask-show" : ""),
    B: common_vendor.o((...args) => $options.hide && $options.hide(...args)),
    C: common_vendor.o(() => {
    })
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-665735f1"]]);
wx.createComponent(Component);
