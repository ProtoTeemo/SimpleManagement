import { Injectable } from '@angular/core';
import { User } from '../../models/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Task } from '../../models/task';
import { WorkLog } from '../../models/worklog';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EpicFlowService {

  readonly baseUrl = "https://hys.epicflow.net/api/api";
  constructor(private http: HttpClient) { }

   getUsers(): Observable<any> {
    const headers = new HttpHeaders()
      .set('Content-type', 'application/json')
      .set('bellaSessionId', 'e3173a97caad413faf915954e52735b6');

    return this.http.post(`${this.baseUrl}/ResourceManagement/GetInternalResourcePool`, null, { headers: headers })
  }

   getTasks(user: User): Observable<any> {
    const headers = new HttpHeaders()
      .set('Content-type', 'application/json')
      .set('bellaSessionId', 'e3173a97caad413faf915954e52735b6');

    return this.http.post(`${this.baseUrl}/ProjectManagement/GetTimesheetUpdate`, { resourceId: user.userId }, { headers: headers })
  }

  getCapacity(usersResponse : any, index: number){
    let capacityResult = 0;
    usersResponse.value.users[index].SubUsers.forEach(u => {
      if(Object.keys(u.Capacity).length > 0){
        capacityResult += u.Capacity[Object.keys(u.Capacity)[Object.keys(u.Capacity).length - 1]];
      }
        
    });
    return capacityResult;
  }

}

