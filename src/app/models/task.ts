import { WorkLog } from './worklog';

export class Task {
    startDate : Date;
    name : string;
    hyperLink : string;
    workLogs : WorkLog[];
}