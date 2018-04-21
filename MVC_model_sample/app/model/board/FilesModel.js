 Ext.define('YSYS.model.board.FilesModel', {
    extend: 'Ext.data.Model',
	
    uses: [
        'YSYS.model.board.BoardDtlModel'
    ],
    
	fields: [
		{name: 'file_id'},
		{name: 'file_nm'},
		{name: 'file_loc'},
		{name: 'file_size'}
	],
    
    proxy: {
        type: 'ysysproxy',
		url: '/zodiac/board?cmd=getSelectBoardMInfo'
    }
 });
