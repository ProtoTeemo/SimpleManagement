import { Task } from './task';

export class User {
    idInGroups :string[];
    userId : string;
    userName : string;
    tasks? : Task[];
    tasksMap? : Map<string, Task[]> = new Map<string, Task[]>();
    totalHours? : number;
    totalPercantages? : number;
    hoursPerDays? : number[];
    percantagesPerDays? : number[];
    capacity :number;
}