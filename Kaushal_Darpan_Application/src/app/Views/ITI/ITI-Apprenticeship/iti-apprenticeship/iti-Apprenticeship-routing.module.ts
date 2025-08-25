import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ITIApprenticeshipComponent } from './iti-Apprenticeship.component';

const routes: Routes = [{ path: '', component: ITIApprenticeshipComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ITIApprenticeshipRoutingModule { }
