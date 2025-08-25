import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ITIPrivateAddEstablishComponent } from './ITI_Private_AddEstablish.component';

const routes: Routes = [{ path: '', component: ITIPrivateAddEstablishComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ITIPrivateAddEstablishRoutingModule { }
