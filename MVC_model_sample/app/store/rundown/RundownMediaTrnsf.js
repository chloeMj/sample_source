Ext.define('YSYS.store.rundown.RundownMediaTrnsf', {
	extend: 'Ext.data.Store',

	model: 'YSYS.model.rundown.RundownMediaTrnsfModel',
	remoteSort : false,

	proxy: {
		type: 'ysysproxy',
		url: '/zodiac/rundown?cmd=getSelectRundownMediaTrnsf'
	}
});