Ext.define('YSYS.view.rundown.program.sub.popup.Detail', {
	extend: 'Ext.form.Panel',
	alias: 'widget.rundown-program-sub-Detail',

	title: '런다운 상세보기',
	modal: true,
	width: 1000,
	height: 450,

	layout: 'fit',

	initComponent: function() { 
		var me = this;
		var sm = Ext.create('Ext.selection.RowModel',{ singleSelect: true });
	
		Ext.apply(this, {
		
			tbar: ['->'],
			
			items: [{
				xtype: 'form',
				layout: 'border',
				
				items: [{
					region: 'north',
					xtype: 'container',
					layout: 'vbox',
					defaults: {
						labelAlign: 'right',
						labelWidth: 60,
						flex: 1
					},
					items: [{
						xtype: 'container',
						layout: {
							type: 'hbox',
							align: 'stretch'
						},
						items:[{
							xtype: 'button',
							text: '방송이력',
							action: 'brdcHistory',
							style: {
								marginLeft: '5px',
								marginRight: '5px'
							}
						},{
							xtype: 'button',
							text: '기사이력',
							action: 'artclHistory',
							style: {
								marginRight: '5px'
							}
						},{
							xtype: 'button',
							text: 'ㅁㅁ',
							action: 'Dbpanel',
							style: {
								marginRight: '5px'
							}
						},{
							xtype: 'button',
							text: 'ㅁ',
							action: 'Onepanel',
							hidden: true,
							style: {
								marginRight: '5px'
							}
						},{
							xtype: 'button',
							text: '=',
							action: 'Cation',
							style: {
								marginRight: '5px'
							}					
						},{
							xtype: 'button',
							text: '새로고침',
							action: 'refresh',
							style: {
								marginRight: '5px'
							}
						},{
							xtype: 'combo',
							value: '인쇄',
							width: 70
						}]
					},{
						xtype: 'textfield',
	             	    name: 'pgmTitle',
	             	    readOnly: true,
	             	    width: '80%'
					},{
						xtype: 'container',
	             	    layout: {
			                type: 'hbox',
			                align: 'stretch'
			            },
						items:[{
							xtype: 'label',
							readOnly: true,
							text: 'PD'
						},{
							xtype: 'textfield',
							readOnly: true,
							name: 'pd1Nm',
							width: 80 
						},{
							xtype: 'textfield',
							readOnly: true,
							name: 'pd2Nm',
							width: 80
						},{
							xtype: 'label',
							text: 'ANC',
							padding: '0, 0, 0, 10'
						},{
							xtype: 'textfield',
							name: 'anc1Nm',
							readOnly: true,
							width: 80
						},{
							xtype: 'textfield',
							name: 'anc2Nm',
							readOnly: true,
							width: 80
						},{
							xtype: 'combo',
							readOnly: true,
							name: 'studioNm',
							width: 80,
							padding: '0, 0, 0, 10'
						},{
							xtype: 'combo',
							readOnly: true,
							name: 'subRmNm',
							width: 80
						}]
					}]
				},{
					region: 'center',
					xtype: 'grid',
					selModel: sm,
					store: 'YSYS.store.rundown.ProgramDtl',
					autoScroll: true,
					columns:[{
						header: '순번',
						xtype: 'rownumberer',
						width: 50
					},{
						header: '구분',
						width: 40,
						dataIndex: 'artcl_div_cd'
					},{
						header: '방송',
						width: 40,
						dataIndex: ''
					},{
						header: 'MC',
						width: 40,
						dataIndex: 'mc_st_cd'
					},{
						header: '제목',
						flex: 1,
						dataIndex: 'artcl_titl'
					},{
						header: '형식',
						width: 70,
						dataIndex: 'artcl_frm_cd'
					},{
						header: '기자',
						width: 80,
						dataIndex: 'rptr_nm'
					},{
						header: '그래픽',
						width: 80,
						dataIndex: 'cgcount'
					},{
						header: '영상',
						width: 80,
						dataIndex: 'cvcount'
						
					},{
						header: '소요시간',
						width: 70,
						dataIndex: 'videotime'
					},{
						header: '클립시간',
						width: 70,
						dataIndex: ''
					},{
						header: '방송횟수',
						width: 60,
						dataIndex: 'brdc_cnt'
					}]
				},{
					region: 'east',
					xtype: 'tabpanel',
					name: 'EastTab',
					hidden: true,
					width: 400,
					items:[{
						title: 'SNS'
					},{
						title: '내용'
					},{
						title: '의뢰상태(1/3)'
					},{
						title: '첨부(3)'
					}]
				}]
			}]
		}); 
		this.callParent(arguments); 
	}
});
