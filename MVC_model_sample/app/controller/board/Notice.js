Ext.define('YSYS.controller.board.Notice', {
	extend: 'Ext.app.Controller',
	boardId: 10,
	divcd: "001",

	views : [
		'board.notice.Main',
		'YSYS.ux.LockInfo'
	],
	
	refs: [{
		ref: 'noticeMain',
		selector: 'board-notice'
	}, {
		ref: 'sdate',
		selector: 'board-notice datefield[name=start_date]'
	}, {
		ref: 'edate',
		selector: 'board-notice datefield[name=end_date]'
	}],
	config : {
		eventTab : null,
		isTabClose : false
	},
	init: function() {
		this.control({
			'board-notice' : {
				render : this.render,
				beforeclose: this.onTabClose
			},
			'board-notice textfield[name=search_value]' : {
				specialkey : this.onPressEnter
			},
			'board-notice button[action=search]' : {
				click : this.reload
			},
			'board-notice checkbox[action=deleted]': {
				change: this.isDelCheck
			},
			/*권한 체크 필요한 버튼*/
			'board-notice button[checkGrant=true]': {
				click: this.onCheckButtonGrant
			},
			/*
			'board-notice button[action=new]' : {
				click : this.onMainClickNew
			},
			'board-notice button[action=edit]' : {
				click : this.onMainClickEdit
			},
			'board-notice button[action=delete]' : {
				click : this.onMainClickDelete
			},
			'board-notice button[action=undelete]' : {
				click : this.onMainClickUnDelete
			},
			'board-notice button[action=publish]' : {
				click : this.onMainClickPublishToggle
			},
			'board-notice button[action=unpublish]' : {
				click : this.onMainClickPublishToggle
			},
			*/
			'board-notice button[group=change-date]': {
				click: this.onChangeDate
			},

			'board-notice ux-board-list' : {
				selectionchange : this.onSelect,
				itemdblclick: this.onDblclick
			},
			/*신규, 수정, 상세보기*/
			'board-notice ux-board-writeForm button[action=save]' : {
				click : this.onFormClickSave
			},
			'board-notice ux-board-writeForm button[action=cancel]' : {
				click : this.onFormClickCancel
			},
			/*이전, 다음*/
			'board-notice ux-board-writeForm button[action=preBoard]': {
				click: this.onFormClickPre
			},
			'board-notice ux-board-writeForm button[action=nextBoard]': {
				click: this.onFormClickNext
			},

			/*파일 등록..*/
			'board-notice ux-board-writeForm fileuploadfield' : {
				change: this.fileChange
			},

			/*상세보기 화면 - 첨부파일 목록 선택시 다운로드 버튼 활성화, 파일 삭제버튼 활성화*/
			'board-notice ux-board-writeForm grid[name=fileList]' : {
				selectionchange: this.onSelectFileList
			},
			
			/*파일 삭제..*/
			'board-notice ux-board-writeForm button[action=delFile]' : {
				click: this.onDeleteFile
			},
			'board-notice ux-board-writeForm button[action=download]' : {
				click: this.onDownloadFile
			},

			/* 프린트*/
			'board-notice button[action=print]' : {
				click: this.onPrint
			}
		});
	},
	
	getMain: function() {
		var component, appId;
		/* component = YSYS.ux.TaskBarManager.getActiveTab(); */
		component = this.getNoticeMain();
		return component;
	},
	
	getGrid: function() {
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

	render: function() {
		var me = this,
			app_id = Ext.Number.from(me.getMain().appId);
			writeGrant = YSYS.ux.Grant.getGrant(app_id, config.GRANT_WRITE),
			noticeGrant = YSYS.ux.Grant.getGrant(app_id, config.GRANT_NOTICE);

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

		me.noticeGrant = noticeGrant;
		if(noticeGrant != 'true' && noticeGrant != 'false'){
			noticeGrant = YSYS.ux.Grant.getActionGrant(me.app_id, noticeGrant, "notice", "", "");
		}

		if(noticeGrant == 'true'){
			Ext.each(me.getMain().query('[grant=notice]'), function(item){
				item.setDisabled(false);
			});
		}
		else{
			Ext.each(me.getMain().query('[grant=notice]'), function(item){
				item.setDisabled(true);
			});
		}

		me.getGrid().getStore().on('load', function (store, records, successful, eOpts) {
			if(Ext.isArray(records) && records.length > 0){
				me.getMain().down('button[action=print]').setDisabled(false);
				var index;
				if(me.saveStatus == 'new'){
					index = me.getGrid().getStore().findBy(function(record) {
						if(String().concat(me.boardId, me.gridNewBbmId, UserInfo.ChannelDivisionCode) == String().concat(record.get('bb_id'), record.get('bbm_id'), record.get('ch_div_cd'))){
							return true
						}
						else {
							return false
						}
					});
					me.saveStatus = "";
					me.saveBbm_titl = "";
					me.saveBbm_ctt = "";
				}
				else if(me.saveStatus == 'edit'){
					index = me.getGrid().getStore().find('bbm_id', me.saveBbm_id);
					me.saveStatus = "";
					me.saveBbm_id = "";
				}
				else if(me.saveStatus == 'other'){
					me.saveStatus = "";
				}
				else{
					index = 0;
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
				me.getMain().down('button[action=publish]').setDisabled(true);
				me.getMain().down('button[action=unpublish]').setDisabled(true);
				me.getMain().down('button[action=print]').setDisabled(true);
			}
		});

		me.reload();

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

		if(search_type == 'ALL'){
			var comboData = main.down('combo[name=search_type]').getStore().data.items;
			var comboDataLength = main.down('combo[name=search_type]').getStore().data.items.length;

			for(var i=0; i<comboDataLength; i++){
				var type = comboData[i].data.cd;
				if(type != 'ALL') {
					filter.push({key: type, value: search_value});
				}
			}
		}
		else
		{
			filter.push({key: search_type, value: search_value});
		}


		sort.push({property: 'INPUT_DTM', direction: 'DESC'});


		params = {
			filter: Ext.encode(filter),
			s_date: Ext.Date.format(s_date, 'YmdHis'),
			e_date: Ext.Date.format(e_date, 'YmdHis'),
			del_yn: main.down('checkboxfield[name=isdel]').getSubmitValue(),
			bb_id: me.boardId
		};

		return params;
	},

	onPressEnter: function(textfield, e){
		if (e.getKey() === e.ENTER) {
			this.reload();
		}
	},

	reload: function() {
		var me = this,
			params = me.getParams();

		me.getGrid().getStore().getProxy().extraParams = params;
		me.getGrid().getStore().loadPage(1);

	},

	onSelect: function(selModel, records) {
		var me = this,
			summary = me.getSummary(),
			recordWriteGrant = me.writeGrant;

		if (Ext.isArray(records) && records.length > 0) {
			if(recordWriteGrant != 'true' && recordWriteGrant != 'false'){
				var dept_cd = "";
				var inputr_id = records[0].get('inputr_id');

				recordWriteGrant = YSYS.ux.Grant.getActionGrant(me.app_id, recordWriteGrant, "write", dept_cd, inputr_id);
			}
			if(recordWriteGrant == 'true'){
				me.processDisableGroup();
			}

			var record = records[0];

			me.loadBoardInfoData('summary', record.get('bb_id'), record.get('bbm_id'));
			
			if(YSYS.ux.Util.isMobile()){
				var menu = Ext.create('Ext.menu.Menu', {
					items: [{
						text: record.get('bbm_titl') + ' ' + _text('COMMON_052'),
						handler: function() {
							me.onDblclick();
						}
					}]
				});
	
				menu.showAt(Ext.get(selModel.view.focusedRow).getXY());
			}
			
		} else {
			summary.reset();
		}
	},

	onDblclick: function(){
		var me = this,
			records = me.getGrid().getSelectionModel().getSelection(),
			recordGrant = me.writeGrant,
			record;
			
		if(Ext.isArray(records) && records.length > 0){
			record = records[0];
		}
		else{
			return;			
		}
		
		var dept_cd = "",
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
							msgTitle : _text('ALERT_MSG_154'),
							artcl_titl : _record.get('bbm_titl'),
							lck_user_nm : String().concat(_record.get('lck_user_nm'), '(', _record.get('lck_user_id'), ')'),
							lck_dtm : _record.get('lck_dtm'),
							inphone : _record.get('inphone'),
							mphone : _record.get('mphone')
						}
						
					}).show();
				} else {
					me.onMainClickEdit();
				}
			
			});
		}
	},

	isDelCheck: function( that, newValue, oldValue, eOpts ){
		var undelete = this.getMain().down('button[action=undelete]');

		if(newValue){
			undelete.enable(true);
		}else{
			undelete.setDisabled(true);
		}

		this.reload();
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

	getSelectedRows: function() {
		var me = this;
		return me.getSelected(true);
	},

	onCheckButtonGrant: function(btn){
		var me = this,
			buttonGrant = "",
			records = me.getGrid().getSelectionModel().getSelection();

		if(btn.grant == "write"){
			buttonGrant = me.writeGrant;
		}
		else if(btn.grant == "notice"){
			buttonGrant = me.noticeGrant;
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
			if(btn.action == 'edit'){ }
			Ext.Msg.alert(_text('COMMON_164'), _text('ALERT_MSG_155'));
			return;
		}
	},

	RunButtonFunction: function(btn){
		var me = this;

		switch(btn.action){
			case 'new':
				me.onMainClickNew();
			break;
			case 'edit':
				me.onMainClickEdit();
			break;
			case 'delete':
				me.onMainClickDelete();
			break;
			case 'undelete':
				me.onMainClickUnDelete();
			break;
			case 'publish':
				me.onMainClickPublishToggle();
			break;
			case 'unpublish':
				me.onMainClickPublishToggle();
			break;
		}
	},
	
	onChangeWriteForm: function(flag){
		var me = this;		
		me.task = {
				run: function(){
					if(me.getMain().xtype == 'board-notice'){
						var editorValue = me.getForm().down('ux-board-Editor').getValue();
						
						if(me.saveStatus == 'new'){
							var div = document.createElement("div");
							div.innerHTML = editorValue;
							var editorValue = div.textContent || div.innerText || "";
							
							if(editorValue.trim() !=''){
								me.getForm().down('button[action=save]').setDisabled(false);
							}
						}
						else if(me.saveStatus == 'edit'){
							var v_return = me.getForm().down('ux-board-Editor').getChangeStatus(me.bbm_ctt);
							
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
	
	onMainClickNew: function() {
		var me = this;

		me.getForm().down('form[name=inputForm]').getForm().reset();
		me.getForm().down('ux-board-Editor').reset();
		
		me.getForm().down('grid[name=fileList]').getStore().loadData([],false);
		me.getForm().down('form[name=inputForm]').getForm().setValues([{id: 'bb_id', value: me.boardId}, {id:'inputr_group_nm', value: UserInfo.getGroupName()}, {id:'bbm_writer', value: UserInfo.getName()}, {id:'input_dtm', value: Ext.Date.format(new Date(), 'Y-m-d')}]);

		me.saveStatus = "new";

		me.getMain().getLayout().setActiveItem(1);
		me.onChangeWriteForm(true);
	},

	onMainClickEdit: function() {
		var me = this,
			record = me.getSelectedOne(),
			formStore = Ext.create('YSYS.store.board.BoardDtl');

		if (Ext.isEmpty(record)) {
			Ext.Msg.alert(_text('COMMON_164'), _text('ALERT_MSG_156'));
			return;
		}

		formStore.load({
			params:{
				bb_id: record.get("bb_id"),
				bbm_id: record.get("bbm_id"),
				edit_yn: 'Y'
			},
			callback: function(formStoreRecords, operation, success) {
				if (!Ext.isEmpty(formStoreRecords)) {
					if(formStoreRecords[0].get('bbm_del_yn') == 'Y'){
						Ext.Msg.alert(_text('COMMON_164'), _text('ALERT_MSG_157'));
						me.getGrid().getStore().reload();
						return;
					}

					me.saveStatus = "edit";

					me.getForm().down('grid[name=fileList]').getStore().removeAll();
					me.loadBoardInfoData('form', record.get('bb_id'), record.get('bbm_id'));
				}
			}
		});
	},

	onMainClickDelete: function() {
		var me = this,
			url = '/zodiac/board?cmd=putDeleteBoardM',
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
						Ext.Msg.alert(_text('COMMON_164'), _text('ALERT_MSG_157'));
						me.getGrid().getStore().reload();
						return;
					}

					if(formStoreRecords[0].get('open_yn') == 'Y'){
						Ext.Msg.alert(_text('COMMON_164'), _text('ALERT_MSG_158'));
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

								me.send(url, data, _text('COMMON_028'));
							}
						}
					});
				}
			}
		});
	},

	onMainClickUnDelete: function() {
		var me = this,
			url = '/zodiac/board?cmd=putDeleteBoardM',
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
					if(formStoreRecords[0].get('bbm_del_yn') == 'N'){
						Ext.Msg.alert(_text('COMMON_164'), _text('ALERT_MSG_164'));
						me.getGrid().getStore().reload();
						return;
					}
					
					data = {
						bb_id: record.get("bb_id"),
						del_yn: 'N',
						bbm_id: record.get("bbm_id")
					};

					me.send(url, data, _text('COMMON_177'));
				}
			}
		});
	},

	onMainClickPublishToggle: function() {
		var me = this,
			url = '/zodiac/board?cmd=putUpdateBoardMOpenYN',
			data = {},
			record = me.getSelectedOne(),
			openYn = (record.get("open_yn").toUpperCase() === 'Y') ? 'N' : 'Y',
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
						Ext.Msg.alert(_text('COMMON_164'), _text('ALERT_MSG_157'));
						me.getGrid().getStore().reload();
						return;
					}
					if(openYn == "N" && (formStoreRecords[0].get('open_yn') == 'N')){
						Ext.Msg.alert(_text('COMMON_164'), _text('ALERT_MSG_159'));
						me.getGrid().getStore().reload();
						return;
					}
					if(openYn == "Y" && (formStoreRecords[0].get('open_yn') == 'Y')){
						Ext.Msg.alert(_text('COMMON_164'), _text('ALERT_MSG_160'));
						me.getGrid().getStore().reload();
						return;
					}

					if(openYn == 'Y'){
						var msg = _text('COMMON_178');
					}
					else{
						var msg = _text('COMMON_179');
					}

					data = {
						bb_id: record.get("bb_id"),
						open_yn: openYn,
						bbm_id: record.get("bbm_id")
					};

					me.saveStatus = "edit";
					me.saveBbm_id = data.bbm_id;

					me.send(url, data, msg);
				}
			}

		});

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

		this.reload();
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
				Ext.Msg.alert(_text('COMMON_164'), '다운로드 할 수 없는 파일입니다.');
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
			iframe.src = '/zodiac/webdownload?divcd='+div_cd+'&file_id='+file_id;
		}
	},

	onFormClickSave: function() {

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
			Ext.Msg.alert(_text('COMMON_164'), _text('ALERT_MSG_161'));
			return;
		}

		if(Ext.Date.format(expr_dtm, 'Y-m-d') < Ext.Date.format(new Date, 'Y-m-d')){
			Ext.Msg.alert(_text('COMMON_164'), _text('ALERT_MSG_162'));
			return;
		}

		/* 첨부파일 리스트 생성 (없을경우에도 빈값으로 넘겨줘야함)*/
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

		var fileList = Ext.encode(fileRecords);
		
		var params = {
			bb_id: me.boardId,
			bbm_id: bbm_id,
			bbm_titl: title,
			bbm_ctt: value,
			bbm_expr_dtm: Ext.Date.format(expr_dtm, 'YmdHis'),
			fileList: fileList,
			noti_yn: "N",
			urg_yn: "N",
			open_yn: "N"
		};
		
		Ext.Ajax.request({
			url: '/zodiac/board?cmd=putWrite',
			params: params,
			success: function(response) {
				var responseText = Ext.decode(response.responseText);
				
				if(responseText.result.success != true && responseText.result.success != 'true'){
					Ext.Msg.alert(_text('COMMON_164'), responseText.result.msg);
					return;
				}
				
				form.reset();
				me.getForm().down('ux-board-Editor').reset();
				
				if(me.saveStatus == 'edit'){
					me.saveBbm_id = formValues.bbm_id;
					me.gridNewBbmId = me.saveBbm_id;
					me.unLock(me.boardId, me.saveBbm_id, function (responseText) { });
				}
				else if(me.saveStatus == 'new'){
					me.gridNewBbmId = parseInt(responseText.data.record.id);
					me.saveBbm_titl = formValues.bbm_titl;
					me.saveBbm_ctt = formValues.bbm_ctt;
				}
				
				me.bbm_ctt = "";
				
				me.getMain().getLayout().setActiveItem(0);
				me.onChangeWriteForm(false);
				
				 /*닫기 여부 판단 하여 store 를 다시 load 할것인지 판단
				 닫기시 load 이벤트 호출 후 발생하는 처리를 무효화 하기 위해 처리 함*/
				if(me.getIsTabClose()) {
			 		me.setIsTabClose(false);
				 	me.getEventTab().close();
			 	} else {
					me.getGrid().getStore().reload();
			 	}
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
			return false;
		}

		fileuploadform.getForm().submit({
			headers: {'Content-Type':'multipart/form-data; charset=UTF-8'},
			url: '/zodiac/webupload?cmd=upload&divcd=001',
			waitMsg: _text('ALERT_MSG_212'),//'첨부파일을 업로드 중입니다...',

			success: function(form, action) { },
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
			
			/*수정버튼 활성화. 2014.08.25 g.c.Shin*/
			me.getForm().down('button[action=save]').setDisabled(false);
		}
	},

	onTabClose : function (tab, eOpts) {
		var me = this;
		
		if(me.getMain().getLayout().getActiveItem().getXType() == 'ux-board-writeForm') {
			me.setIsTabClose(true);
			me.setEventTab(tab);
			me.onFormClickCancel();
			return false;
		}
		else {
			return true;
		}
	},
	
	onFormClickCancel: function() {
		var me = this,
			saveFlag = me.getForm().down('button[action=save]').isDisabled();
		if(!saveFlag){
			Ext.Msg.show({
				title: _text('COMMON_164'),
				msg: _text('ALERT_MSG_151'),
				buttons: Ext.Msg.YESNOCANCEL,
				fn: function(btn){
					if(btn == 'yes'){
						me.onFormClickSave();
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
		/*폼 작성창에서 취소를 눌렀을때 처리*/
		var lockStatus = me.unLock('', '', function (responseText, bb_id, bbm_id) {
			me.saveStatus = "";
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
				 	
				 	delete me.getGrid().getStore().lastOptions.callback ;
					
				}
			});
			
			if(!Ext.isEmpty(me.getGrid())){
				_grid.getStore().reload(lastOptions);
			}
	
	/*
	 * CS 에서는 게시판 List 를 새로고침 해주고 있음
			_grid.getStore().findBy(function(record, id) {
				if(String().concat(bb_id, bbm_id) == String().concat(record.get('bb_id'), record.get('bbm_id'))){
					_grid.getSelectionModel().select(record );
				}
			});
*/
			
		});
		
		me.getMain().getLayout().setActiveItem(0);
		me.onChangeWriteForm(false);
		
		if(!lockStatus && me.getIsTabClose()) {
	 		me.setIsTabClose(false);
			me.getEventTab().close();
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
			Ext.Msg.alert(_text('COMMON_164'), _text('ALERT_MSG_152'));
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
			Ext.Msg.alert(_text('COMMON_164'), _text('ALERT_MSG_153'));
		}
	},

	processDisableGroup: function() {
		var me = this,
			record = me.getSelectedOne();

			if (record.get("open_yn").toUpperCase() == "Y") {
				this.getMain().down('button[action=publish]').setDisabled(true);
				this.getMain().down('button[action=unpublish]').setDisabled(false);
			} else {
				this.getMain().down('button[action=publish]').setDisabled(false);
				this.getMain().down('button[action=unpublish]').setDisabled(true);
			}

			if (record.get("bbm_del_yn").toUpperCase() == "Y") {
				this.getMain().down('button[action=new]').setDisabled(true);
				this.getMain().down('button[action=edit]').setDisabled(true);
				this.getMain().down('button[action=delete]').setDisabled(true);
				this.getMain().down('button[action=undelete]').setDisabled(false);
				this.getMain().down('button[action=publish]').setDisabled(true);
				this.getMain().down('button[action=unpublish]').setDisabled(true);
			} else {
				this.getMain().down('button[action=new]').setDisabled(false);
				this.getMain().down('button[action=edit]').setDisabled(false);
				this.getMain().down('button[action=delete]').setDisabled(false);
				this.getMain().down('button[action=undelete]').setDisabled(true);
			}
	},

	send: function(url, data, msg) {
		var me = this,
			idx = me.getGrid().getSelectionModel().getSelection()[0].index,
			_store = me.getGrid().getStore();
		
			me.gridSelectIndex = idx - (_store.lastOptions.limit * (_store.currentPage-1));
			
			
		Ext.Ajax.request({
			method : 'POST',
			url: url,
			params: data,
			success: function(response) {
				var responseText = Ext.decode(response.responseText);
				if(responseText.result.success != true && responseText.result.success != 'true'){
					Ext.Msg.alert(_text('COMMON_164'), responseText.result.msg);
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
				edit_yn: editYn
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

						me.getForm().down('form[name=inputForm]').getForm().setValues([{id: 'bb_id', value: me.boardId}]);
						me.getForm().down('ux-board-Editor').setValue(formStoreRecord.get('bbm_ctt'));
						me.bbm_ctt = me.getForm().down('ux-board-Editor').getValue();
						
						me.getMain().getLayout().setActiveItem(1);
						me.onChangeWriteForm(true);
					}
					else if(target == 'summary'){
						var summary = me.getSummary();
						if(!Ext.isEmpty(summary))
							summary.load(formStoreRecord);
					}
					else if(target == 'detail'){
						/*var detail = me.getDetailView();
						detail.down('ux-board-summary').load(formStoreRecord);
						detail.bbm_id = formStoreRecord.get('bbm_id');
						detail.preBbm_id = formStoreRecord.get('pre_id');
						detail.nextBbm_id = formStoreRecord.get('next_id');
						detail.bb_id = formStoreRecord.get('bb_id');
						me.getMain().getLayout().setActiveItem(2);*/
						
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
			url: '/zodiac/board?cmd=putUpdateBoardLck',
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
	DisPlayDetailView: function (record) {
		var me = this;
		var detail = me.getDetailView();
		me.getMain().getLayout().setActiveItem(2);
		detail.down('ux-board-summary').load(record);
		detail.bbm_id = record.get('bbm_id');
		detail.preBbm_id = record.get('pre_id');
		detail.nextBbm_id = record.get('next_id');
		detail.bb_id = record.get('bb_id');
						
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
		record = me.getSelectedOne();
		return {
			bb_id: record.get('bb_id'),
			bbm_id: record.get('bbm_id'),
			usr_id: UserInfo.getId(),
			token: UserInfo.getToken(),
			ch_div_cd: UserInfo.getChannelDivisionCode()
		};
	},

	onPrint: function () {
		window.open(Gemiso.config.print.board.notice.href + '&' + Ext.Object.toQueryString(this.getPrintParams()), Gemiso.config.print.hrefTarget, Gemiso.config.print.windowOpenOption);
	}
});