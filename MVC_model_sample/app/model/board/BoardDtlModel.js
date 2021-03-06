 Ext.define('YSYS.model.board.BoardDtlModel', {
    extend: 'Ext.data.Model',
  
	fields: [
		'bb_id',
		'bb_nm',
		'bbm_ctt',
		'bbm_del_yn',
		//{name: 'bbm_expr_dtm', type: 'date', dateFormat: 'y-m-d'},
		{name: 'bbm_expr_dtm', convert: YSYS.ux.FieldConvert.dateFormatDate},
		'bbm_hits_cnt',
		'bbm_id',
		'bbm_titl',
		'bbm_writer',
		'ch_div_cd',
		'ch_div_nm',
		'chg_lck_yn',
		'cmnts',
		{name: 'cmnts', mapping: 'cmnts.cmnt', convert: YSYS.ux.FieldConvert.cmnts},
		{name: 'del_dt', mapping: 'del_dt', convert: YSYS.ux.FieldConvert.dateFormatDateTime_hi},
		{name: 'del_dtm', convert: YSYS.ux.FieldConvert.dateFormatDate},
		'delr_id',
		{name: 'files', mapping: 'files.file', convert: YSYS.ux.FieldConvert.files},
		'group_nm',
		'hrnk_bb_id',
		'hrnk_bbm_seq',
		{name: 'input_dt', mapping: 'input_dtm', convert: YSYS.ux.FieldConvert.dateFormatDateTime_hi},
		{name: 'input_dtm', convert: YSYS.ux.FieldConvert.dateFormatDate},
		'inputr_group_nm',
		'inputr_id',
		'inphone',
		'lck_dtm',
		'lck_user_id',
		'lck_user_nm',
		'mphone',
		'next_id',
		'noti_yn',
		'open_yn',
		'os_typ',
		'pre_id',
		'reply',
		'reply_id',
		'reply_cnt',
		'step',
		{name: 'updt_dt', mapping: 'updt_dtm', convert: YSYS.ux.FieldConvert.dateFormatDateTime_hi},
		{name: 'updt_dtm', convert: YSYS.ux.FieldConvert.dateFormatDate},
		'updtr_group_nm',
		'updtr_id',
		'updtr_nm',
		'urg_yn'
	]
 });