import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmitraLayoutComponent } from './emitra-layout.component';

const routes: Routes = [{ path: '', component: EmitraLayoutComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmitraLayoutRoutingModule { }
