import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InternalSlidingComponent } from './internal-sliding.component';

const routes: Routes = [{ path: '', component: InternalSlidingComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InternalSlidingRoutingModule { }
