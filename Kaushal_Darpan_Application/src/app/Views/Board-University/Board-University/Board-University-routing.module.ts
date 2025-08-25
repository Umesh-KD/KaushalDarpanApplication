import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BoardUniversityComponent } from './Board-University.component';

const routes: Routes = [{ path: '', component: BoardUniversityComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BoardUniversityRoutingModule { }
