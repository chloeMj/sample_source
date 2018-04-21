 Ext.define('YSYS.model.board.PrivateNoteDtl', {
    extend: 'Ext.data.Model',
    uses: [
        'YSYS.model.board.FilesModel'
    ],
  
	fields: [
		'del_dtm',
		'del_yn',
		{name: 'files', mapping: 'files.file', convert: YSYS.ux.FieldConvert.files},
		{name: 'input_dtm', convert: YSYS.ux.FieldConvert.dateFormatDate},
		'next_id',
		'note_ctt',
		'note_seq',
		'note_titl',
		'os_typ',
		'pre_id',
		{name: 'updt_dtm', convert: YSYS.ux.FieldConvert.dateFormatDate},
		'user_id',
		'user_nm'
	]
 });