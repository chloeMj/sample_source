import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { WebSocketService } from '../../common/service/websocket.service';
import { HttpApiService } from '../../common/service/http-api.service';
import { Router } from '@angular/router';

import { NowResult, SideSlipResult, BrakeResult, SpeedResult } from '../../common/model/nowResult.model';
import { CarConfigClass } from '../../common/model/carConfigClass.model';

import * as $ from 'jquery';
import { element } from 'protractor';

//import { StaticDataService } from '../../common/service/staticData.service';
//import { StaticData } from '../../common/model/staticData.model';



interface config {
	title: string;
	sidebar: boolean
}


@Component({
  selector: 'main',
  templateUrl: './main.component.html',
	styleUrls: ['../../../common.css', './main.component.css']
})

export class MainComponent implements OnInit {
    //staticData: StaticData;
	rssData: any;
	data: config;
	carType: any;
	axle: any;
	carList:any;

	wheel = [];
	checkMode: any;
	portList: any;
	usedPort: any;
	usedBaud: any;
	nowResult: any;
	subWindowVal: any;

	selectedRow: any;
	autoMode: any;

	test : any;

	constructor(
		private route: ActivatedRoute,
		private ios: WebSocketService,
		private httpApi: HttpApiService,
		private router: Router,
		//public staticDataService: StaticDataService 
	) {
		this.carType = 1;
		this.axle = 1;
		this.usedPort = "";
		this.usedBaud = "";
		this.nowResult = new NowResult();
		//this.nowResult.sideSlip_result = new SideSlipResult();
		this.nowResult.sideSlip_result = [];
		this.nowResult.sideSlip_result[0] = new SideSlipResult();
		this.nowResult.sideSlip_result[1] = new SideSlipResult();
		this.nowResult.brake_result = [];
		this.nowResult.brake_result[0] = new BrakeResult();
		this.nowResult.brake_result[1] = new BrakeResult();
		this.nowResult.brake_result[2] = new BrakeResult();
		this.nowResult.brake_result[3] = new BrakeResult();
		this.nowResult.brake_result[4] = new BrakeResult();
		this.nowResult.brake_result[5] = new BrakeResult();
		this.nowResult.speed_result = new SpeedResult();

		this.carList = [];
		this.carList[0] = new CarConfigClass();
		
		this.subWindowVal = 0;

		this.autoMode = 0;
	}

	ngOnInit() {
        this.data = this.route.snapshot.data as config
       // this.staticData = this.staticDataService.getStaticData();
        //console.log(this.staticData);
		//this.data.title = this.route.snapshot.data.title;
		//this.subStart();
		this.subStart();

		//자동검사 모드 표시
		if(this.autoMode){
			$('div.autoMode > span[name=autoMode]').text('On');
		}
		else{
			$('div.autoMode > span[name=autoMode]').text('Off');
		}
	}

	autoCheckStart() {
		if (this.usedPort == null) {
			alert("포트를 연결하세요")
			return;
		}
		this.checkMode = 1;
		this.ios.sendMessage("main", { "command": "autoCheckStart", "val": { carType: this.carType,axle:this.axle } });
	}

	degreeStart() {
		this.checkMode = 3;
		this.ios.sendMessage("main", { "command": "degreeStart" });
	}

	adjustStart() {
		this.checkMode = 2;
		this.ios.sendMessage("main", { "command": "adjustStart" });
	}

	autoCheckStop() {
		this.checkMode = 3;
		this.ios.sendMessage("main", { "command": "autoCheckStop" });
	}

	portSel(num) {
		if (num != "0") {
			this.ios.sendMessage("main", { "command": "portSel", "val": num });
		}
	}
	baudSel(num) {
		if (num != "0") {
			this.ios.sendMessage("main", { "command": "baudSel", "val": num });
		}
	}


	
	subWindow(num) {
		this.subWindowVal = num;
		this.ios.sendMessage("main", { "command": "subWindow", "val": num });
	}
	
