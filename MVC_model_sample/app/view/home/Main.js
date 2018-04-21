/*var todayIssueStore = Ext.create('YSYS.store.news.Issue');
var tomorrowIssueStore = Ext.create('YSYS.store.news.Issue');
var planNoticeStore = Ext.create('YSYS.store.board.List');
var noticeStore = Ext.create('YSYS.store.board.List');*/

var v_ch_div_cd = '';
var v_usr_id = '';
var v_infix = '';

Ext.define('YSYS.view.home.Main', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.home',

	requires: [
		'Ext.util.Cookies',
		'YSYS.ux.plugin.tab.Reload',
		'YSYS.store.news.Issue'
	],

	layout: 'border',
	iconCls: 'home',
	title: _text('MENU_000'),
	style: {
		border : '0px solid blue',
		'margin': '0px 0px 0px 0px'
	},
	
	items: [
	{
		xtype: 'box',
		id : 'mainPrame',
		autoEl: {
			tag: 'iframe',
			style: 'border:0px',
			src: '/zodiac/zodiac-workspace/zodiac-app/app/view/home/ysys.jsp'
		}
	}],
	
	initComponent: function() {
		var me = this;
		me.callParent();
	
		//me.down('button[action=new]', me.openNewForm, me);
		me.on('activate', me.onRefresh, me);
	},

	onRefresh: function(){
		var me = this,
			today = new Date();
		
		//me.onRefresh();
	},
	
	onRefresh: function(){
		
	}
});
