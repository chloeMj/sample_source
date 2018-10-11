import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Title } from "@angular/platform-browser";
import {
	Router,
	Event as RouterEvent,
	NavigationStart,
} from '@angular/router';


import * as $ from 'jquery';

import { WebSocketSimulService } from '../common/service/websocketSimul.service';
import { StaticDataService } from '../common/service/staticData.service';
import { HttpApiService } from '../common/service/http-api.service';

import { Subscription } from 'rxjs';



@Component({
	selector: 'app-section',
	templateUrl: './simulSection.component.html',
	styleUrls: ['./simulSection.component.css']
	//animations: [
	//	trigger('alertToggle', [
	//		state('true', style({
	//			opacity: 1
	//		})),
	//		state('false', style({
	//			opacity: 0
	//		})),
	//		transition('true => false', animate('.9s')),
	//		transition('false => true', animate('.5s'))
	//	])
	//]
})
export class SimulSectionComponent implements OnInit {
	
	portList: any;
	usedPort: any;
	input: any;
	output: any;


	constructor(private router: Router,
		private ios: WebSocketSimulService,
		private httpApi: HttpApiService,
	) {
		this.portList = [];
		this.usedPort = "";

		this.input = [];

		for (let i = 0; i < 16; i++) {
			this.input[i] = '0';
		}

		this.output = [];

		for (let i = 0; i < 16; i++) {
			this.output[i] = '0';
		}
	}
	
	
	ngOnInit() {
		this.subStart();
	}

	subStart() {
		this.ios.sendMessage("simul", { "command": "usedPort" });
		this.ios.sendMessage("simul", { "command": "getInput" });

		this.ios.getInput().subscribe(msg => {
			this.input = msg;
		});

		this.ios.getUsedPort().subscribe(msg => {
			this.usedPort = msg;
		});



		let paramsString = '';
		paramsString = '';
		this.httpApi.get('using_port', paramsString).subscribe(
			data => {
				this.portList = data[0]
				console.log(data);
			},
			({ error }) => {
				console.log(error.message);
			},
			() => {
				//this.router.navigate(['/main/dashboard']),
				//console.log();
			}
		);
	}

	

	writeCreate(num) {
		this.ios.sendMessage("simul", { "command": "writeCreate", "val": num });
	}

	portSel(num) {
		if (num != "0") {
			this.ios.sendMessage("simul", { "command": "portSel", "val": num });
		}

	}
}
