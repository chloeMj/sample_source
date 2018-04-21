Ext.define('YSYS.view.rundown.program.sub.popup.ArtclHistory', {
	extend: 'Ext.Window',
	alias: 'widget.rundown-program-sub-ArtclHistory',

	title: '기사이력',
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
						height: 20,
						items:[{
							xtype: 'button',
							name: 'refresh',
							text: '새로고침'
						}]					
					},{
						region: 'center',
						xtype: 'tabpanel',
						items: [{
							title: '대체기사',
							xtype: 'grid',
							columns: [{
								header: '순번',
								xtype: 'rownumberer',
								width: 30
							},{
								header:'',
								width: 30
							},{
								header:'구분',
								width: 30
							},{
								header:'이슈',
								width: 80
							},{
								header:'부서',
								width: 80
							},{
								header:'제목',
								flex: 1
							},{
								header:'형식',
								width: 50								
							},{
								header:'기자',
								width: 80
							},{
								header:'영상',
								width: 80
							},{
								header:'그래픽',
								width: 80
							},{
								header:'작성일시',
								width: 150
							},{
								header:'작성자',
								width: 80
							}]
						},{
							title: '관련기사',
							xtype: 'grid',
							columns: [{
								header: '순번',
								xtype: 'rownumberer',
								width: 30
							},{
								header:'',
								width: 30
							},{
								header:'구분',
								width: 30
							},{
								header:'이슈',
								width: 80
							},{
								header:'부서',
								width: 80
							},{
								header:'제목',
								width: 200
							},{
								header:'형식',
								width: 50								
							},{
								header:'기자',
								width: 80
							},{
								header:'영상',
								width: 80
							},{
								header:'그래픽',
								width: 80
							},{
								header:'작성일시',
								width: 150
							},{
								header:'작성자',
								width: 80
							}]
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
