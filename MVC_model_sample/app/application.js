//console.log( Gemiso.config.print.boradcastPlan.organize.cm.script.list.href );
UserInfo = {
    isInstance: false
};

Options = {
    isInstance: false
};

Ext.define('YSYS.Application', {
    name: 'YSYS',

    extend: 'Ext.app.Application',

    paths: {
        'Ext.ux': 'resources/Ext.ux'
    },

    requires: [
        'YSYS.ux.FieldConvert',

        'YSYS.ux.field.CheckColumn',
        'YSYS.ux.TaskBarManager',
        'YSYS.ux.Options',
        'YSYS.ux.UserInfo',
        'YSYS.ux.Proxy',
        'YSYS.ux.Util',
        'YSYS.ux.Grant',
        'YSYS.ux.UserSearch',
        'YSYS.ux.ArtclUserSearch',
        'YSYS.ux.board.List',
        'YSYS.ux.field.ArtclDeptCombo',
        
        'YSYS.ux.article.List',
        'YSYS.ux.article.summary.TabPanel',
        'YSYS.ux.article.detailView',
        
        'YSYS.ux.editor.Panel',

        'overrides.grid.Panel',
        'overrides.grid.column.RowNumberer',
        'overrides.window.Window'
    ],

    views: [
        'Main',
        'Login'
    ],

    controllers: [
        'Menu',
        'Home',
        'message.Message'
    ],
    
    //autoCreateViewport: true,

    init: function() {
        var me = this;

        if (Ext.Date) {
            Ext.Date.monthNames = [_text('MONTH_01'), _text('MONTH_02'), _text('MONTH_03'), _text('MONTH_04'), _text('MONTH_05'), _text('MONTH_06'), _text('MONTH_07'), _text('MONTH_08'), _text('MONTH_09'), _text('MONTH_11'), _text('MONTH_12')];

            Ext.Date.dayNames = [_text('WEEK_01'), _text('WEEK_02'), _text('WEEK_03'), _text('WEEK_04'), _text('WEEK_05'), _text('WEEK_06'), _text('WEEK_07')];
        }

        if (Ext.util && Ext.util.Format) {
            Ext.apply(Ext.util.Format, {
                thousandSeparator: ',',
                decimalSeparator: '.',
                currencySign: '\u20a9',
                // Korean Won
                dateFormat: 'm/d/Y'
            });
        }

        Ext.util.Observable.observe(Ext.data.Connection, {
            beforerequest: function(conn, options, eOpts) {
                if (UserInfo.isInstance) {
                    Ext.applyIf(options.params, {
                        usr_id: UserInfo.getId(),
                        token: UserInfo.getToken(),
                        ch_div_cd: UserInfo.getChannelDivisionCode()
                    });
                }
				if(options.url.indexOf("getSelectMAM") < 0) {
					Ext.apply(options.params, me.getParams());
				}
            },

            requestcomplete: function(conn, response, options, eOpts) {
                var result = response.responseText;

                result = result || '';

                if (Ext.isEmpty(result) || result.toUpperCase() === 'NULL') Ext.Msg.alert(_text('MSG_016'), _text('MSG_017')+'(' + options.url + ')');
            },

            requestexception: function(conn, response, options, eOpts) {

                Ext.create('Ext.Window', {
                    title: options.url  + ' 요청 중 ' + response.status + ' 오류을 발견하였습니다.',

                    modal: true,
                    width: 600,
                    height: 400,
                    layout: 'fit',

                    items: [{
                        xtype: 'textarea',
                        value: "응답 값\n\n" + response.responseText
                    }]
                }).show();
            }
        });
        
        var isLogin = $(parent.document).contents().find('#isLoginText').text();
        if(isLogin == "success"){
			me.setOptions();
        	me.setUserInfo();
        }
        		
		$(parent.document).contents().find('#isLoginBtn').click(function(){
			//var isLogin = $(parent.document).contents().find('#isLoginText').text();
			me.setOptions();
			me.setUserInfo();
		});
                
    },

	setOptions: function(){
		var me = this;
		var options_obj = {};
		if(!localStorage) return;
		var config_options = localStorage.getItem('config_options');
		if(!config_options) return;

		var loginInfoObject = JSON.parse(config_options);
		for (var key in loginInfoObject){
			options_obj[key] = loginInfoObject[key];
		}

        var Options_menu = new YSYS.ux.Options();
		Options_menu.option = options_obj;
		Options = Options_menu.option;
	},
    
    setUserInfo: function(){
    	var me = this;
        var userInfo = {};
        Ext.apply(userInfo, {
            id: me.getCookie('id'),
            name: me.getCookie('name'),
            ChannelDivisionCode: me.getCookie('ChannelDivisionCode'),
            groupName: me.getCookie('groupName'),
            groupCode: me.getCookie('groupCode'),
            token: me.getCookie('token'),
            requireChangePwd: me.getCookie('requireChangePwd'),
            email: me.getCookie('email'),
            inphon_no: me.getCookie('inphon_no'),
            mphon_no: me.getCookie('mphon_no'),
            lang_cd: me.getCookie('lang_cd')
        });
        
        Ext.util.Cookies.set('session', Ext.encode(userInfo));
        
        UserInfo = new YSYS.ux.UserInfo(userInfo);
        
        me.onLogin();
    },
    
    getCookie: function(cname) {
		if(Ext.isEmpty(localStorage)) return;
    	var loginInfoObject = localStorage.getItem('loginInfo');
		return JSON.parse(loginInfoObject)[cname];
//	    var name = cname + "=";
//	    var ca = document.cookie.split(';');
//	    for(var i=0; i<ca.length; i++) {
//	        var c = ca[i].trim();
//	        if (c.indexOf(name) == 0) {
//	        	if(cname == 'name') return unescape(c.substring(name.length, c.length));
//	        	return c.substring(name.length, c.length);
//	        }
//	    }
//	    return "";
	},
	
    launch: function() {
        var me = this,
            login = Ext.create('YSYS.view.Login');

        login.on('login', me.onLogin, me);

        //login.show();
    },

    onLogin: function() {
        var me = this;


        // 권한 설정
        Ext.Ajax.request({
            url: '/zodiac/common?cmd=getSelectGrantPart',
            params: Ext.apply(me.getParams(), {
                usr_id: UserInfo.getId()
            }),
            callback: function(options, success, response) {
            	
                if (success) {
                    try {

                    	/*login 완료 후 새로고침시 초기에 Ext.data.Connection override 를 타지 않아 추가한 항목*/
                    	if(responseError(options, response)) {
	                        var result = Ext.decode(response.responseText);
	                        result = me.converterAuthJson(result);
	                        if (result.success === true) {
	                            var usr_grp = {
	                            	name: "",
	                            	code: ""
	                            };
	
	                            UserInfo.setAuth(result.data);
	                            
	                            if(!Ext.isEmpty(result.data.usr_grps)){
	                            	if(Ext.isArray(result.data.usr_grps)){
	                            		usr_grp.name = result.data.usr_grps[0].grp_nm;
	                            		usr_grp.code = result.data.usr_grps[0].grp_id;
	                            	}
	                            	else{
	                            		usr_grp.name = result.data.usr_grps.grp_nm;
	                            		usr_grp.code = result.data.usr_grps.grp_id;
	                            	}
	                            }
	                            UserInfo.setGroupName(usr_grp.name);
	                            UserInfo.setGroupCode(usr_grp.code);
	
	                            Ext.create('YSYS.view.Viewport');
	
								//document.title = 'Ysys-S ' + UserInfo.getName() +'(' + UserInfo.getId() + ') v.0.0.1.10';
	                            config.setLoginTime(new Date().toString());
	                            me.setChannelLogo(UserInfo.getChannelDivisionCode());
	
	                        } else {
		                            Ext.Msg.alert(_text('COMMON_164'), result.msg);
	                        }
                    	}
                    } catch (e) {
                        //console.log(e);
                        // Ext.Msg.show('Error', e.getMessage());
                    }
                }
            }
        });
        
        //파일 업로드 가능한 확장차 받아서 셋팅. 2014.11.12 g.c.Shin
        Ext.Ajax.request({
            url: '/zodiac/common?cmd=getSelectAttcExt',
			params: Ext.apply(me.getParams(), {
             	
			}),
            callback: function(options, success, response) {
            	if(response.responseText == 'null') return false;
            	var responseText = Ext.decode(response.responseText);
                if (responseText.result.success !== true &&
                        responseText.result.success !== 'true') {
                    Ext.Msg.alert(_text('COMMON_164')+'['+_text('MSG_018')+']', responseText.result.msg);
                    return false;
                }
                
                var record = responseText.data.record;
                
                for(var i=0; i<record.length; i++){
                	config.FILE_UPLOAD_MIME_ALL += '"' + record[i].attc_allow_ext.toLowerCase() + '",';
                	config.FILE_UPLOAD_CNT = record[i].up_cnt;
                	
                	/* 첨부파일구분(001:동영상, 002:이미지, 003:문서, 009:기타) */
                	if(record[i].attc_div_cd == '001'){
                		config.FILE_UPLOAD_MIME_VIDEO += '"' + record[i].attc_allow_ext.toLowerCase() + '",';
                	}else if(record[i].attc_div_cd == '002'){
                		config.FILE_UPLOAD_MIME_IMAGE += '"' + record[i].attc_allow_ext.toLowerCase() + '",';
                	}else if(record[i].attc_div_cd == '003'){
                		config.FILE_UPLOAD_MIME_DOC += '"' + record[i].attc_allow_ext.toLowerCase() + '",';
                	}else{
                		config.FILE_UPLOAD_MIME_OTHERS += '"' + record[i].attc_allow_ext.toLowerCase() + '",';
                	}
                }
                
                if(Ext.isEmpty(config.FILE_UPLOAD_CNT)){
                	config.FILE_UPLOAD_CNT = 0;
                }
            }
        });
        
        //session time select. 2014.11.13 g.c.Shin
        Ext.Ajax.request({
            url: '/zodiac/common?cmd=getSelectSession',
			params: Ext.apply(me.getParams(), {
             	
			}),
            callback: function(options, success, response) {
            	if(response.responseText == 'null') return false;
            	var responseText = Ext.decode(response.responseText);
                if (responseText.result.success !== true &&
                        responseText.result.success !== 'true') {
                    Ext.Msg.alert(_text('COMMON_164')+'['+_text('MSG_019')+']', responseText.result.msg);
                    return false;
                }
                
                var record = responseText.data.record;
                
                if(!Ext.isEmpty(record.sessiontime)){
                	config.LOG_OUT_TIME = record.sessiontime;
                }
            }
        });
        
        //      viewport.
    },

    getParams: function() {
        return {
            format: 'JSON2',
            os_type: 'WEB',
            lang: 'KO',
            next: 'web/json2.jsp'
        };
    },

    converterAuthJson: function(json) {
        var data = {};

        data = {
            auths: json.data.record.auths.auth,
            usr_grps: json.data.record.usr_grps.usr_grp
        };

        return {
            success: json.result.success,
            msg: json.result.msg,
            data: data
        };
    },

    setChannelLogo: function(channel) {
		return;
        var LogoComp = Ext.ComponentQuery.query('ux-image[itemId=channel-logo]')[0];
        var img_src = 'resources/images/channel/{0}.png';

        if (LogoComp) {
            LogoComp.setSrc(Ext.String.format(img_src, channel));
        }
    },
    
    getControllerwithName: function(aControllerName){
	    var iController = this.controllers.get(aControllerName);
	    
	    return iController;
    },
    
    addController: function(aControllerName){
	    var iController = this.controllers.get(aControllerName);
	
	    if ( !iController )
	    {    
	        var iController = this.getController(aControllerName);
			//iController.init();
	    }
	
	    return iController;
    }
});