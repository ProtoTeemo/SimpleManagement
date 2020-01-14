import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../models/user';
import { SortMethods } from '../info-board/info-board.component';

@Pipe({
  name: 'sort',
  pure: false
})
export class SortPipe implements PipeTransform {

  unsortedUsers: User[] = null;

  transform(value: User[], property: string, dir: SortMethods): any {
    if (!this.unsortedUsers) {
      this.unsortedUsers = new Array<User>();
      value.map(u => {
        this.unsortedUsers.push(u)
      })
    }
    let result = value;
    switch (dir) {
      case SortMethods.NORMAL:
        result.sort((a, b) => {
          if (a[property] < b[property]) return -1;
          else if (a[property] > b[property]) return 1;
          return 0;
        });
        break;
      case SortMethods.REVERSE:
        result.sort((a, b) => {
          if (a[property] < b[property]) return 1;
          else if (a[property] > b[property]) return -1;
          return 0;
        });
        break;
      default:
        console.log("unsorted  users:", this.unsortedUsers);
        console.log("general user:", value);
        if (this.unsortedUsers) {
          value = new Array<User>();
          this.unsortedUsers.map(u => {
            value.push(u);
          });
          this.unsortedUsers = null;
          return value;
        }

    }
    return result;
  }

}
