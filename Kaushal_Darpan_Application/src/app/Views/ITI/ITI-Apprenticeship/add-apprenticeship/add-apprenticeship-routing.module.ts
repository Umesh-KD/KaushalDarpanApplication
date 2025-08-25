import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddApprenticeshipComponent } from './add-apprenticeship.component';

const routes: Routes = [{ path: '', component: AddApprenticeshipComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddApprenticeshipRoutingModule { }
