Ext.define('YSYS.view.board.notice.sub.Summary', {
	extend: 'Ext.form.Panel',
	alias: 'widget.board-notice-summary',	
	
	layout: 'anchor',
//	border: true,
	frame: true,
	padding: 5,
	defaults: {
		readOnly : true,
		anchor: '95%',
		labelAlign: 'right',
		labelWidth: 50,					
	},
	defaultType: 'textfield',

    items: [{
        fieldLabel: '제목',
        readOnly : true,
        name: 'bbm_titl'
    },{
		xtype: 'fieldcontainer',
		layout: 'hbox',

		fieldLabel: '작성',

		defaults: {
			readOnly : true,
			xtype: 'textfield'
		},

		items: [{
			 name: 'inputr_nm'
		},{
			xtype: 'displayfield',							
			margin: '0 5 0 5'
		},{	
			 name: 'input_dtm'
		}]
	},{
		xtype: 'fieldcontainer',
		layout: 'hbox',

		fieldLabel: '수정',

		defaults: {
			readOnly : true,
			xtype: 'textfield'
		},

		items: [{	
			 name: 'updtr_nm'
		},{
			xtype: 'displayfield',			
			margin: '0 5 0 5'
		},{
			 name: 'updt_dtm'
		}]
	},{
    	xtype:'htmleditor',
    	enableAlignments : false,
    	enableColors : false,
    	enableFont : false,
    	enableFontSize : false,
    	enableFormat : false,
    	enableLinks : false,
    	enableLists: false,
    	enableSourceEdit: false,
    	readOnly : true,
        fieldLabel: '내용',
        name: 'bbm_ctt'
    },{    	
        fieldLabel: '첨부',
        xtype: 'fieldcontainer',
        name: 'files',
        
        layout: 'hbox',
    	items:[{
    		flex: 1,
    		fieldLabal: '첨부',
    		minHeight: 100
//    		,xtype: 'board-notice-attach'
    	},{
    		xtype:'button',
    		action: 'download',
    		width: 100,
    		text: '다운로드'
    	}]
        
        //layout: 'fit',
        //height: '200',
        //items:[{
        	//xtype: 'board-notice-attach'
        //}]
                
    }]
    
});