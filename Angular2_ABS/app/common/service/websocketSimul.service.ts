import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { Socket} from 'ng-socket-io';


@Injectable()
export class WebSocketSimulService {
	//heartNum: number = 0;
	//socket = io(environment.socketUrl);

	constructor(private socket: Socket) {
	}
	
	
	init() {
		//this.socket.on('login', function () {
		//	console.log("연결성공");
		//});

		//this.socket.on('message', function (data) {
		//	console.log("연결성공2");
		//});
		//this.socket.on('disconnect', function () {

		//});
	}
	sendMessage(command: string, msg: any) {
		this.socket.emit(command, JSON.stringify(msg));
	}

	getMessage() {
		return this.socket
			.fromEvent("message");
	}

	getUsedPort() {
		return this.socket
			.fromEvent("usedPort");
	}


	getStatusText() {
		return this.socket
			.fromEvent("statusText");
	}



	getPageMove() {
		return this.socket
			.fromEvent("pageMove");
	}

	getSubPageMove() {
		return this.socket
			.fromEvent("subPageMove");
	}

	getAdjustPageMove() {
		return this.socket
			.fromEvent("adjustPageMove");
	}




	getSideSlip() {
		return this.socket
			.fromEvent("sideSlip");
	}
	getWeight() {
		return this.socket
			.fromEvent("weight");
	}
	getBrakeLeft() {
		return this.socket
			.fromEvent("brake_left");
	}

	getBrakeRight() {
		return this.socket
			.fromEvent("brake_right");
	}

	getSpeed() {
		return this.socket
			.fromEvent("speed");
	}




	getSideSlipStart() {
		return this.socket
			.fromEvent("sideSlipStart");
	}
	getBphoto() {
		return this.socket
			.fromEvent("bPhoto");
	}

	getInput() {
		return this.socket
			.fromEvent("input");
	}

	getNowResult() {
		return this.socket
			.fromEvent("nowResult");
	}
	
}
