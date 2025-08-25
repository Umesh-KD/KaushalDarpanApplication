import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OptionFormTabComponent } from './option-form-tab.component';

const routes: Routes = [{ path: '', component: OptionFormTabComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OptionFormTabRoutingModule { }
