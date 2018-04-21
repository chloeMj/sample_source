Ext.define('YSYS.view.home.popup.AccountPreferences', {
	extend: 'Ext.Window',
	alias: 'widget.home-AccountPreferences',
	requires: [
	   'YSYS.ux.field.email'
	],
	
	frame:false,
	modal: true,
	width: 400,
	height: 500,
	title: '개인정보 변경',
	layout: 'fit',
	resizable: false,
	closeFlag: false,
	items: [{
		xtype: 'form',
		border: 'false',
		frame:false,
		defaults: {
			anchor: '100%'
		},
		items: [{
			xtype: 'fieldset',
			title: '사용자 정보 변경',
			hidden:true,
			defaults: {
				anchor: '100%',
				labelWidth: 90,
				labelAlign: 'right'
			},
			items: [{
				xtype: 'ux-email',
				fieldLabel: '이메일 주소',
				name: 'email'
			},{
				fieldLabel: '휴대전화 번호',
				name: 'mphon_no',
				xtype: 'ux-phonenumberfield',
				format: "mobile",
				editFlag: true
			},{
				xtype: 'ux-numberfield',
				fieldLabel: '내선 전화번호',
				enableKeyEvents: true,
				name: 'inphon_no'
			}]
		},
		{
			xtype: 'fieldset',
			title: '운영자 공지',
			defaults: {
				anchor: '100%',
				labelWidth: 90,
				labelAlign: 'right'
			},
			items: [{ xtype: 'displayfield', value: '보안상의 이유로 지금<br/><br/>비밀번호를 변경해야 시스템을<br/><br/>사용할 수 있습니다.' }]
		}
		,{
			xtype: 'fieldset',
			title: '비밀번호 변경',
			layout: 'vbox',
			defaults: {
				width: '100%',
				labelWidth: 90,
				labelAlign: 'right'
			},
			items: [{
				xtype: 'textfield',
				fieldLabel: '사용자 ID',
				readOnly: true,
				name: 'usr_id'
			},{
				xtype: 'textfield',
				fieldLabel: '사용자명',
				readOnly: true,
				name: 'usr_nm'
			},{
				flex: 1,
				minHeight: 130,
				html: '<div style="line-height:20px; margin:15px; padding:0 10px;">비밀번호는 영문, 숫자 혼합하여 6자 이상 입력하세요.<br/>예) a2b5c4d<br/><span style="color:red;">", \', \\, ,는 사용 불가능</span><br/><br/>* 비밀번호 변경시에만 입력하세요.</div>',
			},{//class="pwdChangeStyle"
				xtype: 'textfield',
				inputType: 'password',
				fieldLabel: '기존 비밀번호',
				enableKeyEvents: true,
				name: 'origion_pwd'
			},{
				xtype: 'textfield',
				inputType: 'password',
				fieldLabel: '새 비밀번호',
				enableKeyEvents: true,
				name: 'new_pwd'
			},{
				xtype: 'textfield',
				inputType: 'password',
				fieldLabel: '비밀번호 확인',
				enableKeyEvents: true,
				name: 'new_pwd_confirm'
			}]
		}]
	}],
	buttons: [{
		text: '변경',
		action: 'updateUser'
	},{
		text: '닫기',
		handler: function(btn){
			btn.up('window').close();
		}
	}],
	
	initComponent: function() {
		var me = this;
		me.callParent();
		
		me.down('ux-email').down('textfield[name=email_id]').on('keypress', function(text, e){			
			if (e.getKey() === e.ENTER) {
				me.down('ux-email').down('combo[name=email_address_combo]').focus();
			}
		});
		
		
		me.down('ux-email').down('combo[name=email_address_combo]').on('keypress', function(text, e){
			if (e.getKey() === e.ENTER) {
				me.down('ux-phonenumberfield').down('combo[format=mobile][name=one]').focus();
			}
		});
		me.down('ux-phonenumberfield').down('combo[format=mobile][name=one]').on('keypress', function(text, e){
			if (e.getKey() === e.ENTER) {
				me.down('ux-phonenumberfield').down('ux-numberfield[name=two]').focus();
			}
		});
		me.down('ux-phonenumberfield').down('ux-numberfield[name=two]').on('keypress', function(text, e){
			if (e.getKey() === e.ENTER) {
				me.down('ux-phonenumberfield').down('ux-numberfield[name=three]').focus();
			}
		});
		me.down('ux-phonenumberfield').down('ux-numberfield[name=three]').on('keypress', function(text, e){
			if (e.getKey() === e.ENTER) {
				me.down('ux-numberfield[name=inphon_no]').focus();
			}
		});
		me.down('ux-numberfield[name=inphon_no]').on('keypress', function(text, e){
			if (e.getKey() === e.ENTER) {
				me.down('textfield[name=origion_pwd]').focus();
			}
		});
		me.down('textfield[name=origion_pwd]').on('keypress', function(text, e){
			if (e.getKey() === e.ENTER) {
				me.down('textfield[name=new_pwd]').focus();
			}
		});
		me.down('textfield[name=new_pwd]').on('keypress', function(text, e){
			if (e.getKey() === e.ENTER) {
				me.down('textfield[name=new_pwd_confirm]').focus();
			}
		});
		me.down('textfield[name=new_pwd_confirm]').on('keypress', function(text, e){
			if (e.getKey() === e.ENTER) {
				me.down('button[action=updateUser]').focus();
			}
		});
	}
	
	
});