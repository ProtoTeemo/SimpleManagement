import { Component, OnInit } from '@angular/core';
import { EpicFlowService } from '../shared/epic-flow.service';
import { User } from '../models/user';

@Component({
  selector: 'app-info-board',
  templateUrl: './info-board.component.html',
  styleUrls: ['./info-board.component.scss']
})
export class InfoBoardComponent implements OnInit {

  constructor(private service : EpicFlowService) { }
  users :User[];

  ngOnInit() {
    this.users = this.service.getUsers();
    console.log(this.service.getTasks(new Date(), "100000"));
  }

}
