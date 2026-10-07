import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PromotionEligibleStudentComponent } from './promotion-eligible-student.component';

const routes: Routes = [{ path: '', component: PromotionEligibleStudentComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PromotionEligibleStudentRoutingModule { }
