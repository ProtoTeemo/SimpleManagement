import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../models/user';
import { SortMethods } from '../info-board/info-board.component';
import * as _  from 'lodash';

@Pipe({
  name: 'sort',
  pure: false
})
export class SortPipe implements PipeTransform {

  transform(value: User[], property: string, dir: SortMethods): any {
    let order = '';
    if(dir == 1){
      order = 'asc';
    } else if(dir == 2){
      order = 'desc';
    }
    if (!value || order === '' || !order) { return value; } // no array
    if (!property || property === '') { return _.sortBy(value); } // sort 1d array
    if (value.length <= 1) { return value; } // array with only one item
    return _.orderBy(value, [property], [order as any]);
  }

}
