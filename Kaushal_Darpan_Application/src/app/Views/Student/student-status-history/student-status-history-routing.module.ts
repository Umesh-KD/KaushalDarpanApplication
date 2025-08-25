import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentStatusHistoryComponent } from './student-status-history.component';

const routes: Routes = [{ path: '', component: StudentStatusHistoryComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentStatusHistoryRoutingModule { }
