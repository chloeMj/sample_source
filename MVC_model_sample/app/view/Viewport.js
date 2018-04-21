Ext.define('YSYS.view.Viewport', {
	extend: 'Ext.container.Viewport',

	layout: 'card',

	items: [{
		xtype: 'main'
	},{
		xtype: 'login'
	}],

	initComponent: function() {
		var me = this;

		this.callParent(arguments);

		if ( YSYS.ux.Util.isMobile()) {
			me.autoScroll = true;
		}
	},

	onRender: function() {
		var me = this;
		var v_screenWidth = window.screen.Width;
		var v_screenHeight = window.screen.Height;
		
		this.callParent(arguments);

		if ( YSYS.ux.Util.isMobile()) {
			me.width = '100%';
			me.minHeight = '100%';
			
			/* 탭 및 모바일 화면의 경우 최소 사이즈 이하의 화면 사이즈는 스크롤이 생기도록 적용. 2014.11.03 g.c.Shin */
			if(v_screenWidth < 1366){
				me.minWidth = 1366;
				me.minHeight = 768;
			}
		}
	},

	afterFirstLayout: function() {
		var me = this;

		if ( ! YSYS.ux.Util.isMobile()) {
			setTimeout(function() {
				Ext.EventManager.onWindowResize(me.fireResize, me);
			}, 1);
		}
	}
});