import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IDFFundDetailsComponent } from './idffund-details.component';

const routes: Routes = [{ path: '', component: IDFFundDetailsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IDFFundDetailsRoutingModule { }
