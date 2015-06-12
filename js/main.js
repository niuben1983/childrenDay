Zepto(function($){
    var bValidate = RegExp(/^(0|86|17951)?(13[0-9]|17[0-9]|15[012356789]|18[0-9]|14[57])[0-9]{8}$/);

    function upLoad(){
        var _this = this;
        if($('#upLoadPhoto').size() <= 0){
            return;
        }
        _this.form = $('#upLoadPhoto');
        _this.GetRadioValue = function (RadioName) {
            var obj;
            obj = document.getElementsByName(RadioName);
            if (obj != null) {
                var i;
                for (i = 0; i < obj.length; i++) {
                    if (obj[i].checked) {
                        return obj[i].value;
                    }
                }
            }
            return null;
        };
        _this.form.on('click', '.js_btn', function(event){
            event.preventDefault();
            _this.form.find('.tips').html('');
            _this.data = {
                name: _this.form.find('.js_name').val(),
                gender: _this.GetRadioValue('sex'),
                mobile: _this.form.find('.js_mobile').val(),
                hope: _this.form.find('.js_hope').val(),
                file: _this.form.find('.js_file').val(),
                user_id: '',
                user_name: ''
            };
            console.dir(_this.data);
            if(_this.form.find('.js_name').val() == ''){
                _this.form.find('.tips').html('姓名不能为空！');
                return;
            }
            if(_this.GetRadioValue('sex') == null){
                _this.form.find('.tips').html('请选择性别！');
                return;
            }
            if(!bValidate.test(_this.form.find('.js_mobile').val())){
                _this.form.find('.tips').html('电话号码填写不正确！');
                return;
            }
            if(_this.form.find('.js_hope').val() == ''){
                _this.form.find('.tips').html('六一寄语不能为空！');
                return;
            }
            $.post('http://app.myintv.com.cn/yaotj/children/default/submit', _this.data, function(data){
                if(data.status == 0){
                    $('#tz_upload').hide();
                    $('#tz_success').show();
                }else {
                    _this.form.find('.tips').html(data.reason);
                    
                }
            }, 'json');
        });

    }


    var upLoadTZ = new upLoad();


    function cj(){
        if($('#cj').size() <= 0){
            return;
        }
        this.farent = $('#cj');
        this.child = this.farent.find('.js_child');
        this.init = function(){
            this.isover();
        };

        this.isover = function () {
            var data = {'status': 0}
            $.getJSON('http://app.intv.com.cn/yaotj/children/prize/canluck', function (data) {
                if (data.status == 0) {
                    this.farent.find('.cj_start').show();
                    this.start();
                    this.submitInfo();
                } else{
                    this.child.hide();
                    this.farent.find('.cj_end').show();
                }
            });
        };
                        var data = {
                            "status": "0",
                            "result": {
                                "id": "6",
                                "prize_name": "\u606d\u559c\u60a8\u83b7\u5f97\u7531\u9ea6\u514b\u83f2\u6797\u6587\u5316\u4f20\u64ad\u63d0\u4f9b\u7684\u513f\u7ae5\u97f3\u4e50\u821e\u53f0\u5267\u300a\u5947\u5e7b\u68ee\u6797\u300b\u516b\u4e94\u6298\u4f18\u60e0\u5238\u4e00\u5f20  ",
                                "prize_take": "1.\u52a0\u5b98\u65b9\u5fae\u4fe1\uff1a \u5173\u6ce8\u300a\u5947\u5e7b\u68ee\u6797\u300b\u66f4\u591a\u7cbe\u5f69\u6d3b\u52a8\u4e0d\u65ad\r\n2.\u4eb2\u5b50\u5957\u7968\u4e0d\u53c2\u52a0\u672c\u6d3b\u52a8\r\n3.\u6d3b\u52a8\u6700\u7ec8\u89e3\u91ca\u6743\u5f52\u9ea6\u514b\u83f2\u6797\u6587\u5316\u4f20\u64ad\u3002\r\n\u516b\u4e94\u6298\u4f18\u60e0\u5238\uff0c\u987b\u5230\u5b98\u65b9\u6307\u5b9a\u552e\u7968\u70b9\uff0c\u51ed\u83b7\u5956\u622a\u56fe\u4eab\u53d7\u4f18\u60e0\u8d2d\u7968\u3002\r\n\u6307\u5b9a\u552e\u7968\u70b9\uff08a.\u6cb3\u4e1c\u533a\u7b2c\u4e8c\u5de5\u4eba\u6587\u5316\u5babb. \u6cb3\u897f\u533a\u6676\u91c7\u5927\u53a6\u5723\u6cfd\u6587\u5316\u6559\u80b2\uff09\r\n\u54a8\u8be2\u7535\u8bdd\uff1a18812569720",
                                "logo_info": "\u5947\u5e7b\u68ee\u6797"
                            }
                        };
        this.start = function () {
            var _this = this;
            this.farent.find('.js_start').on('click', function(event) {
                event.preventDefault();
                console.dir(11);
                $.getJSON('http://app.intv.com.cn/yaotj/children/prize/luck', {
                    user_id: 'as1dfasdfasdjfalskj2'
                }, function (data) {
                    if(data.status == 0){
                        _this.farent.find('.cj_ljxx .js_prize_pic').attr('src', data.result.logo_info);
                        _this.farent.find('.cj_ljxx .js_prize_name').html(data.result.prize_name);
                        _this.farent.find('.cj_ljxx .js_prize_take').html(data.result.prize_take);
                        _this.child.hide();
                        _this.farent.find('.cj_zjl').show();
                    }else{
                        _this.child.hide();
                        _this.farent.find('.cj_mzj').show();
                    }
                });
            });
        };

        this.submitInfo = function () {
            var _this = this;
            var vName = this.farent.find('.cj_zjl .js_name');
            var vMobile = this.farent.find('.cj_zjl .js_mobile');
            var oTips = this.farent.find('.cj_zjl .tips');
            var oBtn = this.farent.find('.cj_zjl .js_btn');

            oTips.html('');
            oBtn.on('click', function (event) {
                event.preventDefault();
                if(vName.val() == ''){
                    oTips.html('姓名不能为空！');
                    return;
                }
                if(!bValidate.test(vMobile.val())){
                    oTips.html('电话号码填写不正确！');
                    return;
                }
                $.getJSON('http://app.intv.com.cn/yaotj/children/prize/userinfo', {
                    user_id: 'as1dfasdfasdjfalskj2',
                    mobile: vMobile.val(),
                    username: vName.val()
                }, function (data) {
                    if(data.status == 0){
                        _this.child.hide();
                        _this.farent.find('.cj_ljxx').show();
                    }
                });
            });
        };

        this.init();
    }

    var CJ = new cj();
});