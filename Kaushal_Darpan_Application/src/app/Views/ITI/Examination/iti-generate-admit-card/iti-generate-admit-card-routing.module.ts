import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ITIGenerateAdmitCardComponent } from './iti-generate-admit-card.component';

const routes: Routes = [{ path: '', component: ITIGenerateAdmitCardComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ITIGenerateAdmitCardRoutingModule { }
