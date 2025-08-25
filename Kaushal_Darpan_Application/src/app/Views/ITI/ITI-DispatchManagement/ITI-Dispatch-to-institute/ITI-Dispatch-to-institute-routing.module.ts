import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ITIDispatchToInstituteComponent } from './ITI-Dispatch-to-institute.component';

const routes: Routes = [{ path: '', component: ITIDispatchToInstituteComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ITIDispatchToInstituteRoutingModule { }
