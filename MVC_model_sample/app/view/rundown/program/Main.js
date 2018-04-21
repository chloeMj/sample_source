Ext.define('YSYS.view.rundown.program.Main', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.rundown-program',

	requires: [
		//'Ext.grid.plugin.DragDrop'
	],
	
	layout: 'card',	

	title: _text('MENU_008_01'),
	border: false,
	plain: true,
    selModel: {
        selectionMode: 'SINGLE'
    },
    viewConfig: {
     //   plugins: {
     //       ptype: 'gridviewdragdrop'
     //   }
    },
    
	dockedItems: [{
		dock: 'top',
		xtype: 'toolbar',
		padding: '10 0 10 15',
		style : {
			background : '#F5F5F5'
		},
		items:[_text('COMMON_075'), {
			text: '<',
			group: 'change-date',
			action: 'previous-day'
		}, {
			xtype: 'datefield',
			format: 'Y-m-d',
			name: 'sdate',
			width: config.SEARCH_DATE_WIDTH,
			value: new Date(),
			listeners: {
				render: function(){
					var date = new Date();
					date.setMonth(date.getMonth() - 1);
					//this.setValue(date);
				}
			}
		},'~',{
			xtype: 'datefield',
			format: 'Y-m-d',
			name: 'edate',
			width: config.SEARCH_DATE_WIDTH,
			value: new Date()
		}, {
			text: '>',
			group: 'change-date',
			action: 'next-day'
		}, {
			text: _text('MSG_011'),
			group: 'change-date',
			action: 'today'
		}, ' ', _text('MENU_008_01_012'), {
			xtype: 'textfield',
			name: 'search_v',
			width: 250
		}, {
			text: _text('COMMON_069'),
			action: 'search'
		}, '->', {
			text: _text('COMMON_180'),
			action: 'print',
			hidden: false
		}]		
	}],
	
	items: [{
		xtype: 'panel',
		layout: 'border',
		border: false,
		
		items:[{
			xtype: 'rundown-program-list',
			region: 'center'
		}]
	}, {
		xtype: 'rundown-program-sub-Detail',
		hidden: true
	}, {
		xtype: 'form',
		title: 'test'
	}],
	
	initComponent: function() {
		var me = this;
		
		me.callParent();
		
		var controller = YSYS.getApplication().addController('rundown.Program');
	},
	 
	getSelection: function() {
		var me = this;
		 
		return me.down('rundown-program-list').getSelectionModel().getSelection();
	}
});