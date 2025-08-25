import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItiCenterObserverComponent } from './iti-flying-squad.component';

const routes: Routes = [{ path: '', component: ItiCenterObserverComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItiCenterObserverRoutingModule { }
