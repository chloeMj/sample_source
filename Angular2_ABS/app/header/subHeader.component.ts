import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WebSocketService } from '../common/service/websocket.service';
//import { AuthService } from '../common/service/auth.service';
//import { ConfirmDirective } from '../common/directive/confirm.directive';

@Component({
  selector: 'sub-header',
  templateUrl: './subHeader.component.html',
	styleUrls: ['./subHeader.component.css']
})
export class SubHeaderComponent implements OnInit {

	constructor(private router: Router ,private ios: WebSocketService) { }

	ngOnInit() {
	}

	routerLink(val) {
		this.router.navigate([val]);
	}

	goHome() {
		this.ios.sendMessage("main", { "command": "autoCheckStop" });
	}

	//logout = () => {
	//	this.auth.signout();
	//	this.router.navigate(['/login']);
	//}

	
}
