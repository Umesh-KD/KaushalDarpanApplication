import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ITISearchComponent } from './iti-search.component';

const routes: Routes = [{ path: '', component: ITISearchComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ITISearchRoutingModule { }
