Ext.define('YSYS.controller.rundown.Program', {
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

        'rundown.program.Main',

		'rundown.program.sub.List',
		'rundown.program.sub.Detail',
		'rundown.program.sub.popup.CaptionPreview'
	],
	
	 /*ch_div_cd 값을 저항하기 위한 변수*/
	ch_div_cd: null,

	refs: [{
		ref: 'PopupBroadcastHistory',
		selector: 'ux-article-broadcasthistory',
		xtype: 'ux-article-broadcasthistory',
		autoCreate: true
	},{
		ref: 'PopupArticleHistory',
		selector: 'ux-article-history',
		xtype: 'ux-article-history',
		autoCreate: true
	}, {
		ref: 'captionPreview',
		selector: 'rundown-program-sub-CaptionPreview',
		autoCreate: true,
		xtype: 'rundown-program-sub-CaptionPreview'
	}
	
	],

	init: function() {
		this.control({
			'rundown-program': {
				afterrender: this.onInit
			},

			'rundown-program textfield[name=search_v]': {
				specialkey : this.onPressEnter
			},
			'rundown-program button[action=search]': {
				click: this.onHandlerSearch
			},
			'rundown-program button[group=change-date]': {
				click: this.onChangeDateNormal
			},
			/*런다운 리스트 페이지 인쇄*/
			'rundown-program button[action=print]': {
				click: this.onPrintRundownList
			},

			'rundown-program-list': {
				selectionchange: this.onSelectList,
				itemdblclick : this.listDbClick,
				containercontextmenu: this.containerRowClick,
				beforeitemcontextmenu: this.listRowClick
			},
			
			'rundown-program-sub-Detail ux-article-summary[name=EastTab]': {
				expand: this.onExpandRdSummary
			},
			'rundown-program-sub-Detail button[action=broadcast-history]': {
				click: this.onBroadHistory
			},
			'rundown-program-sub-Detail button[action=article-history]': {
				click: this.onArticleHistory
			},
			'rundown-program-sub-Detail button[action=refresh]': {
				click: this.ProgramlistRefresh
			},
			'rundown-program-sub-Detail button[action=showListTab]': {
				click: this.onDoublePanel
			},
			'rundown-program-sub-Detail button[action=Onepanel]': {
				click: this.onOnePanel
			},
			'rundown-program-sub-Detail button[action=CaptionPreview]': {
				click: this.showCation
			},
			
			/*런다운 상세 페이지 인쇄 start*/
			'rundown-program-sub-Detail menuitem[action=printRundownList]': {
				click: this.onPrintRundownListInDetail
			},
			/* 런다운 전체인쇄는 기능 제공 안함. 2014.12.23 g.c.Shin
			 * 'rundown-program-sub-Detail menuitem[action=printRundownAll]': {
				click: this.onPrintRundownAll
			},*/
			'rundown-program-sub-Detail menuitem[action=printRundownEach]': {
				click: this.onPrintRundownEach
			},
			'rundown-program-sub-Detail menuitem[action=printRundownAncAll]': {
				click: this.onPrintRundownAncAll
			},
			'rundown-program-sub-Detail menuitem[action=printRundownAncEach]': {
				click: this.onPrintRundownAncEach
			},

			'rundown-program-sub-Detail menuitem[action=printRundownCGList]': {
				click: this.onPrintRundownCGList
			},
			'rundown-program-sub-Detail menuitem[action=printRundownVFList]': {
				click: this.onPrintRundownVFList
			},
			'rundown-program-sub-Detail menuitem[action=printRundownGFList]': {
				click: this.onPrintRundownGFList
			},
			/*런다운 상세 페이지 인쇄 end*/
			'rundown-program-sub-Detail grid[name=detailList]': {
				selectionchange: this.onSelectDtlList,
				itemdblclick: this.onDblclickDtlList,
				cellclick: this.detailCellSelect
			},
			
			'rundown-program-sub-Detail article-refer-rundown-detail button[action=close]': {
				click: this.onClickCloseDetail
			}
		});
	},

	getMain: function() {
		return Ext.getCmp('main-container').getActiveTab();
	},

	getFromDateNormal: function() {
		return this.getMain().down('datefield[name=sdate]');
	},

	getToDateNormal: function() {
		return this.getMain().down('datefield[name=edate]');
	},

	getList: function() {
		return this.getMain().down('rundown-program-list');
	},

	getSummary: function() {
		return this.getMain().down('ux-article-summary');
	},

	getListView: function() {
		return this.getMain().down('[region=center]');
	},

	onInit: function(){
		var me = this;
		me.gridCtxMenu = Ext.create('Ext.menu.Menu', {
			itemId: 'gridCtxMenu',
			items: [{
				text: _text('MENU_008_04_009'),
				handler: function(btn){
					var today = new Date(),
						date = Ext.Date.format(today, 'Y-m-d'),
						time = Ext.Date.format(today, 'H:i:s'),
						store = me.getList().getStore(),
						index_array = new Array();
						
					store.findBy(function(record,id){
						if(record.get('brdc_dt') == date && record.get('brdc_end_clk') > time && record.get('brdc_start_clk') < time){
							index_array.push(record);
						}
					});

					me.getList().getSelectionModel().select(index_array[0]);
				}
			}]
		});

		var sdate = Ext.Date.format(me.getMain().down('datefield[name=sdate]').getValue(), 'Ymd000000');
		var edate = Ext.Date.format(me.getMain().down('datefield[name=edate]').getValue(), 'Ymd235959');
		var pgm_nm = me.getMain().down('textfield[name=search_v]').getValue();
		
		var ch_div_cd = UserInfo.getChannelDivisionCode();
		
		me.getList().getStore().load({
			params: {
				sdate: sdate,
				edate: edate,
				pgm_nm: pgm_nm,
				ch_div_cd : ch_div_cd
			},
			callback: function(records) {
				if(Ext.isArray(records) && records.length > 0){
					var today = new Date(),
						date = Ext.Date.format(today, 'y-m-d'),
						time = Ext.Date.format(today, 'H:i:s'),
						index_array = new Array();

					for(var i = 0; i < records.length; i++){
						if(records[i].get('brdc_dt') == date && records[i].get('brdc_end_clk') > time && records[i].get('brdc_start_clk') < time){
							index_array.push(records[i]);
						}
					}

					me.getList().getSelectionModel().select(index_array[0]);
				}
			}
		});
	},

	onPressEnter: function(textfield, e){
		if (e.getKey() === e.ENTER) {
			this.onHandlerSearch();
		}
	},

	onHandlerSearch: function(btn){
		var me = this;
		
		if(me.getMain().xtype != 'rundown-program') return;
		var sdate = me.getMain().down('datefield[name=sdate]').getValue();
		var edate = me.getMain().down('datefield[name=edate]').getValue();
		var pgm_nm = me.getMain().down('textfield[name=search_v]').getValue();
		var ch_div_cd = UserInfo.getChannelDivisionCode();

		if(sdate > edate){
			me.getMain().down('datefield[name=sdate]').setValue(edate);
			me.getMain().down('datefield[name=edate]').setValue(sdate);

			var chagneDate = sdate;
			sdate = edate;
			edate = chagneDate;
		}
		
		var duration = (edate - sdate)/60/60/24/1000;
		if(duration > 30){
			Ext.Msg.alert(_text('COMMON_164'), _text('ALERT_MSG_250')+'<br>('+_text('ALERT_MSG_251')+')');
			
			sdate = Ext.Date.add(edate, Ext.Date.DAY, -30);
			me.getMain().down('datefield[name=sdate]').setValue(sdate);
		}

		
		var __list = this.getList();
		var __store = __list.getStore();
		var lastSelectRecord = __list.getSelectionModel().getLastSelected();
		var lastIndex = __store.indexOf(lastSelectRecord)||0;
		__store.load({
			params: {
				sdate: Ext.Date.format(sdate, 'Ymd000000'),
				edate: Ext.Date.format(edate, 'Ymd235959'),
				pgm_nm: pgm_nm,
				ch_div_cd: ch_div_cd
			},
			callback: function(records, operation, success) {
				if(success){
					var selectIndex = records.length-1 >= lastIndex ? (lastIndex==-1)?0:lastIndex : 0;
					__list.getSelectionModel().select(selectIndex);
				}
			}
		});
	},

	onChangeDateNormal: function (btn) {
		var sdateCmp = this.getFromDateNormal(),
			edateCmp = this.getToDateNormal(),
			sdate = sdateCmp.getValue(),
			edate = edateCmp.getValue();

		if (btn.action == 'previous-day') {
			sdate = Ext.Date.add(sdate, Ext.Date.DAY, -1);
			edate = Ext.Date.add(edate, Ext.Date.DAY, -1);
		}
		else if (btn.action == 'next-day') {
			sdate = Ext.Date.add(sdate, Ext.Date.DAY, 1);
			edate = Ext.Date.add(edate, Ext.Date.DAY, 1);
		}
		else {
			sdate = new Date();
			edate = new Date();
		}

		sdateCmp.setValue(sdate);
		edateCmp.setValue(edate);

		this.onHandlerSearch();
	},

	onRefresh: function() {
		var me = this;
		var sdate = Ext.Date.format(this.getMain().down('datefield[name=sdate]').getValue(), 'Ymd000000');
		var edate = Ext.Date.format(this.getMain().down('datefield[name=edate]').getValue(), 'Ymd235959');
		var pgm_nm = this.getMain().down('textfield[name=search_v]').getValue();
		var ch_div_cd = UserInfo.getChannelDivisionCode();

		this.getList().getStore().load({
			params: {
				sdate: sdate,
				edate: edate,
				pgm_nm: pgm_nm,
				ch_div_cd : ch_div_cd
			},
			callback: function() {
			}
		});
	},
	
	onSelectList: function(selModel, records){
		var me = this;
		
		if (Ext.isArray(records) && records.length > 0) {
			if(YSYS.ux.Util.isMobile()){
	            var menu = Ext.create('Ext.menu.Menu', {
	                items: [{
	                    text: records[0].get('daily_pgm_nm') + ' ' + _text('COMMON_052'),
	                    handler: function() {
	                        me.listDbClick();
	                    }
	                }]
	            });
	
	            menu.showAt(Ext.get(selModel.view.focusedRow).getXY());
	        }
		}
	},

	listDbClick: function(){
		var me = this,
			widget_config,
			comp,
			title = _text('MENU_008_04'),
			rd_record = me.getList().getSelectionModel().getSelection(),
			ch_div_cd = UserInfo.getChannelDivisionCode();

		if(rd_record[0].get('rd_st_nm') === "준비"){//config.RUNDOWN_ST_READY
			Ext.Msg.alert(_text('COMMON_164'), _text('ALERT_MSG_252'));
			return;
		}
		else if(Ext.isEmpty(rd_record[0].get('rd_id'))){
			Ext.Msg.alert(_text('COMMON_164'), _text('ALERT_MSG_253'));
			return;
		}
		else{
			
			widget_config = {
				appId: me.getMain().appId + '_detail',
				rd_id: rd_record[0].get('rd_id'),
				xtype: 'rundown-program-sub-Detail',
				closable: true
			};
						
			comp = YSYS.ux.TaskBarManager.add(widget_config);
			
			me.detailComp = comp;
			
			comp.setTitle(_text('MENU_008_04'));
			 /*런다운 상세보기 조회시 필요한 parameter 값을 상세조회페이지 내에 setValue함 (2014.04.30 임찬모)*/
			comp.down('hiddenfield[name=rd_id]').setValue(rd_record[0].get('rd_id'));
			comp.down('hiddenfield[name=ch_div_cd]').setValue(ch_div_cd);
			 /*위에서 set한 parameter값을 기준으로 런다운 상세조회*/
			comp.load();

			comp.on('beforedestroy', function() {
	        	me.detailComp = null;
	        });
		}
	},

	ProgramlistRefresh: function() {
		var me = this;

		me.detailComp.refreshProgramDtlList();
		
	},

	containerRowClick: function(grid, e){
		e.stopEvent();
		this.gridCtxMenu.showAt(e.getXY());
	},

	listRowClick: function(grid, reocrd, item, index, e){
		e.stopEvent();
		this.gridCtxMenu.showAt(e.getXY());
	},

	onBroadHistory: function() {
		var me = this,
			cmp = me.getPopupBroadcastHistory(),
			record;
		
		records = me.detailComp.down('grid[name=detailList]').getSelectionModel().getSelection();

		if(Ext.isArray(records) && records.length > 0){
			var record = records[0];

			if ( ! Ext.isEmpty(record)) {
				cmp.show().load(record);
			} else {
				Ext.Msg.alert(_text('COMMON_164'), _text('ALERT_MSG_198'));
			}
		}
	},

	onArticleHistory: function(){
		var me = this,
			record;
			
		records = me.detailComp.down('grid[name=detailList]').getSelectionModel().getSelection();
		
		record = records[0];
		
		if ( ! Ext.isEmpty(record)) {
			me.getPopupArticleHistory().show().load(record);
		} else {
			Ext.Msg.alert(_text('COMMON_164'), _text('ALERT_MSG_198'));
		}
	},

	onDoublePanel: function(){
		var me = this,
			record;
			
		records = me.detailComp.down('grid[name=detailList]').getSelectionModel().getSelection();
			
		me.detailComp.down('ux-article-summary').expand();
		
		if(Ext.isArray(records) && records.length > 0){
			me.getSummary().load(records[0]);
		}
	},

	onOnePanel: function(){
		var me = this;
				
		me.detailComp.down('ux-article-summary').collapse();
	},

	showCation: function(){
		var me = this;
		var select = Ext.getCmp('main-container').getActiveTab().down('grid').getSelectionModel().getSelection()[0];
		if(!select){
			Ext.Msg.alert(_text('COMMON_164'), _text('ALERT_MSG_092'));
			return;
		}
		me.getCaptionPreview().down('form').getForm().reset();
		me.getCaptionPreview().down('[name=index]').setValue(select.index);
		me.getCaptionPreview().show();
	},

	onDblClickDetailGrid: function(self, record, item, index){
		if (record) {
			var record = Ext.create('YSYS.model.article.ListModel', {
				artcl_titl: record.get('artcl_titl'),
				artcl_ctt: record.get('artcl_ctt')
			});

			var editor = Ext.getCmp('main-container').down('article-writer');
			if(!editor){
				editor = Ext.getCmp('main-container').add({xtype: 'article-writer', ArticleRecord: record, fireWriter: true, closable: true});
			}
			else { }

			Ext.getCmp('main-container').setActiveTab(editor);

		} else {
			Ext.Msg.alert(_text('COMMON_164'), _text('ALERT_MSG_209'));
		}
	},
	
	onSelectDtlList: function(dtlList, records){
		this.onExpandRdSummary();
	},
	
	onExpandRdSummary: function(){
		var me = this,
			summary = me.getSummary(),
			records = me.detailComp.down('grid[name=detailList]').getSelectionModel().getSelection();
		
		if(summary.collapsed) return;
			
		if(Ext.isArray(records) && records.length > 0){
			me.getSummary().load(records[0]);
		}
		else{
			me.getSummary().reset(Ext.create('YSYS.model.article.ListModel', {
                artcl_id : '-1'
    		}));
		}
	},
	
	onDblclickDtlList: function(grid, record){
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
                /*참조부분에서 선택된 값에 대한 자세한 정보*/
                var record = responseText.data.record;

                if(Ext.isEmpty(record)){
                    return;
                }
                
                var DtlModel = Ext.create('YSYS.model.article.ListModel', record);
                
                me.detailComp.down('article-refer-rundown-detail').getForm().setValues(DtlModel.getData());
                
				me.detailComp.down('article-refer-rundown-detail').down('article-editor[name=articleReferRundownEditor]').setInnerValue(DtlModel);
				me.detailComp.down('article-refer-rundown-detail').down('ux-article-summary').load(DtlModel);
		
				me.detailComp.down('panel[name=rdDtlMain]').getLayout().setActiveItem(1);
            }
        });
		
	},
	
	onClickCloseDetail: function(btn){
		this.detailComp.down('panel[name=rdDtlMain]').getLayout().setActiveItem(0);
	},

	detailCellSelect: function(dtlList, td, column, record, tr, rowIndex, e, eOpts){
		var me = this;
		if(Ext.isEmpty(record.get('artcl_id'))){
			record.set('artcl_id', '-1');
		}
		if(column == 7 || column == 8){
			var ch_div_cd = UserInfo.getChannelDivisionCode();
			
			var win = Ext.create('Ext.Window', {
				width: 520,
				height: 470,
				layout: 'fit',
				modal: true,
				title: _text('MENU_008_04_010'),
				items:[{
					xtype: 'form',
					name: 'sendStatus',
					layout: 'vbox',
					defaults: {
						width: '100%'
					},
					dockedItems: [{
					    xtype: 'toolbar',
					    dock: 'top',
					    items: ['->',
					        { xtype: 'button', text: _text('COMMON_209'), handler: function(btn){ win.down('grid').getStore().reload(); } },
					        { xtype: 'button', text: _text('COMMON_003'), handler: function(btn){ btn.up('window').close(); } }
					    ]
					}],

					items:[{
						xtype: 'grid',
						store: Ext.create('YSYS.store.rundown.RundownMediaTrnsf', {
							listeners: {
								load: function (store, records, successful, eOpts) {
									if(Ext.isArray(records) && records.length > 0){
										win.down('grid').getSelectionModel().select(records[0]);
									}
								}
							}
						}),
						columns: [
							{header: _text('COMMON_181'), xtype: 'rownumberer', width: 40, align: 'center'},
							{header: _text('MENU_014_02_003'), dataIndex: 'playout_id', width: 120},
							{xtype: 'progressbarcolumn', header: _text('COMMON_236'), dataIndex: 'trnsf_rate', align: 'center', width: 80},
							{header: _text('MENU_014_02_001'), dataIndex: 'media_nm', flex: 1},
							{header: _text('MENU_008_04_011'), dataIndex: 'snd_st_nm', width: 90},
							{header: _text('MENU_014_02_004'), dataIndex: 'media_id', hidden: true}
						],
						forcefit: true,
						flex: 1,
						autoScroll: true,
						listeners: {
							selectionchange: function(selModel, records){
								if(!Ext.isArray(records) || records.length < 1){
									return;
								}
								var mediatype = "";
								var objectid = records[0].get('media_id');

								switch(column){
									case 8:
										mediatype = 'graphic';
									break;
									case 7:
										mediatype = 'video';
									break;
								}

								Ext.Ajax.request({
									url: '/zodiac/inews?cmd=getSelectMAMPreviewUrl',
									params: {
										mediatype: mediatype,
										objectid: objectid,
										next: 'web/xml2.jsp',
										format: 'XML',
										os_type: 'WEB',
										lang: 'KO'
									},
								    success: function(response) {
								    	var result = Ext.decode(response.responseText);

								    	if(result.result.success != true){
								    		win.down('panel[name='+mediatype+']').update('<img style="height:100%; width:auto;" src="'+config.NOIMAGE+'"');
								    		Ext.Msg.alert(_text('COMMON_164'), result.result.msg);
								    		return;
								    	}
								    	var previewUrl = result.data.record.previewurl.url;
								    	var protocol = previewUrl.substring(0,4);

								    	if(protocol == 'rtmp'){
								    		win.down('panel[name='+mediatype+']').update('<iframe height="100%" width="100%" src="/zodiac/streaming/videoProxyPlay.jsp?proxyurl='+ previewUrl +'"></iframe>');
								    	}
								    	else if(protocol == 'http'){
								    		win.down('panel[name='+mediatype+']').update('<img style="height:100%; width:auto;" src="'+previewUrl+'" onError="this.src=\''+config.NOIMAGE+'\'"/>');
								    	}

								    },
									scope: this
								});
							}
						}
					},{
						xtype: 'label',
						text: _text('COMMON_111')
					},{
						xtype: 'panel',
						hidden: true,
						margin: '10 0 10 0',
						name: 'video',
						height: 250,
						border: true
					},{
						xtype: 'panel',
						hidden: true,
						margin: '10 0 10 0',
						name: 'graphic',
						height: 250,
						border: true
					}]
				}],
				listeners: {
					show: function(window, eOpts){
						var record = window.down('grid').getStore().getAt(0);
						if(!Ext.isEmpty(record)){
							win.down('grid').getSelectionModel().select(record);
						}
					}
				}
			});
			
			if(column == 8 && record.get('grphc_count') > 0){/*그래픽*/
				var rd_id = record.get('rd_id');
				var rd_seq = record.get('rd_seq');
				var del_yn = record.get('del_yn');
				

				win.down('panel[name=graphic]').show();

				win.down('grid').getStore().load({
					params:{
						rd_id: rd_id,
						rd_seq: rd_seq,
						media_cd: "002",
						del_yn: del_yn,
						ch_div_cd: ch_div_cd
					},
					callback: function(records, operation, success){
						win.show();
					}
				});

			}

			if(column == 7 && record.get('video_count') > 0){//영상
				var rd_id = record.get('rd_id');
				var rd_seq = record.get('rd_seq');
				var del_yn = record.get('del_yn');

				win.down('panel[name=video]').show();
				win.down('grid').getStore().load({
					params:{
						rd_id: rd_id,
						rd_seq: rd_seq,
						media_cd: "001",
						del_yn: del_yn,
						ch_div_cd: ch_div_cd
					},
					callback: function(records, operation, success){
						win.show();
					}
				});
			}
		}
	},


/*
- 런다운 리스트 인쇄					onPrintRundownList, onPrintRundownListInDetail
- 런다운 전체내용 인쇄				onPrintRundownAll

- 개별 기사내용 인쇄					onPrintRundownEach
- 앵커용 런다운 전체내용 인쇄			onPrintRundownAncAll
- 앵커용 개별 기사내용 인쇄				onPrintRundownAncEach

- CG List 인쇄					onPrintRundownCGList
- 영상 리스트 인쇄					onPrintRundownVFList
- 그래픽 리스트 인쇄					onPrintRundownGFList
*/
	getPrintParams: function (params) {
		var returnObj = {};
		//넘어온 파라미터들
		for(var i in params){
			returnObj[i] = params[i];
		}
		//기본 파라미터들
		returnObj.usr_id = UserInfo.getId();
		returnObj.token = UserInfo.getToken();
		returnObj.ch_div_cd = UserInfo.getChannelDivisionCode();
		return returnObj;
	},

	onPrintRundownList: function () {
		/*조회된 항목이 없을 시*/
		if( Ext.isEmpty(this.getList().getSelectionModel().getSelection()) )
		{
			Ext.Msg.alert(_text('COMMON_164'), _text('ALERT_MSG_254'));
			return;
		}

		var select = this.getList().getSelectionModel().getSelection()[0].data;
		/*조회된 런다운의 기사가 0건일 시*/
		if( select.articlecount == 0 )
		{
			Ext.Msg.alert(_text('COMMON_164'), _text('ALERT_MSG_254'));
			return;
		}

		var	params = {
			rd_id: select.rd_id
		};

		window.open(Gemiso.config.print.rundown.detail.printRundownList.href + '&' + Ext.Object.toQueryString(this.getPrintParams(params)), Gemiso.config.print.hrefTarget, Gemiso.config.print.windowOpenOption);
	},

	onPrintRundownListInDetail: function () {
		var me = this,
			selects = me.getListView().getSelectionModel().getSelection();
						
		if(!Ext.isArray(selects) || selects.length < 1){
			return;
		}
		
		var	params = {
			rd_id: selects[0].get('rd_id')
		};

		window.open(Gemiso.config.print.rundown.detail.printRundownList.href + '&' + Ext.Object.toQueryString(this.getPrintParams(params)), Gemiso.config.print.hrefTarget, Gemiso.config.print.windowOpenOption);
	},

	onPrintRundownAll: function () {
		var me = this,
			selects = me.getListView().getSelectionModel().getSelection();
			
		if(!Ext.isArray(selects) || selects.length < 1){
			return;
		}
		
		var	params = {
			/*rd_id: selects[0].get('rd_id'),
			div_cd: '001'*/
			artcl_id: '20131216162600AE00588',
			usr_id: UserInfo.getId(),
			token: UserInfo.getToken(),
			ch_div_cd: UserInfo.getChannelDivisionCode()
		};
		
		
		

		window.open(Gemiso.config.print.rundown.detail.printRundownAll.href + '&' + Ext.Object.toQueryString(this.getPrintParams(params)), Gemiso.config.print.hrefTarget, Gemiso.config.print.windowOpenOption);
	},

	onPrintRundownEach: function () {
		var me = this,
			selects = me.getListView().getSelectionModel().getSelection();
			
		if(!Ext.isArray(selects) || selects.length < 1){
			return;
		}
		
		var	params = {
			rd_id: selects[0].get('rd_id'),
			rd_seq: selects[0].get('rd_seq')
		};
		window.open(Gemiso.config.print.rundown.detail.printRundownEach.href + '&' + Ext.Object.toQueryString(this.getPrintParams(params)), Gemiso.config.print.hrefTarget, Gemiso.config.print.windowOpenOption);
	},

	onPrintRundownAncAll: function () {
		var me = this,
			selects = me.getListView().getSelectionModel().getSelection();
			
		if(!Ext.isArray(selects) || selects.length < 1){
			return;
		}
		
		var	params = {
			rd_id: selects[0].get('rd_id'),
			rd_seq: selects[0].get('rd_seq'),
			div_cd: '002'
		};

		window.open(Gemiso.config.print.rundown.detail.printRundownAncAll.href + '&' + Ext.Object.toQueryString(this.getPrintParams(params)), Gemiso.config.print.hrefTarget, Gemiso.config.print.windowOpenOption);
	},

	onPrintRundownAncEach: function () {
		var me = this,
			selects = me.getListView().getSelectionModel().getSelection();
			
		if(!Ext.isArray(selects) || selects.length < 1){
			return;
		}
		
		var	params = {
			rd_id: selects[0].get('rd_id'),
			rd_seq: selects[0].get('rd_seq')
		};

		window.open(Gemiso.config.print.rundown.detail.printRundownAncEach.href + '&' + Ext.Object.toQueryString(this.getPrintParams(params)), Gemiso.config.print.hrefTarget, Gemiso.config.print.windowOpenOption);
	},

	onPrintRundownCGList: function () {
		var me = this,
			selects = me.getListView().getSelectionModel().getSelection();
			
		if(!Ext.isArray(selects) || selects.length < 1){
			return;
		}
		
		var	params = {
			rd_id: selects[0].get('rd_id'),
			list_typ: '001'
		};

		window.open(Gemiso.config.print.rundown.detail.printRundownCGList.href + '&' + Ext.Object.toQueryString(this.getPrintParams(params)), Gemiso.config.print.hrefTarget, Gemiso.config.print.windowOpenOption);
	},

	onPrintRundownVFList: function () {
		var me = this,
			selects = me.getListView().getSelectionModel().getSelection();
			
		if(!Ext.isArray(selects) || selects.length < 1){
			return;
		}
		
		var	params = {
			rd_id: selects[0].get('rd_id'),
			list_typ: '002'
		};

		window.open(Gemiso.config.print.rundown.detail.printRundownVFList.href + '&' + Ext.Object.toQueryString(this.getPrintParams(params)), Gemiso.config.print.hrefTarget, Gemiso.config.print.windowOpenOption);
	},
	onPrintRundownGFList: function () {
		var me = this,
			selects = me.getListView().getSelectionModel().getSelection();
			
		if(!Ext.isArray(selects) || selects.length < 1){
			return;
		}
		
		var	params = {
			rd_id: selects[0].get('rd_id'),
			list_typ: '003'
		};

		window.open(Gemiso.config.print.rundown.detail.printRundownGFList.href + '&' + Ext.Object.toQueryString(this.getPrintParams(params)), Gemiso.config.print.hrefTarget, Gemiso.config.print.windowOpenOption);
	}
	
});