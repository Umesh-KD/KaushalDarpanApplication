import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InstituteDetailComponent } from './institute-detail.component';

const routes: Routes = [{ path: '', component: InstituteDetailComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InstituteDetailRoutingModule { }
