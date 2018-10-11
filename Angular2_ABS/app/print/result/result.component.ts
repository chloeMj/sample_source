import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { NowResult, SideSlipResult, BrakeResult, SpeedResult } from '../../common/model/nowResult.model';

import * as $ from 'jquery';

@Component({
	selector: 'printResult',
	templateUrl: './result.component.html',
	styleUrls: ['../../../common.css', './result.component.css']
})

export class printResultComponent implements OnInit {
	nowResult: any;

	constructor(
		private route: ActivatedRoute,
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
		var nowResult_json = JSON.parse(localStorage['nowResult']);
		this.nowResult = nowResult_json;
	}
}
