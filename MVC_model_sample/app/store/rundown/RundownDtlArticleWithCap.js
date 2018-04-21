Ext.define('YSYS.store.rundown.RundownDtlArticleWithCap', {
	extend: 'Ext.data.Store',

	model: 'YSYS.model.rundown.ArticleModel',
	remoteSort : false,

	proxy: {
		type: 'ysysproxy',
		url: '/zodiac/rundown?cmd=getSelectRundownDtlArticleWithCap'
	}
	
});