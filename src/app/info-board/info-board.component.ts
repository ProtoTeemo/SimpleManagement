import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { EpicFlowService } from '../shared/epic-flow.service';
import { User } from '../models/user';
import { Task } from '../models/task';
import { DateService } from '../shared/date.service';
import { WorkLog } from '../models/worklog';

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
      public dateService: DateService
    ) {
    // получить пользователей
    this.dateService.week.subscribe(() => {
      this.users.forEach(u => {
        u.tasksMap.clear();
      });
      this.getTasks();
    });
  }

  users: User[] = new Array<User>();

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.service.getUsers().subscribe((res: any) => {
      res.value.users.map(user => {
        const user_map: User = {
          idInGroups: user.UserInGroups
            .filter(u => ~u.Name.indexOf('Gebo'))
            .map(u => u.Id),
          userId: user.UserId,
          userName: user.UserName,
          tasksMap: new Map<string, Task[]>(),
          tasks: new Array<Task>(),
          hoursPerDays: new Array<number>(7)
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
            const hoursMap = t.workLogs.map(wl => { return wl.hours});
            hoursPerDay += hoursMap.reduce((prev, cur) =>{
              return prev + cur;
            });
          });
          u.hoursPerDays[i] = hoursPerDay;
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

  hideUser(user: User){
    localStorage.setItem(user.userId, JSON.stringify(user));
  }

  showUser(userId: string){
    localStorage.removeItem(userId);
  }

  getTasks() {
    this.users.forEach(u => {
      this.service.getTasks(u).subscribe((res: any) => {
        const workLogs = [];
        if(u.tasks.length > 0) u.tasks = new Array<Task>();
        res.value.Tasks.filter(task => {
          return task.Assignments.some(a => {
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

  calculateHours(){
    this.users.forEach(u => {
      let sum = 0;
      for(const tasks of u.tasksMap.values()){
        tasks.map(t => {
          t.workLogs.map(wl => {
            sum += wl.hours;
          })
        })
      }
      u.totalHours = sum;
    });
  }

  printTasks() {
    this.users.forEach(u => {
      this.dateService.week.value.forEach(day => {
        if(u.tasksMap.get(day.toLocaleDateString()).length > 0)
          console.log(`${u.userName}: `, u.tasksMap.get(day.toLocaleDateString()));
      })
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

  isHidden(userId : string) : boolean {
    return localStorage.getItem(userId) ? true : false;
  }

  hideIconMouseEnter(event){
    event.target.innerText = "visibility_off";
    event.target.style.color = "grey";
  }

  hideIconMouseLeave(event){
    event.target.innerText = "visibility";
    event.target.style.color = "black";
  }


  getHiddenUsersList(): {userName:string, id:string}[]{
    const users = new Array<{userName:string, id:string}>();
    const lenght = localStorage.length;
    for (let i = 0; i < lenght; i++) {
     const user = JSON.parse(localStorage.getItem(localStorage.key(i))) as User;
     users.push({userName: user.userName, id: user.userId});    
    }

    return users;
  }

}
