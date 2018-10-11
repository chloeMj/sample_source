import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { WebSocketService } from '../../common/service/websocket.service';
import { NowResult, SideSlipResult, BrakeResult, SpeedResult } from '../../common/model/nowResult.model';

import * as $ from 'jquery';

//import { StaticDataService } from '../../common/service/staticData.service';
//import { StaticData } from '../../common/model/staticData.model';


interface config {
	title: string;
	sidebar: boolean
}


@Component({
	selector: 'result',
	templateUrl: './result.component.html',
	styleUrls: ['../../../common.css', './result.component.css']
})

export class ResultComponent implements OnInit {
	//staticData: StaticData;
	rssData: any;
	data: config;
	nowResult: any;


	constructor(
		private route: ActivatedRoute,
		private ios: WebSocketService,
		//public staticDataService: StaticDataService 
	) {
		this.nowResult = new NowResult();
		this.nowResult.sideSlip_result = [];
		this.nowResult.sideSlip_result[0] = new SideSlipResult();
		this.nowResult.sideSlip_result[1] = new SideSlipResult();
		this.nowResult.brake_result = [];
		this.nowResult.brake_result[0] = new BrakeResult();
		this.nowResult.brake_result[1] = new BrakeResult();
		this.nowResult.brake_result[2] = new BrakeResult();
		this.nowResult.brake_result[3] = new BrakeResult();
		this.nowResult.brake_result[4] = new BrakeResult();
		this.nowResult.speed_result = new SpeedResult();

	}

	ngOnInit() {
		this.data = this.route.snapshot.data as config
		this.ios.sendMessage("sub", { "command": "getResult" });
		// this.staticData = this.staticDataService.getStaticData();
		//console.log(this.staticData);
		//this.data.title = this.route.snapshot.data.title;

		this.ios.getNowResult().subscribe(msg => {
			this.nowResult = msg;
		});
	}


	goHome() {
		this.ios.sendMessage("main", { "command": "autoCheckStop" });
	}

	openPrintPop(){
		var json_nowresult = JSON.stringify(this.nowResult);
		localStorage['nowResult'] = json_nowresult;
		var printResult = window.open("http://127.0.0.1:4300/#/print/result", 'resultPrintPop', 'menubar=0, titlebar=0, toolbar=0, resizable=1, width=1200px, height=900px');

		printResult.print();
		
	}
}