Ext.define('YSYS.view.rundown.program.sub.popup.BrdcHistory', {
	extend: 'Ext.Window',
	alias: 'widget.rundown-program-sub-BrdcHistory',

	title: '방송이력',
	modal: true,
	width: 600,
	height: 300,

	layout: 'fit',

	initComponent: function() { 
		var me = this;
		var sm = Ext.create('Ext.selection.CheckboxModel');
		Ext.apply(this, {
			
			items: [{
				xtype: 'form',
				name: 'all',
				padding: 5,
				frame: true,
				layout: 'fit',
				defaultType: 'textfield',
				
				items: [{
					xtype: 'container',
					layout: 'border',
					items:[{
						region: 'north',
						xtype: 'container',
						layout: 'hbox',
						height: 20,
						items: [{
							xtype: 'label',
							name: 'prgmNm',
							text: '',
							flex: 1
						},{
							xtype: 'label',
							name: 'rowCnt',
							text: ''
						}]
					},{
						region: 'center',
						xtype: 'grid',
						columns:[{
							header: '순번',
							xtype: 'rownumberer',
							width: 30
						},{
							header: '방송일시',
							width: 100
						},{
							header: '프로그램명',
							width: 100
						},{
							header: '기사제목',
							flex: 1
						}]
					}]
				}],
				buttons: [{
					text: '닫기',
					handler: function (btn) {
						btn.up('window').close();
					}
				}]
			}]
		}); 
		this.callParent(arguments); 
	}
});
