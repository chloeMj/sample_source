import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { WebSocketService } from '../common/service/websocket.service';

//import { StaticDataService } from '../../common/service/staticData.service';
//import { StaticData } from '../../common/model/staticData.model';


interface config {
	title: string;
	sidebar: boolean
}
class Data {
	name: string;
	mean: number;
	//min: number;
	//max: number;
}

@Component({
  selector: 'gauge',
	templateUrl: './gauge.component.html',
	styleUrls: ['./gauge.component.css'],
})

export class GaugeComponent implements OnInit {
    //staticData: StaticData;
	rssData: any;
	data: config;
	value: Data;

	dataSource: Data[] = [{
		name: 'Summer',
		mean: 0
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
		
	}

	customizeText(string) {
		return string.valueText;
	}
}
