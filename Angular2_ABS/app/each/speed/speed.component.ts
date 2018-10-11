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
	selector: 'speed',
	templateUrl: './speed.component.html',
	styleUrls: ['./speed.component.css', '../../../common.css'],
})

export class EachSpeedComponent implements OnInit {
    //staticData: StaticData;
	rssData: any;
	data: config;
	value: GaugeClass;
	statusText: string;
	standard: any;
	testList: any;

	dataSource: GaugeClass[] = [{
		name: 'Summer',
		mean: 0,
		subValue: [0],
		endValue: 5000,
		trueValue: 0,
		release:0,
		tick: 10
		//}, {
		//	name: 'Autumn',
		//	mean: 24,
		//	min: 20,
		//	max: 32
		//}, {
		//	name: 'Winter',
		//	mean: 18,
		//	min: 16,
		//	max: 23
		//}, {
		//	name: 'Spring',
		//	mean: 27,
		//	min: 18,
		//	max: 31
		//
	}];
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
		this.value = this.dataSource[0];
		this.statusText = "차량을 진입시키세요";
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

		this.getSpeedStandardVal(40);
	}

	getSpeedStandardVal(val){
		if(val == 40){
			this.standard = {
				value: 40,
				start: 34.8,
				end: 44.8
			};
		}
		else if(val == 60) {
			this.standard = {
				value: 60,
				start: 34.8,
				end: 44.8
			};
		}
	}

	postRss(val) {
		this.ios.sendMessage("message",val);
	}

	subStart() {
		this.ios.sendMessage("sub", { "command": "getResult" });
		this.ios.getSpeed().subscribe(msg => {
			
			let subData = JSON.parse(String(msg));
			console.log(subData)
			this.value.mean = Number(subData.Value) / 10
			if (this.value.trueValue == 0) {
				this.value.subValue[0] = 0;
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
