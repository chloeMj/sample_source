import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

//import { AuthService } from '../common/service/auth.service';
//import { ConfirmDirective } from '../common/directive/confirm.directive';

@Component({
  selector: 'main-header',
  templateUrl: './mainHeader.component.html',
	styleUrls: ['./mainHeader.component.css']
})
export class MainHeaderComponent implements OnInit {

	constructor(private router: Router) { }

	ngOnInit() {
	}

	routerLink(val) {
		this.router.navigate([val]);
	}
	


	//logout = () => {
	//	this.auth.signout();
	//	this.router.navigate(['/login']);
	//}

	
}
