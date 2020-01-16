import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dayData',
  pure: false
})
export class DayDataPipe implements PipeTransform {

  formatsObj = {
    'hours': (value: number) : string => { return value.toString() },
    'percantage': (value: number, column: number, capacity: number) : string => {
      if(!column) return this.getDayPercantage(capacity, value).toString() + '%';
      return this.getWeekPercantage(capacity, value).toFixed(1).toString() + '%';
    }
  };

  transform(value: number, format: string, capacity?: number, column?: string): string {
    if (value) {
      return this.formatsObj[format](value, column, capacity);
    }
  }

  getDayPercantage(capacity: number, hours: number): number {
    if (!capacity) return 0;
    let normalHours = capacity * 8 * 0.01;
    let onePercentage = normalHours / 100;

    return hours / onePercentage;
  }

  getWeekPercantage(capacity: number, hours: number): number {
    if (!capacity) return 0;
    let normalHours = capacity * 40 * 0.01;
    let onePercentage = normalHours / 100;

    return hours / onePercentage;
  }

}
