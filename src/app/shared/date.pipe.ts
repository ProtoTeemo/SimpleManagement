import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
@Pipe({
  name: 'date'
})
export class DatePipe implements PipeTransform {

  transform(value: Date, ...args: any[]): any {
    if(value)
      return moment(value).format("ddd DD");
  }

  

}




