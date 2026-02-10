import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { itiAllResultComponent } from './iti-All-Result.component';

const routes: Routes = [{ path: '', component: itiAllResultComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class itiAllResultRoutingModule { }
