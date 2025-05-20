import html2canvas from 'html2canvas'
const sealImg = new URL('@/assets/seal.png', import.meta.url).href
const convertCurrency = (money) => {
  var cnNums = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
  var cnIntRadice = ['', '拾', '佰', '仟']
  var cnIntUnits = ['', '万', '亿', '兆']
  var cnDecUnits = ['角', '分', '毫', '厘']
  var cnInteger = '整'
  var cnIntLast = '元'
  var maxNum = 999999999999999.9999
  let integerNum = ''
  let decimalNum = ''
  var chineseStr = ''
  let parts = []
  if (money === '') {
    return ''
  }
  money = parseFloat(money)
  if (money >= maxNum) {
    return ''
  }
  if (money === 0) {
    chineseStr = cnNums[0] + cnIntLast + cnInteger
    return chineseStr
  }
  money = money.toString()
  if (money.indexOf('.') === -1) {
    integerNum = money
    decimalNum = ''
  } else {
    parts = money.split('.')
    integerNum = parts[0]
    decimalNum = parts[1].substr(0, 4)
  }
  if (parseInt(integerNum, 10) > 0) {
    var zeroCount = 0
    var IntLen = integerNum.length
    for (var i = 0; i < IntLen; i++) {
      var n = integerNum.substr(i, 1)
      var p = IntLen - i - 1
      var q = p / 4
      var m = p % 4
      if (n === '0') {
        zeroCount++
      } else {
        if (zeroCount > 0) {
          chineseStr += cnNums[0]
        }
        zeroCount = 0
        chineseStr += cnNums[parseInt(n)] + cnIntRadice[m]
      }
      if (m === 0 && zeroCount < 4) {
        chineseStr += cnIntUnits[q]
      }
    }
    chineseStr += cnIntLast
  }
  if (decimalNum !== '') {
    var decLen = decimalNum.length
    for (i = 0; i < decLen; i++) {
      n = decimalNum.substr(i, 1)
      if (n !== '0') {
        chineseStr += cnNums[Number(n)] + cnDecUnits[i]
      }
    }
  }
  if (chineseStr === '') {
    chineseStr += cnNums[0] + cnIntLast + cnInteger
  } else if (decimalNum === '') {
    chineseStr += cnInteger
  }
  return chineseStr
}

export const getSettle = (data) => {
  return new Promise((resolve, reject) => {
    let title = `<p style="text-align: center;font-size: 30px;margin-bottom: 30px;font-weight: bold">结清证明</p>`
    let info = ``
    data.over_data.persons.forEach((item) => {
      info += `<p style="text-align: center;margin-bottom: 10px;font-size: 15px">借款人：<span style="border-bottom: solid 1px;padding: 0 5px">${item.name}</span>，证件号：<span style="border-bottom: solid 1px;padding: 0 5px">${item.id_card}</span>；</p>`
    })
    data.over_data.create_time *= 1000
    let year = new Date(data.over_data.create_time).getFullYear()
    let month =
      new Date(data.over_data.create_time).getMonth() + 1 < 10
        ? `0${new Date(data.over_data.create_time).getMonth() + 1}`
        : new Date(data.over_data.create_time).getMonth() + 1
    let day =
      new Date(data.over_data.create_time).getDate() < 10
        ? `0${new Date(data.over_data.create_time).getDate()}`
        : new Date(data.over_data.create_time).getDate()
    let current_year = new Date().getFullYear()
    let current_month = new Date().getMonth() + 1 < 10 ? `0${new Date().getMonth() + 1}` : new Date().getMonth() + 1
    let current_day = new Date().getDate() < 10 ? `0${new Date().getDate()}` : new Date().getDate()
    let content = `<p style="text-indent: 2em;margin-bottom: 10px;line-height: 25px;font-size: 15px">于<span style="border-bottom: solid 1px;padding: 0 5px">${year}</span>年<span style="border-bottom: solid 1px;padding: 0 5px">${month}</span>月<span style="border-bottom: solid 1px;padding: 0 5px">${day}</span>日借款人民币<span style="border-bottom: solid 1px;padding: 0 5px">${
      data.over_data.pay_price
    }</span>元
（大写：<span style="border-bottom: solid 1px;padding: 0 50px">${convertCurrency(
      data.over_data.pay_price
    )}</span>），借款合同编号为<span style="border-bottom: solid 1px;padding: 0 5px">${
      data.over_data.contract_num
    }</span>。</p>
<p style="text-indent: 2em;line-height: 25px;font-size: 15px">兹证明该笔借款已于<span style="border-bottom: solid 1px;padding: 0 10px">${current_year}</span>年<span style="border-bottom: solid 1px;padding: 0 15px">${current_month}</span>月<span style="border-bottom: solid 1px;padding: 0 15px">${current_day}</span>日结清，该借款合同终止。</p>`
    let company = `<p style="text-align: right;margin:30px 0 10px;font-size: 15px">成都市彭州仟加源小额贷款有限责任公司</p>`
    let footer = `<p style="text-align: right;font-size: 15px">${current_year}年${current_month}月${current_day}日</p>`

    let seal = `<img style="width: 200px;height: 200px;position: absolute;bottom: -20px;right: 20px;" src="${sealImg}"/>`

    let html = `${title}${info}${content}${company}${footer}${seal}`
    let body = document.createElement('div')
    body.style.width = '375px'
    body.style.margin = '0 auto'
    body.style.padding = '50px'
    body.style.position = 'fixed'
    body.style.bottom = '100%'
    body.style.left = '0'
    body.innerHTML = html
    document.body.appendChild(body)

    // 使用html2canvas异步转换body
    html2canvas(body).then((canvas) => {
      canvas.toBlob((blob) => {
        let img = URL.createObjectURL(blob)
        resolve({
          url: img,
          blob
        })
      })
    })
  })
}
