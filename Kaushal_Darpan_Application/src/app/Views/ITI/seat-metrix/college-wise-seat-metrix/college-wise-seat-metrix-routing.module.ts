import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CollegeWiseSeatMetrixComponent } from './college-wise-seat-metrix.component';

const routes: Routes = [{ path: '', component: CollegeWiseSeatMetrixComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CollegeWiseSeatMetrixRoutingModule { }
