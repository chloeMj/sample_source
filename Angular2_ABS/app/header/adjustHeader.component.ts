import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WebSocketService } from '../common/service/websocket.service';
//import { AuthService } from '../common/service/auth.service';
//import { ConfirmDirective } from '../common/directive/confirm.directive';

@Component({
  selector: 'adjust-header',
  templateUrl: './adjustHeader.component.html',
	styleUrls: ['./adjustHeader.component.css']
})
export class AdjustHeaderComponent implements OnInit {

	url: any;
	constructor(private router: Router, private ios: WebSocketService) {
		this.url = '';
	}

	ngOnInit() {
		this.url = this.router.url;
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
