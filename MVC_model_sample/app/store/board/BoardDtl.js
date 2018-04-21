Ext.define('YSYS.store.board.BoardDtl', {
	extend: 'Ext.data.Store',
	model: 'YSYS.model.board.BoardDtlModel',
	
	remoteSort : false,
	
	proxy: {
		type: 'ysysproxy',
		url: '/zodiac/board?cmd=getSelectBoardMInfo'
	}
});