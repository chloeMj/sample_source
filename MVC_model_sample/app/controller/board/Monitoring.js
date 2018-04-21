Ext.define('YSYS.controller.board.Monitoring', {
	extend: 'Ext.app.Controller',
	boardId: 13,
	divcd: "001",

	views: [
		'board.monitoring.Main',
		'YSYS.ux.LockInfo'
	],
	
	config : {
		eventTab : null,
		isTabClose : false
	},
	
	refs: [{
		ref: 'monitoringMain',
		selector: 'board-monitoring'
	}, {
		ref: 'sdate',
		selector: 'board-monitoring datefield[name=start_date]'
	}, {
		ref: 'edate',
		selector: 'board-monitoring datefield[name=end_date]'
	}, {
		ref: 'editform',
		selector:'board-monitoring-editform'
	},{
		ref: 'grid',
		selector: 'board-monitoring-list'
	}],
	
	init: function() {
		this.control({
			'board-monitoring': {				
				render: this.onRender,
				beforeclose: this.onTabClose
			},
			'board-monitoring button[group=change-date]': {
				click: this.onChangeDate
			},
			'board-monitoring ux-board-list': {	
				selectionchange: this.onSelectionChange,
				celldblclick: this.onCellDblclick
			},
			'board-monitoring checkbox[action=deleted]': {	
				change: this.onHandlerRefresh
			},
			'board-monitoring textfield[name=search_value]' : {
				specialkey : this.onPressEnter
			},
			'board-monitoring button[action=search]': {
				click: this.onHandlerRefresh
			},			
			
			/*권한 체크 필요한 버튼*/
			'board-monitoring button[checkGrant=true]': {
				click: this.onCheckButtonGrant
			},
			/*
			'board-monitoring button[action=new]': {
				//신규
				click: this.onNew
			},
			'board-monitoring button[action=edit]': {
				//수정
				click: this.onEdit
			},
			'board-monitoring button[action=delete]': {
				//삭제
				click: this.onDelete
			},
			'board-monitoring button[action=undelete]': {
				//삭제 취소
				click: this.onDeleteCancel
			},
			'board-monitoring button[action=notice]': {
				//게시
				click: this.onMainClickPublishToggle//onNotice
			},
			'board-monitoring button[action=unnotice]': {
				//게시 취소
				click: this.onMainClickPublishToggle//onNoticeCancel
			},
			'board-monitoring button[action=replyBorad]': {
				//답글
				click: this.onReplyBoard
			},
			*/
			'board-monitoring button[action=print]': {
				click: this.onPrint
			},
			
			'board-monitoring ux-board-writeForm button[action=cancel]': {
				click: this.onFormClose
			},
			'board-monitoring ux-board-writeForm button[action=save]': {
				click: this.onFormSave
			},
			
			'board-monitoring ux-board-writeForm button[action=preBoard]': {
				click: this.onFormClickPre
			},
			'board-monitoring ux-board-writeForm button[action=nextBoard]': {
				click: this.onFormClickNext
			},
			
			'board-monitoring ux-board-writeForm filefield' : {
				change: this.fileChange
			},
			/*상세보기 화면 - 첨부파일 목록 선택시 다운로드 버튼 활성화, 파일 삭제버튼 활성화*/
			'board-monitoring ux-board-writeForm grid[name=fileList]' : {
				selectionchange: this.onSelectFileList
			},
			'board-monitoring ux-board-writeForm button[action=delFile]' : {
				click: this.onDeleteFile
			},
			'board-monitoring ux-board-writeForm button[action=download]': {
				click: this.onDownloadFile
			}
		});
	},
	
	getMain: function() {
		var component, appId;
		/* component = YSYS.ux.TaskBarManager.getActiveTab(); */
		component = this.getMonitoringMain();
		return component;
	},
	
	getGrid: function(){
		var me = this, main = me.getMain(); 
		return main.down('ux-board-list');
	},
	
	getSummary: function(){
		var me = this, main = me.getMain(); 
		return main.down('ux-board-summary');
	},
	
	getDetailView: function(){
		var me = this, main = me.getMain();
		return main.down('ux-board-detailview');
	},
	
	getForm: function(){
		var me = this, main = me.getMain();
		return main.down('ux-board-writeForm');
	},
	
	onRender: function(){
		var me = this,
			app_id = Ext.Number.from(me.getMain().appId),		
			writeGrant = YSYS.ux.Grant.getGrant(app_id, config.GRANT_WRITE);
		
		me.app_id = app_id;
		
		me.writeGrant = writeGrant;
		if(writeGrant != 'true' && writeGrant != 'false'){
			writeGrant = YSYS.ux.Grant.getActionGrant(me.app_id, writeGrant, "write", "", "");
		}			 
		
		if(writeGrant == 'true'){
			Ext.each(me.getMain().query('[grant=write]'), function(item){
				item.setDisabled(false);
			});
		}
		else{
			Ext.each(me.getMain().query('[grant=write]'), function(item){
				item.setDisabled(true);
			});
		}
		
		me.getGrid().getStore().on('load', function (store, records, successful, eOpts) {
			if(Ext.isArray(records) && records.length > 0){
				me.getMain().down('button[action=print]').setDisabled(false);
				
				var index = 0;
				
				if(me.formStatus == 'edit'){
					index = me.getGrid().getStore().find('bbm_id', me.saveBbm_id);
					me.formStatus = "";
					me.saveBbm_id = "";	 
				}
				else if(me.formStatus == 'new' || me.formStatus == 'reply'){
					index = me.getGrid().getStore().findBy(function(record) {							
						if(String().concat(me.boardId, me.gridNewBbmId, UserInfo.ChannelDivisionCode) == String().concat(record.get('bb_id'), record.get('bbm_id'), record.get('ch_div_cd'))){
							return true
						}
						else {
							return false
						} 
					});
					me.formStatus = "";
					me.saveBbm_titl = "";
					me.saveBbm_ctt = "";
				}
				else{
					if(!Ext.isEmpty(me.lastRecordIndex)){
						index = me.lastRecordIndex;
						me.formStatus = "";
						me.lastRecordIndex = "";
					}
					else if(!Ext.isEmpty(me.getGrid().lastRecordIndex)){
						index = me.getGrid().lastRecordIndex;
						me.formStatus = "";
						me.getGrid().lastRecordIndex = "";
					}
					else{
						index = 0;
					}
				}
				
				if(index > -1){
					me.getGrid().getSelectionModel().select(records[index]);
				}
				else{
					me.getGrid().getSelectionModel().select(records[0]);
				}
			}
			else{
				me.getSummary().reset();
				
				/*검색 결과가 없을 경우 수정, 삭제, 삭제취소, 기사화, 게시, 게시취소 등의 버튼은 비활성화된다.*/	 
				var del_yn = me.getMain().down('checkbox[action=deleted]').getSubmitValue();
				if(del_yn == 'Y') {
					me.getMain().down('button[action=new]').setDisabled(true);
				}
				else{
					var writeGrant = me.writeGrant;
					if(writeGrant != 'true' && writeGrant != 'false'){
						writeGrant = YSYS.ux.Grant.getActionGrant(me.app_id, writeGrant, "write", "", "");
					}
			
					if(writeGrant == 'true'){
						me.getMain().down('button[action=new]').setDisabled(false);
					}
				}
				me.getMain().down('button[action=edit]').setDisabled(true);
				me.getMain().down('button[action=delete]').setDisabled(true);
				me.getMain().down('button[action=undelete]').setDisabled(true);
				me.getMain().down('button[action=replyBorad]').setDisabled(true);
				me.getMain().down('button[action=print]').setDisabled(true);
			}
		});
		
		me.onHandlerRefresh();
	},
	
	onPressEnter: function(textfield, e){
		if (e.getKey() === e.ENTER) {
			this.onHandlerRefresh();
		}
	},
	
	onChangeDate: function(btn){
		var sdateCmp = this.getSdate(),
			edateCmp = this.getEdate(),
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
		
		this.onHandlerRefresh();
	},
	
	isDelCheck: function( that, newValue, oldValue, eOpts ){		
		var undelete = this.getMain().down('button[action=undelete]');
		
		if(newValue){
			undelete.enable(true);		
		}else{
			undelete.setDisabled(true);
		}
		
		this.onHandlerRefresh();
	},
	onHandlerRefresh: function(){				
		var me = this,
			params = me.getParams();

		me.getGrid().getStore().getProxy().extraParams = params;
		me.getGrid().getStore().loadPage(1);
	},
	
	getParams: function() {
		var me = this,
			main = me.getMain(),
			s_date = main.down('datefield[name=start_date]').getValue(),
			e_date = main.down('datefield[name=end_date]').getValue(),
			search_type = main.down('combo[name=search_type]').getValue(),
			search_value = main.down('textfield[name=search_value]').getValue(),
			params = {},
			filter = [],
			sort = [],
			av_obj = new Object();
		
		av_obj.searchText = search_value;
		search_value = fn_searchText_check(av_obj);
		me.getMain().down('textfield[name=search_value]').setValue(search_value);
		
		if(s_date>e_date){
			var change_date = s_date;
			main.down('datefield[name=start_date]').setValue(e_date);
			main.down('datefield[name=end_date]').setValue(s_date);
			s_date = e_date;
			e_date = change_date;
		}
		
		if(search_type == '')
		{
			filter = [{key: 'bbm_titl', value: search_value}, {key: 'bbm_writer', value: search_value}];	
		}
		else
		{
			filter = [{key: search_type, value: search_value}];	
		}
		
		sort.push({property: 'INPUT_DTM', direction: 'DESC'});
		
		params = {
			filter: Ext.encode(filter),
			s_date: Ext.Date.format(s_date, 'Y-m-d'),
			e_date: Ext.Date.format(e_date, 'Y-m-d'),
			del_yn: main.down('checkboxfield[name=isdel]').getSubmitValue(),
			bb_id: me.boardId			
		};
		
		return params;
	},
	
	onPrint: function() {		
	},
	
	onDownload: function(){
		var att_grid = this.getForm().down('grid');
		var selmd = att_grid.getSelectionModel();
		var sels = this.getForm().down('grid').getSelectionModel().getSelection();

		if(Ext.isEmpty(sels)){
			Ext.Msg.alert('알림','대상을 선택 해주세요');
			return;
		}
	},
	
	onDelete: function(){
		var me = this,
			url = '/ysys/board?cmd=putDeleteBoardM',
			data = {},
			record = me.getSelectedOne(),
			formStore = Ext.create('YSYS.store.board.BoardDtl');
		
		if (Ext.isEmpty(record)) return;

		formStore.load({
			params:{
				bb_id: record.get("bb_id"),
				bbm_id: record.get("bbm_id")
			},
			callback: function(formStoreRecords, operation, success) {
				if (!Ext.isEmpty(formStoreRecords)) {
					if(formStoreRecords[0].get('bbm_del_yn') == 'Y'){
						Ext.Msg.alert('알림', '이미 삭제된 게시글입니다.');
						me.getGrid().getStore().reload();
						return;
					}
					
					Ext.Msg.show({
						title: _text('COMMON_164'),
						msg: _text('ALERT_MSG_207'),
						buttons: Ext.Msg.OKCANCEL,
						fn: function(btnId) {
							if (btnId == 'ok') {
								data = {
									bb_id: record.get("bb_id"),
									del_yn: 'Y',
									bbm_id: record.get("bbm_id")
								};
		
								me.send(url, data, '삭제');
							}
						}
					});
				}
			}
			
		});
	},
	
	onDeleteCancel: function(){
		var me = this,
			url = '/ysys/board?cmd=putDeleteBoardM',
			data = {},
			record = me.getSelectedOne(),
			formStore = Ext.create('YSYS.store.board.BoardDtl');
		
		if (Ext.isEmpty(record)) return;

		formStore.load({
			params:{
				bb_id: record.get("bb_id"),
				bbm_id: record.get("bbm_id")
			},
			callback: function(formStoreRecords, operation, success) {
				if (!Ext.isEmpty(formStoreRecords)) {
					if(formStoreRecords[0].get('bbm_del_yn') == 'N' || record.get("bbm_del_yn") == "N"){
						Ext.Msg.alert('알림', '이미 삭제 취소된 게시글입니다.');
						me.getGrid().getStore().reload();
						return;
					}
					data = {
						bb_id: record.get("bb_id"),
						del_yn: 'N',
						bbm_id: record.get("bbm_id")
					};

					me.send(url, data, '삭제');
					
				}
			}
			
		});
	},
	
	onMainClickPublishToggle: function() {
		var me = this,
			url = '/ysys/board?cmd=putUpdateBoardMOpenYN',
			data = {},
			record = me.getSelectedOne(),
			openYn = (record.get("open_yn").toUpperCase() === 'Y') ? 'N' : 'Y';
		
		if (Ext.isEmpty(record)) return;
		
		data = {
			bb_id: record.get("bb_id"),
			bbm_id: record.get("bbm_id"),
			open_yn: openYn
		};
		
		if(openYn == 'Y'){
			var msg = '게시';
		}
		else{
			var msg = '게시 취소';			
		}
		me.send(url, data, msg);	
	},
	
	onNotice: function(){
		var sels = this.getGrid().getSelectionModel().getSelection();		
		if(Ext.isEmpty(sels)){
			return;
		}	
		
		var open_yn = 'Y';
		
		var vals = sels[0].data;			

		var xml = {
			'data' : [{
				'record': {
					'bb_id' : vals.bb_id,
					'bbm_id' : vals.bbm_id,
					'ch_div_cd' : vals.ch_div_cd,
					'bbm_titl': vals.bbm_titl,					
					'bbm_ctt' :vals.bbm_ctt,
					'bbm_expr_dtm': vals.bbm_expr_dtm,
					'open_yn' : open_yn
				}
			}]
		};

		var data = {
				xml: Ext.encode(xml)
		};
		
		Ext.Ajax.request({
			method : 'POST',
			url: '/ysys/board?cmd=putUpdateBoardM',
			params: data,			
			success: function(response){				
				var result = Ext.decode(response.responseText);
				if(!result){
					Ext.Msg.alert('알림','전송실패' );
					return;
				}
				if(result.result.success == true || result.result.success == 'true'){
					this.onHandlerRefresh();
				}
				Ext.Msg.alert('알림',result.result.msg );	
			},
			scope: this
		});	
	},
	onNoticeCancel: function(){	
		var sels = this.getGrid().getSelectionModel().getSelection();		
		if(Ext.isEmpty(sels)){
			return;
		}	
		
		var open_yn = 'N';
		
		var vals = sels[0].data;			

		var xml = {
			'data' : [{
				'record': {
					'bb_id' : vals.bb_id,
					'bbm_id' : vals.bbm_id,
					'ch_div_cd' : vals.ch_div_cd,
					'bbm_titl': vals.bbm_titl,					
					'bbm_ctt' :vals.bbm_ctt,
					'bbm_expr_dtm': vals.bbm_expr_dtm,
					'open_yn' : open_yn
				}
			}]
		};

		var data = {
				xml: Ext.encode(xml)
		};
		
		Ext.Ajax.request({
			method : 'POST',
			url: '/ysys/board?cmd=putUpdateBoardM',
			params: data,			
			success: function(response){				
				var result = Ext.decode(response.responseText);
				if(!result){
					Ext.Msg.alert('알림','전송실패' );
					return;
				}
				if(result.result.success == true || result.result.success == 'true'){
					this.onHandlerRefresh();
				}
				Ext.Msg.alert('알림',result.result.msg );	
			},
			scope: this
		});
	},
	
	onSelectionChange: function(selModel, records){
		var me = this,
			summary = me.getSummary(),
			recordWriteGrant = me.writeGrant;
					
		if(Ext.isArray(records) && records.length > 0){
			if(recordWriteGrant != 'true' && recordWriteGrant != 'false'){
				var dept_cd = "";
				var inputr_id = records[0].get('inputr_id');
				
				recordWriteGrant = YSYS.ux.Grant.getActionGrant(me.app_id, recordWriteGrant, "write", dept_cd, inputr_id);
			}
			
			if(recordWriteGrant == 'true'){
				me.gridDisableGroup();
			}
			
			record = records[0];
			
			me.loadBoardInfoData('summary', record.get('bb_id'), record.get('bbm_id'));
			
			if(YSYS.ux.Util.isMobile()){
				var menu = Ext.create('Ext.menu.Menu', {
					items: [{
						text: record.get('bbm_titl') + ' 상세보기',
						handler: function() {
							me.onCellDblclick();
						}
					}]
				});
	
				menu.showAt(Ext.get(selModel.view.focusedRow).getXY());
			}
			
			
		} else {
			summary.reset();
		}
		
	},
	
	gridDisableGroup: function() {
		var me = this,
			record = me.getSelectedOne();
		
		if(record.get('bbm_del_yn') == 'Y') {
			me.getMain().down('button[action=new]').setDisabled(true);
			me.getMain().down('button[action=edit]').setDisabled(true);
			me.getMain().down('button[action=delete]').setDisabled(true);
			me.getMain().down('button[action=undelete]').setDisabled(false);
			me.getMain().down('button[action=replyBorad]').setDisabled(true);
		} else if(record.get('bbm_del_yn') == 'N') {
			me.getMain().down('button[action=new]').setDisabled(false);
			me.getMain().down('button[action=edit]').setDisabled(false);
			me.getMain().down('button[action=delete]').setDisabled(false);
			me.getMain().down('button[action=undelete]').setDisabled(true);
			me.getMain().down('button[action=replyBorad]').setDisabled(false);
		}
	},
	
	onCellDblclick: function(){
		
		var me = this,
			recordGrant = me.writeGrant,
			records = me.getGrid().getSelectionModel().getSelection(),
			record;
			
		if(Ext.isArray(records) && records.length > 0){
			record = records[0];
		}
		else{
			return;
		}
		
		var	dept_cd = "",
			inputr_id = record.get('inputr_id');
		
		if(recordGrant != 'true' && recordGrant != 'false'){
			recordGrant = YSYS.ux.Grant.getActionGrant(me.app_id, recordGrant, "write", dept_cd, inputr_id);
		}
		if(recordGrant == "false"){
			me.loadBoardInfoData('detail', record.get('bb_id'), record.get('bbm_id'));
		}
		else{
			
			me.loadBoardInfoData('lock', record.get('bb_id'), record.get('bbm_id'), function (_record) {
				if(_record.get('chg_lck_yn')=='Y' && UserInfo.id != _record.get('lck_user_id') ) {
					me.DisPlayDetailView(_record);
					Ext.widget('ux-lockinfo',{
						manualConfig : {
							msgTitle : '수정중인 게시글입니다.',
							artcl_titl : _record.get('bbm_titl'),
							lck_user_nm : String().concat(_record.get('lck_user_nm'), '(', _record.get('lck_user_id'), ')'),
							lck_dtm : _record.get('lck_dtm'),
							inphone : _record.get('inphone'),
							mphone : _record.get('mphone')
						}
						
					}).show();
				} else {
					me.onEdit();
				}
			
			});
		}
	},
	
	DisPlayDetailView : function (record) {
		var me = this;
		var index = me.getGrid().getSelectionModel().getSelection()[0].index,

		page = me.getGrid().getSelectionModel().getSelection()[0].store.currentPage,
		limit = me.getGrid().getStore().lastOptions.limit,
		rowNum = index-((page-1)*limit);
			
		var detail = me.getDetailView();
		me.getMain().getLayout().setActiveItem(2);
		detail.down('ux-board-summary').load(record);
		
		detail.index = rowNum;
		detail.bbm_id = record.get('bbm_id');
		detail.preBbm_id = record.get('pre_id');
		detail.nextBbm_id = record.get('next_id');
		detail.bb_id = record.get('bb_id');
	},

	onHandlerCopy: function() {
		this.getCopyform().show();
	},
	
	onCheckButtonGrant: function(btn){
		var me = this,
			buttonGrant = "",
			records = me.getGrid().getSelectionModel().getSelection();
			
		if(btn.grant == "write"){	
			buttonGrant = me.writeGrant;
		}
		
		if(buttonGrant != 'true' && buttonGrant != 'false'){
			if(Ext.isArray(records) && records.length > 0 && btn.action!= 'new'){
				var dept_cd = "";
				var inputr_id = records[0].get('inputr_id');
				
				buttonGrant = YSYS.ux.Grant.getActionGrant(me.app_id, buttonGrant, btn.grant, dept_cd, inputr_id);
			}
			else{
				buttonGrant = YSYS.ux.Grant.getActionGrant(me.app_id, buttonGrant, btn.grant, "", "");
			}
		}
		
		if(buttonGrant == 'true'){
			me.RunButtonFunction(btn);
		}
		else{
			if(btn.action == 'edit'){
			}
			Ext.Msg.alert('알림', '권한이 없습니다.');
			return;
		}
	},
	
	RunButtonFunction: function(btn){
		var me = this;
		
		switch(btn.action){
			case 'new':
				me.onNew();
			break;
			case 'edit':
				me.onEdit();
			break;
			case 'delete':
				me.onDelete();
			break;
			case 'undelete':
				me.onDeleteCancel();
			break;
			case 'notice':
				me.onMainClickPublishToggle();
			break;
			case 'unnotice':
				me.onMainClickPublishToggle();
			break;
			case 'replyBorad':
				me.onReplyBoard();
			break;
		}
	},
	
	onChangeWriteForm: function(flag){
		var me = this;		
		me.task = {
			run: function(){
				if(me.getMain().xtype == 'board-monitoring'){
					var editorValue = me.getForm().down('ux-board-Editor').getValue();
					
					if(me.formStatus == 'new' || me.formStatus == 'reply'){
						var div = document.createElement("div");
						div.innerHTML = editorValue;
						var editorValue = div.textContent || div.innerText || "";
						
						if(editorValue.trim() !=''){
							me.getForm().down('button[action=save]').setDisabled(false);
						}
					}
					else if(me.formStatus == 'edit'){
						if(editorValue != me.bbm_ctt){
							me.getForm().down('button[action=save]').setDisabled(false);
						}
					}
				}
			},
			interval: 500
		};
		
		me.getForm().down('button[action=save]').setDisabled(true);
		
		if(flag){
			me.getForm().down('datefield[name=bbm_expr_dtm]').on('change', function(){
				me.getForm().down('button[action=save]').setDisabled(false);
			});
			me.getForm().down('textfield[name=bbm_titl]').on('change', function(){
				me.getForm().down('button[action=save]').setDisabled(false);
			}, me);
			if(!Ext.isEmpty(me.task)){
				Ext.TaskManager.start(me.task);
			}
		}
		else{
			me.getForm().down('datefield[name=bbm_expr_dtm]').on('change', Ext.emptyFn, me);
			me.getForm().down('textfield[name=bbm_titl]').on('change', Ext.emptyFn, me);
			
			Ext.TaskManager.stopAll();
			me.task = null;
		}
	},

	onNew: function () {		
		this.fileCount = 0;		
		
		var me = this;
		
		me.getForm().down('form[name=inputForm]').getForm().reset();
		me.getForm().down('ux-board-Editor').reset();
		
		me.getForm().down('grid[name=fileList]').getStore().loadData([],false);
		me.getForm().down('form[name=inputForm]').getForm().setValues([{id: 'bb_id', value: me.boardId},{id:'usr_id', value: UserInfo.getId()}]);
		
		me.formStatus = 'new';
		me.getMain().getLayout().setActiveItem(1);
		me.onChangeWriteForm(true);
		
	},
	
	onEdit: function(){
		var me = this,
			record = me.getSelectedOne(),
			formStore = Ext.create('YSYS.store.board.BoardDtl');
		
		if(!record){
			Ext.Msg.alert('알림', '수정할 노트를 선택하세요.');
			return;
		}

		formStore.load({
			params:{
				bb_id: record.get("bb_id"),
				bbm_id: record.get("bbm_id")
			},
			callback: function(formStoreRecords, operation, success) {
				if (!Ext.isEmpty(formStoreRecords)) {
					if(formStoreRecords[0].get('bbm_del_yn') == 'Y'){
						Ext.Msg.alert('알림', '삭제된 게시글입니다.');
						me.getGrid().getStore().reload();
						return;
					}
					
					me.fileCount = 0;
					me.formStatus = 'edit';
					
					var inputForm = me.getForm().down('form[name=inputForm]');
					var fileAttach = me.getForm().down('form[name=fileAttach]');
					
					me.getForm().down('grid[name=fileList]').getStore().removeAll();
					fileAttach.doLayout();
					
					me.loadBoardInfoData('form', record.get('bb_id'), record.get('bbm_id'));
				}
			}
		});
		
	},
	
	onReplyBoard: function(){
		var me = this,
			record = me.getSelectedOne(),
			formStore = Ext.create('YSYS.store.board.BoardDtl');
		
		if(!record){
			Ext.Msg.alert('알림', '답글을 작성할 노트를 선택하세요.');
			return;
		}
		
		if(record.get('reply') != ""){
			Ext.Msg.alert('알림', '답글에 답글은 등록할 수 없습니다.<br>다른 목록을 선택 후 다시 시도해주십시오.');
			return;
		}

		formStore.load({
			params:{
				bb_id: record.get("bb_id"),
				bbm_id: record.get("bbm_id")
			},
			callback: function(formStoreRecords, operation, success) {
				if (!Ext.isEmpty(formStoreRecords)) {
					if(formStoreRecords[0].get('bbm_del_yn') == 'Y'){
						Ext.Msg.alert('알림', '삭제된 게시글입니다.');
						me.getGrid().getStore().reload();
						return;
					}
					
					me.fileCount = 0;
					
					me.formStatus = 'reply';
					me.getForm().down('form[name=inputForm]').getForm().reset();
					me.getForm().down('ux-board-Editor').reset();
					me.getForm().down('form[name=inputForm]').getForm().setValues([{id: 'bb_id', value: record.get('bb_id')},{id: 'bbm_id', value: record.get('bbm_id')},{id:'usr_id', value: UserInfo.getId()}]);
					
					me.getForm().down('grid[name=fileList]').getStore().loadData([],false);
					
					me.getMain().getLayout().setActiveItem(1);
					me.onChangeWriteForm(true);
				}
				
			}
		});
	},
	
	onDownloadFile: function(btn){
		var me = this;
		
		if(btn.from && btn.from == 'form'){
			var records = me.getForm().down('grid[name=fileList]').getSelectionModel().getSelection();
		}
		else if(btn.from && btn.from == 'summary'){
			var records = me.getSummary().down('grid[name=fileList]').getSelectionModel().getSelection();
		}
		
		if(Ext.isArray(records) && records.length > 0){
			var record = records[0];
			var file_id = record.get('file_id');
			var div_cd = me.divcd;
			
			if(!file_id){
				Ext.Msg.alert('알림', '다운로드 할 수 없는 파일입니다.');
				return;
			}
			
			var hiddenIFrameId = 'fileDownload';
			var iframe = document.getElementById(hiddenIFrameId);
			if (iframe === null) {
				iframe = document.createElement("iframe");
				iframe.name = hiddenIFrameId;
				iframe.id = hiddenIFrameId;
				iframe.style.display = 'none';
				document.body.appendChild(iframe);
			}
			iframe.src = '/ysys/webdownload?divcd='+div_cd+'&file_id='+file_id;
			
		}
	},

	onSelect: function () {
	},
	
	getSelected: function(rtnArray) {
		var me = this,
		list = me.getGrid(),
		selModel = list.getSelectionModel(),
		records = selModel.getSelection();
		
		if (rtnArray) {
			return records;
		} else {
			return records[0];
		}
	},
	
	getSelectedOne: function() {
		var me = this;
		return me.getSelected(false);
	},

	onResize: function (self) {	
	},
	onFormReset: function(){
	},
	onAddFile: function(ff, value, eOpts ){
		
		var form = this.getNewform().getForm();
		
		 var fileinfo = ff.fileInputEl.dom.files[0];
		 
		 var data = {};		 
		 data.dir= fileinfo.name;
		 data.name= fileinfo.name;
		 data.smax= fileinfo.size;
		 data.type= fileinfo.type;
		 
			Ext.Ajax.request({
				method : 'POST',
				url: '/ysys/webupload?cmd=upload',
				params: data,			
				success: function(response){
					var text = response.responseText;
					var xml = response.responseXML;			 
					var data = Ext.DomQuery.selectNode('record', xml); 
					var json_data = this.xmlToJson(data) ;
					
					var newData = {};
				},
				scope: this
			});	
		 
	},
	/* 기존 저장버튼 클릭시 파일을 일괄등록하던 부분이 파일을 추가할때마다 등록하는 방식으로 변경(2014.04.10 임찬모)*/
	fileChange: function(self, value){
		var me = this,
			filename_arr = value.split("\\"),
			file_nm = filename_arr[filename_arr.length - 1],
			viewStore = me.getForm().down('grid[name=fileList]').getStore(),
			fileuploadform = me.getForm().down('form[name=fileAttach]'),
			av_obj = new Object();
		
		/* 파일 확장자 선택이 잘못된 경우의 제한기능 추가. 2014.10.10 g.c.Shin */
		av_obj.file_nm = file_nm;
		av_obj.file_obj = self;
		if(!fn_fileExtensionCheck(av_obj)){
			return;
		}
		
		fileuploadform.getForm().submit({
			headers: {'Content-Type':'multipart/form-data; charset=UTF-8'},
			url: '/ysys/webupload?cmd=upload&divcd=001',
			waitMsg: '첨부파일을 업로드 중입니다...',

			success: function(form, action) {
			},
			failure: function(form, action) {
				var datas = Ext.decode(action.response.responseText),
				records = datas.data.record,
				filesize = me.getFileSizeByte(records.file_size);

				/*업로드 완료 후 스토어에 한 건 추가*/
				viewStore.add({
					file_id: records.file_id,
					file_nm: file_nm,
					file_size_string: filesize
				});
				
				/*수정버튼 활성화. 2014.08.25 g.c.Shin*/
				me.getForm().down('button[action=save]').setDisabled(false);
			}
		});
	},
	
	onSelectFileListInSummary: function(selModel, records){
		var me = this;
			
		if(records.length > 0){
			me.getSummary().down('button[action=download]').setDisabled(false);
		}
		else{
			me.getSummary().down('button[action=download]').setDisabled(true);
		}
	},
	
	onSelectFileList: function(selModel, records){
		var me = this;
			
		if(records.length > 0){
			me.getForm().down('fieldcontainer[name=filebuttons]').down('button[action=delFile]').setDisabled(false);
			me.getForm().down('fieldcontainer[name=filebuttons]').down('button[action=download]').setDisabled(false);
		}
		else{
			me.getForm().down('fieldcontainer[name=filebuttons]').down('button[action=delFile]').setDisabled(true);
			me.getForm().down('fieldcontainer[name=filebuttons]').down('button[action=download]').setDisabled(true);
		}
	},
	
	onDeleteFile: function(){
		var me = this,
			records = me.getForm().down('grid[name=fileList]').getSelectionModel().getSelection();
			
		if(records.length > 0){
			var record = records[0];
			var index = me.getForm().down('grid[name=fileList]').getStore().indexOfTotal(record);
			
			me.getForm().down('grid[name=fileList]').getStore().removeAt(index);
			me.getForm().down('form[name=fileAttach]').doLayout();
			
			/*수정버튼 활성화. 2014.08.25 g.c.Shin*/
			me.getForm().down('button[action=save]').setDisabled(false);
		}
		
	},
	
	onTabClose : function (tab, eOpts) {
		var me = this;
		if(me.getMain().getLayout().getActiveItem().getXType() == 'ux-board-writeForm') {
			me.setIsTabClose(true);
			me.setEventTab(tab);
			me.onFormClose();
			return false;
		}
		else {
			return true;
		}
	},
	
	onFormClose: function () {	
		var me = this,
			saveFlag = me.getForm().down('button[action=save]').isDisabled();
		
		if(!saveFlag){
			Ext.Msg.show({
				title: '알림',
				msg: '게시글이 변경되었습니다. 저장하시겠습니까?',
				buttons: Ext.Msg.YESNOCANCEL,
				fn: function(btn){
					if(btn == 'yes'){
						me.onFormSave();
					}
					else if(btn == 'no'){
						me.onCancel();
					}
				}
			});
		}
		else{
			me.onCancel();
		}
	},
	
	onCancel: function(){
		var me = this;
		
		var lockStatus = me.unLock('', '', function (responseText, bb_id, bbm_id) {
			me.formStatus = "";
			me.bbm_ctt = "";
			if(me.getIsTabClose()) {
				me.setIsTabClose(false);
				me.getEventTab().close();
				return false;
			}
			var _grid = me.getGrid();
			lastOptions = _grid.getStore().lastOptions
			Ext.apply(lastOptions, {
				 callback: function(records, options) {
				 	Ext.Array.each(records, function (record, index, countriesItSelf) {
				 		if(String().concat(bb_id, bbm_id, UserInfo.ChannelDivisionCode) == String().concat(record.get('bb_id'), record.get('bbm_id'), record.get('ch_div_cd'))){
							_grid.getSelectionModel().select(record);
						}
				 	});
				 	me.getMain().getLayout().setActiveItem(0);
					me.onChangeWriteForm(false);
					delete me.getGrid().getStore().lastOptions.callback;
					if(me.getIsTabClose()) {
				 		me.setIsTabClose(false);
						me.getEventTab().close();
					}
				 }
			});
			
			if(!Ext.isEmpty(me.getGrid())){
				_grid.getStore().reload(lastOptions);
			}
		});
		
		me.getMain().getLayout().setActiveItem(0);
		me.onChangeWriteForm(false);
		
		if(!lockStatus && me.getIsTabClose()) {
			me.setIsTabClose(false);
			me.getEventTab().close();
		}
	},
	
	onFormSave: function(){
		
		/*2013.11.26 송민정. 방송/인터넷 모니터링 신규 등록*/
		
		var me = this,
			bbm_id = me.getForm().down('hidden[name=bbm_id]').getValue(),
			form = me.getForm().down('form[name=inputForm]').getForm(),
			formValues = form.getValues(),
			title = me.getForm().down('textfield[name=bbm_titl]').getValue(),
			value = me.getForm().down('ux-board-Editor').getValue(),
			expr_dtm = me.getForm().down('datefield[name=bbm_expr_dtm]').getValue();
			
		var div = document.createElement("div");
		div.innerHTML = value;
		var editorValue = div.textContent || div.innerText || "";
		
		if(title.trim()=='' || editorValue.trim()==''){
			Ext.Msg.alert('알림', '제목과 내용을 모두 입력해주세요.');
			return;
		}
		
		/* 첨부파일 리스트 생성 (없을경우에도 빈값으로 넘겨줘야함) - 2014.04.10 임찬모*/
		var fileStore = me.getForm().down('grid[name=fileList]').getStore(),
			fileRecords = [];
		
		if(fileStore.getCount() > 0) {
			for(var i=0; i<fileStore.getCount(); i++) {
				if(fileStore.getAt(i).get('file_id')) {
					fileRecord = {'file_id':fileStore.getAt(i).get('file_id'), 'file_nm': fileStore.getAt(i).get('file_nm')};
					fileRecords.push(fileRecord);
				}
			}
			if(fileRecords.length > 0) {
				me.getForm().down('form[name=inputForm]').down('hidden[name=file_yn]').setValue('Y');
			}
		}
		
		var params = {
			bb_id: me.boardId,
			bbm_id: bbm_id,
			bbm_titl: title,
			bbm_ctt: value,
			bbm_expr_dtm: expr_dtm,
			fileList: Ext.encode(fileRecords),
			noti_yn: "N",
			urg_yn: "N",
			open_yn: "N"
		};
		
		if(this.formStatus == 'new' || this.formStatus == 'edit'){		
			Ext.Ajax.request({
				url: '/ysys/board?cmd=putWrite',
				params: params,
				success: function(response) {
					var responseText = Ext.decode(response.responseText);
					if(responseText.result.success != true && responseText.result.success != 'true'){
						Ext.Msg.alert('알림', responseText.result.msg);
						return;
					}
					
					form.reset();
					me.getForm().down('ux-board-Editor').reset();
					
					if(me.formStatus == 'edit'){
						me.saveBbm_id = formValues.bbm_id;
						me.gridNewBbmId = me.saveBbm_id;
						me.unLock(me.boardId, me.saveBbm_id, function (responseText) { }); }
					else if(me.formStatus == 'new'){
						me.gridNewBbmId = parseInt(responseText.data.record.id);
						me.saveBbm_titl = formValues.bbm_titl;
						me.saveBbm_ctt = formValues.bbm_ctt;
					}
					
					me.bbm_ctt = "";
					me.getMain().getLayout().setActiveItem(0);
					me.onChangeWriteForm(false);
					
					if(me.getIsTabClose()) {
				 		me.setIsTabClose(false);
					 	me.getEventTab().close();
				 	} else {
						me.getGrid().getStore().reload();
				 	}
				},
				scope: this
			});
				
		}
		else if(this.formStatus == 'reply'){
			Ext.Ajax.request({
				url: '/ysys/board?cmd=putReplyBoardM',
				params: params,
				success: function(response) {
					var responseText = Ext.decode(response.responseText);
					if(responseText.result.success != true && responseText.result.success != 'true'){
						Ext.Msg.alert('알림', responseText.result.msg);
						return;
					}
					
					form.reset();
					me.getForm().down('ux-board-Editor').reset();
					
					me.saveBbm_titl = formValues.bbm_titl;
					me.saveBbm_ctt = formValues.bbm_ctt;
					
					me.bbm_ctt = "";	
					me.getGrid().getStore().reload();
					me.getMain().getLayout().setActiveItem(0);
					me.onChangeWriteForm(false);	
					if(me.getIsTabClose()) {
				 		me.setIsTabClose(false);
					 	me.getEventTab().close();
				 	} else {
						me.getGrid().getStore().reload();
				 	}
				},
				scope: this
			});
		}
	},
	
	onFormClickPre: function(){
		var me = this,
			is_Pre = me.getGrid().getSelectionModel().selectPrevious(),
			record = me.getSelectedOne();
		
		if(is_Pre){
			me.getForm().down('grid[name=fileList]').getStore().removeAll();
			
			me.loadBoardInfoData('form', record.get('bb_id'), record.get('bbm_id'));
			
		}
		else{
			Ext.Msg.alert('알림', '이전 게시물이 없습니다.');
		}
	},
	
	onFormClickNext: function(){
		var me = this,
			is_Next = me.getGrid().getSelectionModel().selectNext(),
			record = me.getSelectedOne();
			
		if(is_Next){			
			me.getForm().down('grid[name=fileList]').getStore().removeAll();
			
			me.loadBoardInfoData('form', record.get('bb_id'), record.get('bbm_id'));
		}
		else{
			Ext.Msg.alert('알림', '다음 게시물이 없습니다.');
		}
	},
	
	
	onFormUpdate: function(){
		if(!this.getEditform().isValid()){
			Ext.Msg.alert('알림','필수값을 입력하세요');
			return;
		}
		var vals = this.getEditform().getValues();	
		
		var noti_yn="Y";
		var open_yn = "Y";
		var urg_yn = "N";
		
		var ckeditor_id = this.getEditform().down('component[target=ckeditor]').getId();
		var cheditor = this.getCKeditor(ckeditor_id);
		vals.bbm_ctt = cheditor.getData();
			
		var xml = {
				'data' : [{
					'record': {
						'bb_id' : vals.bb_id,
						'bbm_id' : vals.bbm_id,
						'ch_div_cd' : vals.ch_div_cd,
						'noti_yn' : noti_yn,
						'open_yn' : open_yn,
						'bbm_titl': vals.bbm_titl,
						'bbm_ctt' :vals.bbm_ctt,
						'bbm_expr_dtm': vals.bbm_expr_dtm
					}
				}]
			};

		var data = {
				xml: Ext.encode(xml)
		};
		
		Ext.Ajax.request({
			method : 'POST',
			url: '/ysys/board?cmd=putUpdateBoardM',
			params: data,			
			success: function(response){				
				var result = Ext.decode(response.responseText);
				if(!result){
					Ext.Msg.alert('알림','전송실패' );
					return;
				}
				if(result.result.success == true || result.result.success == 'true'){
					this.onFormClose();
				}
				Ext.Msg.alert('알림',result.result.msg );
			},
			scope: this
		});
	},
	getCKeditor: function(id){
		 var obj = eval('CKEDITOR.instances.'+id);		
		return obj;
	},
	
	send: function(url, data, msg) {
		var me = this,
			listStore = me.getGrid().getStore(),
			index = me.getGrid().getSelectionModel().getSelection()[0].index;
			me.gridSelectIndex = index - (listStore.lastOptions.limit * (listStore.currentPage-1));
			
		
		Ext.Ajax.request({
			method : 'POST',
			url: url,
			params: data,
			success: function(response) {	
				var responseText = Ext.decode(response.responseText);
				
				if(responseText.result.success != true && responseText.result.success != 'true'){
					Ext.Msg.alert('알림', responseText.result.msg);
					return;
				}
				
				me.getGrid().getStore().reload({
					callback: function(records, options) {
						if(data['del_yn']=='Y') {
							me.getGrid().getSelectionModel().select(records[me.gridSelectIndex] );
						}
						delete me.getGrid().getStore().lastOptions.callback ;
					}
				});
					
				
			},
			scope: this
		});	
	},
		
	loadBoardInfoData: function(target, bb_id, bbm_id, func){
		var me = this,
			formStore = Ext.create('YSYS.store.board.BoardDtl'),
			editYn = 'N';

		if (target == 'lock') {
			editYn = 'Y';
		}
		
		formStore.load({
			params:{
				bb_id: bb_id,
				bbm_id: bbm_id,
				edit_yn: editYn,
				lang: "KOR",
				format: "XML"
			},
			callback: function(formStoreRecords, operation, success) {
				if (formStoreRecords && formStoreRecords.length > 0) {
					var formStoreRecord = formStoreRecords[0];
					
					if(target == 'form'){
						var fileStore = formStoreRecord.get('files');
						
						if(!Ext.isEmpty(fileStore) && Ext.isArray(fileStore) && fileStore.length > 0){
							for(var i=0; i<fileStore.length; i++){
								if(target == 'form'){
									me.getForm().down('grid[name=fileList]').getStore().add({
										file_nm: fileStore[i].file_nm, 
										file_size: fileStore[i].file_size, 
										file_size_string: fileStore[i].file_size_string, 
										file_id: fileStore[i].file_id, 
										file_loc: fileStore[i].file_loc
									});
								}
							}
						}				
					
						var inputForm = me.getForm().down('form[name=inputForm]');
						inputForm.getForm().loadRecord(formStoreRecord);
						
						me.getForm().down('form[name=inputForm]').getForm().setValues([{id: 'bb_id', value: bb_id},{id: 'bbm_id', value: bbm_id},{id:'usr_id', value: UserInfo.getId()}]);
						me.getForm().down('ux-board-Editor').setValue(formStoreRecord.get('bbm_ctt'));
						me.bbm_ctt = me.getForm().down('ux-board-Editor').getValue();					
						me.getMain().getLayout().setActiveItem(1);
						me.onChangeWriteForm(true);
					}
					else if(target == 'summary'){
						/* 탭 종료로 화면이 닫힌 경우 버그발생을 방지함. 2014.12.26 g.c.Shin */
						if(Ext.isEmpty(me.getGrid())){
							return;
						}
						var index = me.getGrid().getSelectionModel().getSelection()[0].index,
							page = me.getGrid().getSelectionModel().getSelection()[0].store.currentPage,
							limit = me.getGrid().getStore().lastOptions.limit,
							rowNum = index-((page-1)*limit);
							
						var summary = me.getSummary();
						if(!Ext.isEmpty(summary)){
							summary.load(formStoreRecord, rowNum);
						}
					}
					else if(target == 'detail'){
						me.DisPlayDetailView(formStoreRecord);
					}
					else if (target == 'lock') {
						func(formStoreRecord);
					}
				}				
			}
		});
	},
	unLock : function (_bb_id, _bbm_id, func) {
		
		var me = this;
		var grid = me.getGrid();
		var store = grid.getStore();
		var selectRecord = grid.getSelectionModel().getSelection()[0];
		
		var bb_id = _bb_id;
		if(Ext.isEmpty(_bb_id)) {
			if(Ext.isDefined(selectRecord))
				bb_id = selectRecord.get('bb_id');
			else
				return false;
		}
		var bbm_id = (Ext.isEmpty(_bb_id))?selectRecord.get('bbm_id'):_bbm_id;
		
		var unlockParam = {bb_id:bb_id, bbm_id:bbm_id, lck_yn:'N'};
		
		/* unlock */
		Ext.Ajax.request({
			url: '/ysys/board?cmd=putUpdateBoardLck',
			params: unlockParam,
			success: function(response) {
				var responseText = Ext.decode(response.responseText);
				if(typeof(func) == "function") {
					func(responseText, bb_id, bbm_id);
				}
			},
			scope: this
		});
		
		return true;
	}, 
	/* byte 단위로 리턴받은 파일 사이즈를 단위화 시키는 함수*/
	getFileSizeByte: function(file_size){
		var j = -1,
			fileSizeInBytes = file_size,
			byteUnits = new Array(' KB', ' MB', ' GB');

		do {
			fileSizeInBytes = parseInt(fileSizeInBytes) / 1024;
			j++;
		} while (fileSizeInBytes > 1024 && j < byteUnits.length);

		var resultFileSize = Math.max(fileSizeInBytes, 0.1).toFixed(2);

		return resultFileSize.toString()+byteUnits[j];

	},
	
	getPrintParams: function () {
		var me = this,
			record = me.getGrid().getSelectionModel().getSelection();
			
		return {
			bb_id: record[0].data.bb_id,
			bbm_id: record[0].data.bbm_id,
			usr_id: UserInfo.getId(),
			token: UserInfo.getToken(),
			ch_div_cd: UserInfo.getChannelDivisionCode()
		};
	},

	onPrint: function () {
		window.open(Gemiso.config.print.board.monitor.href + '&' + Ext.Object.toQueryString(this.getPrintParams()), Gemiso.config.print.hrefTarget, Gemiso.config.print.windowOpenOption);
	}
});