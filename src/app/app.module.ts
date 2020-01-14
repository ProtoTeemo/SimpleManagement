import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarComponent } from './calendar/calendar.component';
import { HttpClientModule } from '@angular/common/http';
import { InfoBoardComponent } from './info-board/info-board.component';
import { DatePipe } from './shared/date.pipe';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { AutoUpdateComponent } from './auto-update/auto-update.component';
import { FormsModule } from '@angular/forms';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { ruLocale } from 'ngx-bootstrap/locale';
import { MatModule } from './mat/mat.module';
import { SortPipe } from './shared/sort.pipe';
defineLocale('ru', ruLocale);

@NgModule({
  declarations: [
    AppComponent,
    CalendarComponent,
    InfoBoardComponent,
    DatePipe,
    AutoUpdateComponent,
    SortPipe
  ],
  imports: [
    BrowserModule,
    BsDatepickerModule.forRoot(),
    BrowserAnimationsModule,
    HttpClientModule,
    PopoverModule.forRoot(),
    FormsModule,
    MatModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
