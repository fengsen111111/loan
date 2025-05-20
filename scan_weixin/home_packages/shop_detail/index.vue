<template>
	<view class="container" v-if="shopInfo.id">
		<view style="height: 1.33vw;"></view>
		<view class="shop">
			<view class="title flex alignCenter spaceBetween">
				{{shopInfo.brand_name+"("+shopInfo.name+")"}}
				<image
					:src="shopInfo.is_collection==='N'?require('@/home_packages/static/collect.png'):require('@/home_packages/static/collect_active.png')"
					alt="" @click="collect()">
			</view>
			<view class="info flex spaceBetween alignCenter">
				<view class="left flex alignCenter">
					<view class="star flex alignCenter">
						<view class="item" v-for="(i) in 5" :key="i">
							<image src="@/static/star.png" mode=""></image>
							<view class="bg" :style="{width:getStar(shopInfo.star,i+1)}"></view>
						</view>
					</view>
					<text>{{shopInfo.star}}</text>
				</view>
				<text :style="{color:shopInfo.open_status==='Y'?'#80CF40':'#999999'}">
					{{shopInfo.open_status==='Y'?'营业中':'未营业'}}
				</text>
			</view>
			<view class="address flex alignCenter spaceBetween">
				<text>{{shopInfo.store_type_name[0]||''}}&emsp;{{shopInfo.sort_address}}</text>
				营业时间 {{shopInfo.open_time}}
			</view>
			<view class="label flex alignCenter flexWrap">
				<view class="item" v-for="(i,j) in shopInfoc.signs" :key="j">{{i}}</view>
			</view>
			<scroll-view scroll-x="true">
				<view class="banner flex alignCenter">
					<template v-if="shopInfo.store_images.length">
						<image :src="shopInfo.store_images[item]" mode="" v-for="item in 3" :key="item"
							@click="previewImg(shopInfo.store_images[item])"></image>
					</template>
					<template v-else-if="shopInfo.brand_images.length">
						<image :src="shopInfo.brand_images[item]" mode="" v-for="item in 3" :key="item"
							@click="previewImg(shopInfo.brand_images[item])"></image>
					</template>
					<view class="more flex alignCenter justifyCenter"
						@click="$nav('/home_packages/album/index',{id:shopInfo.id})">查看更多
					</view>
				</view>
			</scroll-view>
			<view class="line"></view>
			<view class="navigation flex alignCenter spaceBetween">
				<view class="detail">{{shopInfo.address}}</view>
				<image src="@/home_packages/static/map.png" alt="" style="height: 6.33vw;" @click="openMap()"></image>
				<image src="@/home_packages/static/phone.png" mode="" @click="callPhone(shopInfo.connect_mobile)">
				</image>
			</view>
		</view>
		<view class="discount" v-if="shopInfo.coupon_list.length">
			<view class="title flex alignCenter">
				<image src="@/static/discount.png" mode=""></image>
				优惠券
			</view>
			<view class="item_box">
				<view class="item flex alignCenter">
					<image :src="shopInfo.coupon_list[0].cover_image" alt="" mode="aspectFill"></image>
					<view class="title flex spaceBetween flexColumn">
						{{shopInfo.coupon_list[0].name}}
						<text>{{shopInfo.coupon_list[0].des}}</text>
					</view>
					<view class="content flex spaceBetween flexColumn">
						{{shopInfo.coupon_list[0].discount_type==='a'?'满'+shopInfo.coupon_list[0].top_price.replace('.00','')+'减'+shopInfo.coupon_list[0].data.replace('.00',''):shopInfo.coupon_list[0].data+'折'}}
						<text>有效期至：{{shopInfo.coupon_list[0].end_time}}</text>
					</view>
				</view>
				<view class="type" v-if="shopInfo.coupon_list[0].types">
					可用类型：{{shopInfo.coupon_list[0].types}}
				</view>
				<view class="get flex flexEnd flexColumn" :style="!shopInfo.coupon_list[0].types?'margin-top:2vw':''">
					<view class="charge flex alignCenter justifyCenter" @click="getCoupon(shopInfo.coupon_list[0])"
						:style="shopInfo.coupon_list[0].has_status==='Y'?'background:#999999':''">
						{{shopInfo.coupon_list[0].has_status==='Y'?'已领取':'领取'}}
					</view>
				</view>
			</view>
			<view class="more flex alignCenter" @click="discountShow=true" v-if="shopInfo.coupon_list.length-1">
				<text
					style="margin-right: 1.33vw;">查看其它{{shopInfo.coupon_list.length>1?shopInfo.coupon_list.length-1:''}}张优惠卷</text>
				<u-icon name="arrow-down" size="16"></u-icon>
			</view>
		</view>
		<view class="recommend">
			<view class="title flex alignCenter">
				<image src="@/home_packages/static/recommend.png" mode=""></image>
				网友推荐
			</view>
			<scroll-view scroll-x="true" style="width: 100%;">
				<view class="flex alignCenter" :style="{width:(recommendList.length*39.33)+'vw'}">
					<view class="item flex flexColumn" v-for="(obj,index) in recommendList" :key="index"
						@click="openShopping(obj)">
						<image :src="obj.cover_image" mode=""></image>
						<view class="title">{{obj.name}}</view>
						<view class="label">{{obj.person_number||0}}人推荐</view>
						<view class="price flex alignCenter spaceBetween">
							<view class="left">
								￥{{obj.price||0.00}}
							</view>
							<view class="optionNum" @click.stop="" v-if="!obj.group_list||!obj.group_list.length">
								<u-icon name="minus-circle" color="rgb(245,232,174)" size="6.67vw"
									v-if="carIdList.findIndex(item=>item.id === obj.id) != -1"
									@click.stop="addCar(1,obj,'min')"></u-icon>
								<view style="width:8vw;text-align: center;font-size: 3.67vw;"
									v-if="carIdList.findIndex(item=>item.id === obj.id) != -1">
									{{carIdList.find(item=>item.id === obj.id).number}}
								</view>
								<view class="get" @click.stop="addCar(1,obj,'add')">
									<u-icon name="plus" color="rgb(245,232,174)" size="4vw"></u-icon>
								</view>
							</view>
							<view class="optionNum" @click.stop="" v-else>
								<view class="selectDetail" @click.stop="selGroup(obj)">选规格</view>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
		<view class="goods_list flex spaceBetween">
			<scroll-view :scroll-with-animation="true" scroll-y="true" :scroll-into-view="rightInto" class="leftScroll">
				<view class="item flex alignCenter justifyCenter flexColumn" v-for="(item,index) in leftList"
					:key="item.id" :id="'l'+item.id" :class="currentIndex === index?'active':''"
					@click="changeCurrent(item.id,index)">
					<image :src="item.icon" mode=""></image>
					{{item.name}}
				</view>
				<view style="height: 20vw;"></view>
			</scroll-view>
			<scroll-view :scroll-with-animation="true" scroll-y="true" :scroll-into-view="leftInto" class="rightScroll"
				@scroll="rightScroll">
				<view v-for="(item,index) in rightList" :key="index" :id="'r'+item.id" class="goodsClass">
					<view class="label">{{item.name}}</view>
					<view class="list" v-for="(obj,j) in item.list" :key="obj.id">
						<view class="item" v-if="obj.is_group==='Y'&&!item.is_buyed" @click="selGroup(obj)">
							<image :src="obj.cover_image" mode=""></image>
							<view class="title flex alignCenter spaceBetween">
								{{obj.name}}
								<text>销量:{{obj.salled_number||0}}</text>
							</view>
							<view class="content">{{obj.introduce}}</view>
							<view class="price flex alignCenter spaceBetween">
								<view class="left">
									￥{{obj.price}}
									<text>￥{{obj.old_price}}</text>
								</view>
								<view class="optionNum" @click.stop="" v-if="!obj.group_list.length">
									<u-icon name="minus-circle" color="rgb(245,232,174)" size="7.67vw"
										v-if="carIdList.findIndex(item=>item.id === obj.id) != -1"
										@click.stop="addCar(1,obj,'min')"></u-icon>
									<view style="width:8vw;text-align: center;font-size: 3.67vw;"
										v-if="carIdList.findIndex(item=>item.id === obj.id) != -1">
										{{carIdList.find(item=>item.id === obj.id).number}}
									</view>
									<view class="get" @click.stop="addCar(1,obj,'add')">
										<u-icon name="plus" color="rgb(245,232,174)" size="4vw"></u-icon>
									</view>
								</view>
								<view class="optionNum" @click.stop="" v-else>
									<view class="selectDetail" @click.stop="selGroup(obj)">选规格</view>
								</view>
							</view>
						</view>
						<view v-else-if="item.is_buyed&&item.is_buyed==='Y'">
							<view class="buyedItem flex alignCenter" v-if="j<3||is_zksq">
								<view class="title flex alignCenter spaceBetween">
									{{obj.name}}
								</view>
								<view class="center">￥{{obj.price}}</view>
								<view class="price flex">
									<view class="optionNum" @click.stop="" v-if="!obj.group_list||!obj.group_list.length">
										<u-icon name="minus-circle" color="rgb(245,232,174)" size="7.67vw"
											v-if="carIdList.findIndex(item=>item.id === obj.id) != -1"
											@click.stop="addCar(obj.is_group==='Y'?1:2,obj,'min')"></u-icon>
										<view style="width:8vw;text-align: center;font-size: 3.67vw;"
											v-if="carIdList.findIndex(item=>item.id === obj.id) != -1">
											{{carIdList.find(item=>item.id === obj.id).number}}
										</view>
										<view class="get" @click.stop="addCar(obj.is_group==='Y'?1:2,obj,'add')">
											<u-icon name="plus" color="rgb(245,232,174)" size="4vw"></u-icon>
										</view>
									</view>
									<view class="optionNum" @click.stop="" v-else>
										<view class="selectDetail" @click.stop="selGroup(obj)">选规格</view>
									</view>
								</view>
							</view>
							<view v-if="item.list.length>3">
								<view v-if="j==item.list.length-1" @click="is_zksq = !is_zksq" style="color: #999999;font-size: 24rpx;">
									{{is_zksq?'收起':'展开'}}
								</view>
							</view>
						</view>
						<view class="item_type flex alignCenter spaceBetween flexWrap" v-else
							@click="openShopping(obj)">
							<image :src="obj.cover_image" mode=""></image>
							<view class="right">
								<view class="title">{{obj.name}}</view>
								<view class="sale">￥{{obj.price}}</view>
								<view class="price flex spaceBetween alignCenter">
									销量:{{obj.salled_number||0}}
									<view class="optionNum" @click.stop="">
										<u-icon name="minus-circle" color="rgb(245,232,174)" size="7.67vw"
											v-if="carIdList.findIndex(item=>item.id === obj.id) != -1"
											@click.stop="addCar(2,obj,'min')"></u-icon>
										<view style="width:8vw;text-align: center;font-size: 3.67vw;"
											v-if="carIdList.findIndex(item=>item.id === obj.id) != -1">
											{{carIdList.find(item=>item.id === obj.id).number}}
										</view>
										<view class="get" @click.stop="addCar(2,obj,'add')">
											<u-icon name="plus" color="rgb(245,232,174)" size="4vw"></u-icon>
										</view>
									</view>
								</view>
							</view>
							<view class="content" v-if="obj.introduce">{{obj.introduce}}</view>
						</view>
					</view>
				</view>
				<view style="height: 20vw;"></view>
			</scroll-view>
		</view>
		<view class="shop_car" :class="carIdList&&carIdList.length>0?'shop_car_active':''" @click="openCar()">
			<view class="left">
				<view class="shopNumber">{{shopNumber||0}}</view>
				<image src="@/home_packages/static/shop_car.png" mode=""></image>
			</view>
			<view><text style="font-size: 2.67vw;">￥</text>{{moneyObj.price||0}}</view>
			<view class="gotIt" @click.stop="scanTableCode()">
				去结算
			</view>
		</view>
		<!-- 套餐 -->
		<u-popup :show="menuShopShow" mode="bottom" round="5.33vw" @close="menuShopShow=false">
			<view class="shopShowContent">
				<view class="title flex alignCenter spaceBetween">
					{{goodsObj.name}}
					<u-icon name="close" color="#000000" size="25" @click="menuShopShow=false"></u-icon>
				</view>
				<view class="sale">销量:{{goodsObj.salled_number||0}}</view>
				<view class="content" style="margin-bottom: 4vw;">{{goodsObj.introduce}}</view>
				<text v-if="goodsObj.group_list&&goodsObj.group_list.length">已包含</text>
				<scroll-view scroll-x="true">
					<view class="flex alignCenter">
						<view class="imgs flex alignCenter" v-for="(i,j) in goodsObj.group_list" :key="j"
							style="height: 41.87vw;"
							:style="{width:i.goods_list?i.goods_list.length*33.7+'vw':'0vw',marginRight:i.goods_list.length===1?'10px':''}">
							<view class="img_box" v-for="(item) in i.goods_list" :key="item.id">
								<image :src="item.cover_image" mode=""></image>
								<text>{{item.name}}</text>
								<text>x{{item.has_number}}</text>
							</view>
						</view>
					</view>
				</scroll-view>
				<view class="line"></view>
				<view class="price flex alignCenter spaceBetween">
					<view>单价&emsp;￥{{goodsObj.price}}
						<text>￥{{goodsObj.old_price}}</text>
					</view>
					<view class="number flex alignCenter">
						<view class="add flex alignCenter justifyCenter" @click="changeNum('min')">
							<u-icon name="minus" color="rgb(245,232,174)"></u-icon>
						</view>
						<view class="num flex alignCenter justifyCenter">{{goodsNum}}</view>
						<view class="min flex alignCenter justifyCenter" @click="changeNum('add')">
							<u-icon name="plus" color="rgb(245,232,174)"></u-icon>
						</view>
					</view>
				</view>
				<view class="remark"
					v-if="goodsObj.choice_des&&goodsObj.choice_des.length&&goodsObj.choice_des[0] !== ''">
					<text>备注</text>
					<view class="remarker flex alignCenter spaceBetween flexWrap">
						<view class="item" :class="remarkIndex === index?'active':''"
							v-for="(item,index) in goodsObj.choice_des" :key="index" @click="changeRemark(index)">
							{{item}}
						</view>
						<view style="width: 20vw;"></view>
						<view style="width: 20vw;"></view>
					</view>
				</view>
				<view class="addShopCar" @click="addShopCar(1)">加入购物袋</view>
			</view>
		</u-popup>

		<!-- 分类单点 -->
		<u-popup :show="shopShow" mode="bottom" round="5.33vw" @close="shopShow=false;goodsNum = 1">
			<view class="shopShowContent">
				<view class="title flex alignCenter spaceBetween">
					{{goodsObj.name}}
					<u-icon name="close" color="#000000" size="25" @click="shopShow=false;goodsNum = 1"></u-icon>
				</view>
				<view class="sale">销量:{{goodsObj.salled_number||0}}</view>
				<view class="content">{{goodsObj.introduce}}</view>
				<scroll-view scroll-x="true" v-if="goodsObj.images&&goodsObj.images.length">
					<view class="imgs flex alignCenter"
						:style="{width:goodsObj.images?goodsObj.images.length*33.7+'vw':'0vw'}">
						<image :src="item" mode="" v-for="(item,index) in goodsObj.images" :key="index"></image>
					</view>
				</scroll-view>
				<view class="line"></view>
				<view class="price flex alignCenter spaceBetween">
					单价&emsp;￥{{goodsObj.price}}
					<view class="number flex alignCenter">
						<view class="add flex alignCenter justifyCenter" @click="changeNum('min')">
							<u-icon name="minus" color="rgb(245,232,174)"></u-icon>
						</view>
						<view class="num flex alignCenter justifyCenter">{{goodsNum}}</view>
						<view class="min flex alignCenter justifyCenter" @click="changeNum('add')">
							<u-icon name="plus" color="rgb(245,232,174)"></u-icon>
						</view>
					</view>
				</view>
				<view class="remark"
					v-if="goodsObj.choice_des&&goodsObj.choice_des.length&&goodsObj.choice_des[0] !== ''">
					<text>备注</text>
					<view class="remarker flex alignCenter spaceBetween flexWrap">
						<view class="item" :class="remarkIndex === index?'active':''"
							v-for="(item,index) in goodsObj.choice_des" :key="index" @click="changeRemark(index)">
							{{item}}
						</view>
						<view style="width: 20vw;"></view>
						<view style="width: 20vw;"></view>
					</view>
				</view>
				<view class="addShopCar" @click="addShopCar(2)">加入购物袋</view>
			</view>
		</u-popup>

		<!-- 购物袋 -->
		<u-popup :show="shopCarShow" mode="bottom" round="5.33vw" @close="shopCarShow=false" zIndex="1000"
			:overlayStyle="{zIndex:999}">
			<view class="shopCarContent">
				<view class="title flex alignCenter spaceBetween">
					购物袋
					<u-icon name="close" color="#000000" size="25" @click="shopCarShow=false"></u-icon>
				</view>
				<u-empty mode="car" text="购物袋为空" v-if="!shopCarList||shopCarList.length===0"></u-empty>
				<scroll-view scroll-y="true"
					:style="!shopCarList||shopCarList.length===0?'height:10vh':'height: 50vh;'">
					<view class="item flex spaceBetween" v-for="(item,index) in shopCarList" :key="index">
						<view class="left flex alignCenter">
							<image :src="item.info.cover_image" mode=""></image>
							<view class="right">
								{{item.info.name}}
								<view class="remark">备注：{{item.choice_des}}</view>
								<text>单价&emsp;￥{{item.info.price}}</text>
							</view>
						</view>
						<view class="right">
							<view class="showDetail flex alignCenter" v-if="item.type===1"
								@click="showDetail(item.info)">
								查看详情 <u-icon name="arrow-down"></u-icon></view>
							<view class="showDetail" v-else></view>
							<view class="number flex alignCenter">
								<view class="add flex alignCenter justifyCenter"
									@click="changeCarNum(item,'min',index)">
									<u-icon name="minus" color="rgb(245,232,174)"></u-icon>
								</view>
								<view class="num flex alignCenter justifyCenter">{{item.num}}</view>
								<view class="min flex alignCenter justifyCenter"
									@click="changeCarNum(item,'add',index)">
									<u-icon name="plus" color="rgb(245,232,174)"></u-icon>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
				<!-- <view class="bottom flex alignCenter spaceBetween">
					总计￥{{moneyObj.price||0}}
					<view class="gotIt" @click="scanTableCode()">{{addType||scanType?'去下单':'扫桌码'}}</view>
				</view> -->
			</view>
		</u-popup>
		<!-- 查看套餐详情 -->
		<u-popup :show="menuDetailShow" mode="bottom" round="5.33vw" @close="menuDetailShow=false;shopCarShow = true;">
			<view class="shopShowContent">
				<view class="title flex alignCenter spaceBetween">
					{{menuDetail.name}}
					<u-icon name="close" color="#000000" size="25"
						@click="menuDetailShow=false;shopCarShow = true;"></u-icon>
				</view>
				<view class="sale">销量:{{menuDetail.salled_number}}</view>
				<view class="content" style="margin-bottom: 4vw;">{{menuDetail.introduce}}</view>
				<text>已包含</text>
				<scroll-view scroll-x="true">
					<view class="imgs flex alignCenter" style="height: 41.87vw;"
						:style="{width:menuDetail.group_goods?menuDetail.group_goods.length*33.7+'vw':'0vw'}">
						<view class="img_box" v-for="(item) in menuDetail.group_goods" :key="item.id">
							<image :src="item.cover_image" mode=""></image>
							<text>{{item.name}}</text>
							<text>x{{item.has_number}}</text>
						</view>
					</view>
				</scroll-view>
			</view>
		</u-popup>

		<!-- 更多优惠券 -->
		<u-popup :show="discountShow" mode="bottom" round="5.33vw" @close="discountShow=false">
			<view class="discountContent">
				<view class="title flex alignCenter spaceBetween">
					优惠卷
					<u-icon name="close" color="#000000" size="25" @click="discountShow=false"></u-icon>
				</view>
				<scroll-view scroll-y="true" style="height: 50vh;">
					<view class="item_box" v-for="(item) in shopInfo.coupon_list" :key="item.id">
						<view class="item flex alignCenter">
							<image :src="item.cover_image" alt="" mode="aspectFill"></image>
							<view class="title flex spaceBetween flexColumn">
								{{item.name}}
								<text>{{item.des}}</text>
							</view>
							<view class="content flex spaceBetween flexColumn">
								{{item.discount_type==='a'?'满'+item.top_price.replace('.00','')+'减'+item.data.replace('.00',''):item.data+'折'}}
								<text>有效期至：{{item.end_time}}</text>
							</view>
						</view>
						<view class="type" v-if="item.types">
							可用类型：{{item.types}}
						</view>
						<view class="get flex flexEnd flexColumn" :style="!item.types?'margin-top:2vw':''">
							<view class="charge flex alignCenter justifyCenter" @click="getCoupon(item)"
								:style="item.has_status==='Y'?'background:#999999':''">
								{{item.has_status==='Y'?'已领取':'领取'}}
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</u-popup>

		<!-- 用餐人数 -->
		<u-popup :show="peopleShow&&!loginShow" mode="center" round="5.33vw" @close="peopleShow=false">
			<view class="peopleShowContent">
				<view class="title flex alignCenter spaceBetween">
					请选择用餐人数
					<u-icon name="close" color="#000000" size="25" @click="peopleShow=false;"></u-icon>
				</view>
				<view class="flex alignCenter spaceBetween flexWrap" style="padding: 0 0 5vw;">
					<view class="number" :class="person_number===item+1?'active':''" v-for="item in 12" :key="item"
						@click="changePeopleNum(item)">
						{{item+1}}
					</view>
				</view>
				<!-- <view class="flex alignCenter spaceBetween" style="height: 30vw;">
					<text style="font-weight: bold;font-size: 4.27vw;color: #000000;">用餐人数</text>
					<view class="number flex alignCenter">
						<view class="add flex alignCenter justifyCenter" @click="changePeopleNum('add')">
							<u-icon name="plus" color="rgb(245,232,174)"></u-icon>
						</view>
						<view class="num flex alignCenter justifyCenter">{{person_number}}</view>
						<view class="min flex alignCenter justifyCenter" @click="changePeopleNum('min')">
							<u-icon name="minus" color="rgb(245,232,174)"></u-icon>
						</view>
					</view>
				</view> -->
				<view class="confirm" @click="peopleConfirm()">确定</view>
			</view>
		</u-popup>
		<u-popup :show="loginShow" mode="center" round="5.33vw">
			<view class="loginShowContent">
				<view class="title flex alignCenter spaceBetween">
					用户登录
					<!-- <u-icon name="close" color="#000000" size="25" @click="loginShow=false;"></u-icon> -->
				</view>
				<view class="flex alignCenter flexColumn" style="height: 40vw;">
					<image :src="appInfo.logo" mode="aspectFit"
						style="width: 20vw;height: 20vw;border-radius: 50%;border: solid 1px #000000;margin-bottom: 5vw;">
					</image>
					<text style="font-weight: bold;color: #000000;">{{appInfo.appName}}</text>
				</view>
				<button class="confirm" @click="login()">登录</button>
			</view>
		</u-popup>
		<u-popup :show="remarkShow" mode="center" round="5.33vw" @close="remarkShow = false;remarkIndex = null">
			<view class="remarkShowContent">
				<view class="title flex alignCenter spaceBetween">
					备注
					<u-icon name="close" color="#000000" size="25"
						@click="remarkShow = false;remarkIndex = null"></u-icon>
				</view>
				<view class="remarker flex alignCenter spaceBetween flexWrap">
					<view class="item" :class="remarkIndex === index?'active':''"
						v-for="(item,index) in remarkObj.choice_des" :key="index" @click="changeRemark(index)">
						{{item}}
					</view>
					<view style="width: 20vw;"></view>
					<view style="width: 20vw;"></view>
				</view>
				<view class="confirm" @click="addCar(remarkType,remarkObj,'add')">确定</view>
			</view>
		</u-popup>
		<u-popup :show="groupDetailShow" round="5.33vw" @close="groupDetailShow = false">
			<view class="groupShowContent">
				<view class="title flex alignCenter spaceBetween">
					{{groupDetail.name}}
					<u-icon name="close" color="#000000" size="25" @click="groupDetailShow = false"></u-icon>
				</view>
				<view class="sale">销量:{{groupDetail.salled_number}}</view>
				<scroll-view scroll-y="true" style="max-height: 70vh;">
					<view class="introduce" v-if="groupDetail.introduce">{{groupDetail.introduce}}</view>
					<template v-for="(item) in groupDetail.group_list">
						<view class="list" :key="item.id" v-if="item.type==='check'">
							<view class="label">{{item.goods_list.length||0}}选{{item.check_number||0}}</view>
							<view class="gridBox">
								<view class="item" :class="groupGoodsId.includes(i.id)?'active':''"
									v-for="(i) in item.goods_list" :key="i.id"
									@click="selectGood(item.id,i,item.check_number)">
									<image :src="i.cover_image" mode=""></image>
									<view class="name">{{i.name}}</view>
									<view class="number">x{{i.has_number}}</view>
								</view>
							</view>
						</view>
					</template>
					<view class="list">
						<view class="label">已包含 （tips：套餐内默认餐品）</view>
						<view class="gridBox">
							<view class="item" v-for="(item) in groupContain" :key="item.id">
								<image :src="item.cover_image" mode=""></image>
								<view class="name">{{item.name}}</view>
								<view class="number">x{{item.has_number}}</view>
							</view>
						</view>
					</view>
				</scroll-view>
				<view class="confirm" @click="groupAddCar()">加入购物袋</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				appInfo: {
					logo: require("@/static/logo1.png"),
					appName: "雪域慧生活"
				},
				recommendList: [],
				shopInfo: {},
				type: 0,
				leftList: [],
				rightList: [],
				currentIndex: 0,
				rightInto: "",
				leftInto: "",
				topList: [],
				discountShow: false,
				shopCarList: [],
				changeFlag: false,
				shopShow: false,
				menuShopShow: false,
				shopCarShow: false,
				goodsNum: 1,
				goodsObj: {},

				menuDetail: {},
				menuDetailShow: false,

				moneyObj: {},

				addType: false,
				scanType: false,
				workerType: false,

				scanInfo: {},
				useCoupon: false,
				orderId: "",

				status: {
					a: "平台通用",
					b: "品牌通用",
					c: "门店通用",
					d: "分类通用",
					e: "菜品限定",
					f: "套餐限定"
				},

				shopNumber: 0,
				carIdList: [],

				peopleShow: false, //ashdjkashdkgdfjasgdjashdgjashg


				person_number: 1,

				loginShow: false,

				remarkIndex: null,
				remarkShow: false,
				remarkObj: {},
				remarkType: null,
				remarkFlag: true,

				groupDetailShow: false,
				groupDetail: {},
				groupContain: [],
				groupGoods: [],
				groupGoodsId: [],
				
				is_zksq:false
			};
		},
		async onLoad(option) {
			if (!uni.getStorageSync("token")) {
				this.loginShow = true;
			}
			console.log(option)
			if (option.scene) {
				let param = decodeURIComponent(option.scene)
				let str = param.split("?")[1];
				let obj = {};
				let arr = str.split('&');
				for (let i = 0; i < arr.length; i++) {
					obj[arr[i].split('=')[0]] = arr[i].split('=')[1];
				}
				option = await this.$request("/food/Seat/miniCodeMsg", {
					id: obj.id
				})
			}
			if (uni.getStorageSync("scanInfo") && !option.id) {
				option.id = uni.getStorageSync("scanInfo").store_id;
				this.scanInfo = uni.getStorageSync("scanInfo")
				this.scanType = true;
				uni.removeStorageSync("scanInfo");
			}
			if (option.type === "scan") {
				option.id = option.store_id;
				this.scanInfo = {
					seat_code: option.seat_code.split("#")[0],
					seat_id: option.seat_id
				};
				this.scanType = true;
			}
			if (option.type === "workerOrder") {
				this.workerType = true;
			}
			// if (!uni.getStorageSync("person_number")) {
			// 	this.peopleShow = true;
			// } else {
			// 	const timestamp1 = uni.getStorageSync("person_number").timestamp;
			// 	const timestamp2 = new Date().getTime();
			// 	let differenceInMilliseconds = Math.abs(timestamp2 - timestamp1);
			// 	// 将毫秒转换为小时
			// 	let differenceInHours = Math.floor(differenceInMilliseconds / (60 * 60 * 1000));
			// 	if (differenceInHours >= 2) {
			// 		this.peopleShow = true;
			// 	}
			// }
			// let result = await this.$request("/food/Order/hasUsingOrder", {
			// 	store_id: option.id
			// })
			// if (result.order_id) {
			// 	option.type = "add"
			// }
			// if (option.type === "add") {
			// 	this.addType = true;
			// 	this.useCoupon = option.useCoupon || result.useCoupon
			// 	this.orderId = option.orderId || result.order_id
			// }
			if (option.type === "add") {
				this.addType = true;
				this.useCoupon = option.useCoupon
				this.orderId = option.orderId
			}
			uni.getLocation({
				type: 'wgs84',
				success: async res => {
					this.shopInfo = await this.$request("/food/Store/getStoreDetail", {
						location: res.longitude + "," + res.latitude,
						store_id: option.id
					})
					this.shopCarList = uni.getStorageSync("shop" + this.shopInfo.id);
					if (this.shopCarList) {
						this.shopCarList.map(item => {
							this.carIdList.push({
								id: item.info.id,
								number: item.num
							})
						})
						this.changePrice()
					}
				}
			})
			uni.showLoading({
				title: "请稍后"
			})

			this.$request("/food/Goods/getGoodsList", {
				store_id: option.id
			}).then(res => {
				this.leftList = res.list.map(item => {
					return {
						id: item.id,
						icon: item.icon,
						name: item.name
					}
				})
				this.recommendList = res.top_goods_list;
				this.rightList = res.list;
				setTimeout(() => {
					uni.hideLoading();
					const query = uni.createSelectorQuery();
					query.selectAll(".goodsClass").boundingClientRect(data => {
						if (data) {
							data.map((item, index) => {
								let top = index > 0 ? this.topList[index - 1] : 0;
								top += item.height;
								this.topList.push(top);
							})
						}
					}).exec()
				}, 1000)
			})
		},
		onShow() {
			this.shopCarList = uni.getStorageSync("shop" + this.shopInfo.id);
			this.carIdList = [];
			if (this.shopCarList) {
				this.shopCarList.map(item => {
					this.carIdList.push({
						id: item.info.id,
						number: item.num
					})
				})
				this.changePrice()
			}
		},
		methods: {
			async login() {
				uni.showLoading({
					title: "请稍后"
				})
				const {
					code
				} = await uni.login();
				const {
					mini_openid
				} = await this.$request("/factory_system/Base/wechatUserRegister", {
					code,
					platform: "mini"
				})
				uni.setStorageSync("openId", mini_openid);
				const {
					token
				} = await this.$request("/food/User/loginAndRegister", {
					openid: mini_openid
				})
				uni.setStorageSync("token", token);
				uni.hideLoading();
				this.loginShow = false
			},
			changeRemark(index) {
				this.remarkIndex = index;
			},
			changePeopleNum(number) {
				this.person_number = number + 1
			},
			peopleConfirm() {
				uni.setStorageSync("person_number", {
					timestamp: new Date().getTime(),
					person_number: this.person_number
				});
				this.peopleShow = false
			},
			changePrice() {
				this.shopNumber = 0;
				let formData = {
					goods_list: []
				}
				if (this.shopCarList.length) {
					formData.goods_list = this.shopCarList.map(item => {
						this.shopNumber += item.num
						return {
							goods_type: item.type === 1 ? 'b' : 'a',
							goods_id: item.info.id,
							number: item.num
						}
					})
					this.$request("/food/Order/computerGoods", formData).then(res => {
						this.moneyObj = res
					})
				} else {
					this.moneyObj = {};
					this.carIdList = [];
				}
			},
			changeCurrent(id, index) {
				this.currentIndex = index;
				this.leftInto = 'r' + id;
				this.rightInto = 'l' + id;
				this.changeFlag = true;
			},
			async collect() {
				this.shopInfo.is_collection = this.shopInfo.is_collection === 'N' ? 'Y' : 'N'
				await this.$request("/food/Store/collectionStore", {
					store_id: this.shopInfo.id
				});
			},
			getStar(val, index) {
				if (index - 1 > val) return "0%"
				if (Math.floor(val) >= index) return "100%"
				let stringVal = val + ""
				let value = stringVal.split(".")[1];
				if (value.length === 1) value = value * 10;
				return value + "%"
			},
			openMap() {
				uni.openLocation({
					longitude: Number(this.shopInfo.location.split(",")[0]),
					latitude: Number(this.shopInfo.location.split(",")[1]),
					name: this.shopInfo.name
				})
			},
			callPhone(phone) {
				uni.makePhoneCall({
					phoneNumber: phone
				})
			},
			rightScroll(e) {
				if (!this.changeFlag) {
					let scrollTop = e.target.scrollTop;
					let result = this.topList.findIndex((item, index) => {
						return scrollTop <= item;
					})
					this.currentIndex = result;
				}
				this.changeFlag = false
			},
			openCar() {
				this.shopCarShow = true;
				this.shopCarList = uni.getStorageSync("shop" + this.shopInfo.id);
				this.changePrice();
			},
			menuShopping(obj) {
				this.goodsObj = obj;
				this.menuShopShow = true;
			},
			getCoupon(item) {
				if (item.has_status === "Y") return;
				this.$request("/food/Coupon/hasCoupon", {
					coupon_id: item.id
				}).then(res => {
					uni.getLocation({
						type: 'wgs84',
						success: async res => {
							this.shopInfo = await this.$request("/food/Store/getStoreDetail", {
								location: res.longitude + "," + res.latitude,
								store_id: this.shopInfo.id
							})
						}
					})
				})
			},
			openShopping(obj) {
				if (obj.is_group === 'Y') {
					this.selGroup(obj);
					return;
				}
				this.goodsObj = obj;
				// let getAllgoods = uni.getStorageSync("shop" + this.shopInfo.id);
				// if (getAllgoods) {
				// 	getAllgoods.map(item => {
				// 		if (item.info.id === this.goodsObj.id) {
				// 			this.goodsNum = item.num;
				// 		}
				// 	})
				// }
				this.shopShow = true;
			},
			changeNum(type) {
				if (type === "add") {
					this.goodsNum += 1;
				} else if (type === "min") {
					if (this.goodsNum === 1) return
					this.goodsNum -= 1;
				}
			},
			previewImg(img) {
				uni.previewImage({
					urls: [img]
				})
			},
			addShopCar(type) {
				let getAllgoods = uni.getStorageSync("shop" + this.shopInfo.id);
				let flag = true;
				if (getAllgoods) {
					getAllgoods.map(item => {
						if (item.info.id === this.goodsObj.id) {
							item.num += this.goodsNum;
							item.choice_des = this.goodsObj.choice_des[this.remarkIndex] || '';
							flag = false
						}
					})
					if (flag) {
						getAllgoods.push({
							num: this.goodsNum,
							type,
							choice_des: this.goodsObj.choice_des[this.remarkIndex] || '',
							info: this.goodsObj,
						})
					}
					this.shopCarList = getAllgoods;
					uni.setStorageSync("shop" + this.shopInfo.id, getAllgoods);
				} else {
					getAllgoods = [{
						num: this.goodsNum,
						type,
						choice_des: this.goodsObj.choice_des[this.remarkIndex] || '',
						info: this.goodsObj
					}];
					this.shopCarList = getAllgoods;
					uni.setStorageSync("shop" + this.shopInfo.id, getAllgoods);
				}
				this.carIdList = []
				this.shopCarList.map(item => {
					this.carIdList.push({
						id: item.info.id,
						number: item.num
					})
				})
				this.remarkIndex = null;
				this.changePrice()
				this.shopShow = false;
				this.menuShopShow = false;
				this.goodsNum = 1;
			},
			showDetail(obj) {
				console.log(obj)
				this.menuDetail = obj;
				this.shopCarShow = false;
				this.menuDetailShow = true;
			},
			changeCarNum(obj, type, index) {
				if (type === "add") {
					obj.num += 1
				} else if (type === "min") {
					if (obj.num === 1) {
						this.remarkFlag = true;
						this.shopCarList.splice(index, 1);
					} else {
						obj.num -= 1
					}
				}
				uni.setStorageSync("shop" + this.shopInfo.id, this.shopCarList);
				this.carIdList = [];
				if (this.shopCarList) {
					this.shopCarList.map(item => {
						this.carIdList.push({
							id: item.info.id,
							number: item.num
						})
					})
					this.changePrice()
				}
			},
			scanTableCode() {
				this.shopCarList = uni.getStorageSync("shop" + this.shopInfo.id);
				if (!this.shopCarList || this.shopCarList.length === 0) {
					uni.showToast({
						title: "购物车为空",
						icon: "error"
					})
					return;
				}
				if (this.addType) {
					this.$nav('/home_packages/place_order/index', {
						id: this.shopInfo.id,
						addType: true,
						useCoupon: this.useCoupon,
						orderId: this.orderId
					})
				} else if (this.scanType) {
					this.$nav('/home_packages/place_order/index', {
						id: this.shopInfo.id,
						scanType: true,
						table_code: this.scanInfo.seat_code,
						seat_id: this.scanInfo.seat_id
					})
				} else if (this.workerType) {
					this.$nav('/home_packages/place_order/index', {
						id: this.shopInfo.id,
						workerType: true,
						table_code: "",
						seat_id: ""
					})
				} else {
					// uni.scanCode({
					// 	scanType: ["qrCode"],
					// 	success: res => {
					// 		let str = res.result.split("?")[1];
					// 		let obj = {};
					// 		let arr = str.split('&');
					// 		for (let i = 0; i < arr.length; i++) {
					// 			obj[arr[i].split('=')[0]] = arr[i].split('=')[1];
					// 		}
					// 		this.$nav('/home_packages/place_order/index', {
					// 			id: this.shopInfo.id,
					// 			scanType: true,
					// 			table_code: obj.seat_code,
					// 			seat_id: obj.seat_id
					// 		})
					// 	}
					// })
					this.$nav('/home_packages/place_order/index', {
						id: this.shopInfo.id,
						scanType: false,
						table_code: "",
						seat_id: ""
					})
				}
				this.shopCarShow = false
			},
			selGroup(obj) {
				this.groupDetailShow = true;
				this.groupDetail = obj;
				this.groupContain = [];
				this.groupGoodsId = [];
				this.groupGoods = [];
				obj.group_list.map(item => {
					if (item.type === "single") {
						this.groupContain = this.groupContain.concat(item.goods_list)
					}
				})
			},
			addCar(type, obj, option) {
				let index = this.carIdList.findIndex(item => item.id === obj.id)
				if (this.remarkObj.id !== obj.id) {
					this.remarkFlag = true;
				}
				if (index !== -1 && !obj.group_goods) {
					if (option === 'add') {
						this.carIdList[index].number += 1
					} else if (option === "min") {
						this.carIdList[index].number -= 1;
						if (this.carIdList[index].number === 0) {
							this.remarkFlag = true;
							this.carIdList.splice(index, 1)
						}
					}
				} else {
					if (obj.group_goods) {
						this.remarkFlag = true;
					}
					if (this.remarkIndex === null && obj.choice_des.length && obj.choice_des[0] !== '' && this
						.remarkFlag) {
						this.remarkObj = obj;
						this.remarkType = type;
						this.remarkShow = true;
						return;
					} else if (this.remarkShow) {
						this.remarkFlag = false;
						this.remarkShow = false;
					}
					this.carIdList.push({
						id: obj.id,
						number: 1
					})
				}
				let getAllgoods = uni.getStorageSync("shop" + this.shopInfo.id);
				let flag = true;
				let allGoodsIndex = null;
				if (getAllgoods) {
					if (!obj.group_goods || !obj.group_goods.length) {
						getAllgoods.map((item, index) => {
							if (item.info.id === obj.id) {
								if (this.carIdList[index] && this.carIdList[index].id === obj.id) {
									item.num = this.carIdList[index].number;
								} else {
									allGoodsIndex = index;
								}
								flag = false
							}
						})
					}
					if (allGoodsIndex || allGoodsIndex === 0) getAllgoods.splice(allGoodsIndex, 1)
					if (flag) {
						getAllgoods.push({
							num: 1,
							type,
							choice_des: obj.choice_des[this.remarkIndex] || '',
							info: obj
						})
					}
					this.shopCarList = getAllgoods;
					uni.setStorageSync("shop" + this.shopInfo.id, getAllgoods);
				} else {
					getAllgoods = [{
						num: this.goodsNum,
						type,
						choice_des: obj.choice_des[this.remarkIndex] || '',
						info: obj
					}];
					this.shopCarList = getAllgoods;
					uni.setStorageSync("shop" + this.shopInfo.id, getAllgoods);
				}
				this.remarkIndex = null;
				this.changePrice()
			},
			selectGood(id, obj, checkNumber) {
				if (!this.groupGoods.length) {
					this.groupGoods.push({
						goods_id: obj.id,
						has_number: obj.has_number,
						parent_id: id,
						name: obj.name,
						cover_image: obj.cover_image,
					})
					this.groupGoodsId.push(obj.id);
					return;
				}
				let flag = false;
				let number = 0;
				this.groupGoodsId = [];
				let delFlag = false;
				let delIndex = null;
				let replaceIndex = null;
				this.groupGoods.map((item, index) => {
					if (item.goods_id === obj.id) {
						delFlag = true;
						delIndex = index;
					}
					if (item.parent_id === id) {
						number++;
					}
				})
				this.groupGoods.map((item, index) => {
					if (!delFlag) {
						if (number > 0) {
							if (Number(checkNumber) === 1) {
								replaceIndex = index;
							} else if (number < checkNumber) {
								flag = true;
							}
						} else {
							flag = true;
						}
					}
					this.groupGoodsId.push(item.goods_id);
				})
				if (replaceIndex !== null) {
					this.groupGoods[replaceIndex] = {
						goods_id: obj.id,
						has_number: obj.has_number,
						parent_id: id,
						name: obj.name,
						cover_image: obj.cover_image,
					}
					this.groupGoodsId[replaceIndex] = obj.id
				}
				if (delFlag) {
					this.groupGoods.splice(delIndex, 1);
					this.groupGoodsId.splice(delIndex, 1);
				}
				if (flag) {
					this.groupGoodsId.push(obj.id);
					this.groupGoods.push({
						goods_id: obj.id,
						has_number: obj.has_number,
						parent_id: id,
						name: obj.name,
						cover_image: obj.cover_image,
					})
				}
			},
			groupAddCar() {
				let number = 0;
				this.groupDetail.group_list.map(item => {
					if(item.type=="check"){
						number += Number(item.check_number)
					}
				})
				// console.log('所有商品',this.groupDetail.group_list);
				// console.log('选购总数',number);
				// console.log('已选商品数量',this.groupGoods.length);
				if (this.groupGoods.length < number) {
					// console.log('没选够数量');
					uni.showToast({
						title: "请选择商品",
						icon: 'error'
					})
					return false;
				}
				// console.log('走到提交');
				// return false
				this.groupContain.map(item => {
					this.groupGoods.push({
						goods_id: item.id,
						has_number: item.has_number,
						name: item.name,
						cover_image: item.cover_image,
					})
				})
				this.groupDetail.group_goods = JSON.parse(JSON.stringify(this.groupGoods));
				this.groupGoodsId = [];
				this.groupGoods = [];
				this.groupDetailShow = false;
				this.addCar(1, this.groupDetail, "add")
			}
		}
	}
</script>

<style lang="scss">
	.groupShowContent {
		padding: 5.33vw 4vw;

		>.confirm {
			width: 80vw;
			height: 12vw;
			line-height: 12vw;
			text-align: center;
			margin: 0 auto;
			background: #010101;
			border-radius: 6vw;
			font-weight: bold;
			font-size: 4vw;
			color: #DDC285;
		}

		>.title {
			font-weight: bold;
			font-size: 4.27vw;
			color: #000000;
			margin-bottom: 1.33vw;
		}

		>.sale {
			margin-bottom: 4vw;
			font-weight: 400;
			font-size: 3.2vw;
			color: #000000;
		}

		.introduce {
			font-weight: 400;
			font-size: 3.2vw;
			color: #999999;
			margin-bottom: 4vw;
		}

		.list {
			margin-bottom: 5.33vw;

			>.label {
				width: 100%;
				font-weight: bold;
				font-size: 3.2vw;
				color: #000000;
				margin-bottom: 1.33vw;
			}

			>.gridBox {
				display: grid;
				grid-template-columns: repeat(3, 1fr);
				gap: 2.8vw;

				>.item {
					padding: 1.33vw;
					background: #FFFFFF;
					border-radius: 2.67vw;
					border: 0.13vw solid #999999;
					transition: all .2s;

					>.name {
						font-weight: bold;
						font-size: 3.2vw;
						color: #000000;
					}

					>.number {
						font-weight: 500;
						font-size: 3.2vw;
						color: #666666;
					}

					>image {
						width: 100%;
						height: 26.13vw;
						border-radius: 2.67vw;
						margin-bottom: 1.33vw;
					}
				}

				>.active {
					border: 6rpx solid #DDC285;
					box-shadow: 4rpx 4rpx 4rpx rgba(0, 0, 0, 0.16);
				}
			}
		}
	}

	.remarkShowContent {
		padding: 5.33vw 4vw;

		>.title {
			font-weight: bold;
			font-size: 4.27vw;
			color: #000000;
			margin-bottom: 5.33vw;
		}

		>.remarker {
			width: 85vw;

			>.item {
				width: 20vw;
				height: 10vw;
				border: solid 1px #000000;
				color: #000000;
				text-align: center;
				line-height: 10vw;
				border-radius: 3vw;
				font-size: 3vw;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
				margin-bottom: 3vw;
			}

			>.active {
				border: solid 1px rgb(245, 232, 174);
				color: rgb(245, 232, 174);
			}
		}

		>.confirm {
			width: 80vw;
			height: 12vw;
			line-height: 12vw;
			text-align: center;
			margin: 3vw auto 0;
			background: #010101;
			border-radius: 6vw;
			font-weight: bold;
			font-size: 4vw;
			color: #DDC285;
		}
	}

	.loginShowContent {
		padding: 5.33vw 4vw;

		>.title {
			font-weight: bold;
			font-size: 4.27vw;
			color: #000000;
			margin-bottom: 5.33vw;
		}

		>.confirm {
			width: 80vw;
			height: 12vw;
			line-height: 12vw;
			text-align: center;
			margin: 0 auto;
			background: #010101;
			border-radius: 6vw;
			font-weight: bold;
			font-size: 4vw;
			color: #DDC285;
		}
	}

	.peopleShowContent {
		width: 85vw;
		padding: 5.33vw 4vw;

		>.title {
			font-weight: bold;
			font-size: 4.27vw;
			color: #000000;
			margin-bottom: 5.33vw;
		}

		.number {
			width: 20.67vw;
			height: 8vw;
			border-radius: 4vw;
			overflow: hidden;
			background: #f0f0f0;
			margin-bottom: 3vw;
			text-align: center;
			line-height: 8vw;
		}

		.active {
			background: #000000;
			color: #DDC285;
		}

		>.confirm {
			width: 80vw;
			height: 12vw;
			line-height: 12vw;
			text-align: center;
			margin: 0 auto;
			background: #010101;
			border-radius: 6vw;
			font-weight: bold;
			font-size: 4vw;
			color: #DDC285;
		}
	}

	.discountContent {
		padding: 5.33vw 4vw 0;

		>.title {
			font-weight: bold;
			font-size: 4.27vw;
			color: #000000;
			margin-bottom: 5.33vw;
		}

		.item_box {
			padding: 2.67vw;
			background: #FBFBFB;
			border-radius: 1.33vw;
			border: 0.27vw solid #ED1805;
			margin-bottom: 2.67vw;

			>.get {
				>.charge {
					width: 21.33vw;
					height: 8vw;
					background: #FA4741;
					border-radius: 4vw;
					font-weight: 400;
					font-size: 4vw;
					color: #FFFFFF;
				}
			}

			>.type {
				font-weight: 400;
				font-size: 2.67vw;
				color: #666666;
				margin: 1.33vw 0;
			}

			>.item {
				padding-bottom: 2.67vw;
				border-bottom: solid 1px #F5F5F5;

				>.content {
					font-weight: bold;
					font-size: 4vw;
					color: #ED1805;
					flex: auto;
					align-items: flex-end;

					>text {
						font-weight: 500;
						font-size: 2.67vw;
						color: #666666;
					}
				}

				>.title {
					font-weight: 400;
					font-size: 3.73vw;
					color: #000000;
					flex: auto;

					>text {
						font-weight: 500;
						font-size: 2.67vw;
						color: #666666;
					}
				}

				>image {
					width: 9.6vw;
					height: 9.6vw;
					border-radius: 1.33vw;
					margin-right: 2.67vw;
				}
			}
		}
	}

	.shopCarContent {
		padding: 5.33vw 4vw 15.8vw;
		position: relative;

		>.bottom {
			width: calc(100% - 8vw - 2px);
			height: 12.8vw;
			background: #FFFFFF;
			border-radius: 1.33vw 1.33vw 0 0;
			border: 1px solid #999999;
			position: absolute;
			bottom: 0;
			left: 0;
			padding: 0 4vw;
			font-weight: bold;
			font-size: 4vw;
			color: #ED1805;

			>.gotIt {
				width: 26.67vw;
				height: 8vw;
				line-height: 8vw;
				text-align: center;
				background: #EFA246;
				border-radius: 6vw;
				font-weight: bold;
				font-size: 4vw;
				color: #FFFFFF;
			}
		}

		.item {
			align-items: flex-end;
			margin-bottom: 8vw;

			&:last-child {
				margin-bottom: 0;
			}

			>.right {
				height: 14.67vw;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				align-items: flex-end;

				>.showDetail {
					font-weight: 500;
					font-size: 2.67vw;
					color: #EFA246;
				}

				>.number {
					width: 28vw;
					height: 7.33vw;
					border-radius: 4vw;
					overflow: hidden;

					>.min {
						width: 8vw;
						height: 100%;
						background: #000000;
					}

					>.num {
						width: 12vw;
						height: 100%;
						background: #F5F5F5;
						font-weight: bold;
						font-size: 4.27vw;
						color: #000000;
					}

					>.add {
						width: 8vw;
						height: 100%;
						background: #000000;
					}
				}
			}

			>.left {
				>image {
					width: 14.67vw;
					height: 14.67vw;
					border-radius: 1.33vw;
				}

				>.right {
					height: 14.67vw;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					font-weight: bold;
					font-size: 4vw;
					color: #000000;
					margin-left: 2.67vw;

					>.remark {
						font-size: 2.67vw;
						color: #999999;
					}

					>text {
						color: #ED1805;
					}
				}
			}
		}

		>.title {
			font-weight: bold;
			font-size: 4.27vw;
			color: #000000;
			margin-bottom: 4vw;
		}
	}

	.shopShowContent {
		padding: 5.33vw 4vw 0;

		>.title {
			font-weight: bold;
			font-size: 4.27vw;
			color: #000000;
		}

		>.sale {
			font-weight: 400;
			font-size: 3.2vw;
			color: #000000;
			margin: 1.33vw 0 2.67vw;
		}

		>.content {
			font-weight: 400;
			font-size: 3.2vw;
			color: #999999;
			text-align: justify;
			margin-bottom: 2.67vw;
		}

		>text {
			font-weight: bold;
			font-size: 3.2vw;
			color: #000000;
			margin-bottom: 2.67vw;
			display: block;
		}

		.imgs {
			height: 31.47vw;

			>.img_box {
				font-weight: 500;
				font-size: 3.2vw;
				color: #000000;
				display: flex;
				flex-direction: column;

				>text {
					padding-left: 2.67vw;
				}

				>image {
					width: 31.47vw;
					height: 31.47vw;
					border-radius: 2.67vw;
					margin-right: 2.67vw;
					margin-bottom: 1.33vw;
				}

				&:last-child image {
					margin-right: 0;
				}

			}

			>image {
				width: 31.47vw;
				height: 100%;
				border-radius: 2.67vw;
				margin-right: 2.67vw;

				&:last-child {
					margin-right: 0;
				}
			}
		}

		>.line {
			height: 1px;
			background: #999999;
			margin: 4vw 0;
		}

		>.price {
			font-weight: bold;
			font-size: 4.8vw;
			color: #ED1805;

			>view>text {
				font-weight: 400;
				font-size: 4vw;
				color: #999999;
				text-decoration-line: line-through;
				margin-left: 1.33vw;
			}

			>.number {
				width: 34.67vw;
				height: 8vw;
				border-radius: 4vw;
				overflow: hidden;

				>.min {
					width: 10.67vw;
					height: 100%;
					background: #000000;
				}

				>.num {
					width: 13.33vw;
					height: 100%;
					background: #F5F5F5;
					font-weight: bold;
					font-size: 4.27vw;
					color: #000000;
				}

				>.add {
					width: 10.67vw;
					height: 100%;
					background: #000000;
				}
			}
		}

		>.remark {
			margin-top: 3vw;

			>.remarker {
				>.item {
					width: 20vw;
					height: 10vw;
					border: solid 1px #000000;
					color: #000000;
					text-align: center;
					line-height: 10vw;
					border-radius: 3vw;
					font-size: 3vw;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
					margin-bottom: 3vw;
				}

				>.active {
					border: solid 1px rgb(245, 232, 174);
					color: rgb(245, 232, 174);
				}
			}

			>text {
				font-weight: bold;
				font-size: 3.2vw;
				color: #000000;
				margin-bottom: 2.67vw;
				display: block;
			}
		}

		>.addShopCar {
			width: 80vw;
			height: 12vw;
			line-height: 12vw;
			text-align: center;
			background: #000000;
			border-radius: 6vw;
			font-weight: bold;
			font-size: 4vw;
			color: rgb(245, 232, 174);
			margin: 8.2vw auto 0;
		}
	}

	.container {
		height: 100%;
		min-height: 100vh;
		background: #F5F5F5;
		padding-bottom: constant(safe-area-inset-bottom);
		/*兼容 IOS&gt;11.2*/
		padding-bottom: env(safe-area-inset-bottom);
		/*兼容 IOS&gt;11.2*/

		.shop_car {
			position: fixed;
			bottom: env(safe-area-inset-bottom);
			bottom: constant(safe-area-inset-bottom);
			right: 4.27vw;
			width: 0;
			height: 15vw;
			transition: all .2s;
			overflow: hidden;
			z-index: 9999;

			>.left {
				position: relative;
				margin-left: 5vw;
				margin-right: 5vw;

				>.shopNumber {
					position: absolute;
					left: 5vw;
					top: -3vw;
					background: rgb(245, 232, 174);
					padding: 0 6px;
					height: 5vw;
					text-align: center;
					border-radius: 5vw;
					font-size: 3.67vw;
					color: #000000;
				}

				>image {
					max-width: 6vw;
					max-height: 6vw;
				}
			}
		}

		.shop_car_active {
			right: 50%;
			transform: translateX(50%);
			width: 80vw;
			display: flex;
			align-items: center;
			border-radius: 12vw;
			overflow: hidden;
			background: #000000;
			color: rgb(245, 232, 174);

			>.gotIt {
				position: absolute;
				right: 0;
				font-size: 4.27vw;
				display: flex;
				justify-content: center;
				align-items: center;
				background: #ddc386;
				height: 100%;
				width: 20vw;
				color: #000000;
			}
		}

		>.goods_list {
			background: #FFFFFF;

			.rightScroll {
				height: calc(100vh - constant(safe-area-inset-bottom) - 2.67vw);
				height: calc(100vh - env(safe-area-inset-bottom) - 2.67vw);
				padding-left: 4vw;
				padding-top: 2.67vw;

				.list {
					padding: 0 1vw;

					.buyedItem {
						height: 15vw;

						>.title {
							width: 30vw;
						}

						>.center {
							width: fit-content;
						}

						>.price {
							flex: auto;
							font-weight: 400;
							font-size: 2.67vw;
							color: #000000;
							align-items: center;
							justify-content: flex-end;


							>.optionNum {
								height: 8vw;
								display: flex;
								align-items: center;

								>.selectDetail {
									background: #000000;
									display: flex;
									align-items: center;
									justify-content: center;
									padding: 1vw 3vw;
									border-radius: 3vw;
									color: rgb(245, 232, 174);
									font-size: 3.57vw;
								}

								>.get {
									width: 6.67vw;
									height: 6.67vw;
									background: #000000;
									border-radius: 50%;
									display: flex;
									align-items: center;
									justify-content: center;
								}
							}
						}
					}

					.item_type {
						width: 64.66vw;
						background: #FFFFFF;
						box-shadow: 0 0.4vw 0.8vw 0.13vw rgba(0, 0, 0, 0.16);
						border-radius: 2.67vw;
						overflow: hidden;
						margin-bottom: 2.67vw;
						padding: 2.67vw;

						>.content {
							width: 100%;
							font-weight: 400;
							font-size: 2.67vw;
							color: #999999;
							margin: 2.67vw 0;
							display: -webkit-box;
							-webkit-line-clamp: 2;
							-webkit-box-orient: vertical;
							overflow: hidden;
							text-overflow: ellipsis;
						}

						>.right {
							width: 34vw;

							>.price {
								font-weight: 400;
								font-size: 2.67vw;
								color: #000000;


								>.optionNum {
									height: 8vw;
									display: flex;
									align-items: center;

									>.get {
										width: 6.67vw;
										height: 6.67vw;
										background: #000000;
										border-radius: 50%;
										display: flex;
										align-items: center;
										justify-content: center;
									}
								}
							}

							>.content {
								font-weight: 400;
								font-size: 2.67vw;
								color: #999999;
								margin: 1.33vw 0;
								display: -webkit-box;
								-webkit-box-orient: vertical;
								-webkit-line-clamp: 2;
								overflow: hidden;
								text-overflow: ellipsis;
							}

							>.sale {
								font-weight: bold;
								font-size: 4.8vw;
								color: #ED1805;
								margin: 2.67vw 0;
							}

							>.title {
								font-weight: bold;
								font-size: 4vw;
								color: #000000;
							}
						}

						>image {
							width: 26.67vw;
							height: 26.67vw;
							border-radius: 2.67vw;
						}
					}

					>.item {
						width: 70vw;
						background: #FFFFFF;
						box-shadow: 0 0.4vw 0.8vw 0.13vw rgba(0, 0, 0, 0.16);
						border-radius: 2.67vw;
						overflow: hidden;
						margin-bottom: 1.33vw;

						>.price {
							padding: 0 2.67vw;
							margin-bottom: 2.8vw;

							>.optionNum {
								height: 8vw;
								display: flex;
								align-items: center;

								>.selectDetail {
									background: #000000;
									display: flex;
									align-items: center;
									justify-content: center;
									padding: 1vw 3vw;
									border-radius: 3vw;
									color: rgb(245, 232, 174);
									font-size: 3.57vw;
								}

								>.get {
									width: 6.67vw;
									height: 6.67vw;
									background: #000000;
									border-radius: 50%;
									display: flex;
									align-items: center;
									justify-content: center;
								}
							}

							>.left {
								font-weight: bold;
								font-size: 4.8vw;
								color: #ED1805;

								>text {
									font-weight: 400;
									font-size: 3.2vw;
									color: #999999;
									text-decoration-line: line-through;
									margin-left: 2.67vw;
								}
							}
						}

						>.content {
							font-weight: 400;
							font-size: 2.67vw;
							color: #999999;
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
							padding: 0 2.67vw;
							margin-bottom: 2.67vw;
						}

						>.title {
							font-weight: bold;
							font-size: 4vw;
							color: #000000;
							padding: 0 2.67vw;
							margin: 2.67vw 0 1.33vw;

							>text {
								font-weight: 400;
								font-size: 2.67vw;
								color: #000000;
							}
						}

						>image {
							height: 36.4vw;
						}
					}
				}

				.label {
					font-weight: bold;
					font-size: 3.2vw;
					color: #000000;
					padding-top: 5.33vw;
					margin-bottom: 2.67vw;
				}
			}

			.leftScroll {
				width: 21.33vw;
				height: calc(100vh - constant(safe-area-inset-bottom));
				height: calc(100vh - env(safe-area-inset-bottom));
				background: #F5F5F5;

				.active {
					background: #FFFFFF;
				}

				.item {
					width: 21.33vw;
					height: 21.33vw;
					font-weight: 400;
					font-size: 2.67vw;
					color: #333333;

					>image {
						max-width: 5.33vw;
						max-height: 5.33vw;
					}
				}
			}
		}

		>.recommend {
			background: #FFFFFF;
			padding: 2.67vw 4vw;
			margin-bottom: 1.33vw;

			.item {
				width: 37.33vw;
				margin-right: 2vw;

				&:last-child {
					margin-right: 0;
				}

				>.price {
					font-weight: 400;
					font-size: 2.67vw;
					color: #000000;


					>.optionNum {
						height: 8vw;
						display: flex;
						align-items: center;

						>.selectDetail {
							background: #000000;
							display: flex;
							align-items: center;
							justify-content: center;
							padding: 1vw 3vw;
							border-radius: 3vw;
							color: rgb(245, 232, 174);
							font-size: 3.57vw;
						}

						>.get {
							width: 5.67vw;
							height: 5.67vw;
							background: #000000;
							border-radius: 50%;
							display: flex;
							align-items: center;
							justify-content: center;
						}
					}

					>.left {
						font-weight: bold;
						font-size: 3.8vw;
						color: #ED1805;

						>text {
							font-weight: 400;
							font-size: 2.2vw;
							color: #999999;
							text-decoration-line: line-through;
							margin-left: 2.67vw;
						}
					}
				}

				>.title {
					font-weight: bold;
					font-size: 4vw;
					color: #000000;
					margin-top: 1.33vw;
				}

				>.label {
					font-weight: 400;
					font-size: 2.67vw;
					color: #000000;
					margin: 1.33vw 0;
				}

				>image {
					width: 100%;
					height: 26.67vw;
					border-radius: 2.67vw;
				}
			}

			>.title {
				font-weight: bold;
				font-size: 3.2vw;
				color: #000000;
				margin-bottom: 2.67vw;

				>image {
					width: 4.53vw;
					height: 4.53vw;
					border-radius: 0.53vw;
					margin-right: 1.33vw;
				}
			}
		}

		>.discount {
			background: #FFFFFF;
			padding: 2.67vw 4vw;
			margin-bottom: 1.33vw;

			>.more {
				width: fit-content;
				margin: 2.67vw auto 0;
				font-weight: 500;
				font-size: 3.2vw;
				color: #FA4741;
			}

			>.item_box {
				padding: 2.67vw;
				background: #FBFBFB;
				border-radius: 1.33vw;
				border: 0.27vw solid #ED1805;

				>.get {
					>.charge {
						width: 21.33vw;
						height: 8vw;
						background: #FA4741;
						border-radius: 4vw;
						font-weight: 400;
						font-size: 4vw;
						color: #FFFFFF;
					}
				}

				>.type {
					font-weight: 400;
					font-size: 2.67vw;
					color: #666666;
					margin: 1.33vw 0;
				}

				>.item {
					padding-bottom: 2.67vw;
					border-bottom: solid 1px #F5F5F5;

					>.content {
						font-weight: bold;
						font-size: 4vw;
						color: #ED1805;
						flex: auto;
						align-items: flex-end;

						>text {
							font-weight: 500;
							font-size: 2.67vw;
							color: #666666;
						}
					}

					>.title {
						font-weight: 400;
						font-size: 3.73vw;
						color: #000000;
						flex: auto;

						>text {
							font-weight: 500;
							font-size: 2.67vw;
							color: #666666;
						}
					}

					>image {
						width: 9.6vw;
						height: 9.6vw;
						border-radius: 1.33vw;
						margin-right: 2.67vw;
					}
				}
			}

			>.title {
				font-weight: bold;
				font-size: 3.2vw;
				color: #000000;
				margin-bottom: 2.67vw;

				>image {
					width: 4.53vw;
					height: 4.53vw;
					border-radius: 0.53vw;
					margin-right: 1.33vw;
				}
			}
		}

		>.shop {
			padding: 4vw;
			background: #FFFFFF;
			margin-bottom: 1.33vw;

			>.navigation {
				padding-right: 2.63vw;

				>.detail {
					width: 63vw;
					font-size: 3.2vw;
					color: #000000;
					line-height: 4vw;
				}

				>image {
					width: 5.33vw;
					height: 5.33vw;
				}
			}

			>.line {
				height: 1px;
				background: #999999;
				margin: 2.8vw 0 2.67vw;
			}

			.banner {
				width: 135vw;
				height: 25.33vw;

				>.more {
					height: 100%;
					flex: auto;
					writing-mode: vertical-lr;
					background: #F5F5F5;
					border-radius: 1.33vw 0rem 0rem 1.33vw;
					font-weight: 500;
					font-size: 2.67vw;
					letter-spacing: 5px;
					color: #FA4741;
				}

				>image {
					width: 40vw;
					height: 100%;
					border-radius: 1.33vw;
					margin-right: 1.33vw;
				}
			}

			>.label>.item {
				padding: .4vw 1.33vw;
				margin-right: 1.47vw;
				margin-bottom: 2vw;
				background: #FDECE0;
				border-radius: 0.53vw;
				font-size: 2.67vw;
				color: #C7835A;
			}

			>.address {
				font-size: 3.2vw;
				color: #666666;
				margin-bottom: 2vw;
			}

			>.info {
				font-weight: 500;
				font-size: 3.2vw;
				color: #666666;
				margin-bottom: 2vw;

				>.left {
					font-size: 3.2vw;
					color: #ED4133;

					>.star>.item {
						width: 3.2vw;
						height: 3.2vw;
						border-radius: 0.53vw;
						background: #F5F5F5;
						position: relative;
						margin-right: .27vw;
						overflow: hidden;

						&:last-child {
							margin-right: 1.33vw;
						}

						>.bg {
							width: 0;
							height: 100%;
							position: absolute;
							inset: 0;
							z-index: 1;
							background: #ED4133;
						}

						>image {
							width: 2.67vw;
							height: 2.67vw;
							position: absolute;
							z-index: 2;
							top: 50%;
							left: 50%;
							transform: translate(-50%, -50%);
						}
					}
				}
			}

			>.title {
				font-weight: 400;
				font-size: 5.33vw;
				color: #000000;
				margin-bottom: 2.67vw;

				>image {
					width: 6vw;
					height: 6vw;
				}
			}
		}
	}
</style>