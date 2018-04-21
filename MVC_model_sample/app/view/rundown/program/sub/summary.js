Ext.define('YSYS.view.rundown.program.sub.summary', {
	extend: 'Ext.tab.Panel',
	alias: 'widget.rundown-program-summary',

	modal: true,

	initComponent: function() { 
	
		Ext.apply(this, {
					
			items:[{
						title: 'SNS'
					},{
						title: '내용',
						name: 'contents',
						xtpye: 'container',
						layout: {
							type: 'vbox',
							align: 'stretch'
						},
						
						items: [{
							height: 100,
						}, {
							flex: 1,
							xtype: 'editor',
							editorConfig: {
								readOnly: true,
								gutters: ''
							}
						}]
					},{
						title: '의뢰상태(1/3)'
					},{
						title: '첨부(3)'
					}]
		}); 
		this.callParent(arguments); 
	}
});
