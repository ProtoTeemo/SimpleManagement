import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../models/user';
import { SortMethods } from '../info-board/info-board.component';
import * as _  from 'lodash';

@Pipe({
  name: 'daySort',
  pure: false
})
export class DaySortPipe implements PipeTransform {

  transform(value: User[], day: number, dir: SortMethods): any {
    let order = '';
    if(dir == 1){
      order = 'desc';
    } else if(dir == 2){
      order = 'asc';
    }
    if (!value || order === '' || !order) { return value; } // no array
    if ( day < 0 ) { return _.sortBy(value); } // sort 1d array
    if (value.length <= 1) { return value; } // array with only one item
    return _.orderBy(value, [`hoursPerDays[${day}]`], [order as any]);
  }

}
