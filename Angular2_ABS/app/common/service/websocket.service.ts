import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { SocketIo } from 'ng-io';

@Injectable()
export class WebSocketService {
	//heartNum: number = 0;
	//socket = io(environment.socketUrl);

	constructor(private socket: SocketIo) {
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
	getUsedBaud() {
		return this.socket
			.fromEvent("usedBaud");
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

	getBrakeLeftRelease() {
		return this.socket
			.fromEvent("brake_left_release");
	}

	getBrakeRightRelease() {
		return this.socket
			.fromEvent("brake_right_release");
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
	getOutput() {
		return this.socket
			.fromEvent("output");
	}


	
	getNowResult() {
		return this.socket
			.fromEvent("nowResult");
	}

	getCarList() {
		return this.socket
			.fromEvent("carList");
	}

	//test(data) {
	//	this.socket.emit("message", data);
	//}
	

	//this.ws.send(c);

	//this.socket.emit("connection", {
	//	id: 'test',
	//	level: "10"
	//});

	//this.socket.on("login", function (data) {
	//	console.log("소켓접속성공");
	//});

	//this.socket.on("message", function (data) {
	//	console.log("메세지옴");
	//});
		
	

	//login() {
	//	this.socket.emit("login", '123');
	//	this.socket.emit("message", '456');
	//}

	//getMessage() {
	//	return this.socket.fromEvent("message");
	//}


	//heartBeat() {
	//	setInterval(() => {
	//		console.log("하트비트 "+this.heartNum++);
	//		this.socket.emit("heartBeat", {
	//			id: 'test',
	//		});

	//	}, 30000); 
 //   }

 //   test(data) {
 //       this.socket.emit("test",data);
	//}

	//getLastData(data) {
	//	this.socket.emit("getLastData", data);
	//}

	//controllCloser(data) {
	//	this.socket.emit("controllCloser", data);
	//}

}
