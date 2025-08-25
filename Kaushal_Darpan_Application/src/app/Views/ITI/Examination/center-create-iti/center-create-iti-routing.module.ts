import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CenterCreateITIComponent } from './center-create-iti.component';

const routes: Routes = [{ path: '', component: CenterCreateITIComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CenterCreateITIRoutingModule { }
