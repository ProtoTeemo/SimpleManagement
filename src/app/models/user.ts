import { Task } from './task';

export class User {
    idInGroups :string[];
    userId : string;
    userName : string;
    tasks? : Task[];
}