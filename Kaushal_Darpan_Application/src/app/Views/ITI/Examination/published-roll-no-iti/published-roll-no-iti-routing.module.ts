import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublishedRollNoITIComponent } from './published-roll-no-iti.component';

const routes: Routes = [{ path: '', component: PublishedRollNoITIComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublishedRollNoITIRoutingModule { }
