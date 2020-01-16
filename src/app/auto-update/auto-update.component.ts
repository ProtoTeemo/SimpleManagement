import { Component, OnInit } from '@angular/core';
import { DateService } from '../shared/services/date.service';

@Component({
  selector: 'app-auto-update',
  templateUrl: './auto-update.component.html',
  styleUrls: ['./auto-update.component.scss']
})
export class AutoUpdateComponent implements OnInit {

  constructor( private dateService : DateService) { }

  isActive: boolean = false;
  intervalTime :number = 1;
  interval: number;

  ngOnInit() {
  }

  onAutoUpdate(){
    if(this.isActive){
    this.interval = setInterval(() =>{
      this.dateService.changeDate(this.dateService.week.value[0]);
      }, this.intervalTime * 1000 * 60);
    }
    else {
      clearInterval(this.interval);
    }
  }

}
