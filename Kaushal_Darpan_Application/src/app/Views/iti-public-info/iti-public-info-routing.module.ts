import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ITIPublicInfoComponent } from './iti-public-info.component';

const routes: Routes = [{ path: '', component: ITIPublicInfoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ITIPublicInfoRoutingModule { }
