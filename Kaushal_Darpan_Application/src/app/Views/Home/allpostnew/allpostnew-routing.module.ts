import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllpostnewComponent } from './allpostnew.component';

const routes: Routes = [{ path: '', component: AllpostnewComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllpostnewRoutingModule { }
