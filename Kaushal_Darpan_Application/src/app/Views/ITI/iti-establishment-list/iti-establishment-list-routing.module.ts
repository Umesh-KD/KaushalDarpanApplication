import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItiEstablishmentListComponent } from './iti-establishment-list.component';

const routes: Routes = [{ path: '', component: ItiEstablishmentListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItiEstablishmentListRoutingModule { }
