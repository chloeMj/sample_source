Ext.define('YSYS.view.board.notice.Main', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.board-notice',
	
	requires: [
        'YSYS.ux.board.Summary',
        'YSYS.ux.board.DetailView',
        'YSYS.ux.board.Editor',
        'YSYS.ux.board.writeForm',
        'YSYS.ux.LockInfo'
    ],
	
	title: _text('COMMON_048'),
	border: false,

	layout: 'card',	
	
	items: [{
		dockedItems: [{
			dock: 'top',
			xtype: 'toolbar',
			padding: '10 0 10 15',
			style : {
				background : '#F5F5F5'
			},
			items: [
			_text('COMMON_172'), {
				text: '<',
				group: 'change-date',
				action: 'previous-day'
			}, {
				xtype: 'datefield',
				name:'start_date',
				format: 'Y-m-d',
				width: config.SEARCH_DATE_WIDTH,
				value: Ext.Date.add(new Date(), Ext.Date.MONTH, -1)
			}, '~', {
				xtype: 'datefield',
				format: 'Y-m-d',
				name:'end_date',
				width: config.SEARCH_DATE_WIDTH,
				value: new Date()		
			},{
				text: '>',
				group: 'change-date',
				action: 'next-day'
			}, {
				text: _text('MSG_011'),
				group: 'change-date',
				action: 'today'
			}, {
				xtype: 'label'
			},{
				xtype: 'combo',
				name: 'search_type',
				editable: false,
				displayField: 'cd_nm',
				valueField: 'cd',
				value: 'ALL',
				store: Ext.create('Ext.data.ArrayStore', {
					fields: [
						'cd', 'cd_nm'
					],
					data: [
						['ALL', _text('COMMON_100')],
						['bbm_titl', _text('COMMON_038')],
						['bbm_writer', _text('COMMON_173')],
						['bbm_ctt', _text('COMMON_027')]
					]
				}),
				width: 80
			},{
				xtype: 'textfield',
				name: 'search_value',
				width: 190
			}, {
				xtype: 'button',
				action: 'search',
				text: _text('COMMON_069')
			}, {
				name: 'isdel',
				xtype: 'checkboxfield',
				boxLabel: _text('COMMON_174'),
				inputValue: 'Y',
				uncheckedValue: 'N',
				action: 'deleted',
				grant: "write",
				disabled: true 
			}
			]
		},{
			dock: 'top',
			xtype: 'toolbar',
			padding: '11 0 11 15',
			style : {
				background : '#CCCCCC'
			},
			items: [
			{
				text: _text('COMMON_175'),
				action: 'new',
				grant: "write",
				checkGrant: true,
				disabled: true 
			}, {
				text: _text('COMMON_176'),
				action: 'edit',
				group: 'disable',
				grant: "write",
				checkGrant: true,
				disabled: true
			}, '-', {
				text: _text('COMMON_028'),
				action: 'delete',
				disabled: true,
				group: 'disable',
				grant: "write",
				checkGrant: true,
				disabled: true
			}, {
				text: _text('COMMON_177'),
				action: 'undelete',
				disabled: true,
				group: 'disable',
				grant: "write",
				checkGrant: true,
				disabled: true
			}, '-', {
				text: _text('COMMON_178'),//게시
				action: 'publish',
				disabled: true,
				group: 'disable',
				grant: "notice",
				checkGrant: true,
				disabled: true
			}, {
				text: _text('COMMON_179'),//게시취소
				action: 'unpublish',
				disabled: true,
				group: 'disable',
				grant: "notice",
				checkGrant: true,
				disabled: true
			}, '->', {
				text: _text('COMMON_180'),
				action: 'print'
			}]
		}],
		
		xtype: 'panel',
		layout: 'border',
		border: false,
		items: [{
			xtype: 'ux-board-list',
			region: 'center'
		}, {
			xtype: 'ux-board-summary',
			panelType: 'summary',
			region: 'east',
			header : false,
			split: true,
			collapsible: true,
			collapsed: false,
			collapseMode : 'mini'
		}]
	}, {
	   xtype: 'ux-board-writeForm'
	}, {
		xtype: 'ux-board-detailview'
	}],
   
   initComponent: function() {
	   var me = this;
	   
	   me.callParent();
	   
	   me.down('button[action=new]', me.openNewForm, me);
	   
	   var controller = YSYS.getApplication().addController('board.Notice');
   },
   
   openNewForm: function() {
	   
   }
});