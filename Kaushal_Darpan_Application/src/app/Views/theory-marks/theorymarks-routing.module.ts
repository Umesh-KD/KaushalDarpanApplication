import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TheoryMarksComponent } from './theory-marks.component';


const routes: Routes = [{ path: '', component: TheoryMarksComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class theorymarksRoutingModule { }
