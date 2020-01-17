import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../../models/user';
import { SortMethods } from '../../info-board/info-board.component';
import * as _ from 'lodash';

@Pipe({
  name: 'daySort',
  pure: false
})
export class DaySortPipe implements PipeTransform {

  transform(value: User[], day: number, format?: string, ...dirs: SortMethods[]): any {

    let order = '';

    // I decided mark a 'Total' column as '8'
    const totalColumnNumber = 8
    if (day == totalColumnNumber) {
      if (dirs[1] == SortMethods.NORMAL) {
        order = 'desc';
      } else if (dirs[1] == SortMethods.REVERSE) {
        order = 'asc';
      }

      if (!value || order === '' || !order) { return value; } // no array
      if (value.length <= 1) { return value; } // array with only one item

      if (format == "percantage") {
        return _.orderBy(value, ['totalPercantages'], [order as any]);
      }
      return _.orderBy(value, ['totalHours'], [order as any]);
    }

    if (dirs[0] == SortMethods.NORMAL) {
      order = 'desc';
    } else if (dirs[0] == SortMethods.REVERSE) {
      order = 'asc';
    }
    
    if (!value || order === '' || !order) { return value; }
    if (value.length <= 1 || day == -1) { return value; }

    if (format == "percantage") {
      return _.orderBy(value, [`percantagesPerDays[${day}]`], [order as any]);
    }
    return _.orderBy(value, [`hoursPerDays[${day}]`], [order as any]);
  }

}
