import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Task } from '../models/task';

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
          users.push({ userId: user.UserId, userName: user.UserName });
        });
      });
    return users;
  }

  getTasks(date:Date): Task[]{

  }
}
