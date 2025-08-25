import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GenerateAdmitCardBulkComponent } from './generate-admit-card-bulk.component';

const routes: Routes = [{ path: '', component: GenerateAdmitCardBulkComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GenerateAdmitCardBulkRoutingModule { }
