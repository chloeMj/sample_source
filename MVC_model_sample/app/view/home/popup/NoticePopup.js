Ext.define('YSYS.view.home.popup.NoticePopup', {
	extend: 'Ext.Window',
	alias: 'widget.home-NoticePopup',
	
	requires: [
        'YSYS.ux.board.Summary'
    ],
	
	modal: true,
	width: 850,
	height: 600,
	title: '공지사항',
	layout: 'fit',
	
	items: [{
		xtype: 'form',
		layout: 'border',
		border: 'false',
		items: [{
			region: 'center',
			xtype: 'ux-board-summary',
			panelType: 'summary'
		}],
		buttonAlign: 'center',
		buttons: [{
			text: '닫기',			
			handler: function(btn){
				btn.up('window').close();
			}
		}]
	}],
	
	initComponent: function() {
	   var me = this;
	   
	   me.callParent();
	}
	
	
});