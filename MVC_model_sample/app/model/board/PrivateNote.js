 Ext.define('YSYS.model.board.PrivateNote', {
    extend: 'Ext.data.Model',
  
	fields: [
		{name: 'user_id'},
		{name: 'user_nm'},
		{name: 'note_seq'},
		{name: 'note_titl'},
		{name: 'note_ctt'},
		{name: 'attc_file_yn'},
		{name: 'input_dtm', convert: YSYS.ux.FieldConvert.dateFormatDateTime},
		{name: 'updt_dtm', convert: YSYS.ux.FieldConvert.dateFormatDateTime},
		{name: 'del_dtm', convert: YSYS.ux.FieldConvert.dateFormatDateTime},
		{name: 'del_yn'},
		{name: 'file_count'}
	]
 });