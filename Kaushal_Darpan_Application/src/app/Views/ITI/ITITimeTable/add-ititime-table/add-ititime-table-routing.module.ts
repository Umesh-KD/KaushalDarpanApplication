import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddITITimeTableComponent } from './add-ititime-table.component';

const routes: Routes = [{ path: '', component: AddITITimeTableComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddITITimeTableRoutingModule { }
