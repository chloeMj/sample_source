Ext.define('YSYS.store.board.PrivateNote', {
	extend: 'Ext.data.Store',
	model: 'YSYS.model.board.PrivateNote',
	
	pageSize: 100,
	remoteSort : false,
	
	proxy: {
		type: 'ysysproxy',
		url: '/zodiac/myapp?cmd=getSelectMyNote'
	}
});