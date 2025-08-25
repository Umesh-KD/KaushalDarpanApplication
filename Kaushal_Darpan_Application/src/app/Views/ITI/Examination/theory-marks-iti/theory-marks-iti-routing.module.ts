import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TheoryMarksItiComponent } from './theory-marks-iti.component';

const routes: Routes = [{ path: '', component: TheoryMarksItiComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TheoryMarksItiRoutingModule { }
