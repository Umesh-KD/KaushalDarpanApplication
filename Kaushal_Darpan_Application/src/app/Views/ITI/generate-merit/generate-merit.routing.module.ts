import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GenerateMeritComponent } from './generate-merit.component';





const routes: Routes = [{ path: '', component: GenerateMeritComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GenerateMeritRoutingModule { }
