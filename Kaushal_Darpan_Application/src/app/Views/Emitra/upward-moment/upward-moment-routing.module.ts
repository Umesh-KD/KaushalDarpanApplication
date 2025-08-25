import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UpwardMomentComponent } from './upward-moment.component';

const routes: Routes = [{ path: '', component: UpwardMomentComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UpwardMomentRoutingModule { }
