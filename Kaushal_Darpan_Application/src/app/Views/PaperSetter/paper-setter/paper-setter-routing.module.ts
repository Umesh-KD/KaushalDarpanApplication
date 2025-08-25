import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaperSetterComponent } from './paper-setter.component';

const routes: Routes = [{ path: '', component: PaperSetterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaperSetterRoutingModule { }
