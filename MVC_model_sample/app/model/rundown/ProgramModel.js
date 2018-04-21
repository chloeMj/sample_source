 Ext.define('YSYS.model.rundown.ProgramModel', {
    extend: 'Ext.data.Model',

	fields: [
		'rd_id',
		'ch_div_cd',
		'ch_div_cd_nm',
		'brdc_pgm_id',
		'daily_pgm_nm',
		'brdc_pgm_sub_nm',
		'brdc_seq',
		{name: 'brdc_dt', convert: YSYS.ux.FieldConvert.dateFormatDate},
		'articlecount',
		//'brdc_start_clk',
		{name: 'brdc_start_clk', convert: YSYS.ux.FieldConvert.returnFormatTime},
		//'brdc_end_clk',
		{name: 'brdc_end_clk', convert: YSYS.ux.FieldConvert.returnFormatTime},
		'stdio_id',
		'stdio_nm',
		'subrm_id',
		'subrm_nm',
		'rd_div_cd',
		'rd_div_nm',
		'rd_st_cd',
		'rd_st_nm',
		'ord_chg_lckyn',
		'ord_chg_lckuser_id',
		'ord_chg_lckuser_nm',
		'rd_edit_yn',
		'edt_fnsh_yn',
		'brdc_pgm_nm'
	]
 });/**
 * New node file
 */
