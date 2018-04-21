Ext.define('YSYS.store.board.Monitoring', {
	extend: 'Ext.data.Store',
	pageSize: 100,
	remoteSort : false,
	model: 'YSYS.model.board.MonitoringModel',
	proxy: {
		type: 'ajax',
		url: '/zodiac/board?cmd=getSelectBoardM&next=web/json.jsp',
		reader: {
			type: 'json',			
			root: 'data.record',
			//record: 'record', 
			totalProperty  : 'data.totalcount',
		    successProperty: 'result.success',
		    messageProperty: 'result.msg'
		}
	}
});