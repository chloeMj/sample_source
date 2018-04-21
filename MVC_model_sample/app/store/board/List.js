Ext.define('YSYS.store.board.List', {
	extend: 'Ext.data.Store',
	model: 'YSYS.model.board.BoardModel',

	pageSize: 100,
	remoteSort : false,
	
	proxy: {
		type: 'ysysproxy',
		url: '/zodiac/board?cmd=getSelectBoardM'
	}
});