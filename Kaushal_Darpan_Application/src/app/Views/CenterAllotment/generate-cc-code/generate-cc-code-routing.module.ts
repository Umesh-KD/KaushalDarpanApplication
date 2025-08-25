import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GenerateCcCodeComponent } from './generate-cc-code.component';

const routes: Routes = [{ path: '', component: GenerateCcCodeComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GenerateCcCodeRoutingModule { }
