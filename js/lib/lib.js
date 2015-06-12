'use strict';
var IMG_PATH = "http://app.myintv.com.cn/yaosz/xinlang/",
	APP_PATH = 'http://app.intv.com.cn/yaosz/xinlang/',
	BODY = $("body"),
	reservationBtn = $("#reservation-btn"),
	LS = localStorage,
	appPreFix = "_children_",
	userID = appPreFix + "id",
	userImg = appPreFix + "Img",
	userName = appPreFix + "name",
	userGender = appPreFix + "gender",
	copyright = $("#copyright");
/*
 * INTV 扩展配置
 * */
var INTV = INTV || {};
INTV.iAmong = {
	/**
	 * 预约节目
	 * reserTv  电视台ID
	 * reserID  预约ID
	 * */
	reserTV:10048,
	reserID:1111,
	/**
	 * 关注公众号
	 * APPid   关注的公众号
	 * Dom     关注功能Dom
	 * Type    关注样式 1 灰色 0 黑色；
	 * */
	shakeAppid:"wx546630766e556dcd",
	shakeDom:"#div_subscribe_area",
	shakeType:1,
	/**
	 * 分享
	 * img     分享图片
	 * title   分享标题
	 * des     分享描述
	 * link    分享链接
	 * */
	shareImg:"http://s1.myintv.com.cn/chunwan2015/xinlang_sz/img/logo.jpg",
	shareTitle:"参与六一直播，微信摇一摇，挑战世界纪录，大奖等你拿！",
	shareDesc:"十小时互动直播，精彩节目、诱人大奖，你还等什么？快来摇一摇吧！",
	shareLink:"http://app.intv.com.cn/chunwan2015/xinlang_sz/share_page.html",
	/*
	 * 授权用户
	 * id       授权ID
	 * link     授权URL
	 * */
	authorID:"wx028e76a8342017a4",
	authorUser:"userinfo",
	authorLink:"",
	/*
	 * 截取返回URL参数
	 * &
	 * USER 储存参数
	 * */
	USER:{},
	splitURL:function() {
		var URL = document.location.href, argsArray = [], i, len, argsName, argsVal;
		if (URL.indexOf("?") != -1) {
			argsArray = URL.split("?")[1].split("&");
			len = argsArray.length;
			for (i = 0; i < len; i++) {
				argsName = argsArray[i].split("=")[0];
				argsVal = argsArray[i].split("=")[1];
				INTV.iAmong.USER[argsName] = decodeURIComponent(argsVal);
				if (LS.getItem(argsName) != "") {
					LS.setItem(argsName, argsVal);
				}
			}
		}
		return INTV.iAmong.USER;
	},
	/*
	 * 使URL 链接后面都带上参数
	 * */
	addURL:function() {
		var a = document.querySelectorAll("a"), len = a.length, i, j, href = "", baseURL = "", addString = "";
		if (INTV.iAmong.USER && len != '') {
			for (j in INTV.iAmong.USER) {
				addString += "&" + j + "=" + INTV.iAmong.USER[j];
			}
			for (i = 0; i < len; i++) {
				baseURL = a[i].getAttribute("href");
				if (baseURL.indexOf("html") != -1) {
					a[i].setAttribute("href", baseURL + "?" + addString);
				}
			}
		}
	}
};
INTV.iAmong.splitURL();
/*
 * 用户授权
 * @Authorize
 *   授  权 ：1
 *   未授权 ：0
 * */
shaketv.authorize(INTV.iAmong.authorID,"userinfo",function(d){
	if (d.errorCode === 0){
		//获得code之后，因secretkey在js中使用会有泄露的风险，所以请通过后台接口获取access_token、解密code
		$.ajax({
			type: 'GET',
			url: 'http://app.intv.com.cn/yaosz/member/auth/yao?yaocode='+d.code+'&appid='+INTV.iAmong.authorID+'&callback=jsonp',
			async: false,
			dataType: 'jsonp',
			success:function(data){
				if(data.meta.status!=200){
					console.log('获取用户信息失败');
					toast('授权失败');
//                     window.location.href = 'http://app.intv.com.cn/yaosz/nzny/hb/html-main';
				}else{
					LS.setItem(userID, decodeURIComponent(data.id));
					LS.setItem(userImg, decodeURIComponent(data.name));
					LS.setItem(userName, decodeURIComponent(data.image));
					LS.setItem(userGender,decodeURIComponent(data.gender));

					INTV.iAmong.USER[userID] = decodeURIComponent(data.id);
					INTV.iAmong.USER[userImg] = decodeURIComponent(data.name);
					INTV.iAmong.USER[userName] = decodeURIComponent(data.image);
					INTV.iAmong.USER[userGender] = decodeURIComponent(data.gender);
					console.log('授权成功');
					toast('授权成功');
					INTV.iAmong.addURL();
				}
			},
			error: function(xhr, type){
				toast('授权失败');
//                    goMyUrl();
			}
		});
	} else if( d.errorCode === (-1001) || d.errorCode === (-1002) ) {
		// 取消或超时
		location.reload();
		toast('授权失败');
	} else {
		toast('授权失败');
	}
});

//提示框
function toast(val) {
	BODY.append('<div id="toast" class="toast-show">'+ val +'</div>');
	toast = $('#toast');
	setTimeout(function() {
		toast.addClass('toast-disappear');
		setTimeout(function() {
			toast.remove();
		}, 1000);
	}, 1000);
}
/**
 * 预约节目
 * 关注公众号
 * 分享
 * */
reservationBtn.on("click", function() {
	shaketv.preReserve(INTV.iAmong.reserTV, INTV.iAmong.reserID, function(d) {
		if (d.errorCode == -1007) {
			alert("请不要重复预约哦～");
		} else {
			shaketv.reserve(INTV.iAmong.reserTV, INTV.iAmong.reserID, function(d) {});
		}
	});
});
shaketv.subscribe({
	appid:INTV.iAmong.shakeAppid,
	selector:INTV.iAmong.shakeDom,
	type:INTV.iAmong.shakeType
}, function(returnData) {
	$(INTV.iAmong.shakeDom).hide();
});
shaketv.wxShare(INTV.iAmong.shareImg, INTV.iAmong.shareTitle, INTV.iAmong.shareDesc, INTV.iAmong.shareLink);
copyright.html("本页面由天津卫视提供");