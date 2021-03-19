import { Component } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  // tslint:disable-next-line:max-line-length
  template: '<div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>',
  styleUrls: ['./loading-spinner.component.css']
})
export class LoadingSpinnerComponent {

}
