import { Task } from './task';

export class User {
    idInGroups :string[];
    userId : string;
    userName : string;
    tasks? : Task[];
    tasksMap? : Map<string, Task[]> = new Map<string, Task[]>();
    totalHours? : number;
    hoursPerDays? : number[];
    capacity :number;
}