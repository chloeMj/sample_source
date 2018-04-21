 Ext.define('YSYS.model.rundown.CaptionsModel', {
    extend: 'Ext.data.Model',
	
    uses: [
        'YSYS.model.rundown.ArticleModel'
    ],
    
	fields: [
		{name: 'ln_no'},
		{name: 'cap_tmplt_id'},
		{name: 'cap_ctt'},
		{name: 'cap_tmplt_nm'},
		{name: 'cap_lttr_num'},
		{name: 'cap_ln_num'},
		{name: 'cap_cell_dlmtr'},
		{name: 'take_count'},
		{name: 'cap_class_cd'}
	],
    
    proxy: {
        type: 'ajax',
        url: '/zodiac/rundown?cmd=getSelectRundownDtlArticleWithCap&next=web/issue.jsp',
        reader: {
            type: 'xml',
            root: 'captions',
            record: 'caption'
        }
    },
    
    belongsTo: {
        model: 'YSYS.model.rundown.ArticleModel'
    }
 });