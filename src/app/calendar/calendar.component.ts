import { Component, OnInit } from '@angular/core';
import { DateService } from '../shared/services/date.service';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { listLocales } from 'ngx-bootstrap/chronos'

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

  constructor(public dateService : DateService, private localeService: BsLocaleService) 
  {}

  bsValue : Date = new Date();
  locale = 'ru';
  locales = listLocales();

  onDateChange(value: Date) : void{
    const day = value.getDay();
    if(day !== 1)
      this.bsValue = new Date(value.getFullYear(), value.getMonth(), value.getDate() - day + (day == 0 ? -6 : 1));
    else
      this.bsValue = value;
    this.dateService.changeDate(value);
  }

  onWeekChange(dir : number){
    const newStartDate = new Date(this.bsValue.getFullYear(), this.bsValue.getMonth(), this.bsValue.getDate() + dir);
    this.bsValue = newStartDate;
    this.dateService.changeDate(newStartDate);
  }

  ngOnInit() {
    this.localeService.use(this.locale);
  }

}
