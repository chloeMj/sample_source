Ext.define('YSYS.view.Main', {
	extend: 'Ext.container.Container',
	alias: 'widget.main',

	requires: [
		'YSYS.ux.Img',
		'Ext.util.Cookies',
		'YSYS.ux.LoginInfo'
	],

	layout: 'border',
	id: 'main',
	
	messageWin: null,

	initComponent: function () {
		var me = this;
		
		Ext.apply(me, {

			items: [{
				region: 'north',
				ui: 'main-menu',
				height: 87,
				items: [{
					flex: 1,
					id: 'main-message',
					xtype: 'container',
					cls: 'topbar',
					height: 37,
					usr_nm: '',
					notReadMsgCnt: '',
					tpl: Ext.create('Ext.XTemplate',
						'<div id="navtop">',
							'<div id="message-wrap">',
								'<div id="message">',
									'<span class="left"></span>',
									'<span class="left_new">',
									_text('COMMON_168'),
									'</span>',
									'<span class="right">{alertMessage}</span>',
									//'<span class="right">{message}</span>',
								'</div>',
							'</div>',

							'<div id="logo" style="cursor: pointer" action="goMain">',
								//'<img src="resources/images/login/tbs_',UserInfo.getChannelDivisionCode(),'_small_logo.png" alt="Logo" action="goMain" >',
								'<img src="resources/images/login/zodiac_sublogo.png" alt="Logo" action="goMain" >',
							'</div>',
							
							'{notReadMsgCnt}',
							
							'<div id="message-icon" action="msg">',
								'<img src="resources/images/bg_mail_new_white.png" alt="Logo" action="msg">',
							'</div>',

							'<div id="logout">',
								//'<img class="usrname-bg" src="resources/images/bg_user.png" alt="Logout">',
								'<div class="username">{usr_nm}</div>',
								/*
								'<span id="logout-btns">',
									// 개인정보수정 기능 제거. 2014.09.02 g.c.Shin 
									//'<img id="account-preferences" class="logbtn" src="resources/images/btn_config_s_nor.png" alt="account">',
									// ysys-v 링크 버튼 및 기능 추가. 2014.09.02 g.c.Shin 
									//'<img id="ysysv" class="ysysvbtn" src="resources/images/btn_ysysv.png" alt="ysysv">',
									
									'<img id="logout-btn" class="logoutbtn" src="resources/images/btn_logout_new.png" alt="logout">',
								'</span>',
								*/
								'<span id="logout-btns">',
									'<span id="logout-btn" class="logoutbtn" alt="logout">'+_text('MSG_006')+'</span>',
								'</span>',
							'</div>',
						'</div>'
					)
				},{
					xtype: 'panel',
					layout: 'border',
					height : 50,
					items: [{
						hidden: true,
						itemId: 'channel-logo',
						xtype: 'ux-image',
						region: 'west', 
						style:{
							padding : '0px'
							,'background-color' : '#464646'	/* 메뉴 배경색 지정. g.c.Shin 2014.08.29 */
						},
						height: 30,
						//src: 'resources/images/channel/001.png',
						src: 'resources/images/login/sub_logo_forweb.png',
						listeners: {
							load: function(self) {
								self.setWidth(self.imgEl.dom.naturalWidth);
							}
						}
					},{
						xtype: 'toolbar',
						region: 'center',
						height : 50,
						style: {
							'background-color' : '#464646'	/* 메뉴 배경색 지정. g.c.Shin 2014.08.29 */
							//'box-shadow': 'red 10px 10px 10px 10px inset'
							//,padding : '-20px'
							,border : '2px solid #464646'
						},
						items: [{
							xtype: 'button',
							text: "<font color=white>"+_text('MENU_002')+"</font>",
							iconCls : 'x-menu-board-icon',
							cls: 'top-menu-button',
							menu: {
								xtype: 'menu-board'
							}
						},{
							xtype: 'button',
							text: '<font color=white>'+_text('MENU_003')+'</font>',
							name: 'menu-issue',
							iconCls : 'x-menu-issue-icon',
							cls: 'top-menu-button',
							scope: this,
							menu: {
								xtype: 'menu-issue'
							}
						},{
							xtype: 'button',
							text: '<font color=white>'+_text('MENU_005')+'</font>',
							name: 'menu-article',
							iconCls : 'x-menu-article-icon',
							cls: 'top-menu-button',
							menu: {
								xtype: 'menu-article'
							}
						},{
							xtype: 'button',
							text: '<font color=white>'+_text('MENU_008')+'</font>',
							iconCls : 'x-menu-rundown-icon',
							cls: 'top-menu-button',
							menu: {
								xtype: 'menu-rundown'
							}
						},{
							xtype: 'button',
							text: '<font color=white>'+_text('MENU_004')+'</font>',
							iconCls : 'x-menu-plan-icon',
							cls: 'top-menu-button',
							menu: {
								xtype: 'menu-plan'
							}
						},{
						/*
							text: '<font color=white>의&nbsp;&nbsp;뢰</font>',
							iconCls : 'x-menu-order-icon',
							cls: 'top-menu-button',
							menu: {
								xtype: 'menu-order'
							}
						},{
						*/
							xtype: 'button',
							text: '<font color=white>'+_text('MENU_014')+'</font>',
							iconCls : 'x-menu-data-icon',
							cls: 'top-menu-button',
							menu: {
								xtype: 'menu-data'
							}
						},{
						/*
							text: '<font color=white>시청률</font>',
							iconCls : 'x-menu-rating-icon',
							cls: 'top-menu-button',
							menu: {
								xtype: 'menu-rating'
							}
						},{
						*/
							xtype: 'button',
							text: '<font color=white>'+_text('MENU_015')+'</font>',
							iconCls : 'x-menu-system-icon',
							cls: 'top-menu-button',
							menu: {
								xtype: 'menu-system'
							}
						/*
						},{
							xtype: 'button',
							text: '<font color=white>방송로그</font>',
							iconCls : 'x-menu-log-icon',
							cls: 'top-menu-button',
							menu: {
								xtype: 'menu-log'
							}
						*/
						}, '->', {
							cls : 'x-main-close',
							action: 'tab-close',
							hidden: true
						}
						/*}, {
							text: '쪽지',
							hidden: true,
							menu: {
								xtype: 'menu-message'
							}
						*/
						]
					}]
				}]
			},{
				id: 'main-container',
				region: 'center',
				xtype: 'tabpanel',
				tabPosition: 'bottom',
				items: [{
					xtype: 'home'
				}]
			}]
		});
		
		me.callParent();
		var requireChangePwd = UserInfo.getRequireChangePwd(),
			ch_div_cd = UserInfo.getChannelDivisionCode();
			
		if(requireChangePwd == 'Y'){
			me.onAccountPreferences();
		}
		
		var adminGrant = YSYS.ux.Grant.grantAdmin();
		
		Ext.each(me.query('toolbar menu'), function (menu) {
			if(adminGrant != 'true'){
				me.processGrant(menu);
			}
		});
		
		me.down('[id=main-message]').on('afterrender', me.onRenderMainMsg, me);
	},
	
	onRenderMainMsg: function(self){
		var me = this;
  
		var usr_nm = UserInfo.getName(),
			parentPanel = self.up( '[ui=main-menu]' ).up();
        
        self.usr_nm = usr_nm;
        
        me.setDontReadMsgCnt(UserInfo.getId());
        
        me.setMainMessage(UserInfo.getName(), '', '');
		
		me.down('[id=main-message]').getEl().on('click', function(e, target, eOpts){
			var me = this,
				action = target.getAttribute("action"),
				alt = target.getAttribute("alt");
			
			if(action == "msg"){
				var messageWin = Ext.create( 'YSYS.view.message.popup.messageBox' )
				
				messageWin.on('close', function(){
					me.messageWin = null;
				});
				me.messageWin = messageWin;
				me.messageWin.show();
			}
			else if(action == "goMain"){
				Ext.getCmp('main-container').setActiveTab(0);
			}
			else{
				if(alt == "logout"){
					me.onLogout();
				}
			}
		}, me);
/*        
        //인터페이스 서버 IP
        Ext.Ajax.request({
            url: '/zodiac/common?cmd=getSelectIfIp',
			params: {
	            format: 'JSON2',
	            os_type: 'WEB',
	            lang: 'KOR',
	            next: 'web/json2.jsp'
			},
            callback: function(options, success, response) {
            	if(response.responseText == 'null') return false;
            	var responseText = Ext.decode(response.responseText);
                if (responseText.result.success !== true &&
                        responseText.result.success !== 'true') {
                    Ext.Msg.alert('알림[I/F IP]', responseText.result.msg);
                    return false;
                }
                
                var record = responseText.data.record;
                if(!Ext.isEmpty(record.ip)){
                	var ip_arr = record.ip.split('//');
                	var ip_iso_arr = record.ip_iso.split('//');
                	
                	//
                	// 2014.11.10 송민정
                	// 로컬과 서버에서 return 받아오는 ip의 형식이 서로 다름
                	// http://가 붙는 경우가 있을 때가 있고 없을 때가 있음..
                	//
                	config.IFSERVER_IP = ip_arr[ip_arr.length - 1];
                	config.IFSERVER_IP_ISO = ip_iso_arr[ip_iso_arr.length - 1];
                	
                	//기사
					Ext.Loader.injectScriptElement('resources/websocket.js?dc=002', function(){
						// nothing
					});	
					
					//런다운
					Ext.Loader.injectScriptElement('resources/RundownWebsocket.js', function(){
						// nothing
					});
                }
            }
        });
*/
//socket
//기사
Ext.Loader.injectScriptElement('resources/websocket.js?dc=002', function(){
// nothing
});	
					
//런다운
Ext.Loader.injectScriptElement('resources/RundownWebsocket.js', function(){
// nothing
});
		
		/* 개인정보 수정 팝업 사용 안함. 2014.09.02 g.c.Shin
		Ext.get('account-preferences').on('click', function() {
			parentPanel.onAccountPreferences();
		});
		*/
	},

    getCookie: function(cname) {
		if(Ext.isEmpty(localStorage)) return;
    	var loginInfoObject = localStorage.getItem('loginInfo');
		return JSON.parse(loginInfoObject)[cname];
	},

	onAccountPreferences: function(){//변경버튼 동작은 YSYS.controller.Home.onUpdateUser
		
		Ext.Ajax.request({
			method : 'POST',
			url: '/zodiac/user?cmd=getSelectUserInfo',
			params: {
				user_id: UserInfo.getId(),
				del_yn: "N",
				sch_div_cd: UserInfo.getChannelDivisionCode()
			},
			success: function(response) {
				var responseText = Ext.decode(response.responseText);
				
				if(responseText.result.success && !Ext.isEmpty(responseText.data.record.user_id)){
			        UserInfo.setId(responseText.data.record.user_id);
			        UserInfo.setName(responseText.data.record.user_nm);
			        UserInfo.setChannelDivisionCode(responseText.data.record.ch_div_cd);
			        UserInfo.setGroupName(responseText.data.record.group_nm);
			        UserInfo.setGroupCode(responseText.data.record.group_id);
			        UserInfo.setEmail(responseText.data.record.e_mail);
			        UserInfo.setInphon_no(responseText.data.record.inphon_no);
			        UserInfo.setMphon_no(responseText.data.record.mphon_no);   			        
				}
				
				var preferences = Ext.create('YSYS.view.home.popup.AccountPreferences');
				//이메일
				if(!Ext.isEmpty(UserInfo.getEmail())){
					var email_arr = UserInfo.getEmail().split('@');
					preferences.down('[name=email]').down('[name=email_id]').setValue(email_arr[0]);
					preferences.down('[name=email]').down('[name=email_address_combo]').setValue(email_arr[1]);
				}
				
				//휴대폰
				var mphon_no_arr = UserInfo.getMphon_no();
				if(!Ext.isEmpty(mphon_no_arr)){
					mphon_no_arr = mphon_no_arr.split('-');
					preferences.down('[name=one]').setValue(mphon_no_arr[0]);
					preferences.down('[name=two]').setValue(mphon_no_arr[1]);
					preferences.down('[name=three]').setValue(mphon_no_arr[2]);
				}
				//내선전화
				preferences.down('textfield[name=inphon_no]').setValue(UserInfo.getInphon_no());
				//아이디
				preferences.down('textfield[name=usr_id]').setValue(UserInfo.getId());
				//이름
				preferences.down('textfield[name=usr_nm]').setValue(UserInfo.getName());
		
				preferences.show();
			}
		});
	},
	
	onLogout: function(){
		var me = this;
		parent.onbeforeunload = null;

		var saved = Ext.util.Cookies.get('saved');

		var params = {
				usr_id : UserInfo.getId(),
				ch_div_cd: UserInfo.getChannelDivisionCode(),
				token : UserInfo.getToken()
		};

	 	Ext.util.Cookies.clear('session');

		Ext.Ajax.request({
			method : 'POST',
			action: 'read',
			url: '/zodiac/user?cmd=getSelectLogout',
			params: params,
			success: function(response) {
				var data = Ext.decode(response.responseText);

				//사용자가 없습니다 라는 msg가 옴...
				if (data.result.success == true || data.result.success == 'true') {
//					Ext.Msg.alert('알림', data.result.msg);
					me.clearListCookies();
										
					$(parent.document).contents().find('#isLogin').val("1");
					$(parent.document).contents().find('#logoutBtn').trigger('click');
				}
			}
		});
	},	
	
	clearListCookies: function()
	{	
		var cookies = document.cookie.split(";");
		for (var i = 0; i < cookies.length; i++)
		{	
			var spcook = cookies[i].split("=");
			if(spcook[0].trim() != 'id' && spcook[0].trim() != 'ChannelDivisionCode' && spcook[0].trim() != 'saved'){
				this.deleteCookie(spcook[0]);
			}
		}
	},

	deleteCookie: function(cookiename)
	{
		var d = new Date();
		d.setDate(d.getDate() - 1);
		var expires = ";expires="+d;
		var name=cookiename;
		//alert(name);
		var value="";
		document.cookie = name + "=" + value + expires + "; path=/acc/html";					
	},

	processGrant: function (menu, e) {
		var me = this,
			plainVisibles = new Array(),
			menuVisible = false;
			
		Ext.each(menu.query('menuitem[appId]'), function (menuitem) {
			var visible = false,
				grant = _.findWhere(UserInfo.getAuth().auths, {app_id: Ext.Number.from(menuitem.appId), auth_id: '001'});

			switch (me.getAuthCls(grant)) {
			case '001': // 전체
			case '003': // 사용자
				visible = true;
				break;
			case '002': // 그룹
				visible = me.checkGroup(grant, UserInfo.getAuth().usr_grps);
				break;
			case '004': // 지정그룹
				visible = me.checkWhetherRole(grant.grps, UserInfo.getAuth().usr_grps);
				break;
			default:
				visible = false;
				break;
			}
			
			if(visible) menuVisible = true;
			if(!Ext.isEmpty(menuitem.subMenuId) && plainVisibles.indexOf(menuitem.subMenuId) < 0 && visible) plainVisibles.push(menuitem.subMenuId);

			menuitem.setVisible(visible);
		});
		
		Ext.each(menu.query('menuitem[plain][subMenuId]'), function (menuitem) {
			var visible = false;
			if(plainVisibles.indexOf(menuitem.subMenuId) > -1) visible = true;
			
			menuitem.setVisible(visible);
		});
		
		menu.ownerButton.setVisible(menuVisible);
	},

	checkWhetherRole: function (groups, users) {
		var result;

		users = Ext.Array.from(users);

		if (Ext.isEmpty(groups)) return false;

		// 전체 권한
		if (_.findWhere(users, {grp_id: config.ADMIN_GRANT})) return true;

		result = _.find(Ext.Array.from(groups.grp), function(group) {

			return _.findWhere(users, {grp_id: group.user_grp_id});

		});

		return Ext.isDefined(result);
	},

	checkGroup: function (group, users) {
		var result = false;
		
		//전체권한
		if (_.findWhere(users, {grp_id: config.ADMIN_GRANT})){
			return true;
		}
		//기사작성권한
		else if (group.app_id === config.GROUP_ARTICLE_WRITE) {
			result = _.findWhere(Ext.Array.from(users), {artcl_yn: 'Y'});			
			result = Ext.isDefined(result);
		}
		else{
			result = !Ext.isEmpty(Ext.Array.from(users));
		}

		return result;
	},

	getAuthCls: function (grant) {
		return (grant && grant.auth_cls_cd) ? grant.auth_cls_cd : '';
	},
	
	setDontReadMsgCnt: function(usr_id){
		var me = this;
		
		if(usr_id != UserInfo.getId()) return;
		
		Ext.Ajax.request({
			url: '/zodiac/common?cmd=getSelectMsgSt',
			params: { msg_st_cd: '002' },
			method : 'POST',
			success: function (response){
				var responseText = Ext.decode(response.responseText);
				if ( responseText.result.success != true){
					Ext.Msg.alert( _text('COMMON_164'), data.result.msg);
					return;
				}
				
				var record =  responseText.data.record;
				
				me.setMainMessage(UserInfo.getName(), '', record.cnt);
				
			}
		});
	},
	
	setMainMessage: function(usr_nm, alertMsg, msgCnt){
		var me = this,
			self = me.down('[id=main-message]'),
			notReadMsgCnt = '';
			
		if(!Ext.isEmpty(self.notReadMsgCnt) && parseInt(self.notReadMsgCnt) < parseInt(msgCnt)){
			var snd = new Audio("resources/sound/MessageAlarm.mp3" );
			snd.play();
		}
			
		self.notReadMsgCnt = msgCnt;
		self.usr_nm = usr_nm;
		
		notReadMsgCnt = (Ext.isEmpty(self.notReadMsgCnt) || parseInt(self.notReadMsgCnt) < 1)? '' : '<div id="message-cnt" action="msg">' + '<span class="notReadMsgCnt" action="msg">'+self.notReadMsgCnt+'</span>'+'</div>'
		
				
		self.update({
			alertMessage: alertMsg, //'속보 알림 기능 12월 중 오픈 예정입니다.',
			usr_nm: usr_nm + _text('SIDE_MENU_001'),
			notReadMsgCnt:  notReadMsgCnt
		});
	},
	
	dupLoginMsg: function(data){
		var me = this;
		if(UserInfo.getId() == data['userId'] && data['sessionId'].indexOf(loginStorage().sessId) >= 0 ) {
			config.AUTO_LOGOUT = false;
			logOutInfo();
			Ext.widget('ux-logininfo',{
				manualConfig : {
					msgTitle : data['msgTitle'],
					osType : data['osType'],
					connectionTime : data['connectionTime'].replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/,'$1-$2-$3 $4:$5:$6'),
					userIp : data['userIp']
				}
				
			}).show();
		}
	}
});