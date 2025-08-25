import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExamTicketRoutingModule } from './exam-ticket-routing.module';
import { ExamTicketComponent } from './exam-ticket.component';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../../material.module';



@NgModule({
  declarations: [
    ExamTicketComponent
  ],
  imports: [
    CommonModule,
    ExamTicketRoutingModule,
    FormsModule,
    MaterialModule
  ]
})
export class ExamTicketModule { }



