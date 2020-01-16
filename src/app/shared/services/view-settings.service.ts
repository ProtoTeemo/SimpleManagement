import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ViewSettingsService {

  dayDataFormat : BehaviorSubject<string> = new BehaviorSubject('hours');

  changeFormat(newFormat : string){
    this.dayDataFormat.next(newFormat);
  }
  constructor() { }
}
