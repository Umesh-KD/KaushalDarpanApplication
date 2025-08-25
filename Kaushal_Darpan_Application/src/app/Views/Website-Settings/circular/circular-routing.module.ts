import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CircularComponent } from './circular.component';

const routes: Routes = [{ path: '', component: CircularComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CircularRoutingModule { }
