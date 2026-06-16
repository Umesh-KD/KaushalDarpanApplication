import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SingleIIPDetailsComponent } from './single-iip-details.component';

const routes: Routes = [{ path: '', component: SingleIIPDetailsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SingleIIPDetailsRoutingModule { }
