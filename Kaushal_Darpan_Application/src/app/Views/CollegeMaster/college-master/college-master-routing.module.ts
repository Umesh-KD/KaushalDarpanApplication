import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CollegeMasterComponent } from './college-master.component';


const routes: Routes = [{ path: '', component: CollegeMasterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CollegeMasterRoutingModule { }
