import { Directive, HostListener, Input, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[appConfirm]'
})
export class ConfirmDirective {
	@Output('confirm-click') click: any = new EventEmitter();
	
	@Input() confirmMessage = 'Are you sure you want to do this?';

	@Input() confirmString = '저장';

	//@HostListener('click', ['$event'])
	//confirmFirst() {
	//	const confirmed = window.confirm(this.confirmMessage);

	//	if (confirmed) {
	//		//this.appConfirm(this.confirmString+" 되었습니다");
	//	}
	//}

	@HostListener('click', ['$event']) clicked(e) {
		const confirmed = window.confirm(this.confirmMessage);
		if (confirmed) {
			this.click.emit();
		}

		//window.confirm({
		//	buttons: {
		//		confirm: () => this.click.emit(),
		//		cancel: () => { }
		//	}
		//});
	}

}
