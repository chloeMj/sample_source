import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { WebSocketService } from '../../common/service/websocket.service';
import { GaugeClass } from '../../common/model/dataClass.model';
import * as $ from 'jquery';

//import { StaticDataService } from '../../common/service/staticData.service';
//import { StaticData } from '../../common/model/staticData.model';


interface config {
	title: string;
	sidebar: boolean
}

@Component({
	selector: 'brake',
	templateUrl: './brake.component.html',
	styleUrls: ['../../../common.css', './brake.component.css'],
})

export class EachBrakeComponent implements OnInit {
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
	leftVal : any;
	rightVal : any;
	testList: any;

	dataSource: GaugeClass[] = [
		{
			name: 'Summer',
			mean: 0,
			subValue: [0],
			endValue: 5000,
			trueValue: 0,
			release: 0,
			tick: 1000
		},
		{
			name: 'Summer',
			mean: 0,
			subValue: [0],
			endValue: 2500,
			trueValue: 0,
			release: 0,
			tick: 500
		},
		{
			name: 'Summer',
			mean: 0,
			subValue: [0],
			endValue: 2500,
			trueValue: 0,
			release: 0,
			tick: 500
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
		
	}

	ngOnInit() {
        this.data = this.route.snapshot.data as config
       // this.staticData = this.staticDataService.getStaticData();
        //console.log(this.staticData);
		//this.data.title = this.route.snapshot.data.title;
		//this.subStart();

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

		this.subStart();
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
}
