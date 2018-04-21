Ext.define('YSYS.view.board.notice.sub.List', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.board-notice-list',
	
	sortableColumns : false,
//	border: false,
//	plain: true,
	
	style: {
		borderTopStyle: 'none',
		borderBottomStyle: 'none',
		borderLeftStyle: 'none'
	},
	
    selModel: {
       // selectionMode: 'MULTI'
    },
    
    viewConfig: {
       
    },
    
	columns: [{
		xtype: 'rownumberer',
		header: '순번',	
		width: 50,
		align: 'center'
	}, {
		header: '제목',
		dataIndex: 'bbm_titl',
		flex:1,
		//width: 300,
		
		editor: {
			allowBlank: false
		}
	}, {
		header: '-',
		width: 30,
		dataIndex: 'isattach'
	}, {
		header: '게시여부',
		width: 80,
		dataIndex: 'open_yn',
		align: 'center'
	}, {
		header: '작성자',
		width: 80,
		dataIndex: 'inputr_nm',
		align: 'center'
	}, {
		header: '작성일시',
		width: 90,
		dataIndex: 'input_dtm',
		align: 'center'
	}, {
		header: '수정일시',
		width: 90,
		dataIndex: 'updt_dtm',
		align: 'center'
	}]

	,store: 'YSYS.store.board.groupBoard.Notice'

	,bbar: [{
        xtype: 'pagingtoolbar',
        store: 'YSYS.store.board.groupBoard.Notice',
        pageSize: 100,
       // dock: 'bottom',
        displayInfo: true
    }]
});