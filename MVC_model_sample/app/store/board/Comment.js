Ext.define('YSYS.store.board.Comment', {
	extend: 'Ext.data.Store',
	model: 'YSYS.model.board.CommentModel',

	pageSize: 100,
	remoteSort : false,
	
	proxy: {
		type: 'ysysproxy',
		url: '/zodiac/board?cmd=getSelectBoardMCmnt'
	},

	sorters: [{
	    property: 'input_dtm',
	    direction: 'DESC'
	}]
});