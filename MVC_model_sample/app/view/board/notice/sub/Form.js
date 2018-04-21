Ext.define('YSYS.view.board.notice.sub.Form', {
	extend: 'Ext.form.Panel',
	alias: 'widget.board-notice-form',
	
	layout: {
		type: 'vbox',
		align : 'stretch',
		pack  : 'start'
	},
	
	style: {
		borderStyle: 'none'
	},
	
	border: false,
	frame: true,
	
    items: [{
    	xtype: 'fieldcontainer',
    	padding: 5,
    	layout: 'column',
    	
    	items: [{
    		xtype: 'hidden',
    		name: 'bb_id'
    	}, {
    		xtype: 'hidden',
    		name: 'bbm_id'
    	}, {
    		xtype: 'hidden',
    		name: 'ch_div_cd',
    		value: '001'
    	}, {
    		xtype: 'hidden',
    		name: 'usr_id',
    		value: 'admin'
    	}, {
    		xtype: 'textfield',
    		allowBlank : false,
			labelAlign: 'right',
			labelWidth: 60,					
    		fieldLabel: '제목',    		
			name: 'bbm_titl',
			columnWidth: .7
		}, {
			xtype: 'fieldcontainer',
			labelAlign: 'right',
			labelWidth: 45,					
			fieldLabel: '작성',
			defaultType: 'textfield',
			layout: 'column',
			
			items: [{
				width: 75,
				hidden: true,
				margin: '0 5 0 0',
				readOnly: true,
				name: 'create_dept_nm'
			}, {
				width: 100,
				margin: '0 5 0 0',
				readOnly: true,
				name: 'inputr_nm'
			}, {
				width: 100,
				margin: '0 5 0 0',
				readOnly: true,
				name: 'input_dtm',
			}]
		}, {
			xtype: 'fieldcontainer',
			labelAlign: 'right',
			labelWidth: 45,					
			fieldLabel: '수정',
			defaultType: 'textfield',
			layout: 'column',
			
			items: [{
				width: 100,
				margin: '0 5 0 0',
				readOnly: true,
				name: 'updtr_nm'
			}, {
				width: 100,
				margin: '0 5 0 0',
				readOnly: true,
				name: 'updt_dtm'
			}]
		}, {
			xtype: 'datefield',
			labelAlign: 'right',
			labelWidth: 60,					
			fieldLabel: '게시기간',
			margin: '0 10 0 10',
			name: 'bbm_expr_dtm',
			format: 'Y-m-d',
			value: Ext.Date.add(new Date(), Ext.Date.MONTH, 1)
		}, {
			xtype: 'tbfill'
		}, {
			xtype: 'button',
			margin: '0 10 0 0',
			text: '저장',
			action: 'save'
		}, {
			xtype: 'button',
			margin: '0 10 0 0',
			text: '취소',
			action: 'cancel'
		}, {
			xtype: 'button',
			margin: '0 10 0 0',
			text: '인쇄',
			action: 'print'
		}]    	
    }, {
    	xtype:'htmleditor',
    	allowBlank : false,
		labelAlign: 'right',
		labelWidth: 60,					
    	padding: 5,
        fieldLabel: '내용',
        name: 'bbm_ctt',
        flex: 1
    }, { 
    	xtype: 'fieldcontainer',
		labelAlign: 'right',
		labelWidth: 60,					
    	padding: 5,
    	layout: 'hbox',
    	fieldLabel: '첨부',
        
        items: [{
	    	xtype: 'dataview',
	    	style: {
	    		border: '1px solid red'
	    	},
	    	tpl: [
			    '<tpl for=".">',
			        '<div style="margin-bottom: 10px;" class="thumb-wrap">',
			          '<img src="{src}" />',
			          '<br/><span>{name}</span>',
			        '</div>',
		        '</tpl>'
		    ],
	        height: 100,
	        flex: 1,
	        trackOver: true,
	        overItemCls: 'x-item-over',
	        itemSelector: 'div.thumb-wrap',
	        emptyText: '첨부파일이 없습니다.',
	        store: Ext.create('Ext.data.ArrayStore', {
			   fields: [
			           {name: 'name'},
			           {name: 'url'},
			           {name: 'size', type: 'float'},
			           {name:'lastmod', type:'date', dateFormat:'timestamp'}
		        ]
	        })
        },{
        	xtype: 'fieldcontainer',
        	layout: 'vbox',
        	width: 120,
        	
        	items: [{
        		xtype: 'button',
        		width: 100,
    			margin: '0 10 10 10',
    			text: '파일추가',
    			action: 'addFile'
        	},{
        		xtype: 'button',
        		width: 100,
        		margin: '0 10 10 10',
    			text: '파일삭제',
    			action: 'delFile'
        	},{
        		xtype: 'button',
        		width: 100,
        		hidden: true,
        		margin: '0 10 10 10',
    			text: '다운로드',
    			action: 'download'        		
        	}]
        }]
//        layout: 'hbox',
//    	items:[{
//    		flex: 1,
//    		fieldLabal: '첨부',
//    		xtype:'grid',
//    		height: 100,
//    		border: false,
//    		plain: true,
//    		unstyled: true,
//    		hideHeaders : true,	
//    		forceFit: true,
//    		columns: [{
//    			header: '파일명',
//    			dataIndex: 'file_nm',    		
//    			align: 'left'
//    		}],
//    		store: Ext.create('Ext.data.ArrayStore', {
//    			fields: [
//    	             'file_id','file_loc','file_nm','file_size'
//    	         ]
//    	    })
//    	},{
//    		xtype: 'panel',
//    		width: 100,
//    		frame: true,
//    		 layout: {
//		        type: 'vbox',
//		        align: 'center'
//		    },
//    		items: [{
//        		xtype:'filefield',
//        		hideLabel: true,
//        		buttonOnly: true,
//        		width: 100,
//        		flex:1,
//        		action: 'addfile',    
//        		 buttonText: '파일추가',
//        		text: '파일추가'
//        	},{
//        		xtype:'button',
//        		width: 100,
//        		flex:1,
//        		action: 'delfile',        		
//        		text: '파일삭제'
//        	}
//    		        ]
//    	}
//    	] 
    }],
    
    buttons: [{
		text: '이전',
		hidden: true,
		name: 'preBoard',
		action: 'preBoard'
	}, {
		text: '다음',
		hidden: true,
		name: 'nextBoard',
		action: 'nextBoard'
	}, {
		text: '목록',
		hidden: true,
		name: 'backList',
		action: 'cancel'
	}],
    
    initComponent: function() {
    	this.callParent();
    }
});