import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UndertakingByExminerComponent } from './undertaking-by-exminer.component';

const routes: Routes = [{ path: '', component: UndertakingByExminerComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UndertakingByExminerRoutingModule { }
