import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { THTEPrincipleApplicationListComponent } from './thte-principle-application-list.component';

const routes: Routes = [{ path: '', component: THTEPrincipleApplicationListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class THTEPrincipleApplicationListRoutingModule { }
