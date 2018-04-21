Ext.define('YSYS.controller.board.privateNote', {
	extend : 'Ext.app.Controller',
	boardId: 14,
	divcd: "001",

	views : [
		'board.privateNote.Main',
		'board.privateNote.sub.List'
	],

	stores: [
		 'YSYS.store.board.PrivateNote',
		 'YSYS.store.board.PrivateNoteDtl'
	],
	
	config : {
		eventTab : null,
		isTabClose : false
	},
	
	init: function() {
		this.control({
			'board-privateNote' : {
				render : this.render,
				beforeclose: this.onTabClose
			},
			'board-privateNote-list' : {
				selectionchange : this.onSelect,
				celldblclick: this.onCelldbClick
			},
			'board-privateNote button[group=change-date]': {
				click: this.onChangeDate
			},
			'board-privateNote textfield[name=search_value]' : {
				specialkey : this.onPressEnter
			},
			'board-privateNote button[action=search]' : {
				click : this.reload
			},
			'board-privateNote checkbox[action=deleted]' : {
				change : this.reload
			},
			'board-privateNote button[checkGrant=true]' : {
				click : this.onCheckButtonGrant
			},
			'board-privateNote button[action=copy_to_artcl]': {
				click: this.copyToArtcl
			},
			/*
			'board-privateNote button[action=new]' : {
				click : this.onMainClickNew
			},
			'board-privateNote button[action=edit]' : {
				click : this.onMainClickEdit
			},
			'board-privateNote button[action=delete]' : {
				click : this.onMainClickDelete
			},
			'board-privateNote button[action=undelete]' : {
				click : this.onMainClickunDelete
			},
			'board-privateNote button[action=write]' : {
				click : this.onWriter
			},
			*/
			'board-privateNote button[action=print]' : {
				click: this.onPrint
			},
			'board-privateNote-summary button[action=download]' : {
				click: this.onDownloadFile
			},
			'board-privateNote ux-mynote-writeForm button[action=download]': {
				click: this.onDownloadFile
			},
			'board-privateNote ux-mynote-writeForm button[action=cancel]': {
				click: this.onFormClickCancel
			},
			'board-privateNote ux-mynote-writeForm button[action=save]': {
				click: this.onFormClickSave
			},
			'board-privateNote ux-mynote-writeForm button[action=preBoard]': {
				click: this.onFormClickPre
			},
			'board-privateNote ux-mynote-writeForm button[action=nextBoard]': {
				click: this.onFormClickNext
			},
			'board-privateNote ux-mynote-writeForm filefield' : {
				change: this.fileChange
			},

			/*메인화면 우측 - 첨부파일 목록 선택시 다운로드 버튼 활성화*/
			'board-privateNote-summary grid[name=fileList]' : {
				selectionchange: this.onSelectFileListInSummary
			},
			/*상세보기 화면 - 첨부파일 목록 선택시 다운로드 버튼 활성화, 파일 삭제버튼 활성화*/
			'board-privateNote ux-mynote-writeForm grid[name=fileList]' : {
				selectionchange: this.onSelectFileList
			},
			'board-privateNote ux-mynote-writeForm button[action=delFile]' : {
				click: this.onDeleteFile
			}
		});
	},

	copyToArtcl: function(btn) {
		/*기사작성 - 참조 부분에서 선택된 값을 기사작성 폼에 채워넣는 기능*/
		var me = this,
			main = me.getMain(),
			records = me.getList().getSelectionModel().getSelection();
			writer_main = me.getWriterMain(),
			writer_records = writer_main.getValues();
		/*기존에 들어있던 값으로 레코드 생성*/
		writer_records = Ext.create('YSYS.model.article.ListModel', writer_records);

		if (records && records.length > 0)
		{
			var formStore = Ext.create('YSYS.store.board.PrivateNoteDtl');
			formStore.load({
				params: {
					note_seq: records[0].get('note_seq')
				},
				callback: function(formStoreRecords, operation, success) {
					/*기존에 들어있던 값 중 일부를 참조부분에서 선택한 값으로 치환*/
					writer_records.data.org_artcl_id = "";
					writer_records.data.mode = config.MODE_COPY_ARTCL_FROM_REFERENCE;
					
					/*기존에 들어있던 값 중 일부를 참조부분에서 선택한 값으로 치환*/
					writer_records.data.artcl_titl = formStoreRecords[0].data.note_titl;
					/*내용은 html 제거*/
					writer_records.data.artcl_ctt = writer_main.stripHtmlWithBr( formStoreRecords[0].data.note_ctt );

					/*수정된 레코드로 기사작성 화면을 reload 해주는 함수*/
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
			component = component.down('board-privateNote');
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

	getSdate: function() {
		return this.getMain().down('datefield[name=start_date]');
	},

	getEdate: function() {
		return this.getMain().down('datefield[name=end_date]');
	},

	getList: function() {
		return this.getMain().down('board-privateNote-list');
	},

	getSummary: function() {
		return this.getMain().down('ux-mynote-summary');
	},
	
	getForm: function(){
		var me = this,
			main = me.getMain();
			
		return main.down('ux-mynote-writeForm');
	},
	
	getDetailView: function(){
		var me = this,
			main = me.getMain();
		
		return main.down('ux-mynote-detailview');
	},

	render: function() {
		var me = this,
			app_id = Ext.Number.from(me.getMain().appId),
			writeGrant = YSYS.ux.Grant.getGrant(app_id, config.GRANT_WRITE),
			artclWriteGrant = YSYS.ux.Grant.getArticleGrant();

		me.app_id = app_id;

		me.writeGrant = writeGrant;
		me.artclWriteGrant = artclWriteGrant;

		if(writeGrant != 'true' && writeGrant != 'false'){
			writeGrant = YSYS.ux.Grant.getActionGrant(me.app_id, writeGrant, "write", "", "");
		}

		if(writeGrant == 'true'){
			Ext.each(me.getMain().query('[grant=write]'), function(item){
				if(item.action == 'write' && artclWriteGrant == 'true'){
					item.setDisabled(false);
				}
				else if(item.action != 'write'){
					item.setDisabled(false);
				}
			});
		}
		else{
			Ext.each(me.getMain().query('[grant=write]'), function(item){
				item.setDisabled(true);
			});
		}

		me.getList().getStore().on('load', function (store, records, successful, eOpts) {
			if(Ext.isArray(records) && records.length > 0){
				me.getMain().down('button[action=print]').setDisabled(false);
				
				var index = 0;

				if(me.formStatus == 'new'){
					index = me.getList().getStore().findBy(function(record) {
						var find_note_titl = me.saveNote_titl,
							find_note_ctt = me.saveNote_ctt,
							note_titl = record.get('note_titl'),
							note_ctt = record.get('note_ctt');

						if (find_note_titl === note_titl && find_note_ctt === note_ctt) {
							return true;
						} else {
							return false;
						}
					});
					me.saveNote_ctt = "";
					me.saveNote_titl = "";
				}
				else if(me.formStatus == 'edit'){
					index = me.getList().getStore().find('note_seq', me.saveNote_seq);
					me.saveNote_seq = "";
				}
				else{
					index = 0;
				}

				if(index > -1){
					me.getList().getSelectionModel().select(records[index]);
				}
				else{
					me.getList().getSelectionModel().select(records[0]);
				}

			}
			else{
				me.getSummary().reset();
				
				/*검색 결과가 없을 경우 수정, 삭제, 삭제취소, 기사화, 게시, 게시취소 등의 버튼은 비활성화된다.*/
				var del_yn = me.getMain().down('checkbox[action=deleted]').getSubmitValue();
				if(del_yn == 'Y'){
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
				me.getMain().down('button[action=write]').setDisabled(true);
				me.getMain().down('button[action=print]').setDisabled(true);
			}
		});
		
		/**
		 * 2014.11.06
		 * 송민정
		 * 기사 참조화면에서의 부서게시판은 삭제데이터 체크박스를 표시하지않도록 처리
		 */
		var component = YSYS.ux.TaskBarManager.getActiveTab();
		if (component.xtype === 'article-writer') {
			me.getMain().down('checkboxfield[name=isdel]').setVisible(false);
		}
		else{
			me.getMain().down('checkboxfield[name=isdel]').setVisible(true);
		}

		me.reload();
	},

	onPressEnter: function(textfield, e){
		if (e.getKey() === e.ENTER) {
			this.reload();
		}
	},

	reload: function() {
		/*var me = this,
			params = me.getParams();

		me.getList().getStore().load({
			params: params
		});*/

		var me = this,
			params = me.getParams();

		me.getList().getStore().getProxy().extraParams = params;
		me.getList().getStore().loadPage(1, {
			callback: function(records){
			}
		});
	},

	getParams: function() {
		var me = this,
			main = me.getMain(),
			s_date = me.getSdate().getValue(),
			e_date = me.getEdate().getValue(),
			params = {}, filter = [], sort = [], store,
			av_obj = new Object();
		
		var searchType = main.down('combo[name=search_type]').getValue();
		var search_value = main.down('textfield[name=search_value]').getValue();

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

		if(searchType == 'ALL'){
			var comboData = main.down('combo[name=search_type]').getStore().data.items;
			var comboDataLength = main.down('combo[name=search_type]').getStore().data.items.length;

			for(var i=0; i<comboDataLength; i++){
				var type = comboData[i].data.cd;
				if(type != 'ALL') {
					filter.push({key: type, value: search_value});
				}
			}
		}
		else{
			filter = [{key: searchType, value: search_value}];
		}

		sort.push({property: 'input_dtm', direction: 'DESC'});

		params = {
			filter: Ext.encode(filter),
			sort: Ext.encode(sort),
			s_date: Ext.Date.format(s_date, 'Y-m-d'),
			e_date: Ext.Date.format(e_date, 'Y-m-d'),
			del_yn: main.down('checkboxfield[name=isdel]').getSubmitValue(),
			bb_id: me.boardId
		};

		return params;
	},

	onSelect: function(selModel, records) {
		var me = this,
			summary = me.getSummary(),
			recordWriteGrant = me.writeGrant;

		if (Ext.isArray(records) && records.length > 0 ) {
			if(recordWriteGrant != 'true' && recordWriteGrant != 'false'){
				var dept_cd = "";
				var inputr_id = records[0].get('inputr_id');

				recordWriteGrant = YSYS.ux.Grant.getActionGrant(me.app_id, recordWriteGrant, "write", dept_cd, inputr_id);
			}
			if(recordWriteGrant == 'true'){
				me.processDisableGroup();
			}

			me.loadPrivateNoteInfoData('summary', records[0].get('note_seq'));
			
			if(YSYS.ux.Util.isMobile()){
				var menu = Ext.create('Ext.menu.Menu', {
					items: [{
						text: records[0].get('note_titl') + ' ' + _text('COMMON_052'),
						handler: function() {
							me.onCelldbClick();
						}
					}]
				});
	
				menu.showAt(Ext.get(selModel.view.focusedRow).getXY());
			}
		} else {
			summary.reset();
		}
	},

	onCelldbClick: function(){
		var me = this,
			record = me.getSelectedOne();
			main = me.getWriterMain();
		
		if(main.xtype == 'article-writer'){
			if(!Ext.isEmpty(record)){
				me.loadPrivateNoteInfoData('detail', record.get('note_seq'));
			}
		}
		else{
			me.onMainClickEdit();
		}
	},

	processDisableGroup: function() {
		var me = this,
			record = me.getSelectedOne(),
			artclWriteGrant = me.artclWriteGrant;

		if (record.get("del_yn").toUpperCase() == "Y") {
			this.getMain().down('button[action=new]').setDisabled(true);
			this.getMain().down('button[action=edit]').setDisabled(true);
			this.getMain().down('button[action=delete]').setDisabled(true);
			this.getMain().down('button[action=undelete]').setDisabled(false);
			if(artclWriteGrant == 'true'){
				this.getMain().down('button[action=write]').setDisabled(true);
			}
		} else {
			this.getMain().down('button[action=new]').setDisabled(false);
			this.getMain().down('button[action=edit]').setDisabled(false);
			this.getMain().down('button[action=delete]').setDisabled(false);
			this.getMain().down('button[action=undelete]').setDisabled(true);
			if(artclWriteGrant == 'true'){
				this.getMain().down('button[action=write]').setDisabled(false);
			}
		}
	},

	getSelectedOne: function() {
		var me = this;

		return me.getSelected(false);
	},

	getSelected: function(rtnArray) {
		var me = this,
		list = me.getList(),
		selModel = list.getSelectionModel(),
		records = selModel.getSelection();

		if (rtnArray) {
			return records;
		} else {
			return records[0];
		}
	},

	onCheckButtonGrant: function(btn){
		var me = this,
			buttonGrant = "",
			records = me.getList().getSelectionModel().getSelection();

		if(btn.grant == "write"){
			buttonGrant = me.writeGrant;
		}

		if(buttonGrant != 'true' && buttonGrant != 'false'){
			if(Ext.isArray(records) && records.length > 0 && btn.action!= 'new' && btn.action != 'write'){
				var dept_cd = "";
				var inputr_id = records[0].get('inputr_id');

				buttonGrant = YSYS.ux.Grant.getActionGrant(me.app_id, buttonGrant, btn.grant, dept_cd, inputr_id);
			}
			else if(btn.action == 'write'){
				buttonGrant = YSYS.ux.Grant.getArticleGrant();
			}
			else{
				buttonGrant = me.getGrant(buttonGrant, btn.grant, "", "");
			}
		}

		if(buttonGrant == 'true'){
			me.RunButtonFunction(btn);
		}
		else{
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
				me.onMainClickunDelete();
			break;
			case 'write':
				me.onWriter();
			break;
		}
	},
	
	
	
	onChangeWriteForm: function(flag){
		var me = this;		
		me.task = {
				run: function(){
					if(me.getMain().xtype == 'board-privateNote'){
						var editorValue = me.getForm().down('ux-board-Editor').getValue();
						
						if(me.formStatus == 'new'){
							var div = document.createElement("div");
							div.innerHTML = editorValue;
							var editorValue = div.textContent || div.innerText || "";
							
							if(editorValue.trim() !=''){
								me.getForm().down('button[action=save]').setDisabled(false);
							}
						}
						else if(me.formStatus == 'edit'){
							if(editorValue != me.note_ctt){
								me.getForm().down('button[action=save]').setDisabled(false);
							}
						}
					}
				},
				interval: 500
			};
		
		me.getForm().down('button[action=save]').setDisabled(true);
		
		if(flag){
			me.getForm().down('textfield[name=note_titl]').on('change', function(){
				me.getForm().down('button[action=save]').setDisabled(false);
			}, me);
			
			if(!Ext.isEmpty(me.task)){
				Ext.TaskManager.start(me.task);
			}
		}
		else{
			me.getForm().down('textfield[name=note_titl]').on('change', Ext.emptyFn, me);
			
			Ext.TaskManager.stopAll();
			me.task = null;
		}
	},

	onMainClickNew: function(){
		var me = this;
		this.fileCount = 0;
		this.formStatus = 'new';
		me.getForm().down('form[name=inputForm]').getForm().reset();
		me.getForm().down('ux-board-Editor').reset();
		
		me.getForm().down('grid[name=fileList]').getStore().loadData([],false);
		me.getForm().down('form[name=inputForm]').getForm().setValues([{id: 'bb_id', value: me.boardId}, {id:'input_dtm', value: Ext.Date.format(new Date(), 'Y-m-d')}]);
		
		me.getMain().getLayout().setActiveItem(1);
		me.onChangeWriteForm(true);
	},

	onMainClickDelete: function() {
		var me = this,
			url = '/zodiac/myapp?cmd=putDeleteMyNote',
			data = {},
			record = me.getSelectedOne(),
			formStore = Ext.create('YSYS.store.board.PrivateNoteDtl');

		if (Ext.isEmpty(record)) return;

		formStore.load({
			params: {
				note_seq: record.get('note_seq')
			},
			callback: function(formStoreRecords, operation, success) {
				if (!Ext.isEmpty(formStoreRecords) && formStoreRecords.length > 0) {

					if(formStoreRecords[0].get('del_yn') == 'Y'){
						Ext.Msg.alert(_text('COMMON_164'), _text('ALERT_MSG_157'));
						me.getList().getStore().reload();
						return;
					}

					Ext.Msg.show({
						title: _text('COMMON_164'),
						msg: _text('ALERT_MSG_208'),
						buttons: Ext.Msg.OKCANCEL,
						fn: function(btnId) {
							if (btnId == 'ok') {
								data = {
									note_seq: record.get("note_seq"),
									del_yn: 'Y',
									ch_div_cd: '001'
								};
			
								me.send(url, data);
							}
						}
					});
				}
			}
		});

	},

	onMainClickunDelete: function(){
		var me = this,
			url = '/zodiac/myapp?cmd=putDeleteMyNote',
			data = {},
			record = me.getSelectedOne(),
			formStore = Ext.create('YSYS.store.board.PrivateNoteDtl');

		if (Ext.isEmpty(record)) return;

		formStore.load({
			params: {
				note_seq: record.get('note_seq')
			},
			callback: function(formStoreRecords, operation, success) {
				if (!Ext.isEmpty(formStoreRecords) && formStoreRecords.length > 0) {

					if(formStoreRecords[0].get('del_yn') == 'N'){
						Ext.Msg.alert(_text('COMMON_164'), _text('ALERT_MSG_164'));
						me.getList().getStore().reload();
						return;
					}

					data = {
						note_seq: record.get("note_seq"),
						del_yn: 'N',
						ch_div_cd: '001'
					};

					me.send(url, data);
				}
			}
		});
	},

	onChangeDate: function(btn){
		var me = this,
			sdateCmp = me.getSdate(),
			edateCmp = me.getEdate(),
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
				Ext.Msg.alert(_text('COMMON_164'), _text('ALERT_MSG_211'));
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

	onMainClickEdit: function() {
		var me = this,
			record = me.getSelectedOne(),
			formStore = Ext.create('YSYS.store.board.PrivateNoteDtl');

		if (Ext.isEmpty(record)) {
			Ext.Msg.alert(_text('COMMON_164'), _text('ALERT_MSG_156'));
			return;
		}

		formStore.load({
			params: {
				note_seq: record.get('note_seq')
			},
			callback: function(formStoreRecords, operation, success) {
				if (!Ext.isEmpty(formStoreRecords) && formStoreRecords.length > 0) {
					if(formStoreRecords[0].get('del_yn') == 'Y'){
						Ext.Msg.alert(_text('COMMON_164'), _text('ALERT_MSG_157'));
						me.getList().getStore().reload();
						return;
					}

					me.formStatus = 'edit';
					me.fileCount = 0;

					var inputForm = me.getForm().down('form[name=inputForm]');
					var fileAttach = me.getForm().down('form[name=fileAttach]');

					me.getForm().down('grid[name=fileList]').getStore().removeAll();
					
					me.loadPrivateNoteInfoData('form', record.get('note_seq'));
				}
			}
		});
	},

	send: function(url, data, msg) {
		var me = this;

		Ext.Ajax.request({
			method : 'POST',
			url: url,
			params: data,
			success: function(response) {
				var responseText = Ext.decode(response.responseText);
				if (responseText.result.success != true && responseText.result.success != 'true') {
					Ext.Msg.alert(_text('COMMON_164'), responseText.result.msg);
					return;
				}
				
				var listStore = me.getList().getStore();
				var sels = me.getList().getSelectionModel().getSelection()[0];
				var index = Ext.isDefined(sels) ? sels.index:0;
				me.gridSelectIndex = index - (listStore.lastOptions.limit * (listStore.currentPage-1));
				
				listStore.reload({
					callback: function(records, options) {
						if(data['del_yn']=='Y') {
							me.getList().getSelectionModel().select(records[me.gridSelectIndex] );
						}
							
						delete me.getList().getStore().lastOptions.callback
					}
				});
			},
			scope: this
		});
	},

	onFormClickSave: function() {
		var me = this,
			form = me.getForm().down('form[name=inputForm]').getForm(),
			formValues = form.getValues(),
			title = me.getForm().down('textfield[name=note_titl]').getValue(),
			value = me.getForm().down('ux-board-Editor').getValue();

		var div = document.createElement("div");
		div.innerHTML = value;
		var editorValue = div.textContent || div.innerText || "";

		if(title.trim()=='' || editorValue.trim()==''){
			Ext.Msg.alert(_text('COMMON_164'), _text('ALERT_MSG_161'));
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

		var fileList = Ext.encode(fileRecords);
		var params = {
			user_id: UserInfo.getId(),
			note_seq: formValues.note_seq,
			note_titl: title,
			note_ctt: value,
			fileList: fileList
		};

		if(me.formStatus == 'new'){
			Ext.Ajax.request({
				url: '/zodiac/myapp?cmd=putWriteMyNote',
				params: params,
				success: function(response) {
					var responseText = Ext.decode(response.responseText);					
					if(responseText.result.success != true && responseText.result.success != 'true'){
						Ext.Msg.alert(_text('COMMON_164'), responseText.result.msg);
						return;
					}
					
					me.saveNote_ctt = value;
					me.saveNote_titl = title;

					me.getForm().down('form[name=inputForm]').getForm().reset();

					me.note_ctt = "";
					me.reload();
					me.getMain().getLayout().setActiveItem(0);
					me.onChangeWriteForm(false);
					
					if(me.getIsTabClose()) {
				 		me.setIsTabClose(false);
					 	me.getEventTab().close();
				 	} else {
						me.getList().getStore().reload();
				 	}
				},
				scope: this
			});
			
		}
		else if(me.formStatus == 'edit'){
			Ext.Ajax.request({
				url: '/zodiac/myapp?cmd=putUpdateMyNote',
				params: params,
				success: function(response) {
					var responseText = Ext.decode(response.responseText);					
					if(responseText.result.success != true && responseText.result.success != 'true'){
						Ext.Msg.alert(_text('COMMON_164'), responseText.result.msg);
						return;
					}
					
					me.saveNote_seq = params.note_seq;
					me.getForm().down('form[name=inputForm]').getForm().reset();

					me.note_ctt = "";
					me.reload();
					me.getMain().getLayout().setActiveItem(0);
					me.onChangeWriteForm(false);
				},
				scope: this
			});
		}
	},

	onFormClickPre: function(){
		var me = this,
			is_Pre = me.getList().getSelectionModel().selectPrevious(),
			record = me.getSelectedOne();

		if(is_Pre){
			me.getForm().down('grid[name=fileList]').getStore().removeAll();

			me.loadPrivateNoteInfoData('form', record.get('note_seq'));

		}
		else{
			Ext.Msg.alert(_text('COMMON_164'), _text('ALERT_MSG_152'));
		}
	},

	onFormClickNext: function(){
		var me = this,
			is_Next = me.getList().getSelectionModel().selectNext(),
			record = me.getSelectedOne();

		if(is_Next){
			me.getForm().down('grid[name=fileList]').getStore().removeAll();

			me.loadPrivateNoteInfoData('form', record.get('note_seq'));
		}
		else{
			Ext.Msg.alert(_text('COMMON_164'), _text('ALERT_MSG_153'));
		}
	},
	
	onTabClose : function (tab, eOpts) {
		var me = this;
		if(me.getMain().getLayout().getActiveItem().getXType() == 'ux-mynote-writeForm') {
			
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
		
		me.formStatus = "";
		me.note_ctt = "";
		me.getMain().getLayout().setActiveItem(0);
		me.onChangeWriteForm(false);
		
		delete me.getList().getStore().lastOptions.callback ;
		if(me.getIsTabClose()) {
	 		me.setIsTabClose(false);
		 	me.getEventTab().close();
	 	}
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
			url: '/zodiac/webupload?cmd=upload&divcd=001',
			waitMsg: _text('ALERT_MSG_212'),

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
			
			/*수정버튼 활성화. 2014.08.25 g.c.Shin*/
			me.getForm().down('button[action=save]').setDisabled(false);
		}
	},

	loadPrivateNoteInfoData: function(target, note_seq){
		var me = this,
			formStore = Ext.create('YSYS.store.board.PrivateNoteDtl');

		formStore.load({
			params: {
				note_seq: note_seq
			},
			callback: function(formStoreRecords, operation, success) {
				if (formStoreRecords && formStoreRecords.length > 0) {
					var formStoreRecord = formStoreRecords[0];
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

					if(target == 'form'){
						var inputForm = me.getForm().down('form[name=inputForm]');
						inputForm.getForm().loadRecord(formStoreRecord);

						me.getForm().down('form[name=inputForm]').getForm().setValues([{id: 'bb_id', value: me.boardId}]);
						me.getForm().down('ux-board-Editor').setValue(formStoreRecord.get('note_ctt'));
						me.note_ctt = me.getForm().down('ux-board-Editor').getValue();
						me.getMain().getLayout().setActiveItem(1);
						me.onChangeWriteForm(true);						
					}
					else if(target == 'summary'){
						var summary = me.getSummary();
						if(!Ext.isEmpty(summary))
							summary.load(formStoreRecord);

					}
					else if(target == 'detail'){
						var detail = me.getDetailView();
						detail.down('ux-mynote-summary').load(formStoreRecord);
						detail.note_seq = formStoreRecord.get('note_seq');
						detail.pre_seq = formStoreRecord.get('pre_id');
						detail.next_seq = formStoreRecord.get('next_id');
						me.getMain().getLayout().setActiveItem(2);						
					}
				}
			}
		});

	},

	onWriter: function() {
		var me = this,
			records = me.getList().getSelectionModel().getSelection(),
			user_id = UserInfo.getId(),
			note_seq = records[0].get('note_seq'),
			formStore = Ext.create('YSYS.store.board.PrivateNoteDtl');

		if (note_seq) {

			formStore.load({
				params: {
					ruser_id: user_id,
					note_seq: note_seq
				},
				callback: function(formStoreRecords, operation, success) {
					if(formStoreRecords)
					{
						var note_ctt = formStoreRecords[0].get('note_ctt');
						note_ctt = YSYS.ux.Util.stripTags(note_ctt);

						var record = Ext.create('YSYS.model.article.ListModel', {
							artcl_titl: formStoreRecords[0].get('note_titl'),
							artcl_ctt: note_ctt
						});

						/*기사화 기능 수정(2014.03.26 송민정)*/
						var editor = YSYS.ux.TaskBarManager.addFromAlias('article-writer', {
							ArticleRecord: record,
							fireWriter: true
						}, true);

						Ext.getCmp('main-container').setActiveTab(editor);

					}
					else
					{
						Ext.Msg.alert(_text('COMMON_164'), _text('ALERT_MSG_213'));
					}
				}
			});

		} else {

		}
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
				records = me.getList().getSelectionModel().getSelection();

		return {
			note_seq: records[0].get('note_seq'),
			usr_id: UserInfo.getId(),
			token: UserInfo.getToken(),
			ch_div_cd: UserInfo.getChannelDivisionCode()
		};
	},

	onPrint: function () {
		window.open(Gemiso.config.print.board.person.href + '&' + Ext.Object.toQueryString(this.getPrintParams()), Gemiso.config.print.hrefTarget, Gemiso.config.print.windowOpenOption);
	}

});