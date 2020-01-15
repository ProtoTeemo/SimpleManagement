import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../models/user';
import { SortMethods } from '../info-board/info-board.component';
import * as _ from 'lodash';

@Pipe({
  name: 'daySort',
  pure: false
})
export class DaySortPipe implements PipeTransform {

  transform(value: User[], day: number, ...dir: SortMethods[]): any {

    let order = '';

    if (day == 8) {
      if (dir[1] == 1) {
        order = 'desc';
      } else if (dir[1] == 2) {
        order = 'asc';
      }
      if (!value || order === '' || !order) { return value; } // no array
      if (value.length <= 1) { return value; } // array with only one item
      return _.orderBy(value, ['totalHours'], [order as any]);
    }

    if (dir[0] == 1) {
      order = 'desc';
    } else if (dir[0] == 2) {
      order = 'asc';
    }
    if (!value || order === '' || !order) { return value; } // no array
    if (value.length <= 1 || day == -1) { return value; } // array with only one item
    return _.orderBy(value, [`hoursPerDays[${day}]`], [order as any]);
  }

}
