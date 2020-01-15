import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dayData',
  pure: false
})
export class DayDataPipe implements PipeTransform {

  transform(value: number, format: string, capacity?: number, column?: string): string {
    if (value) {
      switch (format) {
        case "hours":
          return value.toString();
        case "percantage":
          if(!column) return this.getDayPercantage(capacity, value).toString() + '%';
          return this.getWeekPercantage(capacity, value).toString() + '%';
      }
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
