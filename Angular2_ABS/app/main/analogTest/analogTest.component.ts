import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { WebSocketService } from '../../common/service/websocket.service';

import * as $ from 'jquery';

//import { StaticDataService } from '../../common/service/staticData.service';
//import { StaticData } from '../../common/model/staticData.model';


interface config {
	title: string;
	sidebar: boolean
}


@Component({
  selector: 'analogTest',
	templateUrl: './analogTest.component.html',
	styleUrls: ['../../../common.css', './analogTest.component.css']
})

export class AnalogTestComponent implements OnInit {
    //staticData: StaticData;
	rssData: any;
	data: config;
	inputTitles: any;
	outputTitles: any;
	input: any;
	output: any;
	inputString: any;
	input2String: any;
	
	

	constructor(
		private route: ActivatedRoute,
		private ios: WebSocketService,
		//public staticDataService: StaticDataService 
	) {
		this.inputTitles = [];
		this.inputTitles[0] = 'A/I';
		this.inputTitles[1] = 'A/O';
		this.inputTitles[2] = 'B/P';
		this.inputTitles[3] = 'S/P';
		this.inputTitles[4] = 'B/LM';
		this.inputTitles[5] = 'S/LM';
		/*
		for (let i = 0; i < 16; i++) {
			if (this.inputTitle[i] == null) {
				this.inputTitle[i] = i;
			}			
		}
		*/

		this.input = [];

		for (let i = 0; i < 16; i++) {
			this.input[i] = '0';
		}

		this.outputTitles = [];
		this.outputTitles[0] = 'BM';
		this.outputTitles[1] = 'BU';
		this.outputTitles[2] = 'BD';
		this.outputTitles[3] = 'SU';
		this.outputTitles[4] = 'SD';
		/*
		for (let i = 0; i < 16; i++) {
			if (this.outputTitle[i] == null) {
				this.outputTitle[i] = i;
			}
		}
		*/

		this.output = [];

		for (let i = 0; i < 16; i++) {
			this.output[i] = '0';
		}
		
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
		//this.ios.sendMessage('output',val);
	}

	subStart() {
		this.ios.getInput().subscribe(msg => {
			this.input = msg;
		});
		this.ios.getOutput().subscribe(msg => {
			//console.log(msg);
			this.output = msg;
			
		});
	}
	outputGo(val) {
		if (this.output[val] == '1') { 
			this.output[val] = '0';
		} else if (this.output[val] == '0') {
			this.output[val] = '1';
		}
		
		this.ios.sendMessage('output', { "val": val.toString() });
	}

	goHome() {
		this.ios.sendMessage("main", { "command": "autoCheckStop" });
	}
	
}
