import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { WebSocketService } from '../../common/service/websocket.service';
import { HttpApiService } from '../../common/service/http-api.service';

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
  selector: 'setup',
	templateUrl: './setup.component.html',
	styleUrls: ['../../../common.css', './setup.component.css']
})

export class SetupComponent implements OnInit {
    //staticData: StaticData;
	rssData: any;
	data: config;
	setup: any;

	portList: any;
	usedPort: any;
	usedBaud: any;

	draglist: any;
	itemlist: any;

	connected: any;

	constructor(
		private route: ActivatedRoute,
		private ios: WebSocketService,
		private httpApi: HttpApiService,
	) {
		this.itemlist = [{ idx: 1, name: '사이드슬립테스트' }, { idx: 2, name: '브레이크테스트' }, { idx: 3,name: '스피드테스트' }];
		this.draglist = [];
		this.usedPort = "";
		this.usedBaud = "";

		this.connected = "";

		this.setup = new Setup();
		this.subStart();
	}

	ngOnInit() {
		this.data = this.route.snapshot.data as config;
	}

	drog(event) {
		this.itemlist.forEach((item, index) => {
			if (event.dragData.idx === item.idx) {
				this.itemlist.splice(index, 1);
			} 
		});
		
		this.draglist.push(event.dragData);
	}

	portConnect(num) {
		if (num != "0") {
			this.ios.sendMessage("main", { "command": "portSel", "val": num });
		}
	}
	portClose() {
		this.ios.sendMessage("main", { "command": "portClose"});
	}
	
	baudSel(num) {
		if (num != "0") {
			this.ios.sendMessage("main", { "command": "baudSel", "val": num });
		}
	}

	fullSideSel(bool) {
		this.ios.sendMessage("main", { "command": "fullscreen" });
	}


	setupSave() {

		let paramsString = '';
		paramsString = '';

		this.httpApi.put('setup', paramsString, this.setup).subscribe(
			data => {
				console.log(data);
				alert("저장되었습니다");
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
		this.ios.sendMessage("main", { "command": "usedPort" });
		this.ios.sendMessage("main", { "command": "usedBaud" });
		this.ios.sendMessage("sub", { "command": "getResult" });

		this.ios.getUsedPort().subscribe(msg => {
			this.usedPort = msg;
		});

		this.ios.getUsedBaud().subscribe(msg => {
			this.usedBaud = msg;
			if (this.usedBaud == 0) {
				this.usedBaud = "";
			}
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

	connectTotalServer(ip) {
		this.ios.sendMessage("main", { "command": "totalServerConnection", "val": ip  });
		this.connected = "1";
	}

	disconnectTotalServer(ip) {
		this.connected = "";
	}
	
}
