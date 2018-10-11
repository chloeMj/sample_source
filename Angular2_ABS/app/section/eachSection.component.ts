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
	templateUrl: './eachSection.component.html',
	styleUrls: ['./eachSection.component.css']
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
export class EachSectionComponent implements OnInit {
	
	rssData: any;
	sub: Subscription;
	constructor(private router: Router,
		private ios: WebSocketService,
		private staticDataService: StaticDataService,

	) {
	}
	
	
	ngOnInit() {
		this.subStart();
		//this.ios.connect();
		//this.ios.login();
		$("div").find(".dashboard_btn").click(function () {
			$("div").find(".popup_box").fadeIn(300);
		});
        
		$("div").find(".close2").click(function(){
			$("div").find(".popup_box").fadeOut(300);
		});


		
	}
	
	//subStart() {
		//this.sub = this.ios.connect()
		//	.subscribe(data => {
		//		//console.log(data);
		//		//console.log(JSON.parse(data));
				
		//		if (JSON.parse(data).length > 0) {
		//			this.data = JSON.parse(data);
					
		//		}
		//		//console.log(this.data);
		//		//this.data = JSON.parse(data);
				

		//		if (this.data[0].macAddress != null && this.data[1].macAddress != null) {
					
		//		}
				
		//		//this.yScaleMmax = yMax;
		//		//console.log(this.data[0].macAddress);
		//		if (this.data[0].macAddress == null) {
					
		//		} else {
					

		//		}
		//		if (this.data[1].macAddress == null) {
					
		//		} else {
					

		//		}
		//		//console.log(this.activeEntries);
		//	});
	//}
	

    ngOnDestroy() {
       //this.sub.unsubscribe();
	}

	subStart() {

		this.ios.getSubPageMove().subscribe(msg => {
			this.router.navigate([msg]);
		});

		this.ios.getBphoto().subscribe(msg => {
			this.router.navigate(['sub/brake']);
			//this.rssData = msg;
			//this.staticDataService.setOption('rssData', this.rssData);
			//this.value.mean = (Number(msg) - 2048) / 204
			//this.router.navigate(['/']);
			//alert("게이지는 "+msg);
		});
	}



	sectionStaticDataHandler(value) {
		//this.staticData = value;
		//this.staticDataService.setStaticData(this.staticData);
		//this.router.navigateByUrl('/');
		//console.log(value);
		//this.router.navigate(['/']);
		//window.location.reload();
	}

	private refreshToken(event: RouterEvent): void {
		if (event instanceof NavigationStart) {
			//this.authService.refresh().catch(response => null);
		}
	}

	getTimeString(second) {
		second = Math.floor(second);
		let MpMin = 60;
		let MpHou = 60 * 60;
		let MpDay = 24 * 60 * 60;

		let timeString = '';

		if (second / MpDay >= 1) {
			timeString += Math.floor(second / MpDay) + "일 ";
		}
		if (second / MpHou >= 1) {
			if (second / MpDay >= 1) {
				timeString += Math.floor((second / MpHou) % 24  ) + "시 ";
			} else {
				timeString += Math.floor((second / MpHou) % 24) + "시 ";
			}

		}
		if (second / MpMin >= 1) {
			timeString += Math.floor((second / MpMin) % 60) + "분 ";
		}
		if (second > 0) {
			//if (second > 600) {
			//	if (second > 1200) {
			//		obj.setErrorMode(2);
			//	} else {
			//		obj.setErrorMode(1);
			//	}
			//}
			timeString += Math.floor(second % 60) + "초";
			//sb.append((((millis%MpDay)%MpHou)%MpMin)/MpSec+"초 차이");
		}
		if (timeString == ''){
			timeString += "0초"
		}
		return timeString;
	}
	
	formatDate(date) {
		var d = new Date(date),
			month = '' + (d.getMonth() + 1),
			day = '' + d.getDate(),
			year = d.getFullYear();

		if (month.length < 2) month = '0' + month;
		if (day.length < 2) day = '0' + day;

		return [ month, day].join('-');
	}
	
	
}
