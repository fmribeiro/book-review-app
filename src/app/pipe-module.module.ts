import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConvertObjectidToDatePipe } from './shared/pipes/convert-objectid-to-date-pipe.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ConvertObjectidToDatePipe],
  exports: [ConvertObjectidToDatePipe]
})
export class PipeModule {

}
