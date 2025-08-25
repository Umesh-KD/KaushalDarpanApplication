import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AadharEsignComponent } from './aadhar-esign.component';

const routes: Routes = [{ path: '', component: AadharEsignComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AadharEsignRoutingModule { }
