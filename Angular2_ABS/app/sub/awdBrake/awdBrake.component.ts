import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { WebSocketService } from '../../common/service/websocket.service';
import { GaugeClass } from '../../common/model/dataClass.model';

//import { StaticDataService } from '../../common/service/staticData.service';
//import { StaticData } from '../../common/model/staticData.model';

import * as $ from 'jquery';

interface config {
	title: string;
	sidebar: boolean
}

@Component({
	selector: 'awdBrake',
	templateUrl: './awdBrake.component.html',
	styleUrls: ['../../../common.css', './awdBrake.component.css'],
})

export class awdBrakeComponent implements OnInit {
	//staticData: StaticData;
	rssData: any;
	data: config;
	statusText: string;

	weightValue: GaugeClass;
	leftValue: GaugeClass;
	rightValue: GaugeClass;
	sumValue: number;
	differentValue: number;
	absData: any;
	leftVal: any;
	rightVal: any;
	ovalitySource: any;
	energySources: any;
	types: any;

	dataSource: GaugeClass[] = [
		{
			name: 'Summer',
			mean: 0,
			subValue: [0],
			endValue: 5000,
			trueValue: 0,
			release: 0,
			tick: 5
		},
		{
			name: 'Summer',
			mean: 0,
			subValue: [0],
			endValue: 5000,
			trueValue: 0,
			release: 0,
			tick: 5
		},
		{
			name: 'Summer',
			mean: 0,
			subValue: [0],
			endValue: 5000,
			trueValue: 0,
			release: 0,
			tick: 5
		}
	];
	valueIndicator = {
		type: "rangebar",
		baseValue: 0
	}


	constructor(
		private route: ActivatedRoute,
		private ios: WebSocketService,
		private router: Router,
		//public staticDataService: StaticDataService 
	) {
		this.weightValue = this.dataSource[0];
		this.leftValue = this.dataSource[1];
		this.rightValue = this.dataSource[2];
		this.leftVal = 0;
		this.rightVal = 0;
		this.sumValue = 0;
		this.differentValue = 0;
		this.statusText = "제동시험기에 앞 바퀴를 올려 놓으세요"
		this.absData = "";
		this.ovalitySource = [];

	}

	ngOnInit() {
		this.data = this.route.snapshot.data as config
		// this.staticData = this.staticDataService.getStaticData();
		//console.log(this.staticData);
		//this.data.title = this.route.snapshot.data.title;
		//this.subStart();
		this.subStart();

		var ovalityObj = {};
		var mean = 825;
		var toggle = 0;
		for (var i = 0; i < 100; i++) {
			if (i > 34 && i < 36) {
				mean = mean + 80;
			}
			else if (i >= 36 && i < 39) {
				mean = mean - 92;
			}
			else if (i >= 39 && i < 43) {
				mean = mean + 73;
			}
			else if (i >= 43 && i < 45) {
				mean = mean - 117;
			}
			else if (i >= 45 && i < 50) {
				mean = mean + 130;
			}
			else if (i > 58 && mean < 825) {
				mean = mean + 40;
			}
			else if (i > 58 && mean > 825) {
				mean = mean - 40;
			}
			else {
				if (toggle) {
					toggle = 0;
					mean = mean - 50;
				}
				else {
					toggle = 1;
					mean = mean + 50;
				}				
			}

			ovalityObj = {
				'second': i,
				'mean': mean
			};
			this.ovalitySource.push(ovalityObj);
		}

	}

	subStart() {
		this.ios.sendMessage("sub", { "command": "getResult" });

		this.ios.getWeight().subscribe(msg => {
			let subData = JSON.parse(String(msg));


			this.weightValue.mean = Number(subData.Value)
			if (this.weightValue.mean < 0) {
				this.weightValue.mean = 0;
			}
			this.weightValue.trueValue = subData.TrueValue
			if (this.weightValue.subValue[0] < Number(subData.Value)) {
				this.weightValue.subValue[0] = Number(subData.Value);
			}
			if (this.weightValue.trueValue == 0) {
				this.weightValue.subValue[0] = 0;
			}
		});

		this.ios.getBrakeLeft().subscribe(msg => {
			let subData = JSON.parse(String(msg));

			this.leftValue.mean = Number(subData.Value)
			this.leftVal = this.leftValue.mean;
			this.absData = Math.abs(this.leftValue.mean - this.rightValue.mean);
			if (this.leftValue.mean < 0) {
				this.leftValue.mean = 0;
			}
			this.leftValue.trueValue = subData.TrueValue
			if (this.leftValue.subValue[0] < Number(subData.Value)) {
				this.leftValue.subValue[0] = Number(subData.Value);
			}
			if (this.leftValue.trueValue == 0) {
				this.leftValue.subValue[0] = 0;
			}


		});

		this.ios.getBrakeRight().subscribe(msg => {
			let subData = JSON.parse(String(msg));


			this.rightValue.mean = Number(subData.Value)
			this.rightVal = this.rightValue.mean;
			this.absData = Math.abs(this.leftValue.mean - this.rightValue.mean);
			if (this.rightValue.mean < 0) {
				this.rightValue.mean = 0;


			}
			this.rightValue.trueValue = subData.TrueValue
			if (this.rightValue.subValue[0] < Number(subData.Value)) {
				this.rightValue.subValue[0] = Number(subData.Value);
			}
			if (this.rightValue.trueValue == 0) {
				this.rightValue.subValue[0] = 0;
			}
		});

		this.ios.getBrakeLeftRelease().subscribe(msg => {
			let subData = JSON.parse(String(msg));

			this.leftValue.mean = Number(subData.Value)
			this.leftValue.release = Number(subData.Value)
			if (this.leftValue.release < 0) {
				this.leftValue.release = 0;
			}

		});

		this.ios.getBrakeRightRelease().subscribe(msg => {
			let subData = JSON.parse(String(msg));

			this.rightValue.mean = Number(subData.Value)
			this.rightValue.release = Number(subData.Value)
			if (this.rightValue.release < 0) {
				this.rightValue.release = 0;
			}
		});



		this.ios.getStatusText().subscribe(msg => {
			this.statusText = String(msg);
		});


	}

	customizeText(string) {
		return string.valueText;
	}

	show_ovalityTest() {
		$('div.awdPanel').css("display", "none");
		$('div.ovalityPanel').css("display", "flex");
		$("button[name='ovality_check']").hide();
		$("button[name='ovality_check_close']").show();
	}
	hide_ovalityTest() {
		$('div.awdPanel').css("display", "flex");
		$('div.ovalityPanel').css("display", "none");
		$("button[name='ovality_check']").show();
		$("button[name='ovality_check_close']").hide();

	}
}
