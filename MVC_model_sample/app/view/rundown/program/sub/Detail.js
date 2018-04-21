Ext.define('YSYS.view.rundown.program.sub.Detail', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.rundown-program-sub-Detail',

	requires: [
		'YSYS.model.article.ListModel',
		'YSYS.view.rundown.articleRefer.sub.Detail'
	],
	
	ch_type: null,
	
	rd_id: null,

	title: _text('MENU_008_04'),
	modal: true,
	width: 1000,
	height: 450,
	
	layout: 'fit',

	initComponent: function() {
		var me = this;
		var	sm = Ext.create('Ext.selection.CellModel',{ mode: 'SINGLE' });
		var detalStore = Ext.create('YSYS.store.rundown.ProgramDtl');

		Ext.apply(this, {
			
			dockedItems: [{
				dock: 'top',
				xtype: 'toolbar',
				padding: '13 0 13 15',
				style : {
					background : '#000000'
				},
				items: [{
					xtype: 'panel',
					name: 'pgmTitle'
				},'->',{
					xtype: 'panel',
					name: 'broadStatus'
				}]
			}, {
				dock: 'top',
				xtype: 'toolbar',
				padding: '11 0 5 15',
				style : {
					background : '#CCCCCC'
				},
				items: [{
					xtype: 'button',
					text: _text('COMMON_010'),
					action: 'broadcast-history',
					style: {
						marginLeft: '5px',
						marginRight: '5px'
					}
				},{
					xtype: 'button',
					text: _text('COMMON_009'),
					action: 'article-history',
					style: {
						marginRight: '5px'
					}
				},{
					xtype: 'button',
					//text: '=',
					action: 'CaptionPreview',
					style: {
						marginRight: '5px'
					}
				},{
					xtype: 'button',
					text: _text('COMMON_209'),
					action: 'refresh',
					style: {
						marginRight: '5px'
					}
				},{
					xtype: 'displayfield',
					width: 15
				},{
					xtype: 'label',
					readOnly: true,
					text: _text('COMMON_131')
				},{
					xtype: 'textfield',
					readOnly: true,
					name: 'pd1Nm',
					width: 80
				},{
					xtype: 'textfield',
					readOnly: true,
					name: 'pd2Nm',
					width: 80
				},{
					xtype: 'label',
					text: _text('COMMON_132'),
					padding: '0, 0, 0, 10'
				},{
					xtype: 'textfield',
					name: 'anc1Nm',
					readOnly: true,
					width: 80
				},{
					xtype: 'textfield',
					name: 'anc2Nm',
					readOnly: true,
					width: 80
				},{
					xtype: 'combo',
					readOnly: true,
					name: 'studioNm',
					width: 80,
					padding: '0, 0, 0, 10'
				},{
					xtype: 'combo',
					readOnly: true,
					name: 'subRmNm',
					width: 80
				}, '->', {
					xtype: 'button',
					text: _text('COMMON_180'),
					action: 'print',
					menu: {
						items: [{
							text: _text('MENU_008_04_001'),
							action: 'printRundownList'
						},
						/* 런다운 전체인쇄는 기능 제공 안함. 2014.12.23 g.c.Shin
							{
							text: '런다운 전체내용 인쇄',
							action: 'printRundownAll'
						}, */
						{
							text: _text('MENU_008_04_002'),
							hidden : true,	//인쇄 완료 전까지 막아둠. 2015.04.16 g.c.Shin
							action: 'printRundownEach'
						}, {
							text: _text('MENU_008_04_003'),
							hidden : true,	//인쇄 완료 전까지 막아둠. 2015.04.16 g.c.Shin
							action: 'printRundownAncAll'
						}, {
							text: _text('MENU_008_04_004'),
							hidden : true,	//인쇄 완료 전까지 막아둠. 2015.04.16 g.c.Shin
							action: 'printRundownAncEach'
						},'-', {
							text: _text('MENU_008_04_005'),
							hidden : true,	//인쇄 완료 전까지 막아둠. 2015.04.16 g.c.Shin
							action: 'printRundownCGList'
						}, {
							text: _text('MENU_008_04_006'),
							hidden : true,	//인쇄 완료 전까지 막아둠. 2015.04.16 g.c.Shin
							action: 'printRundownVFList'
						}, {
							text: _text('MENU_008_04_007'),
							hidden : true,	//인쇄 완료 전까지 막아둠. 2015.04.16 g.c.Shin
							action: 'printRundownGFList'
						}]
					}
				},{
					xtype: 'button',
					//text: 'ㅁ',
					action: 'Onepanel',
					style: {
						marginRight: '5px'
					}
				},{
					xtype: 'button',
					//text: 'ㅁㅁ',
					action: 'showListTab',
					style: {
						marginRight: '5px'
					}
				}]
			}],

			items: [{
				xtype: 'hiddenfield',
				name: 'rd_id'
			},{
				xtype:'hiddenfield',
				name: 'ch_div_cd'
			},{
				xtype: 'panel',
				name: 'rdDtlMain',
				layout: 'card',
				items: [{
					xtype: 'panel',
					layout: 'border',
					items: [{
						region: 'center',
						xtype: 'grid',
						//selModel: new Ext.selection.CellModel({
						//	mode: 'SIMPLE'
						//}),
						//selType: "cellmodel",
						name: 'detailList',
						store: detalStore,
					    sortableColumns : false,
						autoScroll: true,
						
						viewConfig: {
							stripeRows: false,
					       	getRowClass: function(record, index) {				       		
					       		var css = "",
					       			urg_yn = record.get('urg_yn'),
					       			updt_lck_yn = record.get('updt_lck_yn');
					       						       		
					       		if(updt_lck_yn == "Y"){
					       			//css = 'article-lock';
					       		}
					       		else if(urg_yn == "Y"){
					       			css = 'article-urgent';
					       		}
					       		
					       		if(!Ext.isNumber( parseInt(record.get('rd_ord_mrk')))) {
					       			css = 'article-gray';
					       		}
					       		
					       		if(record.get('apprv_div_cd') == '005'){
					       			css = 'article_disappr';
					       		}
					       		
					       		return css;
					       	}
					    },
		
						columns:[{
							header: _text('COMMON_181'),
							dataIndex: 'rd_ord_mrk',
							style: 'text-align:center',
							width: 50,
							align: 'center',
		   			 		menuDisabled: true
						},{
							header: _text('MENU_008_04_008'),
							width: 80,
							dataIndex: 'videotime',
							style: 'text-align:center',
							align: 'center',
							renderer: function(value, metaData, record, row, col, store, gridView){
								if(record.get('rd_dtl_div_cd') == config.RD_DTL_DIV_OP_RFC && !Ext.isEmpty(record.get('cm_div_nm'))){
									return '-';
								}
								
								if(Ext.isEmpty(value)){
									return '00:00';
								}
								var min = parseInt(parseInt(value)/60);
								var sec = parseInt(parseInt(value)%60);
								
								var min_s = min.toString();
								var sec_s = sec.toString();
								
								if(min_s.length < 2){
					                for(var i=0; i<2-(min_s.length); i++){
					                    min_s = '0'+min_s;
					                }
					            }
					            if(sec_s.length < 2){
					                for(var i=0; i<2-(sec_s.length); i++){
					                    sec_s = '0'+sec_s;
					                }
					            }
								return min_s+":"+sec_s;
							},
		   			 		menuDisabled: true
						},{
							header: _text('MENU_008_02_002'),
							width: 80,
							dataIndex: 'artcl_reqd_sec',
							style: 'text-align:center',
							align: 'center',
							renderer: function(value, metaData, record, row, col, store, gridView){
								if(record.get('rd_dtl_div_cd') == config.RD_DTL_DIV_OP_RFC && !Ext.isEmpty(record.get('cm_div_nm'))){
									return '-';
								}
								
								if(Ext.isEmpty(value)){
									return '00:00';
								}
								var min = parseInt(parseInt(value)/60);
								var sec = parseInt(parseInt(value)%60);
								
								var min_s = min.toString();
								var sec_s = sec.toString();
								
								if(min_s.length < 2){
					                for(var i=0; i<2-(min_s.length); i++){
					                    min_s = '0'+min_s;
					                }
					            }
					            if(sec_s.length < 2){
					                for(var i=0; i<2-(sec_s.length); i++){
					                    sec_s = '0'+sec_s;
					                }
					            }
								
								return min_s+":"+sec_s;
							},
		   			 		menuDisabled: true
						},{
							header: _text('MENU_008_02_003'),
							width: 80,
							dataIndex: 'accrue_artcl_read_sec',
							style: 'text-align:center',
							align: 'center',
		   			 		menuDisabled: true
						},{
							hidden: true,
							header: _text('MENU_008_01_011'),
							width: 80,
							dataIndex: 'brdc_cnt',
							style: 'text-align:center',
							align: 'center',
		   			 		menuDisabled: true
						},{
							header: _text('MENU_005_02_024'),
							width: 50,
							dataIndex: 'brdc_fnsh_yn',
							style: 'text-align:center',
							renderer: function(value, metaData, record, row, col, store, gridView){
								if(value == 'Y'){
		           				 	metaData.tdCls = 'icon-cell';
									return '<img src="'+config.TMP_APPR_ICON+'"/>';
									//return '<font color="red">'+value+'</font>';
								}
								else{
									return '';
								}
							},
							align: 'center',
		   			 		menuDisabled: true
						},{
							header: _text('MENU_008_01_010'),
							width: 50,
							dataIndex: 'mc_st_cd',
							style: 'text-align:center',
							renderer: function(value, metaData, record, row, col, store, gridView){
								switch(value){
									case '001':
										metaData.tdCls = 'icon-cell 18-icon';
										return '<img class="x-grid-row-icon" src="'+config.ICON_02+'" />';
									break;
									case '002':
										metaData.tdCls = 'icon-cell 18-icon';
										return '<img class="x-grid-row-icon" src="'+config.ICON_03+'" />';
									break;
									case '003':
										metaData.tdCls = 'icon-cell 18-icon';
										return '<img class="x-grid-row-icon" src="'+config.ICON_04+'" />';
									break;
									case '004':
										metaData.tdCls = 'icon-cell 18-icon';
										return '<img class="x-grid-row-icon" src="'+config.ICON_05+'" />';
									break;
									case '005':
										metaData.tdCls = 'icon-cell 18-icon';
										return '<img class="x-grid-row-icon" src="'+config.ICON_06+'" />';
									break;
									case '006':
										metaData.tdCls = 'icon-cell 18-icon';
										return '<img class="x-grid-row-icon" src="'+config.ICON_01+'" />';
									break;
								}
								return "";
							},
							align: 'center',
		   			 		menuDisabled: true
						},{
							header: _text('MENU_008_04_013'),
							dataIndex: 'cam_cd',
							style: 'text-align:center',
							width: 50,
							renderer: function(value, metaData, record, row, col, store, gridView){
								switch(value){
									case '001':
										metaData.tdCls = 'icon-cell 18-icon';
										return '<img class="x-grid-row-icon" src="'+config.CAM_ICON_01+'" />';
									break;
									case '002':
										metaData.tdCls = 'icon-cell 18-icon';
										return '<img class="x-grid-row-icon" src="'+config.CAM_ICON_02+'" />';
									break;
									case '003':
										metaData.tdCls = 'icon-cell 18-icon';
										return '<img class="x-grid-row-icon" src="'+config.CAM_ICON_03+'" />';
									break;
								}
								return "";
							},
							align: 'center',
		   			 		menuDisabled: true
						},{
							header: _text('MENU_005_02_018'),
							width: 60,
							dataIndex: 'apprv_div_cd',
							style: 'text-align:center',
							renderer: function(value, metaData, record, row, col, store, gridView){
								var result = "";
								
								if(!Ext.isEmpty(record.get('cm_div_cd'))){
									return record.get('cm_div_nm');
								}
								else if(record.get('rd_dtl_div_cd') == '004'){
									return '제공';
								}
								else{
									
									// 승인이 아니면서 구분이 001 일때 2014-09-22 (성민효대리 guide)
									if (value!=config.CD_ARTCL_GENERAL && record.get('rd_dtl_div_cd') == config.RD_DTL_DIV_ARTCL) {
										metaData.tdCls = 'icon-cell';
										return '<img src="'+config.ICON_07+'"/>';
									}
									
									//기사 승인여부
									/*
										switch(value){
											case config.CD_ARTCL_APPRV:
											break;
											case config.CD_ARTCL_DISAPPRV:
												if(record.get('rd_dtl_div_cd') == config.RD_DTL_DIV_ARTCL){
													result += '1';
												}
											break;
											case config.CD_ARTCL_TMP_APPRV:
												result += '1';
											break;
											default://이슈기사, 일반기사인 경우 외 광고 등의 경우...전 CM같은 값이 들어온다.
												result += value;
											break;
										}
										
										//이슈 기사인지, 일반기사인지
										if(!Ext.isEmpty(record.get('issu_id'))){
											result += '2';
										}
										
										if(result == '1'){
											metaData.tdCls = 'icon-cell';
											return '<img src="'+config.ICON_07+'"/>';
										}
										else if(result == '2'){
											metaData.tdCls = 'icon-cell';
											return '<img src="'+config.ISSU_ICON+'"/>';
										}
										else if(result == '12'){
											metaData.tdCls = 'icon-cell';
											return '<img src="'+config.ISSU_DISAPPRV_ICON+'"/>';
										}
										else{
											return result;
										}
									*/
								}
							},
							align: 'center',
		   			 		menuDisabled: true
						},{
							header: _text('COMMON_038'),
							minWidth:280,
							flex: 1,
							dataIndex: 'artcl_titl',
							style: 'text-align:center',
		   			 		menuDisabled: true,
		   			 		renderer: function(value, metaData, record){
		   			 			return '<font face="'+record.get('fontface')+'" color="'+record.get('fontcolor')+'">'+value+'</font>'
		   			 		}
						},{
							header: _text('COMMON_073'),
							width: 70,
							dataIndex: 'rptr_nm',
							style: 'text-align:center',
							align: 'center',
		   			 		menuDisabled: true
						},{
							header: _text('COMMON_022'),
							width: 60,
							dataIndex: 'cvcount',
							style: 'text-align:center',
							renderer: function(value, metaData, record, row, col, store, gridView){
								if(value == '0' && record.get('video_count') == '0'){
									return '';
								}
								else{
									
									if(record.get('cvcount')=='F') {
										return '<font color="red">CHK</font>';
									}
									else {
										var result = value+'/'+record.get('video_count');
										if(value == record.get('video_count')){
											result = '<font color="blue">' + result + '</font>';
										}
										else{
											result = '<font color="red">' + result + '</font>';
										}
										return result;
									}
								}
							},
							align: 'center'	,
		   			 		menuDisabled: true
						},{
							header: _text('MENU_005_01_010'),
							width: 80,
							dataIndex: 'cap_cnt',
							style: 'text-align:center',
							align: 'center',
							menuDisabled: true
						},{
							header: _text('COMMON_021'),
							width: 60,
							dataIndex: 'cgcount',
							style: 'text-align:center',
							renderer: function(value, metaData, record, row, col, store, gridView){
								if(value == '0' && record.get('grphc_count') == '0'){
									return '';
								}
								else{
									var result = value+'/'+record.get('grphc_count');
									if(value == record.get('grphc_count')){
										result = '<font color="blue">' + result + '</color>';
									}
									else{
										result = '<font color="red">' + result + '</color>';
									}
									return result;
								}
							},
							align: 'center',
		   			 		menuDisabled: true
						}]
					},{
						region: 'east',
						name: 'EastTab',
						header: false,
						xtype: 'ux-article-summary',
						width: 970,
						activeTab: 0,//내용 탭 기본 활성화
						showOne: false,//SNS
						showThree: false,//영상/그래픽(기사)
						showFour: false,//의뢰상태(기사)
						showFive: false,//첨부파일
						showSix: true,//영상/그래픽(런다운)
						showSeven: true,//의뢰상태(런다운)
						collapseMode: 'mini',
						collapsible: true,
						collapsed: true,
						split: true
					}]
				}, {
					xtype: 'article-refer-rundown-detail'
				}]
			}]
		});
		this.callParent(arguments);
	},
	
	load: function() {
		var me = this,
			rd_id = me.down('hiddenfield[name=rd_id]').getValue(),
			ch_div_cd = me.down('hiddenfield[name=ch_div_cd]').getValue(),
			listView_store = me.down('grid').getStore(),
			record = [];
	    	records = [];
	    
	    me.refreshProgramDtlList();
	    me.refreshProgramInfo();
	},

	formatStringtoDate: function(string){
		return Ext.Date.format(Ext.Date.parse(string, 'YmdHis'), 'Y-m-d');
	},

	formatStringtoTime: function(string){
		if(!Ext.isEmpty(string)){
			string = string.toString();

			var hour = string.substr(0, 2);
			var min = string.substr(2, 2);
			var sec = string.substr(4, 2);

			return hour+':'+min;
		}
		return '';
	},
	
	refreshProgramInfo: function(){
		var me = this,
			rd_id = me.down('hiddenfield[name=rd_id]').getValue(),
			ch_div_cd = me.down('hiddenfield[name=ch_div_cd]').getValue(),
			listView_store = me.down('grid').getStore();
			
		if(!Ext.isEmpty(rd_id)){
			
			Ext.Ajax.request({
				method : 'POST',
				url: '/zodiac/rundown?cmd=getSelectRundownDtlAdvanced',
				params: {
					rd_id: rd_id,
					ch_div_cd: ch_div_cd
				},
			    success: function(response) {
			    	var result = Ext.decode(response.responseText);
			    	
			    	if(result.result.success.toString() != "true"){
			    		return;
			    	}
			    	
			    	var	info = result.data.info;
			    	var pgm_nm = info.daily_pgm_nm? info.daily_pgm_nm : info.brdc_pgm_nm;
					/*var title = '<span style="background:#000000;font-weight:bold;font-size:13px;"><font color="#FFFFFF">' + info.brdc_dt + pgm_nm +' '+info.brdc_start_clk+'~'+info.brdc_end_clk + '</font></span>';*/
			    	
					var title = '<span style="background:#000000;font-weight:bold;font-size:13px;">'+
								'<font color="#FFFFFF">'+me.formatStringtoDate(info.brdc_dt)+'</font> '+
								'<font color="#FAC845">'+ me.formatStringtoTime(info.brdc_start_clk)+' ~ '+ me.formatStringtoTime(info.brdc_end_clk) +'</font> '+
								'<font color="#FFFFFF">'+pgm_nm.replace(/ /g, '&nbsp;')+ '</font>'+
							'</span>';
					
					me.down('[name=pgmTitle]').update(title);

					/*
					//#107DFE - 미방송 (주황)
					var broadStatus = '<span style="background:#107DFE;font-size:13px;">미방송</span>';

					if(info.ord_chg_lckyn == 'Y'){
						//#808080 - 방송완료 (회색)
						var broadStatus = '<span style="background:#808080;font-size:13px;">방송완료</span>';
					}
					else if(info.ord_chg_lckyn == 'Y'){
						//#FFAE00 - 오더락 (노랑)
						var broadStatus = '<span style="background:#FFAE00;font-size:13px;">오더락</span>';
					}
					else if(info.ord_chg_lckyn == 'Y'){
						//#EB0000 - 방송중 (빨강)
						var broadStatus = '<span style="background:#EB0000;font-size:13px;">방송중</span>';
					}
					
					console.log(info);
					me.down('[name=broadStatus]').update(broadStatus);
					*/

					me.down('textfield[name=pd1Nm]').setValue(info.pd_1_nm);
					me.down('textfield[name=pd2Nm]').setValue(info.pd_2_nm);
					me.down('textfield[name=anc1Nm]').setValue(info.anc_1_nm);
					me.down('textfield[name=anc2Nm]').setValue(info.anc_2_nm);
					me.down('textfield[name=studioNm]').setValue(info.stdio_nm);
					me.down('textfield[name=subRmNm]').setValue(info.subrm_nm);					
			    },
				scope: this
			});
		}
	},
	
	refreshProgramDtlList: function(){
		var me = this,
			rd_id = me.down('hiddenfield[name=rd_id]').getValue(),
			ch_div_cd = me.down('hiddenfield[name=ch_div_cd]').getValue(),
			listView_store = me.down('grid').getStore();
	    
	    me.resetProgramList();
	    
	    if(!Ext.isEmpty(rd_id)){	
		    listView_store.load({
		    	params: {
					rd_id: rd_id,
					ch_div_cd: ch_div_cd
		    	},
		    	callback: function(records){
		    		if(Ext.isArray(records) && records.length > 0){
		    			for(var i=0; i<records.length; i++){
		    				//records[i].set('artcl_target_gubun', 'R');//set함수 사용할 경우 굉장히 오래걸림. 속도개선을 위해 아래 코드로 변경
		    				records[i].data.artcl_target_gubun = "R";
		    				
							if(records[i].data.rd_dtl_div_cd == config.RD_DTL_DIV_OP_RFC){
								records[i].data.apprv_div_cd = records[i].data.cm_div_nm;
								
							}
						}
						
						me.down('grid').getSelectionModel().select(records[0]);
		    		}
		    	}
		    });
		}
		
	},
	
	resetProgramList: function(){//런다운 상세보기 화면 초기화
		var me = this,
			listView_store = me.down('grid').getStore();
		
		//런다운 상세 리스트
		var ProgramDtlModel = Ext.create('YSYS.model.article.ListModel');
		listView_store.loadData(ProgramDtlModel);
		//우측 기사 정보
		var ListModel = Ext.create('YSYS.model.article.ListModel');
		me.down('[name=EastTab]').load(ListModel);
	}
});
