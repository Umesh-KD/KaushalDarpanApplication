import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddItiCenterObserverComponent } from './add-iti-flying-squad.component';

const routes: Routes = [{ path: '', component: AddItiCenterObserverComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddItiCenterObserverRoutingModule { }
