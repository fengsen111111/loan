"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const utils_jump = require("../../utils/jump.js");
const bankList = [
  {
    node: {
      id: "1",
      bank_name: "中国农业银行",
      bank_code: "01030000"
    }
  },
  {
    node: {
      id: "2",
      bank_name: "大连银行（大连市商业银行）",
      bank_code: "04202220"
    }
  },
  {
    node: {
      id: "3",
      bank_name: "中国建设银行",
      bank_code: "01050000"
    }
  },
  {
    node: {
      id: "4",
      bank_name: "汉口银行（武汉市商业银行）",
      bank_code: "04145210"
    }
  },
  {
    node: {
      id: "5",
      bank_name: "AEON信贷财务亚洲有限公司",
      bank_code: "25260344"
    }
  },
  {
    node: {
      id: "6",
      bank_name: "河南省农村信用社联合社",
      bank_code: "14404900"
    }
  },
  {
    node: {
      id: "7",
      bank_name: "广东省农村信用社联合社",
      bank_code: "14505800"
    }
  },
  {
    node: {
      id: "8",
      bank_name: "南洋商业银行",
      bank_code: "03320000"
    }
  },
  {
    node: {
      id: "9",
      bank_name: "湖北银行（襄樊市商业银行股份有限公司）",
      bank_code: "05755200"
    }
  },
  {
    node: {
      id: "10",
      bank_name: "渣打银行香港有限公司",
      bank_code: "03220000"
    }
  },
  {
    node: {
      id: "11",
      bank_name: "东亚银行中国有限公司",
      bank_code: "03200000"
    }
  },
  {
    node: {
      id: "12",
      bank_name: "七台河市城市信用社",
      bank_code: "05332740"
    }
  },
  {
    node: {
      id: "13",
      bank_name: "泰安银行（泰安市商业银行）",
      bank_code: "05284630"
    }
  },
  {
    node: {
      id: "14",
      bank_name: "恒生银行",
      bank_code: "03260000"
    }
  },
  {
    node: {
      id: "15",
      bank_name: "广西鹿寨渝农商村镇银行",
      bank_code: "15566152"
    }
  },
  {
    node: {
      id: "16",
      bank_name: "昆山农信社",
      bank_code: "14023052"
    }
  },
  {
    node: {
      id: "17",
      bank_name: "普洱民生村镇银行",
      bank_code: "15277470"
    }
  },
  {
    node: {
      id: "18",
      bank_name: "齐鲁银行（济南市商业银行）",
      bank_code: "64094510"
    }
  },
  {
    node: {
      id: "19",
      bank_name: "鞍山银行（鞍山市商业银行）",
      bank_code: "04562230"
    }
  },
  {
    node: {
      id: "20",
      bank_name: "金华银行股份有限公司（金华市商业银行）",
      bank_code: "04263380"
    }
  },
  {
    node: {
      id: "21",
      bank_name: "无锡市商业银行",
      bank_code: "04453020"
    }
  },
  {
    node: {
      id: "22",
      bank_name: "中国银行香港有限公司",
      bank_code: "47980344"
    }
  },
  {
    node: {
      id: "23",
      bank_name: "徐州市市郊农村信用合作社",
      bank_code: "14113030"
    }
  },
  {
    node: {
      id: "24",
      bank_name: "连云港市商业银行",
      bank_code: "04803070"
    }
  },
  {
    node: {
      id: "25",
      bank_name: "焦作中旅银行（焦作市商业银行）",
      bank_code: "04115010"
    }
  },
  {
    node: {
      id: "26",
      bank_name: "安义融兴村镇银行",
      bank_code: "15214213"
    }
  },
  {
    node: {
      id: "27",
      bank_name: "安徽肥西石银村镇银行",
      bank_code: "15433613"
    }
  },
  {
    node: {
      id: "28",
      bank_name: "广元包商贵民村镇银行",
      bank_code: "15736610"
    }
  },
  {
    node: {
      id: "29",
      bank_name: "安吉交银村镇银行",
      bank_code: "15003363"
    }
  },
  {
    node: {
      id: "30",
      bank_name: "松滋中银富登村镇银行",
      bank_code: "15195377"
    }
  },
  {
    node: {
      id: "31",
      bank_name: "大连保税区珠江村镇银行",
      bank_code: "15402220"
    }
  },
  {
    node: {
      id: "32",
      bank_name: "上海农信",
      bank_code: "14012900"
    }
  },
  {
    node: {
      id: "33",
      bank_name: "徐州市商业银行",
      bank_code: "04943030"
    }
  },
  {
    node: {
      id: "34",
      bank_name: "锦州银行股份有限公司（锦州市商业银行）",
      bank_code: "04392270"
    }
  },
  {
    node: {
      id: "35",
      bank_name: "湖南省农村信用社联合社",
      bank_code: "14385500"
    }
  },
  {
    node: {
      id: "36",
      bank_name: "重庆农村商业银行",
      bank_code: "15136900"
    }
  },
  {
    node: {
      id: "37",
      bank_name: "南洋商业银行（中国）",
      bank_code: "03320000"
    }
  },
  {
    node: {
      id: "38",
      bank_name: "法国兴业银行（中国）",
      bank_code: "03330001"
    }
  },
  {
    node: {
      id: "39",
      bank_name: "日本三菱信用卡公司",
      bank_code: "27090392"
    }
  },
  {
    node: {
      id: "40",
      bank_name: "中国工商银行(亚洲)有限公司",
      bank_code: "01020344"
    }
  },
  {
    node: {
      id: "41",
      bank_name: "青海省农村信用社联合社",
      bank_code: "14498500"
    }
  },
  {
    node: {
      id: "42",
      bank_name: "嘉定民生村镇银行",
      bank_code: "15272929"
    }
  },
  {
    node: {
      id: "43",
      bank_name: "PVBCardCorporation",
      bank_code: "29470608"
    }
  },
  {
    node: {
      id: "44",
      bank_name: "青岛农信",
      bank_code: "14144520"
    }
  },
  {
    node: {
      id: "45",
      bank_name: "营口沿海银行",
      bank_code: "05722280"
    }
  },
  {
    node: {
      id: "46",
      bank_name: "宁波通商银行",
      bank_code: "05803320"
    }
  },
  {
    node: {
      id: "47",
      bank_name: "CommercialBankofDubai",
      bank_code: "28790784"
    }
  },
  {
    node: {
      id: "48",
      bank_name: "兴化苏南村镇银行",
      bank_code: "15033161"
    }
  },
  {
    node: {
      id: "49",
      bank_name: "鄂尔多斯市东胜蒙银村镇银行",
      bank_code: "15142050"
    }
  },
  {
    node: {
      id: "50",
      bank_name: "新安融兴村镇银行",
      bank_code: "15214933"
    }
  },
  {
    node: {
      id: "51",
      bank_name: "晋中市榆次融信村镇银行",
      bank_code: "15301750"
    }
  },
  {
    node: {
      id: "52",
      bank_name: "济南长清沪农商村镇银行",
      bank_code: "15584510"
    }
  },
  {
    node: {
      id: "53",
      bank_name: "泰安沪农商村镇银行",
      bank_code: "15584630"
    }
  },
  {
    node: {
      id: "54",
      bank_name: "宁阳沪农商村镇银行",
      bank_code: "15584631"
    }
  },
  {
    node: {
      id: "55",
      bank_name: "东平沪农商村镇银行",
      bank_code: "15584633"
    }
  },
  {
    node: {
      id: "56",
      bank_name: "醴陵沪农商村镇银行",
      bank_code: "15585525"
    }
  },
  {
    node: {
      id: "57",
      bank_name: "双峰沪农商村镇银行",
      bank_code: "15585624"
    }
  },
  {
    node: {
      id: "58",
      bank_name: "中国工商银行印尼分行",
      bank_code: "01020360"
    }
  },
  {
    node: {
      id: "59",
      bank_name: "丹东银行",
      bank_code: "04462269"
    }
  },
  {
    node: {
      id: "60",
      bank_name: "乐山市商业银行",
      bank_code: "05406650"
    }
  },
  {
    node: {
      id: "61",
      bank_name: "云南祥云渝农商村镇银行",
      bank_code: "15567513"
    }
  },
  {
    node: {
      id: "62",
      bank_name: "云南鹤庆渝农商村镇银行",
      bank_code: "15567523"
    }
  },
  {
    node: {
      id: "63",
      bank_name: "华融湘江银行",
      bank_code: "05705500"
    }
  },
  {
    node: {
      id: "64",
      bank_name: "TheBancorpBank",
      bank_code: "28880840"
    }
  },
  {
    node: {
      id: "65",
      bank_name: "临沧临翔沪农商村镇银行",
      bank_code: "15587580"
    }
  },
  {
    node: {
      id: "66",
      bank_name: "新韩卡公司",
      bank_code: "29010410"
    }
  },
  {
    node: {
      id: "67",
      bank_name: "兴业柳银村镇银行",
      bank_code: "15696249"
    }
  },
  {
    node: {
      id: "68",
      bank_name: "北流柳银村镇银行",
      bank_code: "15696246"
    }
  },
  {
    node: {
      id: "69",
      bank_name: "周口银行",
      bank_code: "05625081"
    }
  },
  {
    node: {
      id: "70",
      bank_name: "天长民生村镇银行",
      bank_code: "15273752"
    }
  },
  {
    node: {
      id: "71",
      bank_name: "奉贤浦发村镇银行",
      bank_code: "15072900"
    }
  },
  {
    node: {
      id: "72",
      bank_name: "宁国民生村镇银行",
      bank_code: "15273774"
    }
  },
  {
    node: {
      id: "73",
      bank_name: "京山中银富登村镇银行",
      bank_code: "15195321"
    }
  },
  {
    node: {
      id: "74",
      bank_name: "中银信用卡(国际)有限公司",
      bank_code: "25180344"
    }
  },
  {
    node: {
      id: "75",
      bank_name: "中国工商银行（澳门）",
      bank_code: "01020446"
    }
  },
  {
    node: {
      id: "76",
      bank_name: "蒙古郭勒姆特银行",
      bank_code: "26620496"
    }
  },
  {
    node: {
      id: "77",
      bank_name: "中国工商银行法兰克福分行",
      bank_code: "01020276"
    }
  },
  {
    node: {
      id: "78",
      bank_name: "中国工商银行米兰分行",
      bank_code: "01020380"
    }
  },
  {
    node: {
      id: "79",
      bank_name: "花旗中国",
      bank_code: "03190002"
    }
  },
  {
    node: {
      id: "80",
      bank_name: "韩亚银行（中国）",
      bank_code: "03290000"
    }
  },
  {
    node: {
      id: "81",
      bank_name: "浙江温岭联合村镇银行",
      bank_code: "15083454"
    }
  },
  {
    node: {
      id: "82",
      bank_name: "浙江萧山湖商村镇银行",
      bank_code: "15283310"
    }
  },
  {
    node: {
      id: "83",
      bank_name: "灵宝融丰村镇银行",
      bank_code: "15605053"
    }
  },
  {
    node: {
      id: "84",
      bank_name: "盱眙珠江村镇银行",
      bank_code: "15403088"
    }
  },
  {
    node: {
      id: "85",
      bank_name: "钦州市钦南国民村镇银行",
      bank_code: "15366310"
    }
  },
  {
    node: {
      id: "86",
      bank_name: "南昌银行",
      bank_code: "64484210 "
    }
  },
  {
    node: {
      id: "87",
      bank_name: "厦门国际银行",
      bank_code: "05870000"
    }
  },
  {
    node: {
      id: "88",
      bank_name: "中信银行",
      bank_code: "03020000"
    }
  },
  {
    node: {
      id: "89",
      bank_name: "湖北银行（宜昌市商业银行）",
      bank_code: "05755200"
    }
  },
  {
    node: {
      id: "90",
      bank_name: "江西省农村信用社联合社",
      bank_code: "65394200"
    }
  },
  {
    node: {
      id: "91",
      bank_name: "东莞农村商业银行",
      bank_code: "14156020"
    }
  },
  {
    node: {
      id: "92",
      bank_name: "大西洋银行股份有限公司",
      bank_code: "26230446"
    }
  },
  {
    node: {
      id: "93",
      bank_name: "吉林银行（吉林市商业银行）",
      bank_code: "04512420"
    }
  },
  {
    node: {
      id: "94",
      bank_name: "光大银行",
      bank_code: "03030000"
    }
  },
  {
    node: {
      id: "95",
      bank_name: "招商银行",
      bank_code: "03080000"
    }
  },
  {
    node: {
      id: "96",
      bank_name: "山东省农村信用社联合社",
      bank_code: "14144500"
    }
  },
  {
    node: {
      id: "97",
      bank_name: "广西农村信用社联合社",
      bank_code: "14436100"
    }
  },
  {
    node: {
      id: "98",
      bank_name: "杭州银行",
      bank_code: "04233310"
    }
  },
  {
    node: {
      id: "99",
      bank_name: "上饶市商业银行",
      bank_code: "05264330"
    }
  },
  {
    node: {
      id: "100",
      bank_name: "交通银行香港分行",
      bank_code: "03010344"
    }
  },
  {
    node: {
      id: "101",
      bank_name: "澳门永亨银行",
      bank_code: "03310000"
    }
  },
  {
    node: {
      id: "102",
      bank_name: "重庆银行（重庆市商业银行）",
      bank_code: "04416900"
    }
  },
  {
    node: {
      id: "103",
      bank_name: "大丰银行有限公司",
      bank_code: "25250446"
    }
  },
  {
    node: {
      id: "104",
      bank_name: "哈萨克斯坦国民储蓄银行",
      bank_code: "26330398"
    }
  },
  {
    node: {
      id: "105",
      bank_name: "彭山珠江村镇银行",
      bank_code: "15406672"
    }
  },
  {
    node: {
      id: "106",
      bank_name: "德庆华润村镇银行",
      bank_code: "15915936"
    }
  },
  {
    node: {
      id: "107",
      bank_name: "息烽包商黔隆村镇银行",
      bank_code: "15737012"
    }
  },
  {
    node: {
      id: "108",
      bank_name: "武冈包商村镇银行",
      bank_code: "15735556"
    }
  },
  {
    node: {
      id: "109",
      bank_name: "毕节发展村镇银行",
      bank_code: "15737090"
    }
  },
  {
    node: {
      id: "110",
      bank_name: "辽阳银行股份有限公司（辽阳市商业银行）",
      bank_code: "04192310"
    }
  },
  {
    node: {
      id: "111",
      bank_name: "丹东银行股份有限公司（丹东市商业银行）",
      bank_code: "04462260"
    }
  },
  {
    node: {
      id: "112",
      bank_name: "中信嘉华银行有限公司",
      bank_code: "25160344"
    }
  },
  {
    node: {
      id: "113",
      bank_name: "北京农村商业银行",
      bank_code: "14181000"
    }
  },
  {
    node: {
      id: "114",
      bank_name: "东莞商行",
      bank_code: "05056020"
    }
  },
  {
    node: {
      id: "115",
      bank_name: "德州银行（德州市商业银行）",
      bank_code: "05154680"
    }
  },
  {
    node: {
      id: "116",
      bank_name: "安徽五河永泰村镇银行",
      bank_code: "15633632"
    }
  },
  {
    node: {
      id: "117",
      bank_name: "常宁珠江村镇银行",
      bank_code: "15405545"
    }
  },
  {
    node: {
      id: "118",
      bank_name: "嘉祥中银富登村镇银行",
      bank_code: "15194616"
    }
  },
  {
    node: {
      id: "119",
      bank_name: "浙江景宁银座村镇银行",
      bank_code: "15203438"
    }
  },
  {
    node: {
      id: "120",
      bank_name: "株洲县融兴村镇银行",
      bank_code: "15215521"
    }
  },
  {
    node: {
      id: "121",
      bank_name: "重庆大渡口融兴村镇银行",
      bank_code: "15216922"
    }
  },
  {
    node: {
      id: "122",
      bank_name: "宜宾市商业银行",
      bank_code: "05646710"
    }
  },
  {
    node: {
      id: "123",
      bank_name: "太仓农村商业银行",
      bank_code: "14333051"
    }
  },
  {
    node: {
      id: "124",
      bank_name: "贵州省农村信用社联合社",
      bank_code: "14367000"
    }
  },
  {
    node: {
      id: "125",
      bank_name: "安顺市城市信用社",
      bank_code: "05197117"
    }
  },
  {
    node: {
      id: "126",
      bank_name: "广东南海农村商业银行",
      bank_code: "14505800"
    }
  },
  {
    node: {
      id: "127",
      bank_name: "丝绸之路银行",
      bank_code: "26700860"
    }
  },
  {
    node: {
      id: "128",
      bank_name: "Baiduri Bank Berhad",
      bank_code: "27130096"
    }
  },
  {
    node: {
      id: "129",
      bank_name: "巴基斯坦FAYSAL BANK",
      bank_code: "28040586"
    }
  },
  {
    node: {
      id: "130",
      bank_name: "中国工商银行卡拉奇分行",
      bank_code: "01020586"
    }
  },
  {
    node: {
      id: "131",
      bank_name: "河间融惠村镇银行",
      bank_code: "15211443"
    }
  },
  {
    node: {
      id: "132",
      bank_name: "青岛胶南海汇村镇银行",
      bank_code: "15464520"
    }
  },
  {
    node: {
      id: "133",
      bank_name: "句容茅山村镇银行",
      bank_code: "15033142"
    }
  },
  {
    node: {
      id: "134",
      bank_name: "广东恩平汇丰村镇银行",
      bank_code: "15115893"
    }
  },
  {
    node: {
      id: "135",
      bank_name: "枣阳中银富登村镇银行",
      bank_code: "15195288"
    }
  },
  {
    node: {
      id: "136",
      bank_name: "浙江三门银座村镇银行",
      bank_code: "15203457"
    }
  },
  {
    node: {
      id: "137",
      bank_name: "会宁会师村镇银行",
      bank_code: "15218242"
    }
  },
  {
    node: {
      id: "138",
      bank_name: "宝生村镇银行",
      bank_code: "15335840"
    }
  },
  {
    node: {
      id: "139",
      bank_name: "文昌国民村镇银行",
      bank_code: "15386423"
    }
  },
  {
    node: {
      id: "140",
      bank_name: "大武口石银村镇银行",
      bank_code: "15438720"
    }
  },
  {
    node: {
      id: "141",
      bank_name: "长沙星沙沪农商村镇银行",
      bank_code: "15585511"
    }
  },
  {
    node: {
      id: "142",
      bank_name: "三门峡银行",
      bank_code: "04885050"
    }
  },
  {
    node: {
      id: "143",
      bank_name: "中行新加坡分行",
      bank_code: "01040702"
    }
  },
  {
    node: {
      id: "144",
      bank_name: "临商银行",
      bank_code: "64314730"
    }
  },
  {
    node: {
      id: "145",
      bank_name: "桂林银行",
      bank_code: "64916170"
    }
  },
  {
    node: {
      id: "146",
      bank_name: "个旧沪农商村镇银行",
      bank_code: "15587431"
    }
  },
  {
    node: {
      id: "147",
      bank_name: "建水沪农商村镇银行",
      bank_code: "15587435"
    }
  },
  {
    node: {
      id: "148",
      bank_name: "格鲁吉亚InvestBank",
      bank_code: "29230268"
    }
  },
  {
    node: {
      id: "149",
      bank_name: "RawbankS.a.r.l",
      bank_code: "29460180"
    }
  },
  {
    node: {
      id: "150",
      bank_name: "佛山高明顺银村镇银行",
      bank_code: "15455880"
    }
  },
  {
    node: {
      id: "151",
      bank_name: "北京门头沟珠江村镇银行",
      bank_code: "15401000"
    }
  },
  {
    node: {
      id: "152",
      bank_name: "哈密红星国民村镇银行",
      bank_code: "15368841"
    }
  },
  {
    node: {
      id: "153",
      bank_name: "天台民生村镇银行",
      bank_code: "15273456"
    }
  },
  {
    node: {
      id: "154",
      bank_name: "太仓民生村镇银行",
      bank_code: "15273051"
    }
  },
  {
    node: {
      id: "155",
      bank_name: "宁晋民生村镇银行",
      bank_code: "15271329"
    }
  },
  {
    node: {
      id: "156",
      bank_name: "恩施常农商村镇银行",
      bank_code: "15055411"
    }
  },
  {
    node: {
      id: "157",
      bank_name: "江西赣州银座村镇银行",
      bank_code: "15204280"
    }
  },
  {
    node: {
      id: "158",
      bank_name: "重庆渝北银座村镇银行",
      bank_code: "15206900"
    }
  },
  {
    node: {
      id: "159",
      bank_name: "可汗银行",
      bank_code: "26530496"
    }
  },
  {
    node: {
      id: "160",
      bank_name: "贵州银行（安顺市商业银行）",
      bank_code: "05167030"
    }
  },
  {
    node: {
      id: "161",
      bank_name: "盘锦银行（盘锦市商业银行）",
      bank_code: "05442320"
    }
  },
  {
    node: {
      id: "162",
      bank_name: "邢台银行股份有限公司",
      bank_code: "05541310"
    }
  },
  {
    node: {
      id: "163",
      bank_name: "贵阳银行股份有限公司(贵阳市商业银行)",
      bank_code: "04437010"
    }
  },
  {
    node: {
      id: "164",
      bank_name: "新网银行",
      bank_code: "03580000"
    }
  },
  {
    node: {
      id: "165",
      bank_name: "乌兹别克斯坦INFINBANK",
      bank_code: "27650860"
    }
  },
  {
    node: {
      id: "166",
      bank_name: "临汾市尧都区农信社",
      bank_code: "65341770"
    }
  },
  {
    node: {
      id: "167",
      bank_name: "邢台银行",
      bank_code: "05541310"
    }
  },
  {
    node: {
      id: "168",
      bank_name: "中国工商银行（印度尼西亚）",
      bank_code: "01020360"
    }
  },
  {
    node: {
      id: "169",
      bank_name: "工行阿拉木图",
      bank_code: "01020398"
    }
  },
  {
    node: {
      id: "170",
      bank_name: "工银马来西亚",
      bank_code: "01020458"
    }
  },
  {
    node: {
      id: "171",
      bank_name: "陕西洛南阳光村镇银行",
      bank_code: "15948032"
    }
  },
  {
    node: {
      id: "172",
      bank_name: "工行伦敦",
      bank_code: "01020826"
    }
  },
  {
    node: {
      id: "173",
      bank_name: "中国银行金边分行",
      bank_code: "01040116"
    }
  },
  {
    node: {
      id: "174",
      bank_name: "中国银行(马来西亚)",
      bank_code: "01040458"
    }
  },
  {
    node: {
      id: "175",
      bank_name: "中国银行胡志明分行",
      bank_code: "01040704"
    }
  },
  {
    node: {
      id: "176",
      bank_name: "花旗银行(中国)有限公司",
      bank_code: "03190001"
    }
  },
  {
    node: {
      id: "177",
      bank_name: "汇丰银(中国)有限公司",
      bank_code: "03210000"
    }
  },
  {
    node: {
      id: "178",
      bank_name: "浙江义乌联合村镇银行",
      bank_code: "15083387"
    }
  },
  {
    node: {
      id: "179",
      bank_name: "浙江德清湖商村镇银行",
      bank_code: "15283361"
    }
  },
  {
    node: {
      id: "180",
      bank_name: "漯河银行(漯河市商业银行)",
      bank_code: "05565040"
    }
  },
  {
    node: {
      id: "181",
      bank_name: "潼南民生村镇银行",
      bank_code: "15276914"
    }
  },
  {
    node: {
      id: "182",
      bank_name: "福建海峡银行",
      bank_code: "04053919"
    }
  },
  {
    node: {
      id: "183",
      bank_name: "科尔沁包商村镇银行",
      bank_code: "15731982"
    }
  },
  {
    node: {
      id: "184",
      bank_name: "象山国民村镇银行",
      bank_code: "15363321"
    }
  },
  {
    node: {
      id: "185",
      bank_name: "鄂尔多斯银行股份有限公司（鄂尔多斯市商业银行）",
      bank_code: "05342050"
    }
  },
  {
    node: {
      id: "186",
      bank_name: "柳州银行股份有限公司（柳州市商业银行）",
      bank_code: "04956140"
    }
  },
  {
    node: {
      id: "187",
      bank_name: "华夏银行",
      bank_code: "03040000"
    }
  },
  {
    node: {
      id: "188",
      bank_name: "渤海银行",
      bank_code: "03170000"
    }
  },
  {
    node: {
      id: "189",
      bank_name: "上海银行",
      bank_code: "04012900"
    }
  },
  {
    node: {
      id: "190",
      bank_name: "平凉市城市信用社",
      bank_code: "05238333"
    }
  },
  {
    node: {
      id: "191",
      bank_name: "上海农村商业银行（上海农商银行）",
      bank_code: "65012900"
    }
  },
  {
    node: {
      id: "192",
      bank_name: "广东发展银行",
      bank_code: "03060000"
    }
  },
  {
    node: {
      id: "193",
      bank_name: "河北省农村信用社联合社",
      bank_code: "14411200"
    }
  },
  {
    node: {
      id: "194",
      bank_name: "东莞银行",
      bank_code: "04256020"
    }
  },
  {
    node: {
      id: "195",
      bank_name: "龙江银行（大庆市商业银行）",
      bank_code: "64922690"
    }
  },
  {
    node: {
      id: "196",
      bank_name: "浙江稠州商业银行",
      bank_code: "05303380"
    }
  },
  {
    node: {
      id: "197",
      bank_name: "抚顺银行",
      bank_code: "04302249"
    }
  },
  {
    node: {
      id: "198",
      bank_name: "新都桂城村镇银行",
      bank_code: "15736510"
    }
  },
  {
    node: {
      id: "199",
      bank_name: "景洪民生村镇银行",
      bank_code: "15277491"
    }
  },
  {
    node: {
      id: "200",
      bank_name: "武汉农村商业银行",
      bank_code: "14595210"
    }
  },
  {
    node: {
      id: "201",
      bank_name: "江苏东台稠州村镇银行",
      bank_code: "15353117"
    }
  },
  {
    node: {
      id: "202",
      bank_name: "江苏丰县民丰村镇银行",
      bank_code: "16023031"
    }
  },
  {
    node: {
      id: "203",
      bank_name: "江苏灌南民丰村镇银行",
      bank_code: "16023074"
    }
  },
  {
    node: {
      id: "204",
      bank_name: "临商银行（临沂市商业银行）",
      bank_code: "64314730"
    }
  },
  {
    node: {
      id: "205",
      bank_name: "江阴市农村商业银行",
      bank_code: "14123020"
    }
  },
  {
    node: {
      id: "206",
      bank_name: "河北银行股份有限公司（石家庄市商业银行）",
      bank_code: "04221210"
    }
  },
  {
    node: {
      id: "207",
      bank_name: "大新银行有限公司",
      bank_code: "25040344"
    }
  },
  {
    node: {
      id: "208",
      bank_name: "嘉兴银行（嘉兴市商业银行）",
      bank_code: "04703350"
    }
  },
  {
    node: {
      id: "209",
      bank_name: "唐山银行",
      bank_code: "04991240"
    }
  },
  {
    node: {
      id: "210",
      bank_name: "兰州银行股份有限公司（兰州市商业银行）",
      bank_code: "04478210"
    }
  },
  {
    node: {
      id: "211",
      bank_name: "防城港防城国民村镇银行",
      bank_code: "15366320"
    }
  },
  {
    node: {
      id: "212",
      bank_name: "内蒙古银行",
      bank_code: "64741910"
    }
  },
  {
    node: {
      id: "213",
      bank_name: "齐商银行（淄博市商业银行）",
      bank_code: "64384530"
    }
  },
  {
    node: {
      id: "214",
      bank_name: "吉林省农村信用社联合社",
      bank_code: "14452400"
    }
  },
  {
    node: {
      id: "215",
      bank_name: "安徽利辛湖商村镇银行",
      bank_code: "15283813"
    }
  },
  {
    node: {
      id: "216",
      bank_name: "广东南粤银行股份有限公司",
      bank_code: "64895910"
    }
  },
  {
    node: {
      id: "217",
      bank_name: "延寿融兴村镇银行",
      bank_code: "15212629"
    }
  },
  {
    node: {
      id: "218",
      bank_name: "重庆北碚稠州村镇银行",
      bank_code: "15356900"
    }
  },
  {
    node: {
      id: "219",
      bank_name: "珠海农村信用合作社联社",
      bank_code: "14315850"
    }
  },
  {
    node: {
      id: "220",
      bank_name: "中原银行（安阳商业银行）",
      bank_code: "05864910"
    }
  },
  {
    node: {
      id: "221",
      bank_name: "菲律宾RCBC",
      bank_code: "27250608"
    }
  },
  {
    node: {
      id: "222",
      bank_name: "宝丰豫丰村镇银行",
      bank_code: "15604951"
    }
  },
  {
    node: {
      id: "223",
      bank_name: "长安银行",
      bank_code: "05417900"
    }
  },
  {
    node: {
      id: "224",
      bank_name: "濮阳银行",
      bank_code: "05795020"
    }
  },
  {
    node: {
      id: "225",
      bank_name: "老河口中银富登村镇银行",
      bank_code: "15195287"
    }
  },
  {
    node: {
      id: "226",
      bank_name: "宁乡沪农商行村镇银行",
      bank_code: "15585514"
    }
  },
  {
    node: {
      id: "227",
      bank_name: "沈阳于洪永安村镇银行",
      bank_code: "15572210"
    }
  },
  {
    node: {
      id: "228",
      bank_name: "东源泰业村镇银行",
      bank_code: "15775985"
    }
  },
  {
    node: {
      id: "229",
      bank_name: "中国工商银行新加坡分行",
      bank_code: "01020702"
    }
  },
  {
    node: {
      id: "230",
      bank_name: "云南大理渝农商村镇银行",
      bank_code: "15567511"
    }
  },
  {
    node: {
      id: "231",
      bank_name: "衡水银行（衡水市商业银行）",
      bank_code: "05611480"
    }
  },
  {
    node: {
      id: "232",
      bank_name: "阿拉沪农商村镇银行",
      bank_code: "15587310"
    }
  },
  {
    node: {
      id: "233",
      bank_name: "CimFinanceLtd",
      bank_code: "29440480"
    }
  },
  {
    node: {
      id: "234",
      bank_name: "凉山州商业银行",
      bank_code: "05556840"
    }
  },
  {
    node: {
      id: "235",
      bank_name: "吉安稠州村镇银行",
      bank_code: "15354353"
    }
  },
  {
    node: {
      id: "236",
      bank_name: "新疆农村信用社联合社",
      bank_code: "14448800"
    }
  },
  {
    node: {
      id: "237",
      bank_name: "黑龙江省农村信用社联合社",
      bank_code: "14572600"
    }
  },
  {
    node: {
      id: "238",
      bank_name: "江苏邗江民泰村镇银行",
      bank_code: "15173120"
    }
  },
  {
    node: {
      id: "239",
      bank_name: "沂水中银富登村镇银行",
      bank_code: "15194737"
    }
  },
  {
    node: {
      id: "240",
      bank_name: "北京怀柔融兴村镇银行",
      bank_code: "15211000"
    }
  },
  {
    node: {
      id: "241",
      bank_name: "深圳宝安融兴村镇银行",
      bank_code: "15215840"
    }
  },
  {
    node: {
      id: "242",
      bank_name: "济宁银行股份有限公司",
      bank_code: "05374610"
    }
  },
  {
    node: {
      id: "243",
      bank_name: "晋中银行（晋中市商业银行）",
      bank_code: "05591750"
    }
  },
  {
    node: {
      id: "244",
      bank_name: "库尔勒银行（库尔勒市商业银行）",
      bank_code: "05658880"
    }
  },
  {
    node: {
      id: "245",
      bank_name: "齐鲁银行股份有限公司",
      bank_code: "64094510"
    }
  },
  {
    node: {
      id: "246",
      bank_name: "张家口银行（张家口市商业银行）",
      bank_code: "04901380"
    }
  },
  {
    node: {
      id: "247",
      bank_name: "中国工商银行金边分行",
      bank_code: "01020116"
    }
  },
  {
    node: {
      id: "248",
      bank_name: "中国工商银行万象分行",
      bank_code: "01020418"
    }
  },
  {
    node: {
      id: "249",
      bank_name: "中国工商银行卢森堡分行",
      bank_code: "01020442"
    }
  },
  {
    node: {
      id: "250",
      bank_name: "工行河内",
      bank_code: "01020704"
    }
  },
  {
    node: {
      id: "251",
      bank_name: "中国工商银行马德里分行",
      bank_code: "01020724"
    }
  },
  {
    node: {
      id: "252",
      bank_name: "中国银行雅加达分行",
      bank_code: "01040360"
    }
  },
  {
    node: {
      id: "253",
      bank_name: "中国银行首尔分行",
      bank_code: "01040410"
    }
  },
  {
    node: {
      id: "254",
      bank_name: "中国银行曼谷分行",
      bank_code: "01040764"
    }
  },
  {
    node: {
      id: "255",
      bank_name: "石河子交银村镇银行",
      bank_code: "15009028"
    }
  },
  {
    node: {
      id: "256",
      bank_name: "綦江民生村镇银行",
      bank_code: "15276900"
    }
  },
  {
    node: {
      id: "257",
      bank_name: "贺州八步东盈村镇银行",
      bank_code: "15476340"
    }
  },
  {
    node: {
      id: "258",
      bank_name: "资阳民生村镇银行",
      bank_code: "15276880"
    }
  },
  {
    node: {
      id: "259",
      bank_name: "集宁包商村镇银行",
      bank_code: "15732030"
    }
  },
  {
    node: {
      id: "260",
      bank_name: "四川天府银行（南充市商业银行）",
      bank_code: "04966730"
    }
  },
  {
    node: {
      id: "261",
      bank_name: "中国银行",
      bank_code: "01040000"
    }
  },
  {
    node: {
      id: "262",
      bank_name: "广州农村商业银行",
      bank_code: "14055810"
    }
  },
  {
    node: {
      id: "263",
      bank_name: "中国工商银行澳门分行",
      bank_code: "01020446"
    }
  },
  {
    node: {
      id: "264",
      bank_name: "黄河农村商业银行",
      bank_code: "14468700"
    }
  },
  {
    node: {
      id: "265",
      bank_name: "运城市农村信用合作社联合社",
      bank_code: "05181810"
    }
  },
  {
    node: {
      id: "266",
      bank_name: "云南红塔银行（玉溪市商业银行）",
      bank_code: "05247410"
    }
  },
  {
    node: {
      id: "267",
      bank_name: "承德市商业银行",
      bank_code: "05131410"
    }
  },
  {
    node: {
      id: "268",
      bank_name: "成都市商业银行",
      bank_code: "64296510"
    }
  },
  {
    node: {
      id: "269",
      bank_name: "上海商业银行",
      bank_code: "25090344"
    }
  },
  {
    node: {
      id: "270",
      bank_name: "宁波银行（宁波市商业银行）",
      bank_code: "04083320"
    }
  },
  {
    node: {
      id: "271",
      bank_name: "哈尔滨市银行",
      bank_code: "04422610"
    }
  },
  {
    node: {
      id: "272",
      bank_name: "集友银行",
      bank_code: "25210344"
    }
  },
  {
    node: {
      id: "273",
      bank_name: "曲靖市商业银行",
      bank_code: "05027360"
    }
  },
  {
    node: {
      id: "274",
      bank_name: "葫芦岛银行（葫芦岛市商业银行）",
      bank_code: "04332350"
    }
  },
  {
    node: {
      id: "275",
      bank_name: "廊坊银行（廊坊市商业银行）",
      bank_code: "04721460"
    }
  },
  {
    node: {
      id: "276",
      bank_name: "志丹民生村镇银行",
      bank_code: "15278046"
    }
  },
  {
    node: {
      id: "277",
      bank_name: "惠州仲恺东盈村镇银行",
      bank_code: "15475950"
    }
  },
  {
    node: {
      id: "278",
      bank_name: "掇刀包商村镇银行",
      bank_code: "15735320"
    }
  },
  {
    node: {
      id: "279",
      bank_name: "昆仑银行股份有限公司",
      bank_code: "05478820"
    }
  },
  {
    node: {
      id: "280",
      bank_name: "昆明农联社",
      bank_code: "14097310"
    }
  },
  {
    node: {
      id: "281",
      bank_name: "柳州银行股份有限公司",
      bank_code: "04956140"
    }
  },
  {
    node: {
      id: "282",
      bank_name: "星展银行香港有限公司",
      bank_code: "25080344"
    }
  },
  {
    node: {
      id: "283",
      bank_name: "榆林榆阳民生村镇银行",
      bank_code: "15278060"
    }
  },
  {
    node: {
      id: "284",
      bank_name: "江南农村商业银行",
      bank_code: "14603040"
    }
  },
  {
    node: {
      id: "285",
      bank_name: "江苏丹阳保得村镇银行",
      bank_code: "16013144"
    }
  },
  {
    node: {
      id: "286",
      bank_name: "江苏灌云民丰村镇银行",
      bank_code: "16023073"
    }
  },
  {
    node: {
      id: "287",
      bank_name: "绵阳市商业银行",
      bank_code: "04856590"
    }
  },
  {
    node: {
      id: "288",
      bank_name: "泉州银行（泉州市商业银行）",
      bank_code: "04643970"
    }
  },
  {
    node: {
      id: "289",
      bank_name: "恒丰银行",
      bank_code: "03110000"
    }
  },
  {
    node: {
      id: "290",
      bank_name: "福建海峡银行股份有限公司（福州市商业银行）",
      bank_code: "04053910"
    }
  },
  {
    node: {
      id: "291",
      bank_name: "潍坊银行（潍坊市商业银行）",
      bank_code: "64624580"
    }
  },
  {
    node: {
      id: "292",
      bank_name: "抚顺银行股份有限公司（抚顺市商业银行）",
      bank_code: "04302240"
    }
  },
  {
    node: {
      id: "293",
      bank_name: "广州银行股份有限公司(广州市商业银行)",
      bank_code: "64135810"
    }
  },
  {
    node: {
      id: "294",
      bank_name: "江苏苏州农村商业银行（吴江农商行）",
      bank_code: "14283054"
    }
  },
  {
    node: {
      id: "295",
      bank_name: "苏州银行股份有限公司（江苏东吴农村商业银行股份有限公司）",
      bank_code: "14303050"
    }
  },
  {
    node: {
      id: "296",
      bank_name: "阜新银行股份有限公司（阜新市商业银行）",
      bank_code: "04672290"
    }
  },
  {
    node: {
      id: "297",
      bank_name: "泰隆城市信用社",
      bank_code: "04733450"
    }
  },
  {
    node: {
      id: "298",
      bank_name: "张家港市农村商业银行",
      bank_code: "14163056"
    }
  },
  {
    node: {
      id: "299",
      bank_name: "南宁市商业银行",
      bank_code: "04786110"
    }
  },
  {
    node: {
      id: "300",
      bank_name: "鄞州农村合作银行",
      bank_code: "14203320"
    }
  },
  {
    node: {
      id: "301",
      bank_name: "创兴银行有限公司",
      bank_code: "25170344"
    }
  },
  {
    node: {
      id: "302",
      bank_name: "宜兴阳羡村镇银行",
      bank_code: "15483023"
    }
  },
  {
    node: {
      id: "303",
      bank_name: "工银新西兰",
      bank_code: "01020554"
    }
  },
  {
    node: {
      id: "304",
      bank_name: "广东华兴银行",
      bank_code: "05785800"
    }
  },
  {
    node: {
      id: "305",
      bank_name: "安徽和县新华村镇银行",
      bank_code: "15183653"
    }
  },
  {
    node: {
      id: "306",
      bank_name: "洪湖融兴村镇银行",
      bank_code: "15215373"
    }
  },
  {
    node: {
      id: "307",
      bank_name: "梅县客家村镇银行",
      bank_code: "15315960"
    }
  },
  {
    node: {
      id: "308",
      bank_name: "承德银行",
      bank_code: "65131410"
    }
  },
  {
    node: {
      id: "309",
      bank_name: "枣庄银行",
      bank_code: "05824540"
    }
  },
  {
    node: {
      id: "310",
      bank_name: "无锡农村商业银行",
      bank_code: "65373020"
    }
  },
  {
    node: {
      id: "311",
      bank_name: "苏州银行",
      bank_code: "64303050"
    }
  },
  {
    node: {
      id: "312",
      bank_name: "哈尔滨商行",
      bank_code: "64422610"
    }
  },
  {
    node: {
      id: "313",
      bank_name: "尧都区农村信用合作社联社",
      bank_code: "14341770"
    }
  },
  {
    node: {
      id: "314",
      bank_name: "莱芜银行",
      bank_code: "04974634"
    }
  },
  {
    node: {
      id: "315",
      bank_name: "Travelex",
      bank_code: "26040344"
    }
  },
  {
    node: {
      id: "316",
      bank_name: "澳门国际银行",
      bank_code: "26220446"
    }
  },
  {
    node: {
      id: "317",
      bank_name: "新疆汇和银行",
      bank_code: "05778981"
    }
  },
  {
    node: {
      id: "318",
      bank_name: "BankofChina(Malaysia)",
      bank_code: "99900458"
    }
  },
  {
    node: {
      id: "319",
      bank_name: "江苏长江商业银行",
      bank_code: "04933160"
    }
  },
  {
    node: {
      id: "320",
      bank_name: "越南Vietcombank",
      bank_code: "26550704"
    }
  },
  {
    node: {
      id: "321",
      bank_name: "韩国三星卡公司",
      bank_code: "28660410"
    }
  },
  {
    node: {
      id: "322",
      bank_name: "浙江乐清联合村镇银行",
      bank_code: "15083333"
    }
  },
  {
    node: {
      id: "323",
      bank_name: "浙江嘉善联合村镇银行",
      bank_code: "15083351"
    }
  },
  {
    node: {
      id: "324",
      bank_name: "谷城中银富登村镇银行",
      bank_code: "15195284"
    }
  },
  {
    node: {
      id: "325",
      bank_name: "榆树融兴村镇银行",
      bank_code: "15212411"
    }
  },
  {
    node: {
      id: "326",
      bank_name: "昆山鹿城村镇银行",
      bank_code: "15483052"
    }
  },
  {
    node: {
      id: "327",
      bank_name: "涟源沪农商村镇银行",
      bank_code: "15585623"
    }
  },
  {
    node: {
      id: "328",
      bank_name: "永兴沪农商村镇银行",
      bank_code: "15585635"
    }
  },
  {
    node: {
      id: "329",
      bank_name: "东莞长安村镇银行",
      bank_code: "15776020"
    }
  },
  {
    node: {
      id: "330",
      bank_name: "云南安宁稠州村镇银行",
      bank_code: "15357313"
    }
  },
  {
    node: {
      id: "331",
      bank_name: "珠海华润银行",
      bank_code: "64375850"
    }
  },
  {
    node: {
      id: "332",
      bank_name: "中银通支付",
      bank_code: "48080001"
    }
  },
  {
    node: {
      id: "333",
      bank_name: "保山隆阳沪农商村镇银行",
      bank_code: "15587530"
    }
  },
  {
    node: {
      id: "334",
      bank_name: "RussianStandardBank",
      bank_code: "27670643"
    }
  },
  {
    node: {
      id: "335",
      bank_name: "CapitalBankofMongolia",
      bank_code: "29120496"
    }
  },
  {
    node: {
      id: "336",
      bank_name: "仪征包商村镇银行",
      bank_code: "15733129"
    }
  },
  {
    node: {
      id: "337",
      bank_name: "保定银行",
      bank_code: "05521340"
    }
  },
  {
    node: {
      id: "338",
      bank_name: "南昌大丰村镇银行",
      bank_code: "15494210"
    }
  },
  {
    node: {
      id: "339",
      bank_name: "启东珠江村镇银行",
      bank_code: "15403066"
    }
  },
  {
    node: {
      id: "340",
      bank_name: "固阳包商惠农村镇银行",
      bank_code: "15731922"
    }
  },
  {
    node: {
      id: "341",
      bank_name: "大竹渝农商村镇银行",
      bank_code: "15566761"
    }
  },
  {
    node: {
      id: "342",
      bank_name: "天津华明村镇银行",
      bank_code: "15641100"
    }
  },
  {
    node: {
      id: "343",
      bank_name: "天津武清村镇银行",
      bank_code: "15511100"
    }
  },
  {
    node: {
      id: "344",
      bank_name: "内蒙古农村信用社联合社",
      bank_code: "14511900"
    }
  },
  {
    node: {
      id: "345",
      bank_name: "甘肃省农村信用社联合社",
      bank_code: "14538200"
    }
  },
  {
    node: {
      id: "346",
      bank_name: "湖北仙桃北农商村镇银行",
      bank_code: "15025371"
    }
  },
  {
    node: {
      id: "347",
      bank_name: "双流诚民村镇银行",
      bank_code: "15036512"
    }
  },
  {
    node: {
      id: "348",
      bank_name: "福建建瓯石狮村镇银行",
      bank_code: "15044015"
    }
  },
  {
    node: {
      id: "349",
      bank_name: "浙江平湖工银村镇银行",
      bank_code: "15103352"
    }
  },
  {
    node: {
      id: "350",
      bank_name: "重庆璧山工银村镇银行",
      bank_code: "15106919"
    }
  },
  {
    node: {
      id: "351",
      bank_name: "重庆大足汇丰村镇银行",
      bank_code: "15116917"
    }
  },
  {
    node: {
      id: "352",
      bank_name: "江苏沭阳东吴村镇银行",
      bank_code: "15123181"
    }
  },
  {
    node: {
      id: "353",
      bank_name: "南阳村镇银行",
      bank_code: "15265130"
    }
  },
  {
    node: {
      id: "354",
      bank_name: "新加坡大华银行",
      bank_code: "26070702"
    }
  },
  {
    node: {
      id: "355",
      bank_name: "邯郸银行（邯郸市商业银行）",
      bank_code: "05171270"
    }
  },
  {
    node: {
      id: "356",
      bank_name: "辽阳银行股份有限公司",
      bank_code: "04192310"
    }
  },
  {
    node: {
      id: "357",
      bank_name: "许昌银行（许昌市商业银行）",
      bank_code: "05864910"
    }
  },
  {
    node: {
      id: "358",
      bank_name: "阳泉市商业银行",
      bank_code: "05631650"
    }
  },
  {
    node: {
      id: "359",
      bank_name: "赣州银行股份有限公司",
      bank_code: "64634280"
    }
  },
  {
    node: {
      id: "360",
      bank_name: "福建永安汇丰村镇银行",
      bank_code: "15113961"
    }
  },
  {
    node: {
      id: "361",
      bank_name: "中国工商银行巴黎分行",
      bank_code: "01020250"
    }
  },
  {
    node: {
      id: "362",
      bank_name: "工行米兰",
      bank_code: "01020380"
    }
  },
  {
    node: {
      id: "363",
      bank_name: "工银泰国",
      bank_code: "01020764"
    }
  },
  {
    node: {
      id: "364",
      bank_name: "中国工商银行伦敦子行",
      bank_code: "01020826"
    }
  },
  {
    node: {
      id: "365",
      bank_name: "中行宁波分行",
      bank_code: "01043320"
    }
  },
  {
    node: {
      id: "366",
      bank_name: "星展银行",
      bank_code: "03240000"
    }
  },
  {
    node: {
      id: "367",
      bank_name: "新韩银行",
      bank_code: "03280000"
    }
  },
  {
    node: {
      id: "368",
      bank_name: "河北银行股份有限公司",
      bank_code: "64221210"
    }
  },
  {
    node: {
      id: "369",
      bank_name: "海口联合农村商业银行",
      bank_code: "14616410"
    }
  },
  {
    node: {
      id: "370",
      bank_name: "腾冲民生村镇银行",
      bank_code: "15277533"
    }
  },
  {
    node: {
      id: "371",
      bank_name: "芜湖泰寿村镇银行",
      bank_code: "15643621"
    }
  },
  {
    node: {
      id: "372",
      bank_name: "西安高陵阳光村镇银行",
      bank_code: "15947916"
    }
  },
  {
    node: {
      id: "373",
      bank_name: "钟祥民生村镇银行",
      bank_code: "15275323"
    }
  },
  {
    node: {
      id: "374",
      bank_name: "银海国民村镇银行",
      bank_code: "15366230"
    }
  },
  {
    node: {
      id: "375",
      bank_name: "青岛城阳珠江村镇银行",
      bank_code: "15404520"
    }
  },
  {
    node: {
      id: "376",
      bank_name: "徽商银行",
      bank_code: "04403600"
    }
  },
  {
    node: {
      id: "377",
      bank_name: "包商银行",
      bank_code: "04791920"
    }
  },
  {
    node: {
      id: "378",
      bank_name: "赣州银行股份有限公司（赣州市商业银行）",
      bank_code: "04634280"
    }
  },
  {
    node: {
      id: "379",
      bank_name: "上海浦东发展银行",
      bank_code: "03100000"
    }
  },
  {
    node: {
      id: "380",
      bank_name: "香港上海汇丰银行有限公司",
      bank_code: "03210000"
    }
  },
  {
    node: {
      id: "381",
      bank_name: "中原银行",
      bank_code: "05864910"
    }
  },
  {
    node: {
      id: "382",
      bank_name: "广汉珠江村镇银行",
      bank_code: "15406584"
    }
  },
  {
    node: {
      id: "383",
      bank_name: "张家港农村商业银行",
      bank_code: "14163056"
    }
  },
  {
    node: {
      id: "384",
      bank_name: "张家港渝农商村镇银行",
      bank_code: "15563056"
    }
  },
  {
    node: {
      id: "385",
      bank_name: "新密郑银村镇银行",
      bank_code: "15624916"
    }
  },
  {
    node: {
      id: "386",
      bank_name: "昌吉国民村镇银行",
      bank_code: "15368851"
    }
  },
  {
    node: {
      id: "387",
      bank_name: "梅河口民生村镇银行",
      bank_code: "15272454"
    }
  },
  {
    node: {
      id: "388",
      bank_name: "武陟射阳村镇银行",
      bank_code: "15845013"
    }
  },
  {
    node: {
      id: "389",
      bank_name: "沧州农信社",
      bank_code: "14231430"
    }
  },
  {
    node: {
      id: "390",
      bank_name: "中山市农村信用合作社",
      bank_code: "14326030"
    }
  },
  {
    node: {
      id: "391",
      bank_name: "台州银行（台州市商业银行）",
      bank_code: "04593450"
    }
  },
  {
    node: {
      id: "392",
      bank_name: "青海银行（西宁市商业银行）",
      bank_code: "04588510"
    }
  },
  {
    node: {
      id: "393",
      bank_name: "浙江泰隆商业银行",
      bank_code: "64733450"
    }
  },
  {
    node: {
      id: "394",
      bank_name: "平顶山银行",
      bank_code: "05484959"
    }
  },
  {
    node: {
      id: "395",
      bank_name: "曹县中银富登村镇银行",
      bank_code: "15194752"
    }
  },
  {
    node: {
      id: "396",
      bank_name: "监利中银富登村镇银行",
      bank_code: "15195379"
    }
  },
  {
    node: {
      id: "397",
      bank_name: "桦川融兴村镇银行",
      bank_code: "15212723"
    }
  },
  {
    node: {
      id: "398",
      bank_name: "偃师融兴村镇银行",
      bank_code: "15214931"
    }
  },
  {
    node: {
      id: "399",
      bank_name: "耒阳融兴村镇银行",
      bank_code: "15215547"
    }
  },
  {
    node: {
      id: "400",
      bank_name: "忠县稠州村镇银行",
      bank_code: "15356926"
    }
  },
  {
    node: {
      id: "401",
      bank_name: "中山东凤珠江村镇银行",
      bank_code: "15406030"
    }
  },
  {
    node: {
      id: "402",
      bank_name: "吉林银行（长春市商业银行）",
      bank_code: "04062410"
    }
  },
  {
    node: {
      id: "403",
      bank_name: "西安银行股份有限公司（西安市商业银行）",
      bank_code: "04447910"
    }
  },
  {
    node: {
      id: "404",
      bank_name: "盐城商行",
      bank_code: "04603110"
    }
  },
  {
    node: {
      id: "405",
      bank_name: "湖北农信社",
      bank_code: "14105200"
    }
  },
  {
    node: {
      id: "406",
      bank_name: "大华银行（中国）",
      bank_code: "03340000"
    }
  },
  {
    node: {
      id: "407",
      bank_name: "越南西贡商业银行",
      bank_code: "27200704"
    }
  },
  {
    node: {
      id: "408",
      bank_name: "新加坡星网电子付款",
      bank_code: "27520702"
    }
  },
  {
    node: {
      id: "409",
      bank_name: "BCEL",
      bank_code: "27710418"
    }
  },
  {
    node: {
      id: "410",
      bank_name: "韩国乐天",
      bank_code: "28030410"
    }
  },
  {
    node: {
      id: "411",
      bank_name: "中国工商银行加拿大分行",
      bank_code: "01020124"
    }
  },
  {
    node: {
      id: "412",
      bank_name: "企业银行（中国）",
      bank_code: "03360000"
    }
  },
  {
    node: {
      id: "413",
      bank_name: "银川掌政石银村镇银行",
      bank_code: "15438710"
    }
  },
  {
    node: {
      id: "414",
      bank_name: "永清吉银村镇银行",
      bank_code: "15521463"
    }
  },
  {
    node: {
      id: "415",
      bank_name: "湖北银行",
      bank_code: "05755200"
    }
  },
  {
    node: {
      id: "416",
      bank_name: "MongoliaTradeDevelop.Bank",
      bank_code: "28530496"
    }
  },
  {
    node: {
      id: "417",
      bank_name: "潜江中银富登村镇银行",
      bank_code: "15195375"
    }
  },
  {
    node: {
      id: "418",
      bank_name: "重庆黔江银座村镇银行",
      bank_code: "15206925"
    }
  },
  {
    node: {
      id: "419",
      bank_name: "鹤山珠江村镇银行",
      bank_code: "15405895"
    }
  },
  {
    node: {
      id: "420",
      bank_name: "湖北赤壁武弄商村镇银行",
      bank_code: "15535367"
    }
  },
  {
    node: {
      id: "421",
      bank_name: "阳谷沪农商村镇银行",
      bank_code: "15584713"
    }
  },
  {
    node: {
      id: "422",
      bank_name: "东莞大朗东盈村镇银行",
      bank_code: "15476020"
    }
  },
  {
    node: {
      id: "423",
      bank_name: "中国银行（香港）",
      bank_code: "25190344"
    }
  },
  {
    node: {
      id: "424",
      bank_name: "乌审旗包商村镇银行",
      bank_code: "15732057"
    }
  },
  {
    node: {
      id: "425",
      bank_name: "重庆富民银行",
      bank_code: "03460000"
    }
  },
  {
    node: {
      id: "426",
      bank_name: "北京房山沪农商村镇银行",
      bank_code: "15581000"
    }
  },
  {
    node: {
      id: "427",
      bank_name: "澳门通股份有限公司",
      bank_code: "28020446"
    }
  },
  {
    node: {
      id: "428",
      bank_name: "准格尔旗包商村镇银行",
      bank_code: "15732053"
    }
  },
  {
    node: {
      id: "429",
      bank_name: "北京大兴九银村镇银行",
      bank_code: "15151000"
    }
  },
  {
    node: {
      id: "430",
      bank_name: "北京昌平兆丰村镇银行",
      bank_code: "15731000"
    }
  },
  {
    node: {
      id: "431",
      bank_name: "宁波市鄞州国民村镇银行",
      bank_code: "15363323"
    }
  },
  {
    node: {
      id: "432",
      bank_name: "湖北随州曾都汇丰村镇银行",
      bank_code: "15115270"
    }
  },
  {
    node: {
      id: "433",
      bank_name: "深圳龙岗鼎业村镇银行",
      bank_code: "15145840"
    }
  },
  {
    node: {
      id: "434",
      bank_name: "宁波东海银行",
      bank_code: "05503320"
    }
  },
  {
    node: {
      id: "435",
      bank_name: "遂宁银行（遂宁市商业银行）",
      bank_code: "05516620"
    }
  },
  {
    node: {
      id: "436",
      bank_name: "周口银行",
      bank_code: "05625081"
    }
  },
  {
    node: {
      id: "437",
      bank_name: "齐商银行",
      bank_code: "64384530"
    }
  },
  {
    node: {
      id: "438",
      bank_name: "锦州银行",
      bank_code: "64392270"
    }
  },
  {
    node: {
      id: "439",
      bank_name: "潍坊银行",
      bank_code: "64624580"
    }
  },
  {
    node: {
      id: "440",
      bank_name: "中国银盛",
      bank_code: "25290344"
    }
  },
  {
    node: {
      id: "441",
      bank_name: "中国工商银行（巴西）",
      bank_code: "01020076"
    }
  },
  {
    node: {
      id: "442",
      bank_name: "工行加拿大",
      bank_code: "01020124"
    }
  },
  {
    node: {
      id: "443",
      bank_name: "中国工商银行(印尼",
      bank_code: "01020360"
    }
  },
  {
    node: {
      id: "444",
      bank_name: "青岛银行",
      bank_code: "04504520"
    }
  },
  {
    node: {
      id: "445",
      bank_name: "中国银行马尼拉分行",
      bank_code: "01040608"
    }
  },
  {
    node: {
      id: "446",
      bank_name: "友利银行(中国)有限公司",
      bank_code: "03270000"
    }
  },
  {
    node: {
      id: "447",
      bank_name: "浙江兰溪越商村镇银行",
      bank_code: "15713386"
    }
  },
  {
    node: {
      id: "448",
      bank_name: "灵山泰业村镇银行",
      bank_code: "15776314"
    }
  },
  {
    node: {
      id: "449",
      bank_name: "百色右江华润村镇银行",
      bank_code: "15916260"
    }
  },
  {
    node: {
      id: "450",
      bank_name: "福山珠江村镇银行",
      bank_code: "15404560"
    }
  },
  {
    node: {
      id: "451",
      bank_name: "莫力达瓦包商村镇银行",
      bank_code: "15731966"
    }
  },
  {
    node: {
      id: "452",
      bank_name: "通城惠民村镇银行",
      bank_code: "15805364"
    }
  },
  {
    node: {
      id: "453",
      bank_name: "陆川柳银村镇银行",
      bank_code: "15696247"
    }
  },
  {
    node: {
      id: "454",
      bank_name: "长治银行股份有限公司",
      bank_code: "05121660"
    }
  },
  {
    node: {
      id: "455",
      bank_name: "中国工商银行",
      bank_code: "01020000"
    }
  },
  {
    node: {
      id: "456",
      bank_name: "兴业银行",
      bank_code: "03090000"
    }
  },
  {
    node: {
      id: "457",
      bank_name: "长治银行股份有限公司（长治市商业银行）",
      bank_code: "05121660"
    }
  },
  {
    node: {
      id: "458",
      bank_name: "永隆银行有限公司",
      bank_code: "25100344"
    }
  },
  {
    node: {
      id: "459",
      bank_name: "浙江民泰商业银行",
      bank_code: "05253450"
    }
  },
  {
    node: {
      id: "460",
      bank_name: "北京银行",
      bank_code: "04031000"
    }
  },
  {
    node: {
      id: "461",
      bank_name: "宁波鄞州农村合作银行",
      bank_code: "14203323"
    }
  },
  {
    node: {
      id: "462",
      bank_name: "浙江省农村信用社联合社",
      bank_code: "14293300"
    }
  },
  {
    node: {
      id: "463",
      bank_name: "江苏省农村信用社联合社",
      bank_code: "65243000"
    }
  },
  {
    node: {
      id: "464",
      bank_name: "BC卡公司",
      bank_code: "26630410"
    }
  },
  {
    node: {
      id: "465",
      bank_name: "浙商银行",
      bank_code: "03160000"
    }
  },
  {
    node: {
      id: "466",
      bank_name: "东营银行（东营市商业银行）",
      bank_code: "05274550"
    }
  },
  {
    node: {
      id: "467",
      bank_name: "乌海银行股份有限公司（乌海市商业银行）",
      bank_code: "05311930"
    }
  },
  {
    node: {
      id: "468",
      bank_name: "唐山银行（唐山市商业银行）",
      bank_code: "04991240"
    }
  },
  {
    node: {
      id: "469",
      bank_name: "陕西省农村信用社联合社",
      bank_code: "14427900"
    }
  },
  {
    node: {
      id: "470",
      bank_name: "晋商银行",
      bank_code: "64491610"
    }
  },
  {
    node: {
      id: "471",
      bank_name: "贵州银行（六盘水商行）",
      bank_code: "05167030"
    }
  },
  {
    node: {
      id: "472",
      bank_name: "龙江银行股份有限公司（齐齐哈尔市商业银行)",
      bank_code: "04162640"
    }
  },
  {
    node: {
      id: "473",
      bank_name: "晋商银行（太原市商业银行）",
      bank_code: "04491610"
    }
  },
  {
    node: {
      id: "474",
      bank_name: "柳江柳银村镇银行",
      bank_code: "15696141"
    }
  },
  {
    node: {
      id: "475",
      bank_name: "桂林国民村镇银行",
      bank_code: "15366170"
    }
  },
  {
    node: {
      id: "476",
      bank_name: "江夏民生村镇银行",
      bank_code: "15275210"
    }
  },
  {
    node: {
      id: "477",
      bank_name: "佛山市三水区农村信用合作社",
      bank_code: "14215881"
    }
  },
  {
    node: {
      id: "478",
      bank_name: "洛阳银行（洛阳市商业银行）",
      bank_code: "04184930"
    }
  },
  {
    node: {
      id: "479",
      bank_name: "盛京银行",
      bank_code: "04170000"
    }
  },
  {
    node: {
      id: "480",
      bank_name: "乌鲁木齐银行（乌鲁木齐市商业银行）",
      bank_code: "04270001"
    }
  },
  {
    node: {
      id: "481",
      bank_name: "深圳农村商业银行",
      bank_code: "14045840"
    }
  },
  {
    node: {
      id: "482",
      bank_name: "青岛银行（青岛市商业银行）",
      bank_code: "04504520"
    }
  },
  {
    node: {
      id: "483",
      bank_name: "湖州市商业银行",
      bank_code: "04753360"
    }
  },
  {
    node: {
      id: "484",
      bank_name: "东莞市商业银行",
      bank_code: "04256020"
    }
  },
  {
    node: {
      id: "485",
      bank_name: "安徽明光民丰村镇银行",
      bank_code: "16023757"
    }
  },
  {
    node: {
      id: "486",
      bank_name: "宜都民生村镇银行",
      bank_code: "15275251"
    }
  },
  {
    node: {
      id: "487",
      bank_name: "山西省农村信用社联合社",
      bank_code: "14551600"
    }
  },
  {
    node: {
      id: "488",
      bank_name: "平顶山银行股份有限公司",
      bank_code: "05484950"
    }
  },
  {
    node: {
      id: "489",
      bank_name: "全椒中银富登村镇银行",
      bank_code: "15193754"
    }
  },
  {
    node: {
      id: "490",
      bank_name: "青州中银富登村镇银行",
      bank_code: "15194588"
    }
  },
  {
    node: {
      id: "491",
      bank_name: "单县中银富登村镇银行",
      bank_code: "15194755"
    }
  },
  {
    node: {
      id: "492",
      bank_name: "重庆沙坪坝融兴村镇银行",
      bank_code: "15216900"
    }
  },
  {
    node: {
      id: "493",
      bank_name: "重庆市武隆融兴村镇银行",
      bank_code: "15216925"
    }
  },
  {
    node: {
      id: "494",
      bank_name: "桂林银行（桂林市商业银行）",
      bank_code: "04916170"
    }
  },
  {
    node: {
      id: "495",
      bank_name: "日照银行（日照市商业银行）",
      bank_code: "64554770"
    }
  },
  {
    node: {
      id: "496",
      bank_name: "营口银行股份有限公司（营口市商业银行）",
      bank_code: "04652280"
    }
  },
  {
    node: {
      id: "497",
      bank_name: "武进农村商业银行",
      bank_code: "14353041"
    }
  },
  {
    node: {
      id: "498",
      bank_name: "菲律宾BDO",
      bank_code: "27240608"
    }
  },
  {
    node: {
      id: "499",
      bank_name: "RoyalBank",
      bank_code: "27550031"
    }
  },
  {
    node: {
      id: "500",
      bank_name: "韩国KB",
      bank_code: "28590410"
    }
  },
  {
    node: {
      id: "501",
      bank_name: "中银通商务支付有限公司",
      bank_code: "48100000"
    }
  },
  {
    node: {
      id: "502",
      bank_name: "日照银行",
      bank_code: "64554770"
    }
  },
  {
    node: {
      id: "503",
      bank_name: "辉县珠江村镇银行",
      bank_code: "15404988"
    }
  },
  {
    node: {
      id: "504",
      bank_name: "重庆江津石银村镇银行",
      bank_code: "15436901"
    }
  },
  {
    node: {
      id: "505",
      bank_name: "甘肃银行",
      bank_code: "05818200"
    }
  },
  {
    node: {
      id: "506",
      bank_name: "俄罗斯ORIENTEXPRESSBANK",
      bank_code: "28450643"
    }
  },
  {
    node: {
      id: "507",
      bank_name: "浙江建德湖商村镇银行",
      bank_code: "15283315"
    }
  },
  {
    node: {
      id: "508",
      bank_name: "广州花都稠州村镇银行",
      bank_code: "15355810"
    }
  },
  {
    node: {
      id: "509",
      bank_name: "广元贵商村镇银行",
      bank_code: "15446610"
    }
  },
  {
    node: {
      id: "510",
      bank_name: "石门沪农商村镇银行",
      bank_code: "15585586"
    }
  },
  {
    node: {
      id: "511",
      bank_name: "东莞厚街华业村镇银行",
      bank_code: "15786020"
    }
  },
  {
    node: {
      id: "512",
      bank_name: "乐平融兴村镇银行",
      bank_code: "15214221"
    }
  },
  {
    node: {
      id: "513",
      bank_name: "上饶银行",
      bank_code: "65264330"
    }
  },
  {
    node: {
      id: "514",
      bank_name: "湖南农村信用社联合社",
      bank_code: "65385500"
    }
  },
  {
    node: {
      id: "515",
      bank_name: "TheMauritiusCommercialBank",
      bank_code: "29170480"
    }
  },
  {
    node: {
      id: "516",
      bank_name: "开远沪农商村镇银行",
      bank_code: "15587432"
    }
  },
  {
    node: {
      id: "517",
      bank_name: "蒙自沪农商村镇银行",
      bank_code: "15587433"
    }
  },
  {
    node: {
      id: "518",
      bank_name: "弥勒沪农商村镇银行",
      bank_code: "15587437"
    }
  },
  {
    node: {
      id: "519",
      bank_name: "任丘泰寿村镇银行",
      bank_code: "15641442"
    }
  },
  {
    node: {
      id: "520",
      bank_name: "吴忠市滨河村镇银行",
      bank_code: "15438730"
    }
  },
  {
    node: {
      id: "521",
      bank_name: "孟州射阳村镇银行",
      bank_code: "15845016"
    }
  },
  {
    node: {
      id: "522",
      bank_name: "宁夏贺兰回商村镇银行",
      bank_code: "15738712"
    }
  },
  {
    node: {
      id: "523",
      bank_name: "辽宁省农村信用社联合社",
      bank_code: "14542200"
    }
  },
  {
    node: {
      id: "524",
      bank_name: "大邑交银兴民村镇银行",
      bank_code: "15006518"
    }
  },
  {
    node: {
      id: "525",
      bank_name: "宣汉诚民村镇银行",
      bank_code: "15036753"
    }
  },
  {
    node: {
      id: "526",
      bank_name: "浙江长兴联合村镇银行",
      bank_code: "15083362"
    }
  },
  {
    node: {
      id: "527",
      bank_name: "中山小榄村镇银行",
      bank_code: "15156030"
    }
  },
  {
    node: {
      id: "528",
      bank_name: "Discover Financial Services，I",
      bank_code: "26290840"
    }
  },
  {
    node: {
      id: "529",
      bank_name: "澳门商业银行",
      bank_code: "26320446"
    }
  },
  {
    node: {
      id: "530",
      bank_name: "达州银行（达州市商业银行）",
      bank_code: "05576750"
    }
  },
  {
    node: {
      id: "531",
      bank_name: "雅安市商业银行",
      bank_code: "05666770"
    }
  },
  {
    node: {
      id: "532",
      bank_name: "中原银行（商丘商行）",
      bank_code: "05864910"
    }
  },
  {
    node: {
      id: "533",
      bank_name: "广西北部湾银行",
      bank_code: "64786110"
    }
  },
  {
    node: {
      id: "534",
      bank_name: "郎溪新华村镇银行",
      bank_code: "15183772"
    }
  },
  {
    node: {
      id: "535",
      bank_name: "云南省农村信用社",
      bank_code: "65097300"
    }
  },
  {
    node: {
      id: "536",
      bank_name: "沧州银行",
      bank_code: "04761430"
    }
  },
  {
    node: {
      id: "537",
      bank_name: "工行布鲁塞尔",
      bank_code: "01020056"
    }
  },
  {
    node: {
      id: "538",
      bank_name: "中国工商银行布鲁塞尔分行",
      bank_code: "01020056"
    }
  },
  {
    node: {
      id: "539",
      bank_name: "工行东京分行",
      bank_code: "01020392"
    }
  },
  {
    node: {
      id: "540",
      bank_name: "工行马来西亚",
      bank_code: "01020458"
    }
  },
  {
    node: {
      id: "541",
      bank_name: "工银河内",
      bank_code: "01020704"
    }
  },
  {
    node: {
      id: "542",
      bank_name: "宁波市农业银行",
      bank_code: "01033320"
    }
  },
  {
    node: {
      id: "543",
      bank_name: "池州贵池民生村镇银行",
      bank_code: "15273790"
    }
  },
  {
    node: {
      id: "544",
      bank_name: "河南方城凤裕村镇银行",
      bank_code: "15515134"
    }
  },
  {
    node: {
      id: "545",
      bank_name: "清徐惠民村镇银行",
      bank_code: "15731611"
    }
  },
  {
    node: {
      id: "546",
      bank_name: "珠海华润银行股份有限公司（珠海市商业银行股份有限公司）",
      bank_code: "04375850"
    }
  },
  {
    node: {
      id: "547",
      bank_name: "福建沙县渝农商村镇银行",
      bank_code: "15563956"
    }
  },
  {
    node: {
      id: "548",
      bank_name: "秦皇岛银行股份有限公司(秦皇岛市商业银行)",
      bank_code: "04571260"
    }
  },
  {
    node: {
      id: "549",
      bank_name: "莱州珠江村镇银行",
      bank_code: "15404569"
    }
  },
  {
    node: {
      id: "550",
      bank_name: "莱芜珠江村镇银行",
      bank_code: "15404790"
    }
  },
  {
    node: {
      id: "551",
      bank_name: "西乌珠穆沁包商惠丰村镇银行",
      bank_code: "15732017"
    }
  },
  {
    node: {
      id: "552",
      bank_name: "西安银行股份有限公司",
      bank_code: "04447910"
    }
  },
  {
    node: {
      id: "553",
      bank_name: "辽宁大石桥隆丰村镇银行",
      bank_code: "15752281"
    }
  },
  {
    node: {
      id: "554",
      bank_name: "鄄城包商村镇银行",
      bank_code: "15734759"
    }
  },
  {
    node: {
      id: "555",
      bank_name: "鄢陵郑银村镇银行",
      bank_code: "15625033"
    }
  },
  {
    node: {
      id: "556",
      bank_name: "长春双阳吉银村镇银行",
      bank_code: "15522410"
    }
  },
  {
    node: {
      id: "557",
      bank_name: "阜宁民生村镇银行",
      bank_code: "15273113"
    }
  },
  {
    node: {
      id: "558",
      bank_name: "鞍山银行",
      bank_code: "04562239"
    }
  },
  {
    node: {
      id: "559",
      bank_name: "德阳银行（德阳市商业银行）",
      bank_code: "04986580"
    }
  },
  {
    node: {
      id: "560",
      bank_name: "肇庆农村信用社",
      bank_code: "14265930"
    }
  },
  {
    node: {
      id: "561",
      bank_name: "安徽省农村信用社联合社",
      bank_code: "14473600"
    }
  },
  {
    node: {
      id: "562",
      bank_name: "中国银行澳门分行",
      bank_code: "01040446"
    }
  },
  {
    node: {
      id: "563",
      bank_name: "海南省农村信用社联合社",
      bank_code: "14486400"
    }
  },
  {
    node: {
      id: "564",
      bank_name: "莫斯科人民储蓄银行",
      bank_code: "26690643"
    }
  },
  {
    node: {
      id: "565",
      bank_name: "温州银行",
      bank_code: "04123330"
    }
  },
  {
    node: {
      id: "566",
      bank_name: "天津市农村信用社",
      bank_code: "14191100"
    }
  },
  {
    node: {
      id: "567",
      bank_name: "重庆开州泰业村镇银行股份有限公司（曾用名：开县泰业村镇银行）",
      bank_code: "15776927"
    }
  },
  {
    node: {
      id: "568",
      bank_name: "开封新东方村镇银行",
      bank_code: "15654924"
    }
  },
  {
    node: {
      id: "569",
      bank_name: "攀枝花市商业银行",
      bank_code: "04836560"
    }
  },
  {
    node: {
      id: "570",
      bank_name: "新津珠江村镇银行",
      bank_code: "15406522"
    }
  },
  {
    node: {
      id: "571",
      bank_name: "景德镇商业银行",
      bank_code: "05734220"
    }
  },
  {
    node: {
      id: "572",
      bank_name: "枞阳泰业村镇银行",
      bank_code: "15773683"
    }
  },
  {
    node: {
      id: "573",
      bank_name: "江苏溧水民丰村镇银行",
      bank_code: "16023010"
    }
  },
  {
    node: {
      id: "574",
      bank_name: "成都农村商业银行",
      bank_code: "65226510"
    }
  },
  {
    node: {
      id: "575",
      bank_name: "大同银行（大同市商业银行）",
      bank_code: "04871620"
    }
  },
  {
    node: {
      id: "576",
      bank_name: "威海市商业银行",
      bank_code: "03134650"
    }
  },
  {
    node: {
      id: "577",
      bank_name: "江苏银行（南通市商业银行）",
      bank_code: "04523060"
    }
  },
  {
    node: {
      id: "578",
      bank_name: "天津银行（天津市商业银行）",
      bank_code: "04341100"
    }
  },
  {
    node: {
      id: "579",
      bank_name: "三门峡市城市信用社",
      bank_code: "04885050"
    }
  },
  {
    node: {
      id: "580",
      bank_name: "昆山农村信用合作社联合社",
      bank_code: "14023052"
    }
  },
  {
    node: {
      id: "581",
      bank_name: "广东南粤银行（湛江市商业银行）",
      bank_code: "04895910"
    }
  },
  {
    node: {
      id: "582",
      bank_name: "绍兴银行股份有限公司（绍兴市商业银行）",
      bank_code: "04283370"
    }
  },
  {
    node: {
      id: "583",
      bank_name: "南京银行",
      bank_code: "04243010"
    }
  },
  {
    node: {
      id: "584",
      bank_name: "苏州市商业银行",
      bank_code: "04213050"
    }
  },
  {
    node: {
      id: "585",
      bank_name: "佛山市禅城区农村信用联社",
      bank_code: "14275880"
    }
  },
  {
    node: {
      id: "586",
      bank_name: "佛山顺德农村商业银行",
      bank_code: "65085883"
    }
  },
  {
    node: {
      id: "587",
      bank_name: "晋城银行股份有限公司（晋城商业银行）",
      bank_code: "05031680"
    }
  },
  {
    node: {
      id: "588",
      bank_name: "江西银行（南昌市商业银行）",
      bank_code: "64484210"
    }
  },
  {
    node: {
      id: "589",
      bank_name: "安阳珠江村镇银行",
      bank_code: "15404960"
    }
  },
  {
    node: {
      id: "590",
      bank_name: "常熟农村商业银行",
      bank_code: "14033055"
    }
  },
  {
    node: {
      id: "591",
      bank_name: "平果国民村镇银行",
      bank_code: "15366264"
    }
  },
  {
    node: {
      id: "592",
      bank_name: "望江新华村镇银行",
      bank_code: "15183687"
    }
  },
  {
    node: {
      id: "593",
      bank_name: "临邑中银富登村镇银行",
      bank_code: "15194689"
    }
  },
  {
    node: {
      id: "594",
      bank_name: "应城融兴村镇银行",
      bank_code: "15215352"
    }
  },
  {
    node: {
      id: "595",
      bank_name: "遂宁安居融兴村镇银行",
      bank_code: "15216620"
    }
  },
  {
    node: {
      id: "596",
      bank_name: "重庆市酋阳融兴村镇银行",
      bank_code: "15216935"
    }
  },
  {
    node: {
      id: "597",
      bank_name: "江苏大丰江南村镇银行",
      bank_code: "15343116"
    }
  },
  {
    node: {
      id: "598",
      bank_name: "烟台银行（烟台市商业银行）",
      bank_code: "03134560"
    }
  },
  {
    node: {
      id: "599",
      bank_name: "厦门银行股份有限公司",
      bank_code: "04023930"
    }
  },
  {
    node: {
      id: "600",
      bank_name: "天津滨海农村商业银行",
      bank_code: "14561100"
    }
  },
  {
    node: {
      id: "601",
      bank_name: "西藏银行",
      bank_code: "05767700"
    }
  },
  {
    node: {
      id: "602",
      bank_name: "东营莱商村镇银行",
      bank_code: "15514550"
    }
  },
  {
    node: {
      id: "603",
      bank_name: "临清沪农商村镇银行",
      bank_code: "15584712"
    }
  },
  {
    node: {
      id: "604",
      bank_name: "茌平沪农商村镇银行",
      bank_code: "15584715"
    }
  },
  {
    node: {
      id: "605",
      bank_name: "衡阳沪农商村镇银行",
      bank_code: "15585541"
    }
  },
  {
    node: {
      id: "606",
      bank_name: "临澧沪农商村镇银行",
      bank_code: "15585584"
    }
  },
  {
    node: {
      id: "607",
      bank_name: "桂阳沪农商村镇银行",
      bank_code: "15585634"
    }
  },
  {
    node: {
      id: "608",
      bank_name: "乌海银行股份有限公司",
      bank_code: "05311930"
    }
  },
  {
    node: {
      id: "609",
      bank_name: "九台龙嘉村镇银行",
      bank_code: "15732415"
    }
  },
  {
    node: {
      id: "610",
      bank_name: "云南香格里拉渝农商村镇银行",
      bank_code: "15567571"
    }
  },
  {
    node: {
      id: "611",
      bank_name: "云浮新兴东盈民生村镇银行",
      bank_code: "15476061"
    }
  },
  {
    node: {
      id: "612",
      bank_name: "青海银行",
      bank_code: "64588510"
    }
  },
  {
    node: {
      id: "613",
      bank_name: "重庆南川石银村镇银行",
      bank_code: "15436900"
    }
  },
  {
    node: {
      id: "614",
      bank_name: "澳门BDA",
      bank_code: "27860446"
    }
  },
  {
    node: {
      id: "615",
      bank_name: "从化柳银村镇银行",
      bank_code: "15695812"
    }
  },
  {
    node: {
      id: "616",
      bank_name: "化德包商村镇银行",
      bank_code: "15732036"
    }
  },
  {
    node: {
      id: "617",
      bank_name: "南宁江南国民村镇银行",
      bank_code: "15366110"
    }
  },
  {
    node: {
      id: "618",
      bank_name: "合浦国民村镇银行",
      bank_code: "15366231"
    }
  },
  {
    node: {
      id: "619",
      bank_name: "湖北嘉鱼吴江村镇银行",
      bank_code: "15015363"
    }
  },
  {
    node: {
      id: "620",
      bank_name: "青岛即墨北农商村镇银行",
      bank_code: "15024521"
    }
  },
  {
    node: {
      id: "621",
      bank_name: "海口苏南村镇银行",
      bank_code: "15036410"
    }
  },
  {
    node: {
      id: "622",
      bank_name: "咸丰常农商村镇银行",
      bank_code: "15055416"
    }
  },
  {
    node: {
      id: "623",
      bank_name: "蕲春中银富登村镇银行",
      bank_code: "15195338"
    }
  },
  {
    node: {
      id: "624",
      bank_name: "北京顺义银座村镇银行",
      bank_code: "15201000"
    }
  },
  {
    node: {
      id: "625",
      bank_name: "建设银行亚洲公司",
      bank_code: "25070344"
    }
  },
  {
    node: {
      id: "626",
      bank_name: "建设银行澳门公司",
      bank_code: "25270446"
    }
  },
  {
    node: {
      id: "627",
      bank_name: "Bangkok Bank Pcl",
      bank_code: "26350764"
    }
  },
  {
    node: {
      id: "628",
      bank_name: "宝鸡商行",
      bank_code: "05417930"
    }
  },
  {
    node: {
      id: "629",
      bank_name: "重庆三峡银行",
      bank_code: "05426900"
    }
  },
  {
    node: {
      id: "630",
      bank_name: "中原银行（新乡市商业银行）",
      bank_code: "05864910"
    }
  },
  {
    node: {
      id: "631",
      bank_name: "富滇银行",
      bank_code: "64667310"
    }
  },
  {
    node: {
      id: "632",
      bank_name: "湖州银行",
      bank_code: "64753360"
    }
  },
  {
    node: {
      id: "633",
      bank_name: "东营银行",
      bank_code: "65274550"
    }
  },
  {
    node: {
      id: "634",
      bank_name: "工银印尼",
      bank_code: "01020360"
    }
  },
  {
    node: {
      id: "635",
      bank_name: "中国工商银行阿拉木图子行",
      bank_code: "01020398"
    }
  },
  {
    node: {
      id: "636",
      bank_name: "工行马德里",
      bank_code: "01020724"
    }
  },
  {
    node: {
      id: "637",
      bank_name: "中国银行（澳大利亚）",
      bank_code: "01040036"
    }
  },
  {
    node: {
      id: "638",
      bank_name: "中银东京分行",
      bank_code: "01040392"
    }
  },
  {
    node: {
      id: "639",
      bank_name: "渣打银行中国有限公司",
      bank_code: "03220000"
    }
  },
  {
    node: {
      id: "640",
      bank_name: "华侨永亨银行（中国）",
      bank_code: "03300000"
    }
  },
  {
    node: {
      id: "641",
      bank_name: "华侨永亨银行股份有限公司",
      bank_code: "25060344"
    }
  },
  {
    node: {
      id: "642",
      bank_name: "漯河市郾城包商村镇银行",
      bank_code: "15735040"
    }
  },
  {
    node: {
      id: "643",
      bank_name: "石河子国民村镇银行",
      bank_code: "15369028"
    }
  },
  {
    node: {
      id: "644",
      bank_name: "融水柳银村镇银行",
      bank_code: "15696158"
    }
  },
  {
    node: {
      id: "645",
      bank_name: "遂宁银行（遂宁市商业银行）",
      bank_code: "05516629"
    }
  },
  {
    node: {
      id: "646",
      bank_name: "鄂温克旗包商村镇银行",
      bank_code: "15731971"
    }
  },
  {
    node: {
      id: "647",
      bank_name: "长垣民生村镇银行",
      bank_code: "15274986"
    }
  },
  {
    node: {
      id: "648",
      bank_name: "长葛轩辕村镇银行",
      bank_code: "15655031"
    }
  },
  {
    node: {
      id: "649",
      bank_name: "驻马店银行",
      bank_code: "05605128"
    }
  },
  {
    node: {
      id: "650",
      bank_name: "平安银行",
      bank_code: "03070000"
    }
  },
  {
    node: {
      id: "651",
      bank_name: "江苏银行",
      bank_code: "05083000"
    }
  },
  {
    node: {
      id: "652",
      bank_name: "重庆市农村信用社联合社",
      bank_code: "14136530"
    }
  },
  {
    node: {
      id: "653",
      bank_name: "福建省农村信用社联合社",
      bank_code: "14173900"
    }
  },
  {
    node: {
      id: "654",
      bank_name: "宁夏银行",
      bank_code: "04360010"
    }
  },
  {
    node: {
      id: "655",
      bank_name: "交通银行",
      bank_code: "03010000"
    }
  },
  {
    node: {
      id: "656",
      bank_name: "贵州银行（遵义市商业银行）",
      bank_code: "05167030"
    }
  },
  {
    node: {
      id: "657",
      bank_name: "长沙银行股份有限公司（长沙市商业银行）",
      bank_code: "04615510"
    }
  },
  {
    node: {
      id: "658",
      bank_name: "中国民生银行",
      bank_code: "03050000"
    }
  },
  {
    node: {
      id: "659",
      bank_name: "日本三井住友卡公司",
      bank_code: "26110392"
    }
  },
  {
    node: {
      id: "660",
      bank_name: "成都银行（成都商业银行）",
      bank_code: "04296510"
    }
  },
  {
    node: {
      id: "661",
      bank_name: "四川省农村信用社联合社",
      bank_code: "14526500"
    }
  },
  {
    node: {
      id: "662",
      bank_name: "中国邮政储蓄银行",
      bank_code: "01000000"
    }
  },
  {
    node: {
      id: "663",
      bank_name: "德州银行",
      bank_code: "65154680"
    }
  },
  {
    node: {
      id: "664",
      bank_name: "朝阳银行",
      bank_code: "05492340"
    }
  },
  {
    node: {
      id: "665",
      bank_name: "江苏南通如皋包商村镇银行",
      bank_code: "15733062"
    }
  },
  {
    node: {
      id: "666",
      bank_name: "江西兴国新华村镇银行",
      bank_code: "15184299"
    }
  },
  {
    node: {
      id: "667",
      bank_name: "泸州银行（泸州市商业银行）",
      bank_code: "04866570"
    }
  },
  {
    node: {
      id: "668",
      bank_name: "厦门银行股份有限公司（厦门市商业银行）",
      bank_code: "04023930"
    }
  },
  {
    node: {
      id: "669",
      bank_name: "镇江市商业银行",
      bank_code: "04073140"
    }
  },
  {
    node: {
      id: "670",
      bank_name: "蓬莱民生村镇银行",
      bank_code: "15274561"
    }
  },
  {
    node: {
      id: "671",
      bank_name: "恒生银行有限公司",
      bank_code: "03260000"
    }
  },
  {
    node: {
      id: "672",
      bank_name: "浙江网商银行",
      bank_code: "03410000"
    }
  },
  {
    node: {
      id: "673",
      bank_name: "昆明商业银行",
      bank_code: "04667310"
    }
  },
  {
    node: {
      id: "674",
      bank_name: "安徽粤西湖商村镇银行",
      bank_code: "15283688"
    }
  },
  {
    node: {
      id: "675",
      bank_name: "安徽蒙城湖商村镇银行",
      bank_code: "15283812"
    }
  },
  {
    node: {
      id: "676",
      bank_name: "山东临朐聚丰村镇银行",
      bank_code: "15884583"
    }
  },
  {
    node: {
      id: "677",
      bank_name: "天津静海新华村镇银行",
      bank_code: "15181123"
    }
  },
  {
    node: {
      id: "678",
      bank_name: "宁波镇海中银富登村镇银行",
      bank_code: "15193320"
    }
  },
  {
    node: {
      id: "679",
      bank_name: "宁海中银富登村镇银行",
      bank_code: "15193322"
    }
  },
  {
    node: {
      id: "680",
      bank_name: "来安中银富登村镇银行",
      bank_code: "15193753"
    }
  },
  {
    node: {
      id: "681",
      bank_name: "巴彦融兴村镇银行",
      bank_code: "15212625"
    }
  },
  {
    node: {
      id: "682",
      bank_name: "江苏如东融兴村镇银行",
      bank_code: "15213063"
    }
  },
  {
    node: {
      id: "683",
      bank_name: "安溪民生村镇银行",
      bank_code: "15273974"
    }
  },
  {
    node: {
      id: "684",
      bank_name: "信阳珠江村镇银行",
      bank_code: "15405150"
    }
  },
  {
    node: {
      id: "685",
      bank_name: "龙江银行",
      bank_code: "04922600"
    }
  },
  {
    node: {
      id: "686",
      bank_name: "自贡市商业银行",
      bank_code: "05326560"
    }
  },
  {
    node: {
      id: "687",
      bank_name: "哈密市商业银行",
      bank_code: "05748840"
    }
  },
  {
    node: {
      id: "688",
      bank_name: "本溪银行（本溪市商业银行）",
      bank_code: "05832250"
    }
  },
  {
    node: {
      id: "689",
      bank_name: "山东省农联社",
      bank_code: "14024510"
    }
  },
  {
    node: {
      id: "690",
      bank_name: "武汉农信",
      bank_code: "14105210"
    }
  },
  {
    node: {
      id: "691",
      bank_name: "营口银行股份有限公司",
      bank_code: "04652280"
    }
  },
  {
    node: {
      id: "692",
      bank_name: "郑州银行股份有限公司（郑州市商业银行）",
      bank_code: "04354910"
    }
  },
  {
    node: {
      id: "693",
      bank_name: "靖江市长江城市信用社",
      bank_code: "04933120"
    }
  },
  {
    node: {
      id: "694",
      bank_name: "大新银行（中国）",
      bank_code: "03350000"
    }
  },
  {
    node: {
      id: "695",
      bank_name: "江门新会农村商业银行",
      bank_code: "14255890"
    }
  },
  {
    node: {
      id: "696",
      bank_name: "俄罗斯远东商业银行",
      bank_code: "26780643"
    }
  },
  {
    node: {
      id: "697",
      bank_name: "CSC",
      bank_code: "26790422"
    }
  },
  {
    node: {
      id: "698",
      bank_name: "Allied Bank",
      bank_code: "26930608"
    }
  },
  {
    node: {
      id: "699",
      bank_name: "CJSCFononbank",
      bank_code: "28720762"
    }
  },
  {
    node: {
      id: "700",
      bank_name: "天津农村商业银行",
      bank_code: "65191100"
    }
  },
  {
    node: {
      id: "701",
      bank_name: "杭州联合银行",
      bank_code: "14293300"
    }
  },
  {
    node: {
      id: "702",
      bank_name: "石嘴山银行",
      bank_code: "05438720"
    }
  },
  {
    node: {
      id: "703",
      bank_name: "KrungThajBankPublicCo.Ltd",
      bank_code: "28550764"
    }
  },
  {
    node: {
      id: "704",
      bank_name: "巴基斯坦HabibBank",
      bank_code: "28990586"
    }
  },
  {
    node: {
      id: "705",
      bank_name: "广州番禹新华村镇银行",
      bank_code: "15185810"
    }
  },
  {
    node: {
      id: "706",
      bank_name: "拜泉融兴村镇银行",
      bank_code: "15212652"
    }
  },
  {
    node: {
      id: "707",
      bank_name: "海南保亭融兴村镇银行",
      bank_code: "15216437"
    }
  },
  {
    node: {
      id: "708",
      bank_name: "琼海国民村镇银行",
      bank_code: "15386424"
    }
  },
  {
    node: {
      id: "709",
      bank_name: "湖北咸安武农商村镇银行",
      bank_code: "15535360"
    }
  },
  {
    node: {
      id: "710",
      bank_name: "广州增城长江村镇银行",
      bank_code: "15535813"
    }
  },
  {
    node: {
      id: "711",
      bank_name: "济南槐荫沪农商村镇银行",
      bank_code: "15584513"
    }
  },
  {
    node: {
      id: "712",
      bank_name: "聊城东昌沪农商村镇银行",
      bank_code: "15584710"
    }
  },
  {
    node: {
      id: "713",
      bank_name: "日照沪农商村镇银行",
      bank_code: "15584770"
    }
  },
  {
    node: {
      id: "714",
      bank_name: "澧县沪农商村镇银行",
      bank_code: "15585583"
    }
  },
  {
    node: {
      id: "715",
      bank_name: "慈利沪农商村镇银行",
      bank_code: "15585591"
    }
  },
  {
    node: {
      id: "716",
      bank_name: "嵩明沪农商村镇银行",
      bank_code: "15587317"
    }
  },
  {
    node: {
      id: "717",
      bank_name: "东亚银行有限公司",
      bank_code: "25020344"
    }
  },
  {
    node: {
      id: "718",
      bank_name: "东兴国民村镇银行",
      bank_code: "15366322"
    }
  },
  {
    node: {
      id: "719",
      bank_name: "莱商银行",
      bank_code: "04974790"
    }
  },
  {
    node: {
      id: "720",
      bank_name: "深圳光明沪农商村镇银行",
      bank_code: "15585840"
    }
  },
  {
    node: {
      id: "721",
      bank_name: "瑞丽沪农商村镇银行",
      bank_code: "15587546"
    }
  },
  {
    node: {
      id: "722",
      bank_name: "信阳银行",
      bank_code: "05695150"
    }
  },
  {
    node: {
      id: "723",
      bank_name: "博白柳银村镇银行",
      bank_code: "15696248"
    }
  },
  {
    node: {
      id: "724",
      bank_name: "大连金州联丰村镇银行",
      bank_code: "15732220"
    }
  },
  {
    node: {
      id: "725",
      bank_name: "天津津南村镇银行",
      bank_code: "15731100"
    }
  },
  {
    node: {
      id: "726",
      bank_name: "宁城包商村镇银行",
      bank_code: "15731948"
    }
  },
  {
    node: {
      id: "727",
      bank_name: "宁波银行",
      bank_code: "04083320"
    }
  },
  {
    node: {
      id: "728",
      bank_name: "北京密云汇丰村镇银行",
      bank_code: "15111027"
    }
  },
  {
    node: {
      id: "729",
      bank_name: "方大村镇银行",
      bank_code: "15142080"
    }
  },
  {
    node: {
      id: "730",
      bank_name: "安徽当涂新华村镇银行",
      bank_code: "15183651"
    }
  },
  {
    node: {
      id: "731",
      bank_name: "深圳福田银座村镇银行",
      bank_code: "15205840"
    }
  },
  {
    node: {
      id: "732",
      bank_name: "鹤壁银行",
      bank_code: "05354970"
    }
  },
  {
    node: {
      id: "733",
      bank_name: "铁岭银行",
      bank_code: "05392330"
    }
  },
  {
    node: {
      id: "734",
      bank_name: "中原银行（驻马店银行）",
      bank_code: "05864910"
    }
  },
  {
    node: {
      id: "735",
      bank_name: "九江银行股份有限公司",
      bank_code: "64544240"
    }
  },
  {
    node: {
      id: "736",
      bank_name: "中原银行（商丘市商业银行）",
      bank_code: "05864910"
    }
  },
  {
    node: {
      id: "737",
      bank_name: "上海松江民生村镇银行",
      bank_code: "15272900"
    }
  },
  {
    node: {
      id: "738",
      bank_name: "工银法兰克福",
      bank_code: "01020276"
    }
  },
  {
    node: {
      id: "739",
      bank_name: "工行首尔",
      bank_code: "01020410"
    }
  },
  {
    node: {
      id: "740",
      bank_name: "交通银行澳门分行",
      bank_code: "03010446"
    }
  },
  {
    node: {
      id: "741",
      bank_name: "招商银行香港分行",
      bank_code: "03080344"
    }
  },
  {
    node: {
      id: "742",
      bank_name: "江都吉银村镇银行",
      bank_code: "15523120"
    }
  },
  {
    node: {
      id: "743",
      bank_name: "洛阳银行",
      bank_code: "04184930"
    }
  },
  {
    node: {
      id: "744",
      bank_name: "浙江常山联合村镇银行",
      bank_code: "15083412"
    }
  },
  {
    node: {
      id: "745",
      bank_name: "海阳珠江村镇银行",
      bank_code: "15404564"
    }
  },
  {
    node: {
      id: "746",
      bank_name: "漳浦民生村镇银行",
      bank_code: "15273993"
    }
  }
];
const addressList = [
  {
    code: "110000",
    region: "北京市",
    regionEntitys: [
      {
        code: "110000",
        region: "北京市"
      }
    ]
  },
  {
    code: "120000",
    region: "天津市",
    regionEntitys: [
      {
        code: "120000",
        region: "天津市"
      }
    ]
  },
  {
    code: "130000",
    region: "河北省",
    regionEntitys: [
      {
        code: "130100",
        region: "石家庄市"
      },
      {
        code: "130200",
        region: "唐山市"
      },
      {
        code: "130300",
        region: "秦皇岛市"
      },
      {
        code: "130400",
        region: "邯郸市"
      },
      {
        code: "130500",
        region: "邢台市"
      },
      {
        code: "130600",
        region: "保定市"
      },
      {
        code: "130700",
        region: "张家口市"
      },
      {
        code: "130800",
        region: "承德市"
      },
      {
        code: "130900",
        region: "沧州市"
      },
      {
        code: "131000",
        region: "廊坊市"
      },
      {
        code: "131100",
        region: "衡水市"
      },
      {
        code: "139000",
        region: "省直辖县级行政区划"
      }
    ]
  },
  {
    code: "140000",
    region: "山西省",
    regionEntitys: [
      {
        code: "140100",
        region: "太原市"
      },
      {
        code: "140200",
        region: "大同市"
      },
      {
        code: "140300",
        region: "阳泉市"
      },
      {
        code: "140400",
        region: "长治市"
      },
      {
        code: "140500",
        region: "晋城市"
      },
      {
        code: "140600",
        region: "朔州市"
      },
      {
        code: "140700",
        region: "晋中市"
      },
      {
        code: "140800",
        region: "运城市"
      },
      {
        code: "140900",
        region: "忻州市"
      },
      {
        code: "141000",
        region: "临汾市"
      },
      {
        code: "141100",
        region: "吕梁市"
      }
    ]
  },
  {
    code: "150000",
    region: "内蒙古自治区",
    regionEntitys: [
      {
        code: "150100",
        region: "呼和浩特市"
      },
      {
        code: "150200",
        region: "包头市"
      },
      {
        code: "150300",
        region: "乌海市"
      },
      {
        code: "150400",
        region: "赤峰市"
      },
      {
        code: "150500",
        region: "通辽市"
      },
      {
        code: "150600",
        region: "鄂尔多斯市"
      },
      {
        code: "150700",
        region: "呼伦贝尔市"
      },
      {
        code: "150800",
        region: "巴彦淖尔市"
      },
      {
        code: "150900",
        region: "乌兰察布市"
      },
      {
        code: "152200",
        region: "兴安盟"
      },
      {
        code: "152500",
        region: "锡林郭勒盟"
      },
      {
        code: "152900",
        region: "阿拉善盟"
      }
    ]
  },
  {
    code: "210000",
    region: "辽宁省",
    regionEntitys: [
      {
        code: "210100",
        region: "沈阳市"
      },
      {
        code: "210200",
        region: "大连市"
      },
      {
        code: "210300",
        region: "鞍山市"
      },
      {
        code: "210400",
        region: "抚顺市"
      },
      {
        code: "210500",
        region: "本溪市"
      },
      {
        code: "210600",
        region: "丹东市"
      },
      {
        code: "210700",
        region: "锦州市"
      },
      {
        code: "210800",
        region: "营口市"
      },
      {
        code: "210900",
        region: "阜新市"
      },
      {
        code: "211000",
        region: "辽阳市"
      },
      {
        code: "211100",
        region: "盘锦市"
      },
      {
        code: "211200",
        region: "铁岭市"
      },
      {
        code: "211300",
        region: "朝阳市"
      },
      {
        code: "211400",
        region: "葫芦岛市"
      }
    ]
  },
  {
    code: "220000",
    region: "吉林省",
    regionEntitys: [
      {
        code: "220100",
        region: "长春市"
      },
      {
        code: "220200",
        region: "吉林市"
      },
      {
        code: "220300",
        region: "四平市"
      },
      {
        code: "220400",
        region: "辽源市"
      },
      {
        code: "220500",
        region: "通化市"
      },
      {
        code: "220600",
        region: "白山市"
      },
      {
        code: "220700",
        region: "松原市"
      },
      {
        code: "220800",
        region: "白城市"
      },
      {
        code: "222400",
        region: "延边朝鲜族自治州"
      }
    ]
  },
  {
    code: "230000",
    region: "黑龙江省",
    regionEntitys: [
      {
        code: "230100",
        region: "哈尔滨市"
      },
      {
        code: "230200",
        region: "齐齐哈尔市"
      },
      {
        code: "230300",
        region: "鸡西市"
      },
      {
        code: "230400",
        region: "鹤岗市"
      },
      {
        code: "230500",
        region: "双鸭山市"
      },
      {
        code: "230600",
        region: "大庆市"
      },
      {
        code: "230700",
        region: "伊春市"
      },
      {
        code: "230800",
        region: "佳木斯市"
      },
      {
        code: "230900",
        region: "七台河市"
      },
      {
        code: "231000",
        region: "牡丹江市"
      },
      {
        code: "231100",
        region: "黑河市"
      },
      {
        code: "231200",
        region: "绥化市"
      },
      {
        code: "232700",
        region: "大兴安岭地区"
      }
    ]
  },
  {
    code: "310000",
    region: "上海市",
    regionEntitys: [
      {
        code: "310000",
        region: "上海市"
      }
    ]
  },
  {
    code: "320000",
    region: "江苏省",
    regionEntitys: [
      {
        code: "320100",
        region: "南京市"
      },
      {
        code: "320200",
        region: "无锡市"
      },
      {
        code: "320300",
        region: "徐州市"
      },
      {
        code: "320400",
        region: "常州市"
      },
      {
        code: "320500",
        region: "苏州市"
      },
      {
        code: "320600",
        region: "南通市"
      },
      {
        code: "320700",
        region: "连云港市"
      },
      {
        code: "320800",
        region: "淮安市"
      },
      {
        code: "320900",
        region: "盐城市"
      },
      {
        code: "321000",
        region: "扬州市"
      },
      {
        code: "321100",
        region: "镇江市"
      },
      {
        code: "321200",
        region: "泰州市"
      },
      {
        code: "321300",
        region: "宿迁市"
      }
    ]
  },
  {
    code: "330000",
    region: "浙江省",
    regionEntitys: [
      {
        code: "330100",
        region: "杭州市"
      },
      {
        code: "330200",
        region: "宁波市"
      },
      {
        code: "330300",
        region: "温州市"
      },
      {
        code: "330400",
        region: "嘉兴市"
      },
      {
        code: "330500",
        region: "湖州市"
      },
      {
        code: "330600",
        region: "绍兴市"
      },
      {
        code: "330700",
        region: "金华市"
      },
      {
        code: "330800",
        region: "衢州市"
      },
      {
        code: "330900",
        region: "舟山市"
      },
      {
        code: "331000",
        region: "台州市"
      },
      {
        code: "331100",
        region: "丽水市"
      }
    ]
  },
  {
    code: "340000",
    region: "安徽省",
    regionEntitys: [
      {
        code: "340100",
        region: "合肥市"
      },
      {
        code: "340200",
        region: "芜湖市"
      },
      {
        code: "340300",
        region: "蚌埠市"
      },
      {
        code: "340400",
        region: "淮南市"
      },
      {
        code: "340500",
        region: "马鞍山市"
      },
      {
        code: "340600",
        region: "淮北市"
      },
      {
        code: "340700",
        region: "铜陵市"
      },
      {
        code: "340800",
        region: "安庆市"
      },
      {
        code: "341000",
        region: "黄山市"
      },
      {
        code: "341100",
        region: "滁州市"
      },
      {
        code: "341200",
        region: "阜阳市"
      },
      {
        code: "341300",
        region: "宿州市"
      },
      {
        code: "341500",
        region: "六安市"
      },
      {
        code: "341600",
        region: "亳州市"
      },
      {
        code: "341700",
        region: "池州市"
      },
      {
        code: "341800",
        region: "宣城市"
      }
    ]
  },
  {
    code: "350000",
    region: "福建省",
    regionEntitys: [
      {
        code: "350100",
        region: "福州市"
      },
      {
        code: "350200",
        region: "厦门市"
      },
      {
        code: "350300",
        region: "莆田市"
      },
      {
        code: "350400",
        region: "三明市"
      },
      {
        code: "350500",
        region: "泉州市"
      },
      {
        code: "350600",
        region: "漳州市"
      },
      {
        code: "350700",
        region: "南平市"
      },
      {
        code: "350800",
        region: "龙岩市"
      },
      {
        code: "350900",
        region: "宁德市"
      }
    ]
  },
  {
    code: "360000",
    region: "江西省",
    regionEntitys: [
      {
        code: "360100",
        region: "南昌市"
      },
      {
        code: "360200",
        region: "景德镇市"
      },
      {
        code: "360300",
        region: "萍乡市"
      },
      {
        code: "360400",
        region: "九江市"
      },
      {
        code: "360500",
        region: "新余市"
      },
      {
        code: "360600",
        region: "鹰潭市"
      },
      {
        code: "360700",
        region: "赣州市"
      },
      {
        code: "360800",
        region: "吉安市"
      },
      {
        code: "360900",
        region: "宜春市"
      },
      {
        code: "361000",
        region: "抚州市"
      },
      {
        code: "361100",
        region: "上饶市"
      }
    ]
  },
  {
    code: "370000",
    region: "山东省",
    regionEntitys: [
      {
        code: "370100",
        region: "济南市"
      },
      {
        code: "370200",
        region: "青岛市"
      },
      {
        code: "370300",
        region: "淄博市"
      },
      {
        code: "370400",
        region: "枣庄市"
      },
      {
        code: "370500",
        region: "东营市"
      },
      {
        code: "370600",
        region: "烟台市"
      },
      {
        code: "370700",
        region: "潍坊市"
      },
      {
        code: "370800",
        region: "济宁市"
      },
      {
        code: "370900",
        region: "泰安市"
      },
      {
        code: "371000",
        region: "威海市"
      },
      {
        code: "371100",
        region: "日照市"
      },
      {
        code: "371200",
        region: "莱芜市"
      },
      {
        code: "371300",
        region: "临沂市"
      },
      {
        code: "371400",
        region: "德州市"
      },
      {
        code: "371500",
        region: "聊城市"
      },
      {
        code: "371600",
        region: "滨州市"
      },
      {
        code: "371700",
        region: "菏泽市"
      }
    ]
  },
  {
    code: "410000",
    region: "河南省",
    regionEntitys: [
      {
        code: "410100",
        region: "郑州市"
      },
      {
        code: "410200",
        region: "开封市"
      },
      {
        code: "410300",
        region: "洛阳市"
      },
      {
        code: "410400",
        region: "平顶山市"
      },
      {
        code: "410500",
        region: "安阳市"
      },
      {
        code: "410600",
        region: "鹤壁市"
      },
      {
        code: "410700",
        region: "新乡市"
      },
      {
        code: "410800",
        region: "焦作市"
      },
      {
        code: "410900",
        region: "濮阳市"
      },
      {
        code: "411000",
        region: "许昌市"
      },
      {
        code: "411100",
        region: "漯河市"
      },
      {
        code: "411200",
        region: "三门峡市"
      },
      {
        code: "411300",
        region: "南阳市"
      },
      {
        code: "411400",
        region: "商丘市"
      },
      {
        code: "411500",
        region: "信阳市"
      },
      {
        code: "411600",
        region: "周口市"
      },
      {
        code: "411700",
        region: "驻马店市"
      },
      {
        code: "419000",
        region: "省直辖县级行政区划"
      }
    ]
  },
  {
    code: "420000",
    region: "湖北省",
    regionEntitys: [
      {
        code: "420100",
        region: "武汉市"
      },
      {
        code: "420200",
        region: "黄石市"
      },
      {
        code: "420300",
        region: "十堰市"
      },
      {
        code: "420500",
        region: "宜昌市"
      },
      {
        code: "420600",
        region: "襄阳市"
      },
      {
        code: "420700",
        region: "鄂州市"
      },
      {
        code: "420800",
        region: "荆门市"
      },
      {
        code: "420900",
        region: "孝感市"
      },
      {
        code: "421000",
        region: "荆州市"
      },
      {
        code: "421100",
        region: "黄冈市"
      },
      {
        code: "421200",
        region: "咸宁市"
      },
      {
        code: "421300",
        region: "随州市"
      },
      {
        code: "422800",
        region: "恩施土家族苗族自治州"
      },
      {
        code: "429000",
        region: "省直辖县级行政区划"
      },
      {
        code: "429004",
        region: "仙桃市"
      },
      {
        code: "429005",
        region: "潜江市"
      },
      {
        code: "429006",
        region: "天门市"
      },
      {
        code: "429021",
        region: "神农架林区"
      }
    ]
  },
  {
    code: "430000",
    region: "湖南省",
    regionEntitys: [
      {
        code: "430100",
        region: "长沙市"
      },
      {
        code: "430200",
        region: "株洲市"
      },
      {
        code: "430300",
        region: "湘潭市"
      },
      {
        code: "430400",
        region: "衡阳市"
      },
      {
        code: "430500",
        region: "邵阳市"
      },
      {
        code: "430600",
        region: "岳阳市"
      },
      {
        code: "430700",
        region: "常德市"
      },
      {
        code: "430800",
        region: "张家界市"
      },
      {
        code: "430900",
        region: "益阳市"
      },
      {
        code: "431000",
        region: "郴州市"
      },
      {
        code: "431100",
        region: "永州市"
      },
      {
        code: "431200",
        region: "怀化市"
      },
      {
        code: "431300",
        region: "娄底市"
      },
      {
        code: "433100",
        region: "湘西土家族苗族自治州"
      },
      {
        code: "469001",
        region: "五指山市"
      },
      {
        code: "469002",
        region: "琼海市"
      },
      {
        code: "469005",
        region: "文昌市"
      },
      {
        code: "469006",
        region: "万宁市"
      },
      {
        code: "469007",
        region: "东方市"
      },
      {
        code: "469021",
        region: "定安县"
      },
      {
        code: "469022",
        region: "屯昌县"
      },
      {
        code: "469023",
        region: "澄迈县"
      },
      {
        code: "469024",
        region: "临高县"
      },
      {
        code: "469025",
        region: "白沙黎族自治县"
      },
      {
        code: "469026",
        region: "昌江黎族自治县"
      },
      {
        code: "469027",
        region: "乐东黎族自治县"
      },
      {
        code: "469028",
        region: "陵水黎族自治县"
      },
      {
        code: "469029",
        region: "保亭黎族苗族自治县"
      },
      {
        code: "469030",
        region: "琼中黎族苗族自治县"
      }
    ]
  },
  {
    code: "440000",
    region: "广东省",
    regionEntitys: [
      {
        code: "440100",
        region: "广州市"
      },
      {
        code: "440200",
        region: "韶关市"
      },
      {
        code: "440300",
        region: "深圳市"
      },
      {
        code: "440400",
        region: "珠海市"
      },
      {
        code: "440500",
        region: "汕头市"
      },
      {
        code: "440600",
        region: "佛山市"
      },
      {
        code: "440700",
        region: "江门市"
      },
      {
        code: "440800",
        region: "湛江市"
      },
      {
        code: "440900",
        region: "茂名市"
      },
      {
        code: "441200",
        region: "肇庆市"
      },
      {
        code: "441300",
        region: "惠州市"
      },
      {
        code: "441400",
        region: "梅州市"
      },
      {
        code: "441500",
        region: "汕尾市"
      },
      {
        code: "441600",
        region: "河源市"
      },
      {
        code: "441700",
        region: "阳江市"
      },
      {
        code: "441800",
        region: "清远市"
      },
      {
        code: "441900",
        region: "东莞市"
      },
      {
        code: "442000",
        region: "中山市"
      },
      {
        code: "445100",
        region: "潮州市"
      },
      {
        code: "445200",
        region: "揭阳市"
      },
      {
        code: "445300",
        region: "云浮市"
      }
    ]
  },
  {
    code: "450000",
    region: "广西壮族自治区",
    regionEntitys: [
      {
        code: "450100",
        region: "南宁市"
      },
      {
        code: "450200",
        region: "柳州市"
      },
      {
        code: "450300",
        region: "桂林市"
      },
      {
        code: "450400",
        region: "梧州市"
      },
      {
        code: "450500",
        region: "北海市"
      },
      {
        code: "450600",
        region: "防城港市"
      },
      {
        code: "450700",
        region: "钦州市"
      },
      {
        code: "450800",
        region: "贵港市"
      },
      {
        code: "450900",
        region: "玉林市"
      },
      {
        code: "451000",
        region: "百色市"
      },
      {
        code: "451100",
        region: "贺州市"
      },
      {
        code: "451200",
        region: "河池市"
      },
      {
        code: "451300",
        region: "来宾市"
      },
      {
        code: "451400",
        region: "崇左市"
      }
    ]
  },
  {
    code: "460000",
    region: "海南省",
    regionEntitys: [
      {
        code: "460100",
        region: "海口市"
      },
      {
        code: "460200",
        region: "三亚市"
      },
      {
        code: "460300",
        region: "三沙市"
      },
      {
        code: "460400",
        region: "儋州市"
      },
      {
        code: "469000",
        region: "省直辖县级行政区划"
      }
    ]
  },
  {
    code: "500000",
    region: "重庆市",
    regionEntitys: [
      {
        code: "500000",
        region: "市辖区"
      },
      {
        code: "500101",
        region: "万州区"
      },
      {
        code: "500102",
        region: "涪陵区"
      },
      {
        code: "500103",
        region: "渝中区"
      },
      {
        code: "500104",
        region: "大渡口区"
      },
      {
        code: "500105",
        region: "江北区"
      },
      {
        code: "500106",
        region: "沙坪坝区"
      },
      {
        code: "500107",
        region: "九龙坡区"
      },
      {
        code: "500108",
        region: "南岸区"
      },
      {
        code: "500109",
        region: "北碚区"
      },
      {
        code: "500110",
        region: "綦江区"
      },
      {
        code: "500111",
        region: "大足区"
      },
      {
        code: "500112",
        region: "渝北区"
      },
      {
        code: "500113",
        region: "巴南区"
      },
      {
        code: "500114",
        region: "黔江区"
      },
      {
        code: "500115",
        region: "长寿区"
      },
      {
        code: "500116",
        region: "江津区"
      },
      {
        code: "500117",
        region: "合川区"
      },
      {
        code: "500118",
        region: "永川区"
      },
      {
        code: "500119",
        region: "南川区"
      },
      {
        code: "500120",
        region: "璧山区"
      },
      {
        code: "500151",
        region: "铜梁区"
      },
      {
        code: "500152",
        region: "潼南区"
      },
      {
        code: "500153",
        region: "荣昌区"
      },
      {
        code: "500154",
        region: "开州区"
      },
      {
        code: "500102",
        region: "县"
      }
    ]
  },
  {
    code: "510000",
    region: "四川省",
    regionEntitys: [
      {
        code: "510100",
        region: "成都市"
      },
      {
        code: "510300",
        region: "自贡市"
      },
      {
        code: "510400",
        region: "攀枝花市"
      },
      {
        code: "510500",
        region: "泸州市"
      },
      {
        code: "510600",
        region: "德阳市"
      },
      {
        code: "510700",
        region: "绵阳市"
      },
      {
        code: "510800",
        region: "广元市"
      },
      {
        code: "510900",
        region: "遂宁市"
      },
      {
        code: "511000",
        region: "内江市"
      },
      {
        code: "511100",
        region: "乐山市"
      },
      {
        code: "511300",
        region: "南充市"
      },
      {
        code: "511400",
        region: "眉山市"
      },
      {
        code: "511500",
        region: "宜宾市"
      },
      {
        code: "511600",
        region: "广安市"
      },
      {
        code: "511700",
        region: "达州市"
      },
      {
        code: "511800",
        region: "雅安市"
      },
      {
        code: "511900",
        region: "巴中市"
      },
      {
        code: "512000",
        region: "资阳市"
      },
      {
        code: "513200",
        region: "阿坝藏族羌族自治州"
      },
      {
        code: "513300",
        region: "甘孜藏族自治州"
      },
      {
        code: "513400",
        region: "凉山彝族自治州"
      }
    ]
  },
  {
    code: "520000",
    region: "贵州省",
    regionEntitys: [
      {
        code: "520100",
        region: "贵阳市"
      },
      {
        code: "520200",
        region: "六盘水市"
      },
      {
        code: "520300",
        region: "遵义市"
      },
      {
        code: "520400",
        region: "安顺市"
      },
      {
        code: "520500",
        region: "毕节市"
      },
      {
        code: "520600",
        region: "铜仁市"
      },
      {
        code: "522300",
        region: "黔西南布依族苗族自治州"
      },
      {
        code: "522600",
        region: "黔东南苗族侗族自治州"
      },
      {
        code: "522700",
        region: "黔南布依族苗族自治州"
      }
    ]
  },
  {
    code: "530000",
    region: "云南省",
    regionEntitys: [
      {
        code: "530100",
        region: "昆明市"
      },
      {
        code: "530300",
        region: "曲靖市"
      },
      {
        code: "530400",
        region: "玉溪市"
      },
      {
        code: "530500",
        region: "保山市"
      },
      {
        code: "530600",
        region: "昭通市"
      },
      {
        code: "530700",
        region: "丽江市"
      },
      {
        code: "530800",
        region: "普洱市"
      },
      {
        code: "530900",
        region: "临沧市"
      },
      {
        code: "532300",
        region: "楚雄彝族自治州"
      },
      {
        code: "532500",
        region: "红河哈尼族彝族自治州"
      },
      {
        code: "532600",
        region: "文山壮族苗族自治州"
      },
      {
        code: "532800",
        region: "西双版纳傣族自治州"
      },
      {
        code: "532900",
        region: "大理白族自治州"
      },
      {
        code: "533100",
        region: "德宏傣族景颇族自治州"
      },
      {
        code: "533300",
        region: "怒江傈僳族自治州"
      },
      {
        code: "533400",
        region: "迪庆藏族自治州"
      }
    ]
  },
  {
    code: "540000",
    region: "西藏自治区",
    regionEntitys: [
      {
        code: "540100",
        region: "拉萨市"
      },
      {
        code: "540200",
        region: "日喀则市"
      },
      {
        code: "540300",
        region: "昌都市"
      },
      {
        code: "540400",
        region: "林芝市"
      },
      {
        code: "540500",
        region: "山南市"
      },
      {
        code: "542400",
        region: "那曲地区"
      },
      {
        code: "542500",
        region: "阿里地区"
      }
    ]
  },
  {
    code: "610000",
    region: "陕西省",
    regionEntitys: [
      {
        code: "610100",
        region: "西安市"
      },
      {
        code: "610200",
        region: "铜川市"
      },
      {
        code: "610300",
        region: "宝鸡市"
      },
      {
        code: "610400",
        region: "咸阳市"
      },
      {
        code: "610500",
        region: "渭南市"
      },
      {
        code: "610600",
        region: "延安市"
      },
      {
        code: "610700",
        region: "汉中市"
      },
      {
        code: "610800",
        region: "榆林市"
      },
      {
        code: "610900",
        region: "安康市"
      },
      {
        code: "611000",
        region: "商洛市"
      }
    ]
  },
  {
    code: "620000",
    region: "甘肃省",
    regionEntitys: [
      {
        code: "620100",
        region: "兰州市"
      },
      {
        code: "620200",
        region: "嘉峪关市"
      },
      {
        code: "620300",
        region: "金昌市"
      },
      {
        code: "620400",
        region: "白银市"
      },
      {
        code: "620500",
        region: "天水市"
      },
      {
        code: "620600",
        region: "武威市"
      },
      {
        code: "620700",
        region: "张掖市"
      },
      {
        code: "620800",
        region: "平凉市"
      },
      {
        code: "620900",
        region: "酒泉市"
      },
      {
        code: "621000",
        region: "庆阳市"
      },
      {
        code: "621100",
        region: "定西市"
      },
      {
        code: "621200",
        region: "陇南市"
      },
      {
        code: "622900",
        region: "临夏回族自治州"
      },
      {
        code: "623000",
        region: "甘南藏族自治州"
      }
    ]
  },
  {
    code: "630000",
    region: "青海省",
    regionEntitys: [
      {
        code: "630100",
        region: "西宁市"
      },
      {
        code: "630200",
        region: "海东市"
      },
      {
        code: "632200",
        region: "海北藏族自治州"
      },
      {
        code: "632300",
        region: "黄南藏族自治州"
      },
      {
        code: "632500",
        region: "海南藏族自治州"
      },
      {
        code: "632600",
        region: "果洛藏族自治州"
      },
      {
        code: "632700",
        region: "玉树藏族自治州"
      },
      {
        code: "632800",
        region: "海西蒙古族藏族自治州"
      }
    ]
  },
  {
    code: "640000",
    region: "宁夏回族自治区",
    regionEntitys: [
      {
        code: "640100",
        region: "银川市"
      },
      {
        code: "640200",
        region: "石嘴山市"
      },
      {
        code: "640300",
        region: "吴忠市"
      },
      {
        code: "640400",
        region: "固原市"
      },
      {
        code: "640500",
        region: "中卫市"
      }
    ]
  },
  {
    code: "650000",
    region: "新疆维吾尔自治区",
    regionEntitys: [
      {
        code: "650100",
        region: "乌鲁木齐市"
      },
      {
        code: "650200",
        region: "克拉玛依市"
      },
      {
        code: "650400",
        region: "吐鲁番市"
      },
      {
        code: "650500",
        region: "哈密市"
      },
      {
        code: "652300",
        region: "昌吉回族自治州"
      },
      {
        code: "652700",
        region: "博尔塔拉蒙古自治州"
      },
      {
        code: "652800",
        region: "巴音郭楞蒙古自治州"
      },
      {
        code: "652900",
        region: "阿克苏地区"
      },
      {
        code: "653000",
        region: "克孜勒苏柯尔克孜自治州"
      },
      {
        code: "653100",
        region: "喀什地区"
      },
      {
        code: "653200",
        region: "和田地区"
      },
      {
        code: "654000",
        region: "伊犁哈萨克自治州"
      },
      {
        code: "654200",
        region: "塔城地区"
      },
      {
        code: "654300",
        region: "阿勒泰地区"
      },
      {
        code: "659000",
        region: "自治区直辖县级行政区划"
      },
      {
        code: "659001",
        region: "石河子市"
      },
      {
        code: "659002",
        region: "阿拉尔市"
      },
      {
        code: "659003",
        region: "图木舒克市"
      },
      {
        code: "659004",
        region: "五家渠市"
      },
      {
        code: "659006",
        region: "铁门关市"
      }
    ]
  },
  {
    code: "710000",
    region: "台湾省"
  },
  {
    code: "810000",
    region: "香港特别行政区"
  },
  {
    code: "820000",
    region: "澳门特别行政区"
  }
];
if (!Array) {
  const _easycom_u_radio2 = common_vendor.resolveComponent("u-radio");
  const _easycom_u_radio_group2 = common_vendor.resolveComponent("u-radio-group");
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  const _easycom_u_picker2 = common_vendor.resolveComponent("u-picker");
  (_easycom_u_radio2 + _easycom_u_radio_group2 + _easycom_u_icon2 + _easycom_u_picker2)();
}
const _easycom_u_radio = () => "../../node-modules/uview-plus/components/u-radio/u-radio.js";
const _easycom_u_radio_group = () => "../../node-modules/uview-plus/components/u-radio-group/u-radio-group.js";
const _easycom_u_icon = () => "../../node-modules/uview-plus/components/u-icon/u-icon.js";
const _easycom_u_picker = () => "../../node-modules/uview-plus/components/u-picker/u-picker.js";
if (!Math) {
  (navbar + _easycom_u_radio + _easycom_u_radio_group + _easycom_u_icon + optionBt + _easycom_u_picker)();
}
const navbar = () => "../../components/navbar.js";
const optionBt = () => "../../components/option-bt.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  setup(__props) {
    const { appContext } = common_vendor.getCurrentInstance();
    const globalProxy = appContext.config.globalProperties;
    common_vendor.index.showShareMenu({
      withShareTicket: true,
      menus: ["shareAppMessage", "shareTimeline"]
    });
    const state = common_vendor.reactive({
      front: "",
      behind: "",
      timeNum: 59,
      codeTimer: null,
      codeText: "发送验证码",
      checked: [1],
      tips_popup: false,
      tips_timer: null,
      tipsText: "资料未填写完成",
      bank_name: "",
      selectFlag: false,
      selectNameFlag: false,
      column: [],
      columnName: [],
      pub_picker: false,
      select_value: 0,
      verifyFlag: true,
      address_show: false,
      columns: [],
      firstIndex: 0,
      address: {},
      address_label: ""
    });
    const uPickerRef = common_vendor.ref(null);
    const formData = common_vendor.reactive({
      order_id: common_vendor.index.getStorageSync("order_id"),
      payee_type: "BANKACCT_PRI",
      bank_acctno: "",
      bank_name: "",
      bank_code: "",
      bank_acctname: "",
      cnaps_code: "",
      brabank_name: ""
    });
    const changeAddress = (arr) => {
      return arr.map((item) => {
        if (item.regionEntitys && item.regionEntitys.length) {
          return {
            label: item.region,
            value: item.code,
            children: item.regionEntitys.map((obj) => {
              return {
                label: obj.region,
                value: obj.code
              };
            })
          };
        } else {
          return {
            label: item.region,
            value: item.code
          };
        }
      });
    };
    setTimeout(() => {
      state.columns = [changeAddress(addressList)];
      common_vendor.nextTick$1(() => {
        uPickerRef.value.setColumnValues(1, state.columns[0][0].children);
      });
    }, 200);
    const selectBank = () => {
      if (formData.bank_name) {
        state.selectFlag = true;
        state.column = bankList.filter((item) => item.node.bank_name.indexOf(formData.bank_name) !== -1);
      }
    };
    const activeBank = (obj) => {
      formData.bank_name = obj.bank_name;
      state.selectFlag = false;
      formData.bank_code = obj.bank_code;
    };
    const selectBankName = () => {
      if (formData.brabank_name) {
        common_vendor.index.showLoading({
          title: "请稍后"
        });
        globalProxy.$request("/loan/User/getCnapsCode", {
          bank_code: formData.bank_code,
          city_code: state.address.value,
          brabank_name: formData.brabank_name
        }).then((res) => {
          state.selectNameFlag = true;
          state.columnName = res.data.list.filter((item) => item.brabank_name.indexOf(formData.brabank_name) !== -1);
          common_vendor.index.hideLoading();
        }).catch(() => {
          common_vendor.index.hideLoading();
        });
      }
    };
    const activeBankName = (obj) => {
      console.log("支行名称", obj);
      formData.brabank_name = obj.brabank_name;
      formData.cnaps_code = obj.cnaps_code;
      state.selectNameFlag = false;
    };
    const scanBank = () => {
      common_vendor.index.chooseImage({
        count: 1,
        success: (res) => {
          common_vendor.index.showLoading({
            title: "上传中，请稍后……"
          });
          const name_array = res.tempFilePaths[0].split("/");
          const name = name_array[name_array.length - 1];
          globalProxy.$request("", {
            file: res.tempFiles[0].path,
            fileType: "file",
            params: {
              fileSize: parseFloat((res.tempFiles[0].size / 1024).toFixed(2)),
              fileName: name
            }
          }).then((result) => {
            common_vendor.index.request({
              url: "https://yhk.market.alicloudapi.com/rest/160601/ocr/ocr_bank_card.json",
              header: {
                "Authorization": "APPCODE 5076c8ae1e57459986eb77b688d5d91d"
              },
              method: "POST",
              data: {
                image: result.data.url
              },
              success: (scan) => {
                let scanData = scan.data;
                formData.bank_acctno = scanData.card_num;
              }
            });
            common_vendor.index.hideLoading();
          });
        }
      });
    };
    const showPicker = () => {
      state.address_show = true;
    };
    const bindChange = (val) => {
      state.select_value = val.detail.value[0];
    };
    const picker_confirm = () => {
      state.bank_name = state.column[state.select_value].name;
      formData.bank_id = state.column[state.select_value].id;
      state.select_value = 0;
      state.pub_picker = false;
    };
    const nextStep = async () => {
      console.log(formData);
      if (formData.bank_acctno === "" || formData.bank_acctname === "") {
        openTips("资料未填写完成");
        return;
      }
      if (formData.payee_type === "BANKACCT_PUB") {
        if (formData.cnaps_code === "") {
          openTips("输入支行名称模糊查询后必须从弹出的选项中选择正确的一项");
          return;
        }
        if (state.address_label === "" || formData.bank_code === "") {
          openTips("资料未填写完成");
          return;
        }
      }
      globalProxy.$request("/loan/User/addOrderBank", formData).then(() => {
        utils_jump.back();
      });
    };
    const close = () => {
      state.address_show = false;
    };
    const confirm = (e) => {
      if (e.value[1]) {
        state.address = e.value[1];
        state.address_label = e.value[0].label + "-" + e.value[1].label;
      } else {
        state.address = e.value[0];
        state.address_label = e.value[0].label;
      }
      close();
    };
    const changeHandler = (e) => {
      const { columnIndex, index } = e;
      if (columnIndex === 0) {
        if (state.columns[0][index].children.length) {
          uPickerRef.value.setColumnValues(1, state.columns[0][index].children);
        } else {
          uPickerRef.value.setColumnValues(1, []);
        }
        state.firstIndex = index;
      }
    };
    const openTips = (text) => {
      state.tipsText = text;
      state.tips_popup = true;
      if (state.tips_timer !== null) {
        clearTimeout(state.tips_timer);
      }
      state.tips_timer = setTimeout(() => {
        state.tips_popup = false;
      }, 2e3);
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          title: "新增银行卡"
        }),
        b: common_vendor.p({
          label: "对私银行账户",
          name: "BANKACCT_PRI",
          ["label-size"]: "12px"
        }),
        c: common_vendor.p({
          label: "对公银行账户",
          name: "BANKACCT_PUB",
          ["label-size"]: "12px"
        }),
        d: common_vendor.o(($event) => formData.payee_type = $event),
        e: common_vendor.p({
          ["active-color"]: "#F97E39",
          size: "16px",
          modelValue: formData.payee_type
        }),
        f: formData.bank_acctname,
        g: common_vendor.o(($event) => formData.bank_acctname = $event.detail.value),
        h: formData.bank_acctno,
        i: common_vendor.o(($event) => formData.bank_acctno = $event.detail.value),
        j: common_assets._imports_0$3,
        k: common_vendor.o(($event) => scanBank()),
        l: common_vendor.o([($event) => formData.bank_name = $event.detail.value, ($event) => selectBank()]),
        m: formData.bank_name,
        n: common_vendor.f(state.column, (item, index, i0) => {
          return {
            a: common_vendor.t(item.node.bank_name),
            b: index,
            c: common_vendor.o(($event) => activeBank(item.node), index)
          };
        }),
        o: common_vendor.s(formData.bank_name && state.selectFlag ? "max-height:80vw" : "max-height:0"),
        p: common_vendor.t(state.address_label),
        q: common_vendor.p({
          name: "arrow-down",
          size: "5vw",
          color: "#666666"
        }),
        r: common_vendor.o(($event) => showPicker()),
        s: common_vendor.o([($event) => formData.brabank_name = $event.detail.value, ($event) => selectBankName()]),
        t: formData.brabank_name,
        v: common_vendor.f(state.columnName, (item, index, i0) => {
          return {
            a: common_vendor.t(item.brabank_name),
            b: index,
            c: common_vendor.o(($event) => activeBankName(item), index)
          };
        }),
        w: common_vendor.s(formData.brabank_name && state.selectNameFlag ? "max-height:80vw" : "max-height:0"),
        x: formData.payee_type === "BANKACCT_PUB",
        y: common_vendor.o(($event) => nextStep()),
        z: common_vendor.p({
          confirmText: "确定"
        }),
        A: state.tips_popup
      }, state.tips_popup ? {
        B: common_vendor.t(state.tipsText)
      } : {}, {
        C: state.pub_picker
      }, state.pub_picker ? {
        D: common_vendor.o(($event) => state.pub_picker = false),
        E: common_vendor.o(($event) => picker_confirm()),
        F: common_vendor.f(state.column, (item, index, i0) => {
          return {
            a: common_vendor.t(item.node.bank_name),
            b: index
          };
        }),
        G: common_vendor.o(bindChange)
      } : {}, {
        H: state.pub_picker
      }, state.pub_picker ? {
        I: common_vendor.o(($event) => state.pub_picker = false)
      } : {}, {
        J: common_vendor.sr(uPickerRef, "9ab377cc-6", {
          "k": "uPickerRef"
        }),
        K: common_vendor.o(confirm),
        L: common_vendor.o(changeHandler),
        M: common_vendor.o(($event) => close()),
        N: common_vendor.o(($event) => close()),
        O: common_vendor.p({
          show: state.address_show,
          title: "开户行地址",
          columns: state.columns,
          keyName: "label",
          closeOnClickOverlay: true
        })
      });
    };
  }
});
wx.createPage(_sfc_main);
