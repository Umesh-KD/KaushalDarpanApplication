import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UpwardMomentITIComponent } from './upward-moment-iti.component';

const routes: Routes = [{ path: '', component: UpwardMomentITIComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UpwardMomentITIRoutingModule { }
