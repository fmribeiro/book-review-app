import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'objectidToDate'
})
export class ConvertObjectidToDatePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return new Date(parseInt(value.substring(0, 8), 16) * 1000).toString();
  }

}
