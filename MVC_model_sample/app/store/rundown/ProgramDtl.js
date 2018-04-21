Ext.define('YSYS.store.rundown.ProgramDtl', {
	extend: 'Ext.data.Store',

	model: 'YSYS.model.article.ListModel',
	remoteSort : false,
	
	proxy: {
		type: 'ysysproxy',
		url: '/zodiac/rundown?cmd=getSelectRundownDtlAdvanced',
		reader: {
			root: 'data.records'
		}
	}
});