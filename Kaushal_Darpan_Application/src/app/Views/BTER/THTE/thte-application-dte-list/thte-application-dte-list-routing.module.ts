import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { THTEApplicationDteListComponent } from './thte-application-dte-list.component';

const routes: Routes = [{ path: '', component: THTEApplicationDteListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class THTEApplicationDteListRoutingModule { }
