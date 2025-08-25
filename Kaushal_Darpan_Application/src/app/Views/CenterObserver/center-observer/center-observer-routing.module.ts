import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CenterObserverComponent } from './center-observer.component';

const routes: Routes = [{ path: '', component: CenterObserverComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CenterObserverRoutingModule { }
