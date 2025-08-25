import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ITIResultComponent } from './iti-result.component';

const routes: Routes = [{ path: '', component: ITIResultComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ITIResultRoutingModule { }
