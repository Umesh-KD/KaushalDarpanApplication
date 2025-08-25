import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ITIStudentFeesTransactionHistoryComponent } from './itistudent-fees-transaction-history.component';

const routes: Routes = [{ path: '', component: ITIStudentFeesTransactionHistoryComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ITIStudentFeesTransactionHistoryRoutingModule { }
