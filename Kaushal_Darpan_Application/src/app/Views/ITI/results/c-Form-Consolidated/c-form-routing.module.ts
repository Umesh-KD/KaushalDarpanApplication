import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { cFormConsolidatedComponent } from './c-Form-Consolidated.component';


const routes: Routes = [{ path: '', component: cFormConsolidatedComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class cFormConsolidatedRoutingModule { }
