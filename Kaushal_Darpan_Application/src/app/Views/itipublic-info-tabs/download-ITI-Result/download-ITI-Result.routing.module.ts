import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { downloadITIResultComponent } from './download-ITI-Result.component';

const routes: Routes = [{ path: '', component: downloadITIResultComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class downloadITIResultRoutingModule { }
