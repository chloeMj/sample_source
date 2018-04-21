Ext.define('YSYS.view.rundown.program.sub.popup.CaptionPreview', {
	extend: 'Ext.Window',
	alias: 'widget.rundown-program-sub-CaptionPreview',

	title: 'Caption Preview',
	modal: true,
	width: 600,
	height: 500,

	layout: 'fit',
	
	index: null,

	initComponent: function() { 
		var me = this;
		Ext.apply(this, {
			items: [{
				xtype: 'form',
				width: '100%',
				style: {
					borderStyle: 'none'
				},
				tbar: [{
					xtype: 'hidden',
					name: 'index'
				},{
					xtype: 'radiogroup',
					items: [
						{boxLabel: _text('COMMON_100'), name: 'searchType', width: 65, inputValue: 'all'},
						{boxLabel: _text('MENU_008_04_012'), name: 'searchType', width: 65, inputValue: 'article', checked: true}
					]
				},{
					flex: 1,
					xtype: 'label',
					name: 'artcl_titl',
					style: {
						'margin-left': '10px'
					}
				}],
				bbar: [{
					xtype: 'button',
					text: '<',
					action: 'prevCap'
				}, {
					xtype: 'button',
					text: '>',
					action: 'nextCap'
				}, '->', {
					xtype: 'button',
					text: _text('COMMON_003'),
					handler: function (btn) {
						btn.up('window').close();
					}				
				}],
				items: [{
					anchor: '100% 100%',
					xtype: 'panel',
					frame: false,
					border: true,
					name: 'showCap'
				}]
			}]
		}); 
		this.callParent(arguments); 
		
		me.on('show', me.onShowPopup, me);
		me.down('radiogroup').on('change', me.onSearchPrivewCap, me);
		me.down('button[action=prevCap]').on('click', me.onclickPrevBtn, me);
		me.down('button[action=nextCap]').on('click', me.onclickNextBtn, me);
	},
	
	getMain: function() {
		return Ext.getCmp('main-container').getActiveTab();
	},
	
	getSelected_RdDtlList: function(){
		var me = this,
			main = me.getMain(),
			select = main.down('grid').getSelectionModel().getSelection();
		
		return select;
	},
	
	getRdDtlRecordsWithIndex: function(index){
		var me = this,
			main = me.getMain(),
			records = main.down('grid').getStore().getAt(index);
		
		return records;
	},
	
	setWindowDatas: function(record){
		var me = this,
			radioValue = me.down('radiogroup').getValue(),
			index = parseInt(parseInt(me.down('[name=index]').getValue())),
			artcl_titl = '',
			src = '';
		
		if(!Ext.isEmpty(radioValue) && !Ext.isEmpty(radioValue.searchType)){
			if(radioValue.searchType == 'article'){
				var rd_ord_mrk = !Ext.isEmpty(record.get('rd_ord_mrk'))? '('+record.get('rd_ord_mrk')+')' : '';
				
				artcl_titl = rd_ord_mrk + record.get('artcl_titl');
				src = 'http://10.100.124.30:9200/zodiac/webAcs?cmd=capvw&rd_id='+record.get('rd_id')+'&rd_seq='+record.get('rd_seq')+'&next=web/preview.jsp'
				me.setVisible_btns(true);
			}
			else{ 
				src = 'http://10.100.124.30:9200/zodiac/webAcs?cmd=capvw&rd_id='+record.get('rd_id')+'&rd_seq=&next=web/preview.jsp'
				me.setVisible_btns(false);
			}
		}
		
		if(Ext.isEmpty(me.getRdDtlRecordsWithIndex(index-1))){
			me.down('button[action=prevCap]').disable();
		}
		else{
			me.down('button[action=prevCap]').enable();
		}
		if(Ext.isEmpty(me.getRdDtlRecordsWithIndex(index+1))){
			me.down('button[action=nextCap]').disable();
		}
		else{
			me.down('button[action=nextCap]').enable();
		}
		
		me.down('label[name=artcl_titl]').setText(artcl_titl);
		me.down('panel[name=showCap]').update('<iframe id="container" src="'+src+'" style="width: 100%; height: 100%; border: none;"></iframe>');
	},
	
	setVisible_btns: function(flag){
		var me = this;
		
		me.down('button[action=prevCap]').setVisible(flag);
		me.down('button[action=nextCap]').setVisible(flag);
	},
	
	onShowPopup: function(){
		var me = this,
			index = parseInt(me.down('[name=index]').getValue()),
			select = me.getRdDtlRecordsWithIndex(index);
			
		me.onSearchPrivewCap();
	},
	
	onSearchPrivewCap: function(radioGroup, value){
		var me = this,
			index = parseInt(me.down('[name=index]').getValue()),
			select = me.getRdDtlRecordsWithIndex(index);
			
		if(!Ext.isEmpty(select)){
			me.setWindowDatas(select);
		}
		else{
			me.down('label[name=artcl_titl]').setText('');
			me.down('panel[name=showCap]').update('');
		}
	},
	
	onclickPrevBtn: function(){
		var me = this,
			prevIndex = parseInt(me.down('[name=index]').getValue()),
			prevRecords;
		
		if(prevIndex > 0){
			prevIndex = prevIndex - 1;
			me.down('[name=index]').setValue(prevIndex);
			
			prevRecords = me.getRdDtlRecordsWithIndex(prevIndex);
			me.setWindowDatas(prevRecords);
		}
	},
	
	onclickNextBtn: function(){
		var me = this,
			nextIndex = parseInt(me.down('[name=index]').getValue()),
			totalLength = me.getMain().down('grid').getStore().getTotalCount(),
			nextRecords;
		
		if(nextIndex < totalLength-1){
			nextIndex = nextIndex + 1;
			me.down('[name=index]').setValue(nextIndex);
			
			nextRecords = me.getRdDtlRecordsWithIndex(nextIndex);
			me.setWindowDatas(nextRecords);
		}
	}
});
