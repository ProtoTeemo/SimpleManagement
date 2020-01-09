import { Component, OnInit } from '@angular/core';
import { EpicFlowService } from '../shared/epic-flow.service';
import { User } from '../models/user';
import { Task } from '../models/task';

@Component({
  selector: 'app-info-board',
  templateUrl: './info-board.component.html',
  styleUrls: ['./info-board.component.scss']
})
export class InfoBoardComponent implements OnInit {

  constructor(private service: EpicFlowService) { }
  users: User[];
  tasks: Task[];

  ngOnInit() {
    this.users = this.service.getUsers();
  }

  printUser() {
    this.tasks = this.service.getTasks(new Date(Date.parse('2019-09-09T08:35:08.2907038+02:00')), this.users[5]);
    console.log(this.users[5]);
  }

  printTasks() {
    console.log(this.tasks);
  }

  filterTasks(){
    this.tasks = this.tasks.filter(this.checkDatesForTasks.bind(this));
    this.tasks.map(t => t.workLogs = t.workLogs.filter(this.checkDatesForWorkLogs.bind(this)));
    this.users[5].tasks = this.tasks;
    //this.users[5].calculateHours();
  }

  checkDatesForTasks(value): boolean {
    const selectedDate = new Date(Date.parse('2019-09-09T08:35:08.2907038+02:00'));
    return this.compareDates(value.workLogs[0].dateTime, selectedDate);
  }

  checkDatesForWorkLogs(value): boolean {
    const selectedDate = new Date(Date.parse('2019-09-09T08:35:08.2907038+02:00'));
    return this.compareDates(value.dateTime, selectedDate);
  }

  compareDates(...dates: Date[]) {
    if (dates.length < 2)
      throw new Error("Invalid arguments!")
    return dates.every(date => {
      return date.getDate() == dates[0].getDate()
        && date.getMonth() == dates[0].getMonth()
        && date.getFullYear() == dates[0].getFullYear()
    })
  }

}
