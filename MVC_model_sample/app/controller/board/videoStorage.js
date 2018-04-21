Ext.define('YSYS.controller.board.videoStorage', {
	extend : 'Ext.app.Controller',

	views : [
		'board.videoStorage.Main',
		'board.videoStorage.sub.List',
		'board.videoStorage.sub.Summary',
		'board.videoStorage.sub.Form',
		'board.videoStorage.sub.popup.SelectGroup'
	],

	models: [
	    'YSYS.model.board.videoStorage.ListModel'
	],

	stores: [
	    'YSYS.store.board.videoStorage.List'
	],
	
	config : {
		editFlag : false,
		eventTab : null,
		isTabClose : false
	},

	refs: [{
		ref: 'main',
		selector: 'board-videoStorage',
		xtype: 'board-videoStorage'
	}, {
		ref: 'FromDateNormal',
		selector: 'board-videoStorage datefield[name=start_date]'
	}, {
		ref: 'ToDateNormal',
		selector: 'board-videoStorage datefield[name=end_date]'
	},{
		ref: 'List',
		selector: 'board-videoStorage-list'
	}, {
		ref : 'form',
		selector : 'board-videoStorage-form'
	}, {
		ref: 'summary',
		selector: 'board-videoStorage-Summary'
	}, {
		ref : 'selectGroup',
		selector : 'board-videoStorage-SelectGroup',
		xtype: 'board-videoStorage-SelectGroup',
		autoCreate: true
	}],

	init: function() {
		this.control({
			'board-videoStorage' : {
				render : this.onInit,
				beforeclose: this.onTabClose
			},

			//리스트
			'board-videoStorage-list': {
				selectionchange: this.onListSelect,
				itemdblclick : this.onListDblClick
			},
			'board-videoStorage button[toggleVisible=normal][group=change-date]': {
				click: this.onChangeDateNormal
			},
			'board-videoStorage button[action=search]': {
				click : this.render
			},
			//권한 체크 필요한 버튼
			'board-videoStorage button[checkGrant=true]': {
				click: this.onCheckButtonGrant
			},
			/*
			'board-videoStorage button[action=delete]': {
				click : this.onClickDelete
			},
			*/

			//상세보기
			'board-videoStorage-form button[action=edit]': {
				click : this.onClickEditMetaData
			},
			'board-videoStorage-form button[action=save]': {
				click : this.onSaveMetaData
			},
			'board-videoStorage-form button[action=cancel]': {
				click : this.onCancelMetaData
			},
			'board-videoStorage-form button[action=close]': {
				click : this.onCloseMetaData
			},
			'board-videoStorage-form button[action=delGenre]': {
				click : this.onClickDeleteGenre
			}

		});
	},

	onInit: function(){
		var me = this,
			app_id = Ext.Number.from(me.getMain().appId),
        	writeGrant = YSYS.ux.Grant.getGrant(app_id, config.GRANT_WRITE);//쓰기

        me.app_id = app_id;

        me.writeGrant = writeGrant;//쓰기
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

		me.noImageSrc = config.NOIMAGE;
		Ext.each(this.getForm().query('combo[preLoad=true]'), function (item) {
			item.getStore().load();
		});

		me.getMain().down('board-videoStorage-list').getStore().on('load', function (store, records, successful, eOpts) {
			if(Ext.isArray(records) && records.length > 0){
				me.getList().getSelectionModel().select(records[0]);
			}
			else{
		    	me.getSummary().down('form[name=basic]').getForm().reset();
		    	
				var previewPlayer = '<img src="'+me.noImageSrc+'" style="width:100%;height:100%;padding: 5 5 5 5;">';
		    	me.getSummary().down('[name=videoPlayer]').update(previewPlayer);
			}
		});

		this.render();
	},
	
	onTabClose : function (tab, eOpts) {
		var me = this;
		
		/*
		 * 2014.12.26
		 * EditFlag
		 * 편집모드에서 메뉴를 닫을 때 취소버튼 동작 후 다시 onTabClose가 실행되는데 편집 취소된 상태를 확인하기 위해 사용
		 */
		if(me.getMain().getLayout().getActiveItem().getXType() == 'board-videoStorage-form' && me.getEditFlag()) {
			me.setIsTabClose(true);
			me.setEventTab(tab);
			/*
			 * 2014.12.26 송민정
			 * 메타데이터 변경사항 확인 후 락 해제 및 창 닫기를 위해 onCancelMetaData 함수 사용
			 */
			me.onCancelMetaData();
			return false;
		}
		else {
			return true;
		}
	},

	render: function(option) {
		var me = this,
			List = me.getList(),
			sdateCmp = me.getFromDateNormal(),
			edateCmp = me.getToDateNormal(),
			sdate = sdateCmp.getValue(),
			edate = edateCmp.getValue();
		var options = option || {};
		var v_selectedIdx = 0;
		
		/* 선택된행 유지하는 기능 추가. 2014.11.20 g.c.Shin */
		if(!Ext.isEmpty(List.getSelectionModel().getSelection()[0])){
			v_selectedIdx = List.getSelectionModel().getSelection()[0].index;
		}
		
		if(sdate > edate){
			sdateCmp.setValue(edate);
			edateCmp.setValue(sdate);

			var tmpDate = sdate;
			sdate = edate;
			edate = tmpDate;
		}

		me.getSummary().down('textfield[name=title]').setValue('');
		me.getSummary().down('textfield[name=camdate]').setValue('');
		me.getSummary().down('textarea[name=description]').setValue('');
		var previewPlayer = '<img src="'+me.noImageSrc+'" style="width:100%;height:100%;padding: 5 5 5 5;">';
		me.getSummary().down('[name=videoPlayer]').update(previewPlayer);

		var params = {
				sdate: Ext.Date.format(sdate, 'Y-m-d'),
				edate: Ext.Date.format(edate, 'Y-m-d'),
				del_yn: 'N'
		};
		
		List.getStore().getProxy().extraParams = params;
		
		/* 선택된행 유지하는 기능 추가. 2014.11.20 g.c.Shin */
		//List.getStore().load(options);
		List.getStore().load({
			params: params,
			callback: function(grprecords, operation, success) {
				if(Ext.isEmpty(v_selectedIdx)){
					List.getSelectionModel().select(0);
				}else{
					List.getSelectionModel().select(v_selectedIdx);
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
		else if (btn.action == 'today') {
			sdate = new Date();
			edate = new Date();
		}

		sdateCmp.setValue(sdate);
		edateCmp.setValue(edate);

		this.render();
	},

	onCheckButtonGrant: function(btn){
		var me = this,
			buttonGrant = "",
			records = me.getList().getSelectionModel().getSelection();

		if(btn.grant == "write"){
			buttonGrant = me.writeGrant;
		}

		if(buttonGrant != 'true' && buttonGrant != 'false'){
			if(Ext.isArray(records) && records.length > 0){
				var dept_cd = "";//조건그룹으로 마땅한 값이 없음.
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
        	Ext.Msg.alert('알림', '권한이 없습니다.');
        	return;
        }
	},

	RunButtonFunction: function(btn){
		var me = this;

		switch(btn.action){
			case 'delete':
				me.onClickDelete();
			break;
		}
	},

	onClickDelete: function(){
		var me = this,
			selectRow = me.getList().getSelectionModel().getSelection()[0],
			media_id = selectRow.get('videoid');

		var params = {
			media_id: media_id,
			del_yn: 'Y'
		};

		Ext.Ajax.request({
			method : 'POST',
			url: '/zodiac/myapp?cmd=putDeleteMyVideo',
			params: params,
		    success: function(response) {
		    	var responseText = Ext.decode(response.responseText);
		    	if(responseText.result.success != true && responseText.result.success != 'true'){
		    		Ext.Msg.alert('알림', responseText.result.msg);
		    		return;
		    	}
		    	
		    	var listStore = me.getList().getStore();
	          	var sels = me.getList().getSelectionModel().getSelection()[0];
	          	var index = Ext.isDefined(sels) ? sels.index:0;
	          	me.gridSelectIndex = index - (listStore.lastOptions.limit * (listStore.currentPage-1));
	          
		    	me.render({callback : function (records , operation , success ) {
                        if ( records.length > 0 ) {
                        	me.getList().getSelectionModel().select(records[me.gridSelectIndex] );
                        }
				}});
	           //메시지 출력
	          //Ext.Msg.alert('알림', msg + '가 성공되었습니다');
		    },
			scope: this
		});
	},

	onListSelect: function(selModel, records){
		if(!Ext.isArray(records) || records.length < 1){
			return;
		}

		var me = this,
			videoID = records[0].get('videoid');

		var params = {
			videoID: videoID
		};

		Ext.Ajax.request({
			method : 'POST',
			url: '/zodiac/myapp?cmd=getSelectMyVideoInfo',
			params: params,
		    success: function(response) {
		    	var responseText = Ext.decode(response.responseText);
		    	if(responseText.result.success != true && responseText.result.success != 'true'){
		    		Ext.Msg.alert('알림', responseText.result.msg);
		    		return;
		    	}

		    	var record = responseText.data.record;
		    	var date = Ext.Date.parse(record.camdate, 'Y-m-d H:i:s');
		    	record.camdate = Ext.Date.format(date, 'Y-m-d');

		    	var previewPlayer = '<img src="'+me.noImageSrc+'" style="width:100%;height:100%;padding: 5 5 5 5;">';
		    	if(!Ext.isEmpty(record.previewurl)){
		    		previewPlayer = '<div style="width:100%;height:100%;padding: 5 5 5 5;" align="center"><iframe id="ux-videoStorage-player" height="100%" width="100%" src="/zodiac/streaming/videoProxyPlay.jsp?proxyurl='+ record.previewurl +'"></iframe></div>';
		    	}

		    	me.getSummary().down('form[name=basic]').getForm().setValues(record);
		    	me.getSummary().down('[name=videoPlayer]').update(previewPlayer);
		    },
			scope: this
		});
		
		    			
		if(YSYS.ux.Util.isMobile()){
	        var menu = Ext.create('Ext.menu.Menu', {
	            items: [{
	                text: records[0].get('title') + ' 상세보기',
	                handler: function() {
	                	me.onListDblClick();
	                }
	            }]
	        });
	
	        menu.showAt(Ext.get(selModel.view.focusedRow).getXY());
	    }
	},

	onListDblClick: function() {
		var me = this,
			records = me.getList().getSelectionModel().getSelection(),
			record;
		
		if(Ext.isArray(records) && records.length > 0){
			record = records[0];
		}
		else{
			return;
		}
			
		me.getDtlVideoData(record.get('videoid'), true);
		//return;
	},
	
	getDtlVideoData: function(videoid, playerRefresh){
		var me = this,
			params = {
				videoID: videoid
			};
			
		Ext.Ajax.request({
			method : 'POST',
			url: '/zodiac/myapp?cmd=getSelectMyVideoInfo',
			params: params,
		    success: function(response) {
		    	var result = Ext.decode(response.responseText);
		    	var record = result.data.record;
		    	var infoModel = Ext.create('YSYS.model.board.videoStorage.infoModel', record);
		    	
		    	record.filesize = me.getFileSize(record.filesize);

		    	me.getForm().down('form[name=metaData]').getForm().loadRecord(infoModel);
		    	me.getForm().down('form[name=metaData]').getForm().resetOriginal();
	    		me.getForm().down('form[name=metaData]').down('codecombo[name=subjectcode]').resetOriginalValue();
	    		me.getForm().down('form[name=metaData]').down('codecombo[name=videotypecode]').resetOriginalValue();

		    	if(playerRefresh){
		    		me.getForm().down('[name=previewPlayer]').update('<iframe id="videoStorage-player" style="height:330px;width:100%;" src="/zodiac/streaming/videoProxyPlay.jsp?proxyurl='+ record.previewurl +'"></iframe>');
		    	}
		    	
		    	me.setDisableDtlForm(true);

		    	this.onOpenForm();
				me.getMain().getLayout().setActiveItem(1);
				//me.reload();
		    },
			scope: this
		});
	},
	
	setDisableDtlForm: function(flag){
		var me = this;
		
		me.getForm().down('button[action=edit]').setVisible(flag);
		me.getForm().down('button[action=save]').setVisible(!flag);
		me.getForm().down('button[action=cancel]').setVisible(!flag);
		
		me.getForm().down('form[name=metaData]').getForm().getFields().each(function(item){
			item.setDisabled(flag);
		});
		
		me.getForm().down('grid[name=genreStore]').setDisabled(flag);
		me.getForm().down('button[action=delGenre]').setDisabled(flag);
	},

	getFileSize: function(v){
		var me = this,
			size = parseInt(v),
			k = 1024,
			bytes = ['Bytes', 'KB', 'MB', 'GB', 'TB'],
			result = "";

		if (size === 0) {
			result =  '0 Bytes';
		} else {
			var i = parseInt(Math.floor(Math.log(size) / Math.log(k)),10);

			result = (size / Math.pow(k, i)).toFixed(2) + ' ' + bytes[i];
		}
    	return result;
	},

	onClickDeleteGenre: function(){
		var me = this,
			selGenre = me.getForm().down('grid[name=genreStore]').getSelectionModel().getSelection();

		if(selGenre){
			for(var i = 0; i< selGenre.length; i++){
				selGenre[i].set('genre', 'projectgenre_95fe9958f5827852e47a');
				selGenre[i].set('genreCaption', '전체>미지정');

				var genreIndexName = selGenre[i].get('genreIndex');
				var genreIndex = genreIndexName.substr(genreIndexName.length-1, genreIndexName.length);
				if(genreIndex == '1'){
					genreIndex = '';
				}
				me.getForm().down('textfield[name=genre'+genreIndex+']').setValue('projectgenre_95fe9958f5827852e47a');
				me.getForm().down('textfield[name=genre'+genreIndex+'caption]').setValue('미지정')
			}
		}

		me.getForm().doLayout();
	},
	
	onClickEditMetaData: function(){
		var me = this,
			videoid = me.getForm().down('form[name=metaData]').down('[name=videoid]').getValue();
		
		Ext.Ajax.request({
			url: '/zodiac/inews?cmd=putLockMAMVideo',
			params: {
				videoId: videoid
			},
		    success: function(response) {
		    	var responseText = Ext.decode(response.responseText);
		    	if(responseText.result.success != true && responseText.result.success != "true"){
		    		Ext.Msg.alert('알림', responseText.result.msg);
		    		return;
		    	}
		    	
		    	me.setEditFlag(true);
		    	me.setDisableDtlForm(false);
		    }
		});
		
	},

	onSaveMetaData: function(func){
		var me = this;
		var metaForm = me.getForm(),
			metaDataValue = metaForm.down('form[name=metaData]').getValues();
							
		if(	metaDataValue['genrecaption'] == '미지정' && metaDataValue['genre2caption'] == '미지정' && metaDataValue['genre3caption'] == '미지정')
		//&& metaDataValue['genre4caption'] == '미지정' && metaDataValue['genre5caption'] == '미지정'
		{
			Ext.Msg.alert('알림', '분류 메타데이터를 지정 해 주시기 바랍니다.');
			return;
		}
		
		//UPDATE
    	var params = {
			"title": metaDataValue['title'],
			"description": metaDataValue['description'],
			"subject": metaDataValue['subjectcode'],
			"videoId": metaDataValue['videoid'],
			"videotype": metaDataValue['videotypecode'],
			"genre": metaDataValue['genre'],
			"genre2": metaDataValue['genre2'],
			"genre3": metaDataValue['genre3'],
			"genre4": metaDataValue['genre4'],
			"genre5": metaDataValue['genre5']
		};
		
		Ext.Ajax.request({
			url: '/ysys/inews?cmd=putUpdateMAMUpdateVideo',
			params: params,
		    success: function(response) {
		    	var responseText = Ext.decode(response.responseText);
		    	if(responseText.result.success != true && responseText.result.success != "true"){
		    		Ext.Msg.alert('알림', responseText.result.msg);
		    		return;
		    	}

		    	Ext.Msg.alert('알림', '변경한 내용이 저장되었습니다.');
		    	me.setEditFlag(false);
		    	
		    	if(me.getIsTabClose()) {
		    		me.setIsTabClose(false);
		    		me.getEventTab().close();
		    	} else {
		    		me.render();
		    		if(typeof(func) == "function") {
						func();
						return;
					}
		    		me.getDtlVideoData(metaDataValue.videoid, false);
		    	}
		    },
			scope: this
		});
	},
	
	onCancelMetaData: function(){
		var me = this,
			isFormDirty = me.getForm().down('form[name=metaData]').getForm().isDirty();
		
		if(isFormDirty){
			Ext.Msg.show({
				title: '알림',
				msg: '편집중인 비디오가 있습니다.<br/>취소하시겠습니까?',//'메타데이터 내용이 변경되었습니다.<br/>저장하시겠습니까?',
				buttons: Ext.Msg.OKCANCEL,//YESNOCANCEL,
				fn: function(btn){
					if(btn == 'ok'){
				    	me.getForm().down('form[name=metaData]').getForm().resetOriginal();
			    		me.getForm().down('form[name=metaData]').down('codecombo[name=subjectcode]').resetOriginalValue();
			    		me.getForm().down('form[name=metaData]').down('codecombo[name=videotypecode]').resetOriginalValue();
			    		
						me.cancel();
					}
					else{
						me.setIsTabClose(false);
					}
					/*
					if(btn == 'yes'){
				    	me.getForm().down('form[name=metaData]').getForm().resetOriginal();
			    		me.getForm().down('form[name=metaData]').down('codecombo[name=subjectcode]').resetOriginalValue();
			    		me.getForm().down('form[name=metaData]').down('codecombo[name=videotypecode]').resetOriginalValue();
			    		
						me.onSaveMetaData();
					}
					else if(btn == 'no'){
				    	me.getForm().down('form[name=metaData]').getForm().resetOriginal();
			    		me.getForm().down('form[name=metaData]').down('codecombo[name=subjectcode]').resetOriginalValue();
			    		me.getForm().down('form[name=metaData]').down('codecombo[name=videotypecode]').resetOriginalValue();
			    		
						me.cancel();
					}
					*/
				}
			});
		}
		else{
			me.cancel();
		}
	},
	
	cancel: function(){
		var me = this,
			videoid = me.getForm().down('form[name=metaData]').down('[name=videoid]').getValue();
		
		me.setEditFlag(false);
		me.unLock(videoid, function (videoid) {
			if(me.getIsTabClose()) {
		 		me.setIsTabClose(false);
				me.getEventTab().close();
			}
			else{
				me.getDtlVideoData(videoid, false);
			}
		});
	},
	
	onCloseMetaData: function(){
		var me = this,
			videoid = me.getForm().down('form[name=metaData]').down('[name=videoid]').getValue(),
			isFormDirty = me.getForm().down('form[name=metaData]').getForm().isDirty();
		
		if(isFormDirty){
			Ext.Msg.show({
				title: '알림',
				msg: '편집중인 비디오가 있습니다.<br/>취소하시겠습니까?',//'메타데이터 내용이 변경되었습니다.<br/>저장하시겠습니까?',
				buttons: Ext.Msg.OKCANCEL,//YESNOCANCEL,
				fn: function(btn){
					if(btn == 'ok'){
						me.setEditFlag(false);
						me.unLock(videoid, function () {
							me.getMain().getLayout().setActiveItem(0);
						});
					}
					/*
					if(btn == 'yes'){
				    	me.getForm().down('form[name=metaData]').getForm().resetOriginal();
			    		me.getForm().down('form[name=metaData]').down('codecombo[name=subjectcode]').resetOriginalValue();
			    		me.getForm().down('form[name=metaData]').down('codecombo[name=videotypecode]').resetOriginalValue();
			    		
						me.onSaveMetaData(function(){
							me.getMain().getLayout().setActiveItem(0);
						});
					}
					else if(btn == 'no'){
						me.setEditFlag(false);
						me.unLock(videoid, function () {
							me.getMain().getLayout().setActiveItem(0);
						});
					}
					*/
				}
			});
		}
		else{
			me.unLock(videoid, function () {
				me.getMain().getLayout().setActiveItem(0);
			});
		}
	},
	
	unLock: function(videoid, func){
		var me = this;
				
		Ext.Ajax.request({
			url: '/ysys/inews?cmd=putunLockMAMVideo',
			params: {
				videoId: videoid
			},
		    success: function(response) {
		    	var responseText = Ext.decode(response.responseText);
		    	if(responseText.result.success != true && responseText.result.success != "true"){
		    		Ext.Msg.alert('알림', responseText.result.msg);
		    		return;
		    	}
		    	
		    	if(typeof(func) == "function") {
					func(videoid);
				}
		    },
			scope: this
		});
	},
	
	onOpenForm: function(){
		var me = this,
			genre = "",
			genrecaption = "";
/*
			genre = me.getForm().down('hidden[name=genre]').getValue(),
			genre2 = me.getForm().down('hidden[name=genre2]').getValue(),
			genre3 = me.getForm().down('hidden[name=genre3]').getValue(),
			genre4 = me.getForm().down('hidden[name=genre4]').getValue(),
			genre5 = me.getForm().down('hidden[name=	5]').getValue(),
			genrecaption = me.getForm().down('hidden[name=genrecaption]').getValue(),
			genre2caption = me.getForm().down('hidden[name=genre2caption]').getValue(),
			genre3caption = me.getForm().down('hidden[name=genre3caption]').getValue(),
			genre4caption = me.getForm().down('hidden[name=genre4caption]').getValue(),
			genre5caption = me.getForm().down('hidden[name=genre5caption]').getValue();
*/
		me.getForm().down('grid[name=genreStore]').getStore().removeAll();

		var genreArr = new Array();
		for(var i = 1; i<4; i++){
			if(i == 1){
				genre = me.getForm().down('textfield[name=genre]').getValue();
				genrecaption = me.getForm().down('textfield[name=genrecaption]').getValue();
			}
			else{
				genre = me.getForm().down('textfield[name=genre'+i+']').getValue();
				genrecaption = me.getForm().down('textfield[name=genre'+i+'caption]').getValue();
			}

			me.getForm().down('grid[name=genreStore]').getStore().add({
				genreIndex: '분류'+i,
				genre: genre,
				genreCaption: genrecaption
			});
		}
	}
});