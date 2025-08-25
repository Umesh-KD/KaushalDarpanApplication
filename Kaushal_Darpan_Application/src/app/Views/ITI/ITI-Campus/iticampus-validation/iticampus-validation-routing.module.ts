import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItiCampusValidationComponent } from './iticampus-validation.component';

const routes: Routes = [{ path: '', component: ItiCampusValidationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItiCampusValidationRoutingModule { }
