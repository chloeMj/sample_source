Ext.define('YSYS.controller.Home', {
	extend: 'Ext.app.Controller',

    requires: [
    	'Ext.util.Cookies'
    ],

	views: [
	    'home.Main',
	    'home.popup.AccountPreferences'
	], 

	refs: [{
		ref: 'Main',
		selector: 'main'
	},{
		ref: 'Preferences',
		autoCreate: true,
		xtype: 'home-AccountPreferences',
		selector: 'home-AccountPreferences'
	}],

	init: function () {
		this.control({
			'main': {
				render: this.onInit
			},
			'main tabpanel[id=main-container]': {
//				'main tabpanel': {
				add: this.onTabAdd,
				remove: this.onTabRemove,
				tabchange: function ( view, eOpts ) {
					var me = this;
					var AjaxLoadMask = Ext.getCmp('AjaxLaodMask');
					
		        	myMask = (AjaxLoadMask)?AjaxLoadMask.hide():new Ext.LoadMask(Ext.getBody(), {id:'AjaxLaodMask',msg:_text('COMMON_200')}).hide();
		        	
		        	me.closeButton(me);
				}
			},
			'button[action=tab-close]': {
				click: this.onTabClose
			},
			
			'home-AccountPreferences': {
				close: this.onCloseUpdateUserPopup
			},

			'home-AccountPreferences button[action=updateUser]': {
				click: this.onUpdateUser
			},
			'main grid[name=notice]': {
				selectionchange: this.onSelectNotice,
				itemdblclick: this.onDblClickNotice
			},
			'main grid[name=planNotice]': {
				selectionchange: this.onSelectNotice,
				itemdblclick: this.onDblClickPlanNotice
			}
		});
	},
	
	getNoticeTabpanel: function(){
		var me = this;
		return me.getMain().down('tabpanel[name=noticePanel]');
	},

	onInit: function(){
		var me = this;
	},

	onTabClose: function() {
		var me = this,
			comp = me.getMain().down('tabpanel').getActiveTab();
		if (comp.xtype !== 'home' && comp.close) {
			comp.close();
		}
	},

	onTabAdd: function(tapanel, component, index, eOpts) {
		var me = this;
		me.closeButton(me);
	},
	onTabRemove: function(tapanel, component, eOpts) {
		var me = this;
		if(component.xtype == 'rundown-program-sub-Detail') {
			var rundownpanel = tapanel.down('rundown-program');
			if(!Ext.isEmpty(rundownpanel)){
				var rundownController = YSYS.getApplication().getController('rundown.Program');
				var searchButton = rundownpanel.down('button[action=search]');
				rundownController.onHandlerSearch(searchButton);
			}
		}
		me.closeButton(me);
	},
	onCloseUpdateUserPopup: function(){
		var me = this;
		
		//2015.04.14 mj.song
		//변경이 완료되지 않은 경우에 팝업 창을 닫을 경우 로그아웃 처리
		if(!me.getPreferences().closeFlag){
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
					if (data.result.success == true || data.result.success == 'true') {
						me.clearListCookies();
											
						$(parent.document).contents().find('#isLogin').val("1");
						$(parent.document).contents().find('#logoutBtn').trigger('click');
					}
				}
			});
		}

		return true;
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
	
	onUpdateUser: function(){
		var me = this;
		var form = me.getPreferences().down('form').getForm();
		var userValues = form.getValues();


		if(userValues.origion_pwd != ""){
			//비밀번호
			if(userValues.new_pwd == '' && userValues.new_pwd_confirm == ''){
				Ext.Msg.alert('알림', '비밀번호는 영문, 숫자 혼합하여 6자 이상 입력하세요.');
				return;
			}
			else if(userValues.origion_pwd == ''){
				Ext.Msg.alert('알림', '기존 비밀번호를 입력해 주세요.');
				return;
			}
			else if(userValues.new_pwd == ''){
				Ext.Msg.alert('알림', '신규 비밀번호를 입력해 주세요.');
				return;
			}
			else if(userValues.new_pwd_confirm == ''){
				Ext.Msg.alert('알림', '비밀번호 확인 정보를 입력해 주세요.');
				return;
			}
			else if(userValues.new_pwd != userValues.new_pwd_confirm){
				Ext.Msg.alert('알림', '신규로 변경될 비밀번호가 서로 다릅니다.');
				return;
			}
			else if(userValues.origion_pwd == userValues.new_pwd){
				Ext.Msg.show({
				    title: '알림',
				    msg: '현재와 같은 비밀번호로는 변경할 수 없습니다.',
				    buttons: Ext.Msg.OK,
				    fn: function(){
				    	me.getPreferences().down('textfield[name=new_pwd]').focus();
				    }
				});
				return;
			}
			else{
				var checkFlag = me.check_pwd(userValues.new_pwd);
				if(!checkFlag){
					Ext.Msg.alert('알림', '비밀번호는 영문, 숫자 혼합하여 6자 이상 입력하세요.');
					return;
				}
			}
			
				
			var origion_pwd = CryptoJS.SHA512(userValues.origion_pwd);
			var origionPwdString = origion_pwd.toString(CryptoJS.enc.Hex);

			//origionPwdString = userValues.origion_pwd;
	
			var new_pwd =  CryptoJS.SHA512(userValues.new_pwd);
			var newPwdString = new_pwd.toString(CryptoJS.enc.Hex);

			newPwdString = userValues.new_pwd;
		}
		else{
			Ext.Msg.alert('알림', '비밀번호를 입력해 주세요.');
			return;
		}

		//이메일
		var email = me.getPreferences().down('[name=email]').getValue();
		if(email == '@'){
    		Ext.Msg.alert('알림', '이메일 주소를 확인해 주세요.');
    		return false;
    	}    	
    	userValues.email = email;

		//휴대전화번호
		var mphon_no = me.getPreferences().down('[name=mphon_no]').getValue();
		if(!me.check_num(mphon_no)){
			Ext.Msg.alert('알림','휴대번번호를 확인해주세요');
			return ;
		}
		userValues.mphon_no = mphon_no;
		//내선전화번호
		var inphon_no = me.getPreferences().down('[name=inphon_no]').getValue();
		userValues.inphon_no = inphon_no;

		var params = {
			mphon_no: userValues.mphon_no,
			inphon_no: userValues.inphon_no,
			e_mail: userValues.email,
			old_pwd: origionPwdString,
			new_pwd: newPwdString,
			rmk: "",
			lang_cd: UserInfo.getLang_cd()
		};

		Ext.Ajax.request({
			method : 'POST',
			url: '/zodiac/user?cmd=putUpdateUser',
			params: params,
			success: function(response) {
				var responseText = Ext.decode(response.responseText);
				if(responseText.result.success != "true" && responseText.result.success !== true){
					return;
				}

				me.getPreferences().closeFlag = true;
	
				Ext.Msg.alert('알림', '수정되었습니다.');
				me.getPreferences().close(); // 개인정보 수정 팝업 닫기
			}
		});
	},
	
	closeButton : function (me) {
		var tab = me.getMain().down('tabpanel');
		
		if( (Ext.isEmpty(tab.items)) ? false:
				(Ext.isEmpty(tab.getActiveTab())) ? false:
				(Ext.isEmpty(tab.getActiveTab().xtype))? false:true) {
			if (tab.items.getCount() > 1 && tab.getActiveTab().xtype !== 'home'){
				me.getMain().down('button[action=tab-close]').setVisible(true);
			}else{
				me.getMain().down('button[action=tab-close]').setVisible(false);
			}
		}else{
			me.getMain().down('button[action=tab-close]').setVisible(false);
		}
	},

	check_num: function(num){
		var phone_num = /^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})-?([0-9]{3,4})-?([0-9]{4})$/;

		if (!phone_num.test(num)) {
			return false;
    	}
    	return true;
	},

	check_pwd: function(pwd){
		var eng = /[a-zA-Z]/;
		var num = /[0-9]/;

    	if (!eng.test(pwd)) {
			return false;
    	}
    	else if (!num.test(pwd)) {
			return false;
    	}
    	else if (pwd.length < 6) {
    		return false;
    	}
		return true;
	},
	
	onSelectNotice: function(selModel, records){
		var me = this;
		
		if(YSYS.ux.Util.isMobile()){
	        var menu = Ext.create('Ext.menu.Menu', {
	            items: [{
	                text: records[0].get('bbm_titl') + ' 상세보기',
	                handler: function() {
	                	var grid = me.getNoticeTabpanel().getActiveTab();
	                	var records = grid.getSelectionModel().getSelection();
	                	
	                	if(Ext.isArray(records) && records.length > 0){
	                		me.showNoticePopup(records[0]);
	                	}
	                }
	            }]
	        });
	
	        menu.showAt(Ext.get(selModel.view.focusedRow).getXY());
	    }
	},
	
	onDblClickNotice: function(grid, record){
		var me = this;
		
		me.showNoticePopup(record);
	},
	
	onDblClickPlanNotice: function(grid, record){
		var me = this;
		
		me.showNoticePopup(record);
	},
	
	showNoticePopup: function(record){
		var me = this;
	
		if(!me.noticePopup){
			var noticePopup = Ext.create('YSYS.view.home.popup.NoticePopup');
			noticePopup.on('beforeclose', function(){
				me.noticePopup = null;
			});
			
			me.noticePopup = noticePopup;
		}	
			
		var formStore = Ext.create('YSYS.store.board.BoardDtl');
		
		formStore.load({
		    params:{
				bb_id: record.get('bb_id'),
				bbm_id: record.get('bbm_id')
		    },
		    callback: function(records, operation, success){
		    	if (records && records.length > 0) {
	                noticePopup.down('ux-board-summary').load(records[0]);
	                noticePopup.show();
		    	}
		    }
		});
	},
	
	onSelectPlanNotice: function(selModel, records){
	}
});