	routerLink(val) {
		this.router.navigate([val]);
	}
	fullscreen() {
		this.ios.sendMessage("main", { "command": "fullscreen"});
	}
	/*
	f_print() {
		var win = window.open('http://127.0.0.1:4300/#/sub');
		win.print();
	}
	*/

	subStart() {
		var test : any;
		document.addEventListener('DOMContentLoaded', function () {
			//console.log(test) // undefined
		  
			setTimeout(function() {
			  //console.log(test) // 'test'
			  this.test = test;
			}, 1000)
		  })

		//this.ios.getMessage().subscribe(msg => {
		//	this.rssData = msg;
		//});
		this.ios.sendMessage("main", { "command": "usedPort" });
		this.ios.sendMessage("main", { "command": "usedBaud" });
		this.ios.sendMessage("sub", { "command": "getResult" });
		this.ios.sendMessage("sub", { "command": "getCarList" });

		this.ios.getUsedPort().subscribe(msg => {
			this.usedPort = msg;
		});

		this.ios.getUsedBaud().subscribe(msg => {
			this.usedBaud = msg;
			if (this.usedBaud == 0) {
				this.usedBaud = "";
			}
		});

		this.ios.getNowResult().subscribe(msg => {
			this.nowResult = msg;
			//this.usedPort = msg;
		});

		this.ios.getCarList().subscribe(msg => {
			this.carList = msg;
			console.log(this.carList)
			//this.usedPort = msg;
		});


		let paramsString = '';
		paramsString = '';
		this.httpApi.get('using_port', paramsString).subscribe(
			data => {
				this.portList = data[0]
				console.log(data);
			},
			({ error }) => {
				console.log(error.message);
			},
			() => {
				//this.router.navigate(['/main/dashboard']),
				//console.log();
			}
		);

		//라디오버튼 클릭 시 체크
		$('input[type="radio"]').click(function () {
			this.checked = true;
		});
	}
	/*
	fadeOut(element) {
		var op = 1;  // initial opacity

		var timer = setInterval(function () {
			if (op <= 0.1) {
				clearInterval(timer);
				element.style.display = 'none';
			}
			element.style.opacity = op;
			element.style.filter = 'alpha(opacity=' + op * 100 + ")";
			op -= op * 0.1;
		}, 50);
	}

	fadeIn(element) {
		var op = 0.1;  // initial opacity

		var timer = setInterval(function () {
			console.log(op);
			if (op >= 1) {
				clearInterval(timer);
				element.style.display = 'block';
			}
			element.style.opacity = op;
			element.style.filter = 'alpha(opacity=' + op * 100 + ")";
			op += op * 0.1;
		}, 50);
	}
	// 오류떠요~~~
	*/
	clickSettingBtn(el){
		var size = {
			width: '950px',
			height: '80%'
		};
		var contents = $('#settingPopContent');
		this.popupShow(el, size, contents, this.ActiveFirstTab);
		contents.css('display', 'block');
				
	}

	ActiveFirstTab(that, el){
		//첫번째 탭 활성화
		var tabTitles = $('#settingPopContent').find('.tab_title');
		var tabTitles_firstChild = tabTitles.first()[0];
		
		that.clickTabTitle(tabTitles_firstChild.id);
	}

	clickIndiBtn(el){
		//선택한 차량 목록의 데이터
		var selectedRow = this.selectedRow;
		if(!selectedRow){
			//선택한 항목이 없을 경우 return
			alert('검사할 차량을 선택해주세요.');
			return false;
		}
		
		var size = {
			width: '500px',
			height: '240px'
		};
		var contents = $('#indiPopContent');
		contents.find('span[name=selectedCarNum]').text(selectedRow.carNumber);

		this.popupShow(el, size, contents, null);
		contents.css('display', 'block');
	}

