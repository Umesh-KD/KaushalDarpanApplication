import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExamTicketComponent } from './exam-ticket.component';

const routes: Routes = [{ path: '', component: ExamTicketComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExamTicketRoutingModule { }
