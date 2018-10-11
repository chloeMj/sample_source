import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { WebSocketService } from '../../common/service/websocket.service';
import { GaugeClass } from '../../common/model/dataClass.model';
import $ from 'jquery';

//import { StaticDataService } from '../../common/service/staticData.service';
//import { StaticData } from '../../common/model/staticData.model';


interface config {
	title: string;
	sidebar: boolean
}

@Component({
	selector: 'sideSlip',
	templateUrl: './sideSlip.component.html',
	styleUrls: ['../../../common.css', './sideSlip.component.css'],
})

export class AdjustSideSlipComponent implements OnInit {
    //staticData: StaticData;
	rssData: any;
	data: config;
	value: GaugeClass;
	dataSource: GaugeClass[] = [{
		name: 'Summer',
		mean: 0,
		trueValue: 0,
		subValue: [0, 0],
		endValue: 5000,
		release: 0,
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
	

	constructor(
		private route: ActivatedRoute,
		private ios: WebSocketService,
		private router: Router,
		//public staticDataService: StaticDataService 
	) {
		this.value = this.dataSource[0];
	}

	ngOnInit() {
        this.data = this.route.snapshot.data as config
       // this.staticData = this.staticDataService.getStaticData();
        //console.log(this.staticData);
		//this.data.title = this.route.snapshot.data.title;
		//this.subStart();
		this.subStart();
	}


	postRss(val) {
		this.ios.sendMessage("message",val);
	}

	subStart() {
		this.ios.getSideSlip().subscribe(msg => {
			let subData = JSON.parse(String(msg));


			this.value.mean = Number(subData.Value)/100
			this.value.trueValue = subData.TrueValue
			if (this.value.subValue[0] > this.value.mean) {
				this.value.subValue[0] = this.value.mean;
			}
			if (this.value.subValue[1] < this.value.mean) {
				this.value.subValue[1] = this.value.mean;
			}
			if (this.value.trueValue == 0) {
				this.value.subValue[0] = 0;
				this.value.subValue[1] = 0;
			}
			
			//this.value.trueVal = Number(msg);
			//this.value.mean = (Number(msg) - 2048) / 204
			//this.router.navigate(['/']);
			//alert("게이지는 "+msg);
		});
	}


	zeroVal() {
		const value = {
			command : "sideSlip_zeroVal",
			val: this.value.trueValue + ""
		}
		this.ios.sendMessage("adjust", value);
	}

	adjust(str,val) {
		const value = {
			command: "sideSlip_adjust_" + str,
			val: { "val": this.value.trueValue, "val2": val }
		}
		this.ios.sendMessage("adjust", value);
	}

	customizeText(string) {
		return string.valueText;
	}
}
