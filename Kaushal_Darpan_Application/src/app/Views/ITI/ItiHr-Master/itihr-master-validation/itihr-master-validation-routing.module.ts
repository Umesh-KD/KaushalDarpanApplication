import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItiHrMasterValidationComponent } from './itihr-master-validation.component';

const routes: Routes = [{ path: '', component: ItiHrMasterValidationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItiHrMasterValidationRoutingModule { }
