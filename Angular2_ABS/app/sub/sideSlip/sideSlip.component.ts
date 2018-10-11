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
	selector: 'sideSlip',
	templateUrl: './sideSlip.component.html',
	styleUrls: ['../../../common.css', './sideSlip.component.css'],
})

export class SideSlipComponent implements OnInit {
    //staticData: StaticData;
	rssData: any;
	data: config;
	value: GaugeClass;
	statusText: string;
	inValue: any;
	outValue: any;
	dataSource: GaugeClass[] = [{
		name: 'Summer',
		mean: 0,
		trueValue: 0,
		subValue: [0, 0],
		endValue: 5000,
		release:0,
		tick: 5
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
	currentVal: any;
	//indicatorValue = "linear-gradient(#171718, #39393a, #39393a, #171718 )"
	

	constructor(
		private route: ActivatedRoute,
		private ios: WebSocketService,
		private router: Router,
		//public staticDataService: StaticDataService 
	) {
		this.value = this.dataSource[0];
		this.statusText = "차량을 진입시키세요"
	}

	ngOnInit() {
        this.data = this.route.snapshot.data as config
       // this.staticData = this.staticDataService.getStaticData();
        //console.log(this.staticData);
		//this.data.title = this.route.snapshot.data.title;
		//this.subStart();
		this.subStart();

		// this.value.mean = 3.10;
		// this.value.subValue = -1.17;
		// this.inValue = 2.42;
		// this.outValue = 3.75;
	}


	postRss(val) {
		this.ios.sendMessage("message",val);
	}

	subStart() {
		this.ios.sendMessage("sub", { "command": "getResult" });

		this.ios.getSideSlip().subscribe(msg => {
			let subData = JSON.parse(String(msg));
			
			this.value.mean = Number(subData.Value) / 100

			this.value.trueValue = subData.TrueValue
			if (this.value.subValue[0] > this.value.mean) {
				this.value.subValue[0] = this.value.mean;
				if (this.value.mean != 0) {
					this.inValue = (this.value.mean * -1);
				}
				
			}
			if (this.value.subValue[1] < this.value.mean) {
				this.value.subValue[1] = this.value.mean;
				this.outValue = this.value.mean;
			}

			// var currentVal = String(this.value.mean);
			// currentVal = currentVal.replace('.', '<span style="font-family: Arial; font-size: 40px;">.</span>');
			// $('.currentValue> b').html(currentVal);

			//this.value.trueVal = Number(msg);
			//this.value.mean = (Number(msg) - 2048) / 204
			//this.router.navigate(['/']);
			//alert("게이지는 "+msg);
		});
		/*
		this.value.mean = 12.12;
		var currentVal = String(this.value.mean);
		currentVal = currentVal.replace('.', '<span style="font-family: Arial; font-size: 40px;">.</span>');
		$('.currentValue> b').html(currentVal);
		*/

		this.ios.getStatusText().subscribe(msg => {
			console.log(String(msg));
			this.statusText = String(msg);
		});
	}

	customizeText(string) {
		return string.valueText;
	}

	

}
