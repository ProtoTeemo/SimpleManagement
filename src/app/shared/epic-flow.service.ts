import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Task } from '../models/task';
import { WorkLog } from '../models/worklog';

@Injectable({
  providedIn: 'root'
})
export class EpicFlowService {

  readonly baseUrl = "https://hys.epicflow.net/api/api";
  constructor(private http: HttpClient) { }

  getUsers(): User[] {
    const headers = new HttpHeaders()
      .set('Content-type', 'application/json')
      .set('bellaSessionId', 'e3173a97caad413faf915954e52735b6');

    const users = new Array<User>();
    this.http.post(`${this.baseUrl}/ResourceManagement/GetInternalResourcePool`, null, { headers: headers })
      .subscribe((res: any) => {
        res.value.users.map(user => {
          const user_map: User = {
            idInGroups: user.UserInGroups
              .filter(u => ~u.Name.indexOf('Gebo'))
              .map(u => u.Id),
            userId: user.UserId,
            userName: user.UserName,
            tasksMap: new Map<string, Task[]>()
          };
          users.push(user_map);
        });
      });
    return users;
  }

  getTasks(date: Date, user: User): Task[] {
    const headers = new HttpHeaders()
      .set('Content-type', 'application/json')
      .set('bellaSessionId', 'e3173a97caad413faf915954e52735b6');

    let tasks = new Array<Task>();
    this.http.post(`${this.baseUrl}/ProjectManagement/GetTimesheetUpdate`, { resourceId: user.userId }, { headers: headers })
      .subscribe((res: any) => {
        const workLogs = [];

        res.value.Tasks.filter(task => {
          return task.Assignments.some(a => {
            return a.Worklog.length > 0
          });
        })
        .map(task => {
          workLogs.push({
            name: task.Name,
            workLogs: task.Assignments[0].Worklog,//.filter(wl => this.compareDates(date, new Date(Date.parse(wl.DateTime)))),
            hyperLink: task.Hyperlink
          });
        });

        workLogs.map(wl => {
          tasks.push({
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
      });
    return tasks;
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

