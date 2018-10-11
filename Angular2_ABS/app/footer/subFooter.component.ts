import { Component, OnInit } from '@angular/core';
import { WebSocketService } from '../common/service/websocket.service';
import { ActivatedRoute, Router, ParamMap, Params } from '@angular/router';
import { NowResult, SideSlipResult, BrakeResult, SpeedResult } from '../common/model/nowResult.model';
import * as $ from 'jquery';


@Component({
  selector: 'sub-footer',
  templateUrl: './subFooter.component.html',
	styleUrls: ['./subFooter.component.css', '../../common.css']
})
export class SubFooterComponent implements OnInit {

	toProcessing: any;
	processed: any;
	nowResult: any;
	processingToggle: any;
	testList: any;

	constructor(
		private route: ActivatedRoute,
		private ios: WebSocketService,
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
		this.nowResult.brake_result[5] = new BrakeResult();
		this.nowResult.speed_result = new SpeedResult();

		this.toProcessing = 0;
		setInterval(() => {
			if (this.processingToggle == 1) {
				this.processingToggle = 0;
			} else {
				this.processingToggle = 1;
			}
		}, 500);

		this.processed = [];

		this.testList = {
			sideSlip: true,
			brake: true,
			speed: true
		};
	}
	ngOnInit() {

		this.ios.getNowResult().subscribe(msg => {
			this.nowResult = msg;
			this.toProcessing = this.nowResult.wheelStatus;
			this.processed[this.toProcessing] = 1;
		});
		
		var eachTestList = this.route.snapshot.queryParams["eachTestList"];	
		var that = this;
		if(eachTestList){
			if($.type(eachTestList) !== "array"){
				eachTestList = [eachTestList];
			}
			$.each(this.testList, function(key, val){
				if($.inArray(key, eachTestList) < 0){
					that.testList[key] = false;
				}
			});
		}
	}

	goHome() {
		this.ios.sendMessage("main", { "command": "autoCheckStop" });
	}

}
