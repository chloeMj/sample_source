Ext.define('YSYS.store.board.Notice', {
	extend: 'Ext.data.Store',
	pageSize: 100,
	remoteSort : false,
	model: 'YSYS.model.board.NoticeModel',
	proxy: {
		type: 'ajax',
		url: '/zodiac/board?cmd=getSelectBoardM&next=web/json.jsp',
		reader: {
			type: 'xml',			
			root: 'data',
			record: 'record',
			totalProperty  : 'totalcount',
		    successProperty: 'success'
		//	 totalRecords: '@totalcount'
			//total :'totalcount'

		}
	}
});