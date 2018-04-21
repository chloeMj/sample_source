Ext.define('YSYS.view.Login', {
    extend: 'Ext.Window',
    alias: 'widget.login',

    requires: [
        'Ext.util.Cookies'
    ],

    title: 'Ysys v1.0 로그인',
    closable: false,
    resizable: false,
    draggable: false,
    width: 680,
    height: 395,
    cls: 'login',
    bodyStyle: {
        background: 'transparent',
        border: 'none'
    },

    layout: 'fit',

    limitTimer: '60',

    items: [{
        xtype: 'panel',
        bodyStyle: {
            background: 'transparent',
            border: 'none'
        },
        style: {
            background: 'transparent'
        },

        layout: 'absolute',

        items: [{
            x: 230, y: 100,
            width: 250, height: 40,
            xtype: 'textfield',
            hideLabel: true,
            name: 'usr_id',
            tabIndex: 1
        },{
            x: 230, y: 150,
            width: 250, height: 40,
            xtype: 'textfield',
            inputType: 'password',
            hideLabel: true,
            name: 'pwd',
            tabIndex: 2
        }, {
            x: 230, y: 195,
            xtype: 'checkbox',
            hideLabel: true,
            boxLabel: '사용자ID 저장',
            name: 'save_id',
            tabIndex: 4
        }, {
            x: 170, y: 218,
            xtype: 'label',
            name: 'input_authnum_label',
            text: '인증번호',
            hidden: true,
            cls: 'certificat_label'
        }, {
            x: 230, y: 215,
            xtype: 'textfield',
            width: 215,
            hideLabel: true,
            fieldLabel: '인증번호',
            name: 'input_authnum',
            hidden: true
        }, {
            x: 455, y: 215,
            xtype: 'button',
            name: 'authentication',
            text: '인증하기',
            hidden: true
        }, {
            x: 535, y: 215,
            xtype: 'button',
            name: 'reOrder',
            text: '재요청',
            hidden: true
        }, {
            x: 168, y: 245,
            xtype: 'label',
            name: 'authnum_label',
            text: '임시번호 :',
            hidden: true
        }, {
            x: 230, y: 245,
            xtype: 'label',
            name: 'authnum',
            hidden: true
        }, {
            x: 300, y: 245,
            xtype: 'label',
            name: 'timer_label',
            text: '인증 대기 시간 :',
            hidden: true
        }, {
            x: 395, y: 245,
            xtype: 'label',
            text: '',
            name: 'timer'
        }, {
            x: 495, y: 100,
            text: '확인',
            width: 100, height: 90,
            xtype: 'button',
            name: 'login',
            tabIndex: 3,
            baseCls: 'login-btn',
            overCls: 'login-btn-over',
            style: {
                border: '5px solid #FFFFFF'
            }
        }, {
            x: 30, y: 275,
            xtype: 'radiogroup',
            hideField: true,
            cls: 'login-radio-button',
            defaults: {
                style: {
                    // border: '1px solid red'
                }
            },
            items: [
                {boxLabel: '<img src="resources/images/login/logo_ytn.png" alt="ytn">', name: 'type', inputValue: '001', checked: true, width: 105},
                {boxLabel: '<img src="resources/images/login/logo_science.png" alt="science">', name: 'type', inputValue: '004', width: 175},
                {boxLabel: '<img src="resources/images/login/logo_weather.png" alt="weather">', name: 'type', inputValue: '003', width: 180},
                {boxLabel: '<img src="resources/images/login/logo_dmb.png" alt="dmb">', name: 'type', inputValue: '002', width: 165}
            ]
        }]
    }],

    initComponent: function () {
        var me = this;

        me.addEvents('login');

        me.callParent();

        me.on('afterlayout', me.init);
        me.on('show', function(){
            me.down('textfield[name=usr_id]').focus();
        });

        me.down('textfield[name=usr_id]').on('specialkey', me.onCheckKey, me);
        me.down('textfield[name=pwd]').on('specialkey', me.onCheckKey, me);
        me.down('button[name=login]').on('click', me.onLogin, me);
        me.down('button[name=reOrder]').on('click', me.onLogin, me);
        me.down('button[name=authentication]').on('click', me.onCertificat, me);
        me.down('textfield[name=input_authnum]').on('specialKey', me.onEnter, me);
    },

    init: function() {

        //this.openViewport("", "mj", "송민정", "정치부", "1001", "001");
        //return;

        var me = this,
            saved;

        if (Ext.util.Cookies.get('session')) {
            //Ext.create('YSYS.view.Viewport');
            //me.close();

            UserInfo = new YSYS.ux.UserInfo(Ext.decode(Ext.util.Cookies.get('session')));

            me.openViewport(UserInfo.getToken(), UserInfo.getId(), UserInfo.getName(), UserInfo.getGroupName(), UserInfo.getGroupCode(), UserInfo.getChannelDivisionCode(), UserInfo.getRequireChangePwd(), UserInfo.getEmail(), UserInfo.getInphon_no(), UserInfo.getMphon_no());
            
        } else {
            saved = Ext.util.Cookies.get('saved');
            me.down('checkbox[name=save_id]').setValue(saved);

            if (saved === 'true') {

                me.down('textfield[name=usr_id]').setValue(Ext.util.Cookies.get('usr_id'));
                me.down('textfield[name=pwd]').setValue('');

                me.down('textfield[name=pwd]').focus();
            }
        }
    },

    onLogin: function() {
        var me = this;

        me.checkSaveId();

        var usr_id = me.down('textfield[name=usr_id]').getValue();
        var pwd = CryptoJS.SHA512(me.down('textfield[name=pwd]').getValue());
        var pwdString = pwd.toString(CryptoJS.enc.Hex);
        var ch_div_cd = me.down('radiogroup').getValue().type;

        if ( ! usr_id || ! pwd) {
            Ext.Msg.alert('알림', '아이디와 비밀번호를 입력해주세요.');
            return;
        }

        if ( ! ch_div_cd) {
            Ext.Msg.alert('알림', '채널을 선택해주세요.');
            return;
        }

        if (me.down('textfield[name=input_authnum]').setValue) {
            me.down('textfield[name=input_authnum]').setValue('');
        }

        var params = {
            usr_id: usr_id,
            pwd: pwdString,
            ch_div_cd: ch_div_cd
        };

        Ext.Ajax.request({
            method : 'POST',
            url: '/zodiac/user?cmd=getSelectLoginWeb',
            params: params,
            success: function(response) {
                var result = me.getDecodeResponseText(response.responseText);

                if (result.success !== true) {
                    Ext.Msg.alert('알림', result.msg);
                    return;
                }

                switch (Ext.Number.from(result.data.code)) {
                case 1:
                    me.login(result.data);
                    break;
                case 2:
                	Ext.Msg.show({
                		title: '알림',
                		msg: '사용자 암호 변경이 필요합니다. 사용자 암호를 변경하세요.',
                		buttons: Ext.Msg.OK,
                		fn: function(btn){
                			if(btn == 'ok'){
                				me.login(result.data);
                			}
                		}
                	});
                    break;
                case 40:
                    me.onRequireSMSAuth(result.data);
                    break;
                default:
                    Ext.Msg.alert('알림', response.responseText);
                    break;
                }
            },
            scope: this
        });
    },

    onCertificat: function(){
        var me = this,
            authnum = me.down('textfield[name=input_authnum]').getValue();
        if(!authnum){
            Ext.Msg.alert('알림', '인증번호가 입력되지 않았습니다.');
            return;
        }

        var usr_id = me.down('textfield[name=usr_id]').getValue();
        var pwd = CryptoJS.SHA512(me.down('textfield[name=pwd]').getValue());
        var pwdString = pwd.toString(CryptoJS.enc.Hex);
        var ch_div_cd = me.down('radiogroup').getValue().type;

        var params = {
            authnum: authnum,
            ch_div_cd: ch_div_cd,
            usr_id: usr_id,
            login_pass: "",
            auto_login_check: "",
            token: "",
            usr_ip: "",
            format: "JSON",
            lang: "KOR",
            os_type: "WEB"
        };

        Ext.Ajax.request({
            method : 'POST',
            url: '/zodiac/user?cmd=getSelectLoginAuth',
            params: params,
            success: function(response) {
                var result = {};

                result = me.getDecodeResponseText(response.responseText);

                if (result.success === true) {
                    me.stopTimer();
                    me.login(result.data);
                } else {
                    Ext.Msg.alert('확인', result.msg);
                }
            }
        });
    },

    startTimer: function(limitTimer){
        var me = this;
        var time = parseInt(limitTimer);//(me.limitTimer);
        
        me.task = {
            run: function(){
                if(time <= 0){
                    me.stopTimer();
                }

                var h = parseInt(time/3600);
                var m = parseInt((time%3600)/60);
                var s = time%60;

                if(h < 10){
                    h = '0'+h;
                }
                if(m < 10){
                    m = '0'+m;
                }
                if(s < 10){
                    s = '0'+s;
                }
                me.down('label[name=timer]').setText(h+':'+m+':'+s);
                time--;
            },
            interval: 1000
        };

        Ext.TaskManager.start(me.task);
    },

    stopTimer: function(){
        var me = this;
        Ext.TaskManager.stop(me.task);
        me.down('button[name=authentication]').setDisabled(true);
    },

    openViewport: function(token, usr_id, usr_nm, group_nm, group_cd, ch_div_cd, requireChangePwd, email, inphon_no, mphon_no){
    	
        var me = this,
            viewport,
            userInfo = {};

        Ext.apply(userInfo, {
            id: usr_id,
            name: usr_nm,
            ChannelDivisionCode: ch_div_cd,
            groupName: group_nm,
            groupCode: group_cd,
            token: token,
            requireChangePwd: requireChangePwd,
            email: email,
            inphon_no: inphon_no,
            mphon_no: mphon_no
        });

        UserInfo = new YSYS.ux.UserInfo(userInfo);

        Ext.util.Cookies.set('session', Ext.encode(userInfo));

        me.fireEvent('login', me);

        me.close();
    },

    checkSaveId: function(checkbox, value) {
        var me = this,
            usr_id, pwd, channel, saveId;

        saveId = me.down('checkbox[name=save_id]').getValue();

        if (saveId) {
            usr_id = me.down('textfield[name=usr_id]').getValue();
            pwd = me.down('textfield[name=pwd]').getValue();
            channel = me.down('radiogroup').getValue().type;

            Ext.util.Cookies.set('usr_id', usr_id);
            //Ext.util.Cookies.set('pwd', pwd);
            Ext.util.Cookies.set('channel', channel);
            Ext.util.Cookies.set('saved', true);
        } else {
            Ext.util.Cookies.clear('usr_id');
            //Ext.util.Cookies.clear('pwd');
            Ext.util.Cookies.clear('channel');
            Ext.util.Cookies.set('saved', false);
        }
    },

    onEnter: function(comp, e) {
        if (e.getKey() === e.ENTER) {
            this.onCertificat();
        }
    },

    getDecodeResponseText: function(text) {
        var result = {},
            json = {};

        Ext.log.info(text);

        try {
            json = Ext.decode(text);

            Ext.apply(result , json.result);
            Ext.apply(result , {
                data: json.data.record
            });

            return result;
        } catch (e) {
            Ext.Msg.alert('확인', '서버에 오류가 있습니다.');
        }
    },

    // SMS 인증
    onRequireSMSAuth: function(data) {
        var me = this;
        
        //인증번호 입력 필드
        me.down('label[name=input_authnum_label]').show();
        me.down('textfield[name=input_authnum]').show();
        me.down('textfield[name=input_authnum]').focus();
        //임시번호
        me.down('label[name=authnum_label]').show();
        me.down('label[name=authnum_label]').setText(data.authnum);
        //대기시간
        me.down('label[name=timer_label]').show();
        me.down('label[name=timer]').show();

        //인증하기 버튼
        me.down('button[name=authentication]').setDisabled(false);
        me.down('button[name=authentication]').show();
        //인증번호 재요청
        me.down('button[name=reOrder]').show();

        me.down('textfield[name=usr_id]').setDisabled(true);
        me.down('textfield[name=pwd]').setDisabled(true);
        me.down('checkbox[name=save_id]').setDisabled(true);
        me.down('button[name=login]').setDisabled(true);

        if(me.task){
            Ext.TaskManager.stop(me.task);
        }
        
        me.startTimer(data.limittime);
    },

    login: function(data) {
    	
        var token = data.token;
        var usr_id = data.user_id;
        var usr_nm = data.user_nm;
        var ch_div_cd = data.ch_div_cd;
        var group_cd = data.user_rprn_grp;
        var group_nm = data.group_nm;
        var requireChangePwd = "N";
        if(data.code == 2){
        	requireChangePwd = "Y";
        }
        var email = data.e_mail;
        var inphon_no = data.inphon_no;
        var mphon_no = data.mphon_no;

        this.openViewport(token, usr_id, usr_nm, group_nm, group_cd, ch_div_cd, requireChangePwd, email, inphon_no, mphon_no);
    },

    onCheckKey: function (field, e) {
        if (e.getKey() == e.ENTER) this.onLogin();
    }
});