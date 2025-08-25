import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CampusValidationComponent } from './campus-validation.component';

const routes: Routes = [{ path: '', component: CampusValidationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CampusValidationRoutingModule { }
