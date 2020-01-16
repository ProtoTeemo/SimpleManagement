import { Pipe, PipeTransform } from '@angular/core';
import { User } from 'src/app/models/user';
import * as _  from 'lodash';

@Pipe({
  name: 'filter',
  pure: false
})
export class FilterPipe implements PipeTransform {

  transform(value: User[], searchStr : string): any {
    if(!value || !searchStr){ return value; }
    return value.filter(u => {
      return u.userName.toLowerCase().indexOf(searchStr.toLowerCase()) > -1;
    });
  }

}
