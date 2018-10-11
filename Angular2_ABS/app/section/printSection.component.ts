import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Title } from "@angular/platform-browser";
import {
	Router,
	Event as RouterEvent,
	NavigationStart,
} from '@angular/router';
import {
	trigger,
	state,
	style,
	animate,
	transition
} from '@angular/animations';



import * as $ from 'jquery';

import { WebSocketService } from '../common/service/websocket.service';
import { StaticDataService } from '../common/service/staticData.service';
//import { HttpApiService } from '../common/service/http-api.service';

import { Subscription } from 'rxjs';



@Component({
	selector: 'app-section',
	templateUrl: './printSection.component.html',
	styleUrls: ['./printSection.component.css']

})
export class PrintSectionComponent implements OnInit {
	
	rssData: any;
	sub: Subscription;
	constructor(private router: Router,
		private ios: WebSocketService,
		private staticDataService: StaticDataService,

	) {
	}
	
	
	ngOnInit() {
		
	}

	
}
