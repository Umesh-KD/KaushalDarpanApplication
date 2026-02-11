import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItiLiveResultComponent } from './Iti-Live-Result.component';

const routes: Routes = [{ path: '', component: ItiLiveResultComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItiLiveResultRoutingModule { }
