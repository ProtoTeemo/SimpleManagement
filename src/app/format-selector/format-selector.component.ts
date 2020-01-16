import { Component, OnInit } from '@angular/core';
import { ViewSettingsService } from '../shared/services/view-settings.service';

@Component({
  selector: 'app-format-selector',
  templateUrl: './format-selector.component.html',
  styleUrls: ['./format-selector.component.scss']
})
export class FormatSelectorComponent implements OnInit {

  constructor(public viewSettingsService : ViewSettingsService) { }

  ngOnInit() {
  }

  changeFormat(event){
    this.viewSettingsService.changeFormat(event.target.value);
  }

}
