import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KnowMenuComponent } from './know-menu.component';

const routes: Routes = [{ path: '', component: KnowMenuComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KnowMenuRoutingModule { }
