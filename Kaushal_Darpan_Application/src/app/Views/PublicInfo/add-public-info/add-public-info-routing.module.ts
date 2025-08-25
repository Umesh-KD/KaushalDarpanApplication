import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddPublicInfoComponent } from './add-public-info.component';

const routes: Routes = [{ path: '', component: AddPublicInfoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddPublicInfoRoutingModule { }
