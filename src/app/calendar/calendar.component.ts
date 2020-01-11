import { Component, OnInit } from '@angular/core';
import { DateService } from '../shared/date.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

  constructor(private dateService : DateService) 
  {}

  bsValue : Date = new Date();

  onDateChange(value: Date) : void{
    const day = value.getDay();
    if(day !== 0)
      this.bsValue = new Date(value.getFullYear(), value.getMonth(), value.getDate() - day + (day == 0 ? -6 : 0));
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

  }

}
