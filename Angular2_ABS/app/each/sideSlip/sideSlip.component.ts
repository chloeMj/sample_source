import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, ParamMap, Params } from '@angular/router';
import { WebSocketService } from '../../common/service/websocket.service';
import { GaugeClass } from '../../common/model/dataClass.model';
import * as $ from 'jquery';

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

export class EachSideSlipComponent implements OnInit {
    //staticData: StaticData;
	rssData: any;
	data: config;
	value: GaugeClass;
	statusText: string;
	inValue: any;
	outValue: any;
	dataSource: GaugeClass[] = [{
		name: 'Summer',
		mean: 0,
		trueValue: 0,
		subValue: [0, 0],
		endValue: 5000,
		release:0,
		tick: 5
	}];
	valueIndicator = {
		type: "rangebar",
		baseValue: 0
	}
	testList: any;
	//indicatorValue = "linear-gradient(#171718, #39393a, #39393a, #171718 )"
	

	constructor(
		private route: ActivatedRoute,
		private ios: WebSocketService,
		private router: Router,
		//public staticDataService: StaticDataService 
	) {
		this.value = this.dataSource[0];
		this.statusText = "차량을 진입시키세요"
	}

	ngOnInit() {
        this.data = this.route.snapshot.data as config
       // this.staticData = this.staticDataService.getStaticData();
        //console.log(this.staticData);
		//this.data.title = this.route.snapshot.data.title;
		//this.subStart();

		var eachTestList = this.route.snapshot.queryParams["eachTestList"];	
		var that = this;
		if(eachTestList){
			if($.type(eachTestList) !== "array"){
				eachTestList = [eachTestList];
			}
			$.each(this.testList, function(key, val){
				if($.inArray(key, eachTestList) < 0){
					that.testList[key] = false;
				}
			});
		}

		this.subStart();
	}


	postRss(val) {
		this.ios.sendMessage("message",val);
	}

	subStart() {
		this.ios.sendMessage("sub", { "command": "getResult" });

		this.ios.getSideSlip().subscribe(msg => {
			let subData = JSON.parse(String(msg));
			
			this.value.mean = Number(subData.Value) / 100

			this.value.trueValue = subData.TrueValue
			if (this.value.subValue[0] > this.value.mean) {
				this.value.subValue[0] = this.value.mean;
				if (this.value.mean != 0) {
					this.inValue = (this.value.mean * -1);
				}
				
			}
			if (this.value.subValue[1] < this.value.mean) {
				this.value.subValue[1] = this.value.mean;
				this.outValue = this.value.mean;
			}




			//this.value.trueVal = Number(msg);
			//this.value.mean = (Number(msg) - 2048) / 204
			//this.router.navigate(['/']);
			//alert("게이지는 "+msg);
		});

		this.ios.getStatusText().subscribe(msg => {
			console.log(String(msg));
			this.statusText = String(msg);
		});
	}

	customizeText(string) {
		return string.valueText;
	}

	

}
