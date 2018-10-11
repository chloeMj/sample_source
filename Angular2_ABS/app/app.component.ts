import { Component } from '@angular/core';
import * as $ from 'jquery';
import {
	Router,
	Event as RouterEvent,
	NavigationStart,
	NavigationEnd,    //1
	NavigationCancel, //1
	NavigationError,  //1
} from '@angular/router'

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {
	loading: boolean = false;
	

	constructor(private router: Router) {
		router.events.subscribe((event: RouterEvent) => {
			this.updateLoadingBar(event); //4
		});
	}

	private updateLoadingBar(event: RouterEvent): void { //3
		if (event instanceof NavigationStart) {
			this.loading = true;
		}
		if (event instanceof NavigationEnd
			|| event instanceof NavigationCancel
			|| event instanceof NavigationError) {
			this.loading = false;
		}
	}
}
