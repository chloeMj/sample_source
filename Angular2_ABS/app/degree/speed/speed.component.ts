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
	selector: 'speed',
	templateUrl: './speed.component.html',
	styleUrls: ['../../../common.css', './speed.component.css'],
})

export class DegreeSpeedComponent implements OnInit {
    //staticData: StaticData;
	rssData: any;
	data: config;
	value: GaugeClass;

	dataSource: GaugeClass[] = [{
		name: 'Summer',
		mean: 0,
		subValue: [0],
		endValue: 5000,
		trueValue: 0,
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


	adjustDiameter(num) {
		const value = {
			command: "speed_diameter",
			val: num + ""
		}
		this.ios.sendMessage("adjust", value);
	}

	adjustPulse(num) {
		const value = {
			command: "speed_pulse",
			val: num + ""
		}
		this.ios.sendMessage("adjust", value);
	}

	subStart() {
		this.ios.getSpeed().subscribe(msg => {
			let subData = JSON.parse(String(msg));
			this.value.mean = Number(subData.Value)/10
			if (this.value.trueValue == 0) {
				this.value.subValue[0] = 0;
			}
		});
	}

	outputGo(val) {
		this.ios.sendMessage('output', { "val": val.toString() });
	}

	customizeText(string) {
		return string.valueText;
	}
}
