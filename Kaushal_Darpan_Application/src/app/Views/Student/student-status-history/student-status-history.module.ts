import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentStatusHistoryRoutingModule } from './student-status-history-routing.module';
import { FormsModule } from '@angular/forms';
import { StudentStatusHistoryComponent } from './student-status-history.component';


@NgModule({
  declarations: [
    StudentStatusHistoryComponent
  ],
  imports: [
    CommonModule,
    StudentStatusHistoryRoutingModule, FormsModule
  ],
  exports: [StudentStatusHistoryComponent]
})
export class StudentStatusHistoryModule { }
