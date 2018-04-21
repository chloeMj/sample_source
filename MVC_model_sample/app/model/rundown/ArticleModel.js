 Ext.define('YSYS.model.rundown.ArticleModel', {
    extend: 'Ext.data.Model',
    uses: [
        'YSYS.model.rundown.CaptionsModel'
    ],

	fields: [
		'rd_id',
		'rd_seq',
		'ch_div_cd',
		'ch_div_nm',
		'rd_ord',
		'rd_ord_mrk',
		'rd_dtl_div_cd',
		'mc_st_cd',
		'cm_div_cd',
		'rd_dtl_div_nm',
		'mc_st_nm',
		'cm_div_nm',
		'artcl_id',
		'artcl_frm_cd',
		'artcl_frm_nm',
		'artcl_fld_cd',
		'artcl_fld_nm',
		'artcl_titl',
		'artcl_ctt',
		'rptr_id',
		'rptr_nm',
		'dept_cd',
		'dept_nm',
		'artcl_reqd_sec',
		'artcl_smry_ctt',
		'artcl_div_cd',
		'artcl_div_nm',
		'issu_id',
		'issu_seq',
		'issu_nm',
		'issu_dt',
		'lck_user_id',
		'lck_user_nm',
		'lck_dtm',
		'apprv_div_cd',
		'apprv_div_nm',
		'apprv_dtm',
		'apprvr_id',
		'apprvr_nm',
		'artcl_ord',
		'brdc_cnt',
		'org_artcl_id',
		'rpt_pln_id',
		'brdc_fnsh_yn',
		'urg_yn',
		'frnoti_yn',
		'embg_yn',
		'updt_lck_yn',
		'internet_only_yn',
		'sns_yn',
		'rpt_pln_id',
		'rpt_pln_id',
		'rpt_pln_id',
		'rpt_pln_id',
		'rpt_pln_id',
		'rpt_pln_id',
		'rpt_pln_id'
	],
	
	hasMany: {
        associationKey: 'captions',
        model: 'YSYS.model.rundown.CaptionsModel',
        name: 'captions'
    },

    proxy: {
        type: 'ajax',
        url: '/zodiac/rundown?cmd=getSelectRundownDtlArticleWithCap&next=web/issue.jsp',
        reader: {
            type: 'xml',
            root: 'data',
            record: 'record'
        }
    }
 });