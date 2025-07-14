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
      info += `<p style="text-align: left;margin-bottom: 10px;font-size: 15px">借款人：<span style="border-bottom: solid 1px;padding: 0 5px">${item.name}</span>，证件号：<span style="border-bottom: solid 1px;padding: 0 5px">${item.id_card}</span>；</p>`
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
      data.pay_price?data.pay_price:0
    }</span>元
（大写：<span style="border-bottom: solid 1px;padding: 0 50px">${convertCurrency(
      data.pay_price?data.pay_price:0
    )}</span>），借款合同编号为<span style="border-bottom: solid 1px;padding: 0 5px">${
      data.over_data.contract_num
    }</span>。</p>
<p style="text-indent: 2em;line-height: 25px;font-size: 15px">兹证明该笔借款已于<span style="border-bottom: solid 1px;padding: 0 10px">${current_year}</span>年<span style="border-bottom: solid 1px;padding: 0 15px">${current_month}</span>月<span style="border-bottom: solid 1px;padding: 0 15px">${current_day}</span>日结清，该借款合同终止。</p>`
    let company = `<p style="text-align: right;margin:30px 0 10px;font-size: 15px">成都市彭州仟加源小额贷款有限责任公司</p>`
    let footer = `<p style="text-align: right;font-size: 15px">${current_year}年${current_month}月${current_day}日</p>`

    let seal = `<img style="width: 200px;height: 200px;position: absolute;bottom: -20px;right: 20px;" src="${sealImg}"/>`

    let html = `${title}${info}${content}${company}${footer}${seal}`
    let body = document.createElement('div')
    body.style.width = '380px'
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
import jsPDF from 'jspdf'
// 债权转让协议
export const zqzrxy = (data) => {  
  return new Promise((resolve, reject) => {
    let title = `<p style="text-align: center;font-size: 30px;margin-bottom: 30px;font-weight: bold">债权转让协议</p>`
    let info = ``
      info += `
      <div style="text-indent: 2em;line-height: 21px">
        <p>J0707-4</p>
        <p style="text-align: right;">协议签订地： 四川成都</p>
        <p><b>甲方（债权转让方）：</b>成都市彭州仟加源小额贷款有限责任公司</p>
        <p>法定代表人:  冯勇</p>
        <p>联系地址：成都市彭州市天彭镇三圣南路 76 号。</p>
        <p>联系电话：028–88508088</p>
        <p><b>乙方（债权受让方）：</b>四川捷艾吉科技有限公司</p>
        <p>法定代表人:   赖江</p>
        <p>住所：四川省绵阳市三台县北坝镇会仙路与涪滨路交汇处翡翠滨江9号楼4单元1层4-1-31号</p>
        <p>联系人： 赖江</p>
        <p>联系电话：18989293000</p>
        <p>甲、乙双方依照诚实信用原则，根据相关法律、法规的规定，就甲方向乙方进 行债权转让事宜，达成一致意见，特签订本协议，以资信守。</p>
        <h4>第一条 债权转让的内容</h4>
        <p>1.1 对甲方向合格借款人发放的贷款而形成的债权，乙方自愿受让该债权，双方 据此签署《债权转让确认单》。</p>
        <p>1.2 与债权转让相关的合同材料及借款人资料，甲方可以通过在线方式传输给乙 方。</p>
        <p>1.3 若该笔债权已向公证处申办了赋予债权文书强制执行效力公证, 甲方就该笔 债权向公证处申请出具执行证书的权利一并转让给乙方，后续由乙方向公证处申请 出具执行证书。</p>
        <h4>第二条 债权转让价款</h4>
        <p>债权转让价格为为转让时的资产对价，包含债权本金、利息、罚息、违约金等， 具体以《债权转让确认单》为准。</p>
        <h4>第三条 价款支付</h4>
        <p>乙方将债权转让价款支付至以下甲方指定的支付账户:</p>
        <p>账户名：  【成都市彭州仟加源小额贷款有限责任公司】</p>
        <p>账户号：  【2527428263891483  】</p>
        <p>开户机构： 【连连银通电子支付有限公司】</p>
        <p>实际债权转让对价金额以实际到账金额为准；如本合同约定债权转让对价金额 的到账日期与实际到账日期不一致的，实际到账时间以甲方系统及相关支付记录的 实际转款时间为准。如实际债权转让对价款分多笔的，约定期限起始日以每笔实际 到款日为准，对应的约定到期日按照到款期限顺延。</p>
        <h4>第四条：债权转让的范围</h4>
        <p>甲方向乙方转让债权的范围包括债权本金、利息、罚息、违约金等（具体以《借 款合同》约定的债务范围为准）。签署本债权转让合同前，乙方已全面了解该债权 存在或可能存在的瑕疵、问题，债权转让后，该债权的权利和风险由乙方自行承担， 因债权不能全部实现、不能实现、无法实现等风险由乙方自行承担。</p>
        <h4>第五条 债权转让的通知</h4>
        <p>甲方授权乙方向借款人发送债权转让通知书，发送形式包括但不限于传真、邮 件、电话、短信等。</p>
        <h4>第六条 双方的陈述和保证</h4>
        <p>6.1 甲方的陈述和保证</p>
        <p>6.1.1 甲方保证其向乙方转让的债权真实、有效。</p>
        <p>6.1.2 甲方保证其在约定的时间内向乙方转让债权，且乙方为该债权的唯一受让 方;</p>
        <p>6.1.3  甲方保证将严格遵循国家及内部相关规定管理处置贷款债权，甲方不采取 任何可能妨碍或限制乙方受让债权后权利行使的单方行动；</p>
        <p>6.1.4  甲方保证在出现借款人违约的情形下，将积极配合乙方办理实现债权和抵 押权（如有抵押登记在甲方名下）的相关手续，包括但不限于办理抵押权变更登记、 协助乙方向公证处申请出具执行证书并向法院申请强制执行（如已办理强制执行公证）等直至乙方债权获得完全清偿，所需费用由乙方承担。</p>
        <p>6.1.5  如果借款人在乙方受让债权后向甲方还款的，甲方应当根据乙方指令将其 转回乙方指定账户。</p>
        <p>6.2 乙方的陈述和保证</p>
        <p>6.2.1 乙方保证其依法设立并有效存续，有权实施本协议项下的债权受让行为并 能独立承担民事责任。</p>
        <p>6.2.2 其受让本协议项下债权已获得其内部权利机构的授权或批准。</p>
        <p>6.2.3 乙方保证其债权受让资金为自有资金，且来源合法，因乙方受让债权资金 问题而导致甲方产生损失的，对甲方的损失，乙方应承担赔偿责任。</p>
        <p>6.2.4 乙方确认此债权转让行为是无追索权的，因债务人到期不履行或不完全履 行其还款义务的，乙方无权向甲方追索。</p>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <h4>第七条 违约责任</h4>
        <p>双方同意，如果一方不履行本协议约定义务，或履行本协议义务不符合约定的， 或违反本协议项下的陈述和保证，均视为违约，违约方应承担因其违约行为而给守 约方造成的全部损失。</p>
        <h4>第八条 保密</h4>
        <p>双方一致同意，对本协议在签署和履行过程中获得的对方的有关资料负有保密 义务。非因履行本协议需要或非经对方当事人书面同意，不得向任何第三方直接或 间接披露；双方进一步确认，其将采取一切必要措施，以防止其任何关联公司、雇 员、代理人或任何其他人员非法使用或披露任何保密信息资料。任何一方违反本条 约定，给对方造成损失的，均应承担相应的违约责任并向对方赔偿因此受到的全部 损失。</p>
        <h4>第九条 其他约定</h4>
        <p>9.1 对本协议所作出的任何修改及补充，必须采用书面形式由双方签字并盖章确 认。</p>
        <p>9.2 在执行本协议过程中发生的任何争议，双方应友好协商解决，协商未果的，任何一方均可向甲方所在地的人民法院提起诉讼。</p>
        <p>9.3 本协议经双方通过有效认证的电子签章签署后生效。</p>
        <p>9.4 本协议一式贰份，双方各执壹份，均具有同等法律效力。</p>
        <p>9.5  双方在本合同中填写的地址为其有效的通讯地址，若因本合同发生纠纷诉讼 至法院，则以上通讯地址即为法律文书的送达地址。一方或司法机关以上述通讯地 址给另一方邮寄材料、通知的， 自寄递之日起第三日视为有效送达。若一方通讯地 址发生变动，应在 3  日内以书面方式通知对方；未书面通知的，视为通讯地址和诉 讼送达地址未作变更，变动方应自行承担相应损失和法律责任。</p>
        <p>【以下为签章部分，无正文】</p>
        <div style="height:40px"></div>
        <div style="position: relative;">
          <p>甲方： 成都市彭州仟加源小额贷款有限责任公司</p>
          <p>签订日期：2025年07月07日</p>
          <img style="width: 130px;height: 130px; position: absolute; left: 160px;top:-40px" src="http://localhost:5174/src/assets/seal.png" />
        </div>
        <div style="height:60px"></div>
        <div style="position: relative;">
          <p>乙方：</p>
          <p>签订日期：2025年07月07日</p>
          <img style="width: 130px;height: 130px; position: absolute; left: 160px;top:-40px" src="http://localhost:5174/src/assets/seal.png" />
        </div>
      </div>
      `
    let html = `${title}${info}`
    // 2. 创建主容器
    const container = document.createElement('div')
    container.innerHTML = html
    container.style.width = '794px' // A4 尺寸 px
    container.style.padding = '40px'
    container.style.background = '#fff'
    container.style.position = 'absolute'
    container.style.top = '-10000px'
    container.style.left = '0'
    container.style.fontSize = '14px'
    document.body.appendChild(container)

    html2canvas(container, { scale: 2 }).then(canvas => {
      const imgData = canvas.toDataURL('image/jpeg')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgWidth = 210
      const pageHeight = 297
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      let heightLeft = imgHeight
      let position = 0

      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
      while (heightLeft > 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }
      pdf.save('转让')
      resolve()
      document.body.removeChild(container)
    }).catch(err => {
      reject(err)
      document.body.removeChild(container)
    })
  })
}
