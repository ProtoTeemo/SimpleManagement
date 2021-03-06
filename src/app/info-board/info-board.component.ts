import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { EpicFlowService } from '../shared/services/epic-flow.service';
import { User } from '../models/user';
import { Task } from '../models/task';
import { DateService, WeekDays } from '../shared/services/date.service';
import { WorkLog } from '../models/worklog';
import { ViewSettingsService } from '../shared/services/view-settings.service';


export enum SortMethods {
  NONE,
  NORMAL,
  REVERSE
}


@Component({
  selector: 'app-info-board',
  templateUrl: './info-board.component.html',
  styleUrls: ['./info-board.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class InfoBoardComponent implements OnInit {

  constructor
    (
      private service: EpicFlowService,
      public dateService: DateService,
      public viewSettings: ViewSettingsService
    ) {
    this.dateService.week.subscribe(() => {
      this.users.forEach(u => {
        u.tasksMap.clear();
      });
      this.getTasks();
    });
  }

  users: User[] = new Array<User>();

  search: string;

  ngOnInit() {
    this.getUsers();
  }

  //#region  Sort fields
    namesSortOrder: SortMethods = SortMethods.NONE;
    hoursPerDaySortOrder: SortMethods = SortMethods.NONE;
    hoursPerWeekSortOrder: SortMethods = SortMethods.NONE;
    sortDay: WeekDays = -1;
  
    get sortMethods() { return SortMethods; }
  
    //#endregion

  //#region General of works with table
  getUsers() {
    this.service.getUsers().subscribe((res: any) => {
      res.value.users.map((user, i) => {
        const user_map: User = {
          idInGroups: user.UserInGroups
            .filter(u => ~u.Name.indexOf('Gebo'))
            .map(u => u.Id),
          userId: user.UserId,
          userName: user.UserName,
          tasksMap: new Map<string, Task[]>(),
          tasks: new Array<Task>(),
          hoursPerDays: new Array<number>(7),
          percantagesPerDays: new Array<number>(7),
          capacity: this.service.getCapacity(res, i)
        };
        this.users.push(user_map);
      });
      // получить таски
      this.getTasks();
    });
  }

  setTasksForWeek() {
    this.users.forEach(u => {
      this.dateService.week.value.forEach((day, i) => {
        if (this.dateService.week.value.some(d => {
          return this.compareDates(d, day);
        })) {
          const tasks = u.tasks.filter(t => {
            return t.workLogs.some(wl => this.compareDates(wl.dateTime, day));
          });
          let hoursPerDay = 0;
          tasks.forEach(t => {
            const hoursMap = t.workLogs.map(wl => { return wl.hours });
            hoursPerDay += hoursMap.reduce((prev, cur) => {
              return prev + cur;
            });
          });
          u.hoursPerDays[i] = hoursPerDay;
          u.percantagesPerDays[i] = this.getDayCapacityLevel(u.capacity, hoursPerDay);
          tasks.map(t => {
            t.workLogs = t.workLogs.filter(wl => {
              return this.compareDates(wl.dateTime, day);
            });
          });
          u.tasksMap.set(day.toLocaleDateString(), tasks);
        }

      });
    });
  }

  getTasks() {
    this.users.forEach(u => {
      this.service.getTasks(u).subscribe((res: any) => {
        const workLogs = [];
        if (u.tasks && u.tasks.length > 0) u.tasks = new Array<Task>();
        res.value.Tasks.filter(task => {
          return task.Assignments.some(a => {
            if (!a || !a.Worklog) return false;
            return a.Worklog.length > 0
          });
        })
          .map(task => {
            workLogs.push({
              name: task.Name,
              workLogs: task.Assignments[0].Worklog,
              hyperLink: task.Hyperlink
            });
          });

        workLogs.map(wl => {
          u.tasks.push({
            name: wl.name,
            hyperLink: wl.hyperLink,
            workLogs: wl.workLogs.map(w => {
              const newLog: WorkLog = {
                dateTime: new Date(Date.parse(w.DateTime)),
                hours: w.Hours,
                priority: w.Priority,
                userId: w.Resource
              };
              return newLog;
            })
          });
        });
        this.setTasksForWeek();
        this.calculateHours();
      });
    });
  }
  //#endregion

  //#region Calculate methods
  calculateHours() {
    this.users.forEach(u => {
      let sum = 0;
      for (const tasks of u.tasksMap.values()) {
        tasks.map(t => {
          t.workLogs.map(wl => {
            sum += wl.hours;
          })
        })
      }
      u.totalHours = sum;
      u.totalPercantages = this.getWeekCapacityLevel(u.capacity, sum);
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

  getDayCapacityLevel(capacity: number, hours: number): number {
    /*
    Levels:
      0: x <= 10% 
      1: x <= 25% && x > 10%
      2: x <= 50% && x > 25%
      3. x < 100% && x > 50%
      4. x >= 100%
     */
    if (!capacity) return 0;
    let normalHours = capacity * 8 * 0.01;
    let onePercentage = normalHours / 100;

    return hours / onePercentage;
  }

  getWeekCapacityLevel(capacity: number, hours: number): number {
    if (!capacity) return 0;
    let normalHours = capacity * 40 * 0.01;
    let onePercentage = normalHours / 100;

    return hours / onePercentage;
  }
  //#endregion

  //#region  Work with hidden users

  hideUser(user: User) {
    localStorage.setItem(user.userId, JSON.stringify(user));
  }

  showUser(userId: string) {
    localStorage.removeItem(userId);
  }

  isHidden(userId: string): boolean {
    return localStorage.getItem(userId) ? true : false;
  }

  hideIconMouseEnter(event) {
    event.target.innerText = "visibility_off";
    event.target.style.color = "grey";
  }

  hideIconMouseLeave(event) {
    event.target.innerText = "visibility";
    event.target.style.color = "black";
  }

  getHiddenUsersList(): { userName: string, id: string }[] {
    const users = new Array<{ userName: string, id: string }>();
    const lenght = localStorage.length;
    for (let i = 0; i < lenght; i++) {
      const user = JSON.parse(localStorage.getItem(localStorage.key(i))) as User;
      users.push({ userName: user.userName, id: user.userId });
    }

    return users;
  }
  //#endregion

  //#region Sort methods
  changeNamesSortOrder(event) {
    if (this.namesSortOrder < 2)
      this.namesSortOrder += 1
    else
      this.namesSortOrder = 0;

    if (this.namesSortOrder != SortMethods.NONE) {
      this.hoursPerDaySortOrder = SortMethods.NONE;
      this.hoursPerWeekSortOrder = SortMethods.NONE;
    }
    this.changeArrow(event);
  }

  changeHoursPerDaySortOrder(event, day) {
    if (this.hoursPerDaySortOrder < 2) {
      this.hoursPerDaySortOrder += 1
      this.sortDay = day;
    }
    else {
      this.sortDay = -1;
      this.hoursPerDaySortOrder = 0;
    }

    if (this.hoursPerDaySortOrder != SortMethods.NONE) {
      this.namesSortOrder = SortMethods.NONE;
      this.hoursPerWeekSortOrder = SortMethods.NONE;
    }

    this.changeArrow(event);
  }

  changeHoursPerWeekSortOrder(event) {
    if (this.hoursPerWeekSortOrder < 2) {
      this.hoursPerWeekSortOrder += 1
      this.sortDay = 8;
    }
    else {
      this.hoursPerWeekSortOrder = 0;
      this.sortDay = -1;
    }

    if (this.hoursPerWeekSortOrder != SortMethods.NONE) {
      this.namesSortOrder = SortMethods.NONE;
      this.hoursPerDaySortOrder = SortMethods.NONE;
    }
    this.changeArrow(event);
  }

  changeArrow(event) {
    event.target.innerText = ~(event.target.innerText as string).indexOf("down", 0) ? "keyboard_arrow_up" : "keyboard_arrow_down";
  }
  //#endregion
}
