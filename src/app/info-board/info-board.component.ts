import { Component, OnInit } from '@angular/core';
import { EpicFlowService } from '../shared/epic-flow.service';
import { User } from '../models/user';
import { Task } from '../models/task';
import { DateService } from '../shared/date.service';

@Component({
  selector: 'app-info-board',
  templateUrl: './info-board.component.html',
  styleUrls: ['./info-board.component.scss']
})
export class InfoBoardComponent implements OnInit {

  constructor
    (
      private service: EpicFlowService,
      private dateService: DateService
    ) {
    this.users = this.service.getUsers();
    this.dateService.week.subscribe(() => {

    });
  }

  users: User[];

  ngOnInit() {
  }

  printUser() {
    this.users.forEach(user => {
      this.dateService.week.value.forEach(day => {
        user.tasks = this.service.getTasks(day, user);
        // Нужно устанавливать не все таски, а только те, у которых есть ворклоги на нужный день
        // user.tasks = user.tasks.filter(t => {
        //   return t.workLogs.some(wl => this.compareDates(wl.dateTime, day));
        // });
        user.tasksMap.set(day.toLocaleDateString(), user.tasks);
      });
    });
  }

  fillTable() {

  }

  printTasks() {
    this.users.forEach(user => {
      this.dateService.week.value.forEach(day => {
        if (user.tasksMap.get(day.toLocaleDateString()) && user.tasksMap.get(day.toLocaleDateString()).length > 0)
          console.log(`${user.userName}: `, user.tasksMap.get(day.toLocaleDateString()));
      });
    });
  }

  filterTasks() {
    // Нужно фильтровать таски по дате их ворклогов, чтобы они попадали в диапазон выбранной недели
    this.users.forEach(user => {
      this.dateService.week.value.forEach(day => {
        user.tasksMap.set(day.toLocaleDateString(), user.tasksMap.get(day.toLocaleDateString())); 
            // user.tasksMap
            //     .get(day.toLocaleDateString())
            //     .filter(t => t.workLogs
            //     .every(wl => this.compareDates(wl.dateTime, day))));
        // Теперь фильтруются в сервисе
        //user.tasksMap.get(day.toLocaleDateString()).map(t => t.workLogs = t.workLogs.filter(this.checkDatesForWorkLogs.bind(this)));
      });
    });
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
