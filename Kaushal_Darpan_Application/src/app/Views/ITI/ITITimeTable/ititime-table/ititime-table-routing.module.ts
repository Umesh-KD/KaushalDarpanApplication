import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ITITimeTableComponent } from './ititime-table.component';

const routes: Routes = [{ path: '', component: ITITimeTableComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ITITimeTableRoutingModule { }
