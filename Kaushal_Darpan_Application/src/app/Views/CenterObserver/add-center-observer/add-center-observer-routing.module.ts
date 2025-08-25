import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddCenterObserverComponent } from './add-center-observer.component';

const routes: Routes = [{ path: '', component: AddCenterObserverComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddCenterObserverRoutingModule { }
