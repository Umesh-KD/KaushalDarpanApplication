import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CorrectMeritComponent } from './correct-merit.component';

const routes: Routes = [{ path: '', component: CorrectMeritComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CorrectMeritRoutingModule { }
