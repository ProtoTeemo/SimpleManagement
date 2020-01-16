import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  constructor() { }

  week: BehaviorSubject<Date[]> = new BehaviorSubject(new Array<Date>(7));

  changeDate(startOfWeek: Date) {
    if (startOfWeek.getDay() == WeekDays.MONDAY) {
      this.week.value[0] = startOfWeek;
      for (let i = 1; i < 7; i++) {
        const newValue = new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + i);
        this.week.value[i] = newValue;
      }
      this.week.next(this.week.value);
    }

  }
}

export enum WeekDays {
  SUNDAY, 
  MONDAY,
  TUESDAY,
  WEDNESDAY,
  THURSDAY,
  FRIDAY,
  SATURDAY
}
