import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { WebSocketService } from '../../common/service/websocket.service';
import { GaugeClass } from '../../common/model/dataClass.model';

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

export class DegreeBrakeComponent implements OnInit {
    //staticData: StaticData;
	rssData: any;
	data: config;
	weightValue: GaugeClass;
	leftValue: GaugeClass;
	rightValue: GaugeClass;

	dataSource: GaugeClass[] = [
		{
			name: 'Summer',
			mean: 0,
			subValue: [0],
			endValue: 5000,
			trueValue: 0,
			release:0,
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
		//this.ios.getWeight().subscribe(msg => {
		//	let subData = JSON.parse(String(msg));
			

		//	this.weightValue.mean = Number(subData.Value)
		//	if (this.weightValue.mean < 0) {
		//		this.weightValue.mean = 0;
		//	}
		//	this.weightValue.trueValue = subData.TrueValue
		//	if (this.weightValue.subValue[0] < Number(subData.Value)) {
		//		this.weightValue.subValue[0] = Number(subData.Value);
		//	}
		//	if (this.weightValue.trueValue == 0) {
		//		this.weightValue.subValue[0] = 0;
		//	}
		//});

		//this.ios.getBrakeLeft().subscribe(msg => {
		//	let subData = JSON.parse(String(msg));


		//	this.leftValue.mean = Number(subData.Value)
		//	if (this.leftValue.mean < 0) {
		//		this.leftValue.mean = 0;
		//	}
		//	this.leftValue.trueValue = subData.TrueValue
		//	if (this.leftValue.subValue[0] < Number(subData.Value)) {
		//		this.leftValue.subValue[0] = Number(subData.Value);
		//	}
		//	if (this.leftValue.trueValue == 0) {
		//		this.leftValue.subValue[0] = 0;
		//	}
		//});

		//this.ios.getBrakeRight().subscribe(msg => {
		//	let subData = JSON.parse(String(msg));


		//	this.rightValue.mean = Number(subData.Value)
		//	if (this.rightValue.mean < 0) {
		//		this.rightValue.mean = 0;
		//	}
		//	this.rightValue.trueValue = subData.TrueValue
		//	if (this.rightValue.subValue[0] < Number(subData.Value)) {
		//		this.rightValue.subValue[0] = Number(subData.Value);
		//	}
		//	if (this.rightValue.trueValue == 0) {
		//		this.rightValue.subValue[0] = 0;
		//	}
		//});

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


			this.leftValue.mean = Number(subData.Value);
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
	}


	outputGo(val) {
		this.ios.sendMessage('output', { "val": val.toString() });
	}

	weightZeroVal() {
		const value = {
			command: "weight_zeroVal",
			val: this.weightValue.trueValue + ""
		}
		this.ios.sendMessage("adjust", value);
	}

	weightAdjust(value) {
		const values = {
			command: "weight_adjust",
			val: { "val": this.weightValue.trueValue, "val2": value }
		}
		this.ios.sendMessage("adjust", values);
	}


	brakeLeftZeroVal() {
		const value = {
			command: "brake_left_zeroVal",
			val: this.leftValue.trueValue + ""
		}
		this.ios.sendMessage("adjust", value);
	}

	leftAdjust(value) {
		const values = {
			command: "brake_left_adjust",
			val: { "val": this.leftValue.trueValue, "val2": value }
		}
		this.ios.sendMessage("adjust", values);
	}

	brakeRightZeroVal() {
		const value = {
			command: "brake_right_zeroVal",
			val: this.rightValue.trueValue + ""
		}
		this.ios.sendMessage("adjust", value);
	}

	rightAdjust(value) {
		const values = {
			command: "brake_right_adjust",
			val: { "val": this.rightValue.trueValue, "val2": value }
		}
		this.ios.sendMessage("adjust", values);
	}



	customizeText(string) {
		return string.valueText;
	}
}
