import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ITICollegeSSOMappingComponent } from './iticollege-ssomapping.component';

const routes: Routes = [{ path: '', component: ITICollegeSSOMappingComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ITICollegeSSOMappingRoutingModule { }
