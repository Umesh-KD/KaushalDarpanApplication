import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrincipleUpdateListComponent } from './PrincipleUpdateList.component';




const routes: Routes = [{ path: '', component: PrincipleUpdateListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrincipleListRoutingModule { }
