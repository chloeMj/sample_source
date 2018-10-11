import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { WebSocketService } from '../../common/service/websocket.service';
import { HttpApiService } from '../../common/service/http-api.service';

import { ReferenceConfigClass } from '../../common/model/referenceConfig.model';

import * as $ from 'jquery';

//import { StaticDataService } from '../../common/service/staticData.service';
//import { StaticData } from '../../common/model/staticData.model';


interface config {
	title: string;
	sidebar: boolean
}
class Setup {
	idx: any = 0
	name:any = ""
}


@Component({
	selector: 'referenceConfig',
	templateUrl: './referenceConfig.component.html',
	styleUrls: ['../../../common.css', './referenceConfig.component.css']
})

export class ReferenceConfigComponent implements OnInit {
    //staticData: StaticData;
	rssData: any;
	data: config;
	config: any;



	draglist: any;
	itemlist: any;

	constructor(
		private route: ActivatedRoute,
		private ios: WebSocketService,
		private httpApi: HttpApiService,
	) {

		this.config = new ReferenceConfigClass();
	}

	ngOnInit() {
		let paramsString = '';
		paramsString = '';
		this.httpApi.get('referenceConfig', paramsString).subscribe(
			data => {
				this.config = data[0];
			},
			({ error }) => {
				alert(error.message);
			},
			() => {
				//this.router.navigate(['/main/dashboard']),
				//console.log();
			}
		)


		
	}


	setupReferenceCOnfig() {

		let paramsString = '';
		paramsString = '';

		this.httpApi.put('referenceConfig', paramsString, this.config).subscribe(
			data => {
				alert("저장되었습니다");
				this.subStart();
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

	subStart() {
		let paramsString = '';
		paramsString = '';
		this.httpApi.get('referenceConfig', paramsString).subscribe(
			data => {
				this.config = data[0];
			},
			({ error }) => {
				alert(error.message);
			},
			() => {
				//this.router.navigate(['/main/dashboard']),
				//console.log();
			}
		);
	}
	
}
