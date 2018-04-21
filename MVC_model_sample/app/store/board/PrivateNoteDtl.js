Ext.define('YSYS.store.board.PrivateNoteDtl', {
	extend: 'Ext.data.Store',
	model: 'YSYS.model.board.PrivateNoteDtl',
	
	pageSize: 10,
	remoteSort : false,
	
	proxy: {
		type: 'ysysproxy',
		url: '/zodiac/myapp?cmd=getSelectMyNoteInfo'
	}
});