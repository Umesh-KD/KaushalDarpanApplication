import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ITIsComponent } from './itis.component';

const routes: Routes = [{ path: '', component: ITIsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ITIsRoutingModule { }