	popupShow(el, size, contents, callback) {
		var popupBox = $('#PopupBox');
		// document.getElementById('PopupBox');
		var popupTitle = el.getAttribute("popupTitle");
		var popupEl = $('#PopupBoxWin');
		// document.getElementById('PopupBoxWin');
		var is_popup_bg = (document.getElementsByClassName('popupBg').length > 0)? true : false;

		if (is_popup_bg) {
			//this.fadeIn(dim_layer);
			popupBox.show();
		} else {
			//this.fadeIn(popupEl);
			popupEl.css('display', 'block');
		}
		
		//타이틀 표시
		$("span[name=popupTitle]").html(popupTitle);
		//내용 표시
		$.each($("#popupBoxContents").children(), function(i, element){
			$(element).hide();
		});

		if($("#popupBoxContents").has(contents).length > 0 ){
			$("#popupBoxContents").has(contents).show();
		}
		else{
			//empty
			$("#popupBoxContents").append(contents);
		}
		
		//크기 적용
		popupEl.css('width', size.width);
		popupEl.css('height', size.height);

		var elWidth = popupEl.innerWidth(),
			elHeight = popupEl.innerHeight(),
			docWidth = document.documentElement.clientWidth,
			docHeight = document.documentElement.clientHeight;

		// 화면의 중앙에 레이어를 띄운다.
		if (elHeight < docHeight || elWidth < docWidth) {
			popupEl.css('margin-top', '-'+(elHeight / 2).toString()+'px');
			popupEl.css('margin-left', '-' + (elWidth / 2).toString() + 'px');
		} else {
			popupEl.css('top', '0');
			popupEl.css('left', '0');
		}

		 //드래그 이벤트 추가

		this.dragWinElement(popupEl.attr('id'));
		
		var closeBtns = popupEl.find('.closeBtn');
		//.getElementsByClassName('closeBtn');
		for (var i = 0; i < closeBtns.length; i++) {
			closeBtns[i].addEventListener("click", function () {
				//(is_dimBg) ? this.fadeOut(dim_layer) : this.fadeOut(popupEl); // 닫기 버튼을 클릭하면 레이어가 닫힌다.
				(is_popup_bg) ? popupBox.hide() : popupEl.css('display', 'none');
				return false;
			});
		}

		//배경 클릭 시 팝업 닫기
		$('#PopupBox').find('.popupBg').click( function () {
			(is_popup_bg) ? popupBox.hide() : popupEl.css('display', 'none');
		});

		if(typeof callback === 'function'){
			callback(this, el);
		}
	}

	clickTabTitle(targetId) {
		var target, tabPanelNodes, tabPanelNode, nameAttr;
		target = document.getElementById(targetId);
		tabPanelNodes = target.parentElement.childNodes;
		nameAttr = target.getAttribute("name");

		for (var i = 0; i < tabPanelNodes.length; i++) {
			tabPanelNode = tabPanelNodes[i];
			if (tabPanelNode.getAttribute("name") == nameAttr) {
				target.classList.remove("disabled");
				target.classList.add("active");
			}
			else {
				tabPanelNode.classList.remove("active");
				tabPanelNode.classList.add("disabled");
			}
		}

		this.openTab(nameAttr);
	}

	openTab(tabTitleId) {
		var i, tabtitle, tabcontents, tab;
		tabtitle = document.getElementsByName(tabTitleId);
		tabcontents = document.getElementsByClassName("tabContents")[0].childNodes;

		for (i = 0; i < tabcontents.length; i++) {
			tabcontents[i].style.display = "none";
		}

		$('#' + tabTitleId).css('display', 'block');

	}
	
	dragWinElement(target_id) {
		var active = false;
		var currentX;
		var currentY;
		var initialX;
		var initialY;
		var xOffset = 0;
		var yOffset = 0;
		var dragItemHeader = document.getElementById(target_id+'Header');
		var dragItem = document.getElementById(target_id);
		
		dragItemHeader.addEventListener("mousedown", dragMouseDown, false);
		dragItemHeader.addEventListener("mouseup", dragMouseUp, false);
		document.addEventListener("mousemove", dragMouseMove, false);


		function dragMouseDown(e) {
			initialX = e.clientX - xOffset;
			initialY = e.clientY - yOffset;

			active = true;
		}

		function dragMouseUp(e) {
			initialX = currentX;
			initialY = currentY;

			active = false;
		}

		function dragMouseMove(e) {
			if (active) {
				currentX = e.clientX - initialX;
				currentY = e.clientY - initialY;

				xOffset = currentX;
				yOffset = currentY;

				setTranslate(currentX, currentY, dragItem);
			}
		}

		function setTranslate(xPos, yPos, el) {
			el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
		}

	}

	clickSelectAxis(arg) {
		var parentEl = $('div.selectAxisComp');
		
		if (arg == 'auto') {
			$('div.manualAxisItems').hide();
			parentEl.find("div[name='auto']").addClass('selected');
			parentEl.find("div[name='manual']").removeClass('selected');
		}
		else {
			$('div.manualAxisItems').show();
			parentEl.find("div[name='manual']").addClass('selected');
			parentEl.find("div[name='auto']").removeClass('selected');

		}
	}

	mouseOverRow(evnt){
		if(evnt.type != 'mouseover') {
			return;
		}
		var target = $(event.target)[0];
		var parentEl = $(target.parentElement)[0];

		$(parentEl).addClass('hoverRow');
	}
	mouseOutRow(evnt){
		if(evnt.type != 'mouseout') {
			return;
		}
		var target = $(event.target)[0];
		var parentEl = $(target.parentElement)[0];

		$(parentEl).removeClass('hoverRow');

	}
	matchAxleVal(type){
		switch(type){
			case 'f':
				return '1';
			case 'r':
				return '2';
			case '4':
				return '3';
		}
	}
	matchCarTypeVal(type){
		switch(type){
			case '1F1R':
				return '1';
			case '1F2R':
				return '2';
			case '2F2R':
				return '5';
			case '2F3R':
				return '6';
		}
	}
	selectCarListRow(evnt,m){
		if(evnt.type != 'click') {
			return;
		}
		var target = $(event.target)[0];
		var selectedRow = $(target.parentElement)[0];
		var isSelected = $(selectedRow).hasClass('selected');

		var carListTable = $('div.carList').find('table');
		var carListTableRows = carListTable.find('tr');
		//전체 row 강조 표시 제거
		$.each(carListTableRows, function(index, el){
			$(el).removeClass('selected');
		})

		//선택한 row 강조 표시
		if(!isSelected){
			$(selectedRow).addClass('selected');			
		}

		var selectedRow_data = this.carList[$(selectedRow).attr('data-index')];
		this.selectedRow = selectedRow_data;
		//구동축
		$('div.inputValForm').find('input[name=axle][value='+this.matchAxleVal(selectedRow_data.axle)+']').prop('checked', true);
		//축설정
		$('div.inputValForm').find('input[name=carType][value='+this.matchCarTypeVal(selectedRow_data.carType)+']').prop('checked', true);
	}

	clickIndiCheck(evnt){
		var target = $(evnt.target);
		if(target[0].tagName == 'INPUT') return;

		var targetCheckBox = target.find('input:checkbox');
		var targetCheckBoxVal = targetCheckBox.is(":checked");

		targetCheckBox.prop("checked", !targetCheckBoxVal);
	}

	startEachTest(){
		var indiPopupContent = $("div#indiPopContent");
		var checkedIndi = indiPopupContent.find('input:checked');
		if(checkedIndi.length <= 0) return;

		var indis = [];
		$.each(checkedIndi, function(index, indi){
			indis.push(indi.value);
		})

		//console.log(indis);

		this.router.navigate(['each/'+indis[0]], {queryParams: {eachTestList: indis}});
	}
}
