import { Injectable } from '@angular/core';


@Injectable()
export class StaticDataService {

	constructor() {
	}

	private staticDataConfig = {};

	setOption(option, value) {
		this.staticDataConfig[option] = value;
	}

	getConfig() {
		return this.staticDataConfig;
	}
}
