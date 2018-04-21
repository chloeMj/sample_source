Ext.define('YSYS.controller.rundown.ArticleReferRundown', {
	extend: 'Ext.app.Controller',
	requires: ['YSYS.ux.ProgressBarColumn'],

	models: [
		'YSYS.model.rundown.ProgramModel',
		'YSYS.model.rundown.ProgramDtlModel'
	],

	stores: [
		'YSYS.store.rundown.Program',
		'YSYS.store.rundown.ProgramDtl',
		'YSYS.store.rundown.RundownDtlArticleWithCap',
		'YSYS.store.rundown.RundownMediaTrnsf'
	],

	views: [
        'rundown.articleRefer.Main',
        'rundown.articleRefer.popup.Program',
        'rundown.articleRefer.popup.ProgramList'
	],

	refs: [{
		ref: 'program',
		selector: 'article-refer-rundown-program',
		xtype: 'article-refer-rundown-program',
		autoCreate: true
	}, {
		ref: 'programList',
		selector: 'article-refer-rundown-programlist',
		xtype: 'article-refer-rundown-programlist'
	}],

	init: function() {
		this.control({
			'article-refer-rundown': {
				// 추후 런다운내의 내용을 기사작성기로 가져올때 권한이 필요함
				render: this.onInit
			},
			//refresh
			'article-refer-rundown button[action=refresh]' : {
				click: this.refresh
			},
			// 프로그램선택 클릭
			'article-refer-rundown button[action=select_program]': {
				click: this.onOpenProgram
			},
			//copy_to_artcl 기사로 복사
			'article-refer-rundown button[action=copy_to_artcl]': {
				click: this.copyToArtcl
			},
			// 검색창 enter 키 입력
			'article-refer-rundown-program textfield[name=search_v]': {
				specialkey : this.onPressEnter
			},
			// 검색 클릭
			'article-refer-rundown-program button[action=search]': {
				click: this.onHandlerSearch
			},
			
			'article-refer-rundown grid[name=detailList]': {
				selectionchange: this.onSelectRundownList,
				itemdblclick: this.onDblclickRundownList
			},
			'article-refer-rundown ux-article-summary[name=EastTab]': {
				expand: this.onSelectRundownList
			},
			
			'article-refer-rundown-detail button[action=close]': {
				click: this.onClickCloseDetail
			},
			// 날짜(datefield) 직접 선택
//			'article-refer-rundown-program datefield[name=date]': {
//				change: this.onHandlerSearch
//			},
			// <,>, 오늘 날짜 변경
			'article-refer-rundown-program button[group=change-date]': {
				click: this.onChangeDateNormal
			},
			// 선택열기 클릭
			'article-refer-rundown-program button[action=open]': {
				click: this.onLoadRundownDetail
			},
			'article-refer-rundown-programlist': {
				//추후 더블클릭 관련 기능 추가될 가능성 있음
				itemdblclick: this.onLoadRundownDetail
			}
		});
	},

	selected_rd_id: null,


	copyToArtcl: function(btn) {
        //기사작성 - 참조 부분에서 선택된 값을 기사작성 폼에 채워넣는 기능
        var me = this,
            main = me.getMain(),
            grid = main.down('grid[name=detailList]'),
            records = grid.getSelectionModel().getSelection(),//참조부분에서 선택된 값
            writer_main = me.getWriterMain(),
            writer_records = writer_main.getValues();//기사작성에 들어있던 값
        //기존에 들어있던 값으로 레코드 생성
        writer_records = Ext.create('YSYS.model.article.ListModel', writer_records);

		if (Ext.isArray(records) && records.length > 0)
        {
        	//기사의 상세 내용을 불러오기
	        Ext.Ajax.request({
	            url : '/zodiac/rundown?cmd=getSelectRundownDtlArticleWithCap',
	            params : {
	                rd_id : records[0].get('rd_id'),
	                rd_seq : records[0].get('rd_seq')
	            },
	            success: function(response){
	                var responseText = Ext.decode(response.responseText);
	                if (responseText.result.success !== true) {
	                    Ext.Msg.alert(_text('COMMON_164'), responseText.result.msg);
	                    return;
	                }
	                //참조부분에서 선택된 값에 대한 자세한 정보
	                var record = responseText.data.record;

	                if(Ext.isEmpty(record)){
	                    return;
	                }

                    //editor 부분(자막&내용) 채워넣기 위해 기사 ID가 필요해서, 참조부분에서 선택된 값의 ID로 넣어준다.
                    writer_records.data.org_artcl_id = "";
                    writer_records.data.rd_id = record.rd_id;
                    writer_records.data.rd_seq = record.rd_seq;
                    writer_records.data.mode = config.MODE_COPY_ARTCL_FROM_REFERENCE;

	                //기존에 들어있던 값 중 일부를 참조부분에서 선택한 값으로 치환
	                writer_records.data.artcl_titl = record.artcl_titl? record.artcl_titl : "";//제목
                    writer_records.data.artcl_ctt = record.artcl_ctt? record.artcl_ctt: "";//내용
                    writer_records.data.artcl_reqd_sec = record.artcl_reqd_sec? record.artcl_reqd_sec: "";//기사 시간
                    writer_records.data.artcl_reqd_sec_div_yn = record.artcl_reqd_sec_div_yn? record.artcl_reqd_sec_div_yn: "";//기사시간 자동 여부
                    writer_records.data.artcl_smry_ctt = record.artcl_smry_ctt? record.artcl_smry_ctt: "";//참고사항
                    writer_records.data.rptr_id = record.rptr_id? record.rptr_id: "";//기자아이디
                    writer_records.data.rptr_nm = record.rptr_nm? record.rptr_nm: "";//기자이름
                    
	                //수정된 레코드로 기사작성 화면을 reload 해주는 함수
	               	writer_main.loadValuesFromReference(writer_records);
	            }
	        });
        }
        else
        {
        	Ext.Msg.alert(_text('COMMON_164'), _text('ALERT_MSG_092'));
        }
    },

    getMain: function() {
        var component,
            appId;

        component = YSYS.ux.TaskBarManager.getActiveTab();
        if (component.xtype === 'article-writer') {

            appId = component.appId;
            component = component.down('article-refer-rundown');
            component.appId = appId;
        }

        return component;
    },

    getWriterMain: function() {
        var component,
            appId;

        component = YSYS.ux.TaskBarManager.getActiveTab();

        return component;
    },
    
    getSummary: function(){
    	return this.getMain().down('ux-article-summary[name=EastTab]');
    },
    
    getDetail: function(){
    	return this.getMain().down('article-refer-rundown-detail');
    },
    
    onActiveRundownTab: function(){
    	var me = this,
    		pro_nm = me.getMain().down('label[name=program_nm]').text;
    	if(Ext.isEmpty(pro_nm)) me.onOpenProgram();
    },

	onInit: function(){
		var me = this,
			date = Ext.Date.format(me.getProgram().down('datefield[name=date]').getValue(), 'YmdHis'),
			pgm_nm = me.getProgram().down('textfield[name=search_v]').getValue(),
			ch_div_cd = UserInfo.getChannelDivisionCode();
				
		me.onHandlerSearch();
		
		me.getMain().down('grid[name=detailList]').getStore().on('datachanged', function(store){
			if(store.getCount() > 0){
				me.getMain().down('grid[name=detailList]').getSelectionModel().select(0);
			}
		});
		me.getMain().on('show', me.onActiveRundownTab, me);

		//me.onBeforeRefresh();
	},

	onPressEnter: function(textfield, e){
		if (e.getKey() === e.ENTER) {
			this.onHandlerSearch();
		}
	},

	onHandlerSearch: function(){
		var me = this,
			date = Ext.Date.format(me.getProgram().down('datefield[name=date]').getValue(), 'YmdHis'),
			pgm_nm = me.getProgram().down('textfield[name=search_v]').getValue(),
			ch_div_cd = UserInfo.getChannelDivisionCode();

		me.getProgramList().getStore().load({
			params: {
				sdate: date,
				edate: date,
				pgm_nm: pgm_nm,
				ch_div_cd: ch_div_cd 
			},
			callback: function(records, operation, success) {
				if(Ext.isArray(records) && records.length > 0){
					me.getProgramList().getSelectionModel().select(records[0]);
				}
			}
		});
	},
	
	onSelectRundownList: function(){
		var me = this,
			mainSummary = me.getMain().down('ux-article-summary[name=EastTab]'),
			records = me.getMain().down('grid[name=detailList]').getSelectionModel().getSelection();
		
		if(Ext.isArray(records) && records.length > 0 && !mainSummary.collapsed){
			me.getSummary().load(records[0]);
		}
	},

	refresh: function(){
		var me = this;

		me.loadRundownDetail(me.selected_rd_id, null);
	},
	
	onDblclickRundownList: function(selModel, record){
		var me = this;
		
		if(Ext.isEmpty(record)) return;
		
		Ext.Ajax.request({
            url : '/zodiac/rundown?cmd=getSelectRundownDtlArticleWithCap',
            params : {
                rd_id : record.get('rd_id'),
                rd_seq : record.get('rd_seq')
            },
            success: function(response){
                var responseText = Ext.decode(response.responseText);
                if (responseText.result.success !== true) {
                    Ext.Msg.alert(_text('COMMON_164'), responseText.result.msg);
                    return;
                }
                //참조부분에서 선택된 값에 대한 자세한 정보
                var record = responseText.data.record;

                if(Ext.isEmpty(record)){
                    return;
                }
                
                var DtlModel = Ext.create('YSYS.model.article.ListModel', record);
                
                me.getDetail().getForm().setValues(DtlModel.getData());
                
				me.getDetail().down('article-editor[name=articleReferRundownEditor]').setInnerValue(DtlModel);
				me.getDetail().down('ux-article-summary').load(DtlModel);
		
				me.getMain().getLayout().setActiveItem(1);
            }
        });
	        
	},
	
	onClickCloseDetail: function(){
		this.getMain().getLayout().setActiveItem(0);
	},

	onChangeDateNormal: function (btn) {
		var me = this,
			dateCmp = this.getProgram().down('datefield[name=date]'),
			date = dateCmp.getValue();

		if (btn.action == 'previous-day') {
			date = Ext.Date.add(date, Ext.Date.DAY, -1);
		}
		else if (btn.action == 'next-day') {
			date = Ext.Date.add(date, Ext.Date.DAY, 1);
		}
		else {
			date = new Date();
		}

		dateCmp.setValue(date);

		me.onHandlerSearch();
	},

	// 선택열기 클릭
	onOpenProgram: function(){
		var me = this,
			ch_div_cd = UserInfo.getChannelDivisionCode();
		
		me.onHandlerSearch();		
		
		var popX = window.innerWidth/2 - me.getProgram().width/2;
		var popY = window.innerHeight/2 - me.getProgram().height/2;
		me.getProgram().showAt(popX, popY);
	},

	//프로그램에 따른 상세내용 불러오기
	onLoadRundownDetail: function() {
		var me = this,
			rd_record = me.getProgramList().getSelectionModel().getSelection();

		me.selected_rd_id = rd_record[0].get('rd_id');
		me.loadRundownDetail(rd_record[0].get('rd_id'), rd_record);
	},

	loadRundownDetail: function(rd_id, rd_record) {
		var me = this,
			detail_store = me.getMain().down('grid[name=detailList]').getStore();

		if(Ext.isEmpty(rd_id)){
			detail_store.removeAll();
			me.getProgram().close();
			return;
		}

		Ext.Ajax.request({
			method : 'POST',
			url: '/zodiac/rundown?cmd=getSelectRundownDtlAdvanced',
			params: {
				rd_id: rd_id
			},
		    success: function(response) {
		    	var result = Ext.decode(response.responseText),
		    		records = [];

		    	if(result.result.success.toString() != 'true'){
		    		return;
		    	}
		    	else if(result.data.totalcount > 0){
			    	var records = result.data.records;

					if(rd_record){
						var title = rd_record[0].get('brdc_pgm_nm') + '( ' + _text('COMMON_214') + ' : ' + rd_record[0].get('brdc_pgm_sub_nm') + ')      ' + rd_record[0].get('brdc_start_clk') + ' ~ ' + rd_record[0].get('brdc_end_clk');
						me.getMain().down('label[name=program_nm]').setText(title);
					}
			    	detail_store.loadData(records);
			    	me.getProgram().close();
			    }
		    },
			scope: this
		});
	}
});