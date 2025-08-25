import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SemesterDetailsComponent } from './semester-details.component';

const routes: Routes = [{ path: '', component: SemesterDetailsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SemesterDetailsRoutingModule { }
