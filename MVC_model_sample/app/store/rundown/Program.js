Ext.define('YSYS.store.rundown.Program', {
	extend: 'Ext.data.Store',

	model: 'YSYS.model.rundown.ProgramModel',
	remoteSort : false,

	proxy: {
		type: 'ysysproxy',
		url: '/zodiac/rundown?cmd=getSelectRundownWithSch'
	}
});