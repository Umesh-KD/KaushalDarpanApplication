import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ITIStudentDetailsRevisedResultComponent } from './iti-studentdetails-revised-result.component';

const routes: Routes = [{ path: '', component: ITIStudentDetailsRevisedResultComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ITIStudentDetailsRevisedResultRoutingModule { }
