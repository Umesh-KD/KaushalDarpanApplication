import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ITIGovtAddEstablishComponent } from './ITI-Govt-AddEstablish.component';

const routes: Routes = [{ path: '', component: ITIGovtAddEstablishComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ITIGovtAddEstablishRoutingModule { }
