Ext.define('YSYS.view.rundown.program.sub.List', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.rundown-program-list',

    sortableColumns : false,
//  border: false,
//  plain: true,

    style: {
        borderTopStyle: 'none',
        borderBottomStyle: 'none',
        borderLeftStyle: 'none'
    },

    selModel: {
       // selectionMode: 'MULTI'
    },

    viewConfig: {
    	stripeRows: false,
       getRowClass: function(record, index) {
            var css = '',
                rd_st_cd = record.get('rd_st_cd'),
                loc_yn = record.get('ord_chg_lckyn');
                
            if (loc_yn == 'Y') {
                css = 'rundown-lock';
            }

            switch (rd_st_cd) {
            case config.RUNDOWN_ST_READY:
                break;
            case config.RUNDOWN_ST_WORKING:
                break;
            case config.RUNDOWN_ST_BROADING:
                css = 'rundown-broading';
                break;
            case config.RUNDOWN_ST_DONE:
                css = 'rundown-broad-done';
                break;
            case config.RUNDOWN_ST_COMPLETE:
                break;
            }

            return css;
       }
    },

    columns: [{
        header: _text('COMMON_181'),
		style: 'text-align:center',
        xtype: 'rownumberer',
        width: 50,
        align: 'center', 
        menuDisabled: true
    },{
        header: '<img class="x-grid-row-icon" src="'+config.ORDER_LOCK_ICON_WHITE+'" align="middle">',
        cls: 'icon-header',
        dataIndex: 'ord_chg_lckyn',
		style: 'text-align:center',
        width: 50,
        align: 'center',
        editor: {
            allowBlank: false
        },
        renderer: function(value, metaData, record, row, col, store, gridView){
            if(value == 'Y'){
                metaData.tdCls = 'icon-cell';
                return '<img class="x-grid-row-icon" src="'+config.ORDER_LOCK_ICON+'">';
            }
            else{
                return '';
            }
        }, 
        menuDisabled: true
    }, {
        header: '<img class="x-grid-row-icon" src="'+config.PENCIL_ICON_WHITE+'" align="middle">',
        cls: 'icon-header',
        dataIndex: 'rd_edit_yn',
		style: 'text-align:center',
        width: 50,
        align: 'center',
        editor: {
            allowBlank: false
        },
        renderer: function(value, metaData, record, row, col, store, gridView){
            if(value == 'Y'){
                metaData.tdCls = 'icon-cell';
                return '<img class="x-grid-row-icon" src="'+config.PENCIL_ICON+'" >';
            }
            else{
                return '';
            }
        }, 
        menuDisabled: true
    }, {
        header: _text('MENU_005_02_031'),
        dataIndex: 'daily_pgm_nm',
		style: 'text-align:center',
        align: 'left',
        minWidth:250,
        flex: 1,
        renderer: function(value, metaData, record, row, col, store, gridView){
            if(value == ''){
                return record.get('brdc_pgm_nm');
            }
            else{
                return value;
            }
        }, 
        menuDisabled: true
    }, {
        header: _text('MENU_005_02_030'),
        dataIndex: 'brdc_dt',
		style: 'text-align:center',
        width: 100,
        align: 'center', 
        menuDisabled: true
    }, {
        header: _text('MENU_005_02_034'),
        dataIndex: 'brdc_start_clk',
		style: 'text-align:center',
        width: 100,
        align: 'center', 
        menuDisabled: true
    }, {
        header: _text('MENU_005_02_035'),
        dataIndex: 'brdc_end_clk',
		style: 'text-align:center',
        width: 100,
        align: 'center', 
        menuDisabled: true
    }, {
        header: _text('MENU_005_02_036'),
        dataIndex: 'stdio_nm',
		style: 'text-align:center',
        width: 100,
        align: 'center', 
        menuDisabled: true
    }, {
        header: _text('MENU_005_02_037'),
        dataIndex: 'subrm_nm',
		style: 'text-align:center',
        width: 100,
        align: 'center', 
        menuDisabled: true
    }, {
        header: _text('MENU_005_02_038'),
        dataIndex: 'articlecount',
		style: 'text-align:center',
        width: 80,
        align: 'center', 
        menuDisabled: true
    }, {
        header: _text('MENU_005_02_039'),
        dataIndex: 'rd_st_nm',
		style: 'text-align:center',
        width: 80,
        align: 'center',
        renderer: function(value, metaData, record, row, col, store, gridView){
        	if(value == ""){
        		return _text('MENU_008_01_007');
        	}
        	return value;
        }, 
        menuDisabled: true
    }],

    initComponent: function() {
		var me = this,
		 	store;
	     	
	    store = Ext.create('YSYS.store.rundown.Program');
		 
		Ext.apply(me, {
			store: store
		});

		this.callParent();
	 }
});