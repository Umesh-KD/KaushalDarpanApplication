import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayOutTestComponent } from './lay-out-test.component';

const routes: Routes = [{ path: '', component: LayOutTestComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayOutTestRoutingModule { }
