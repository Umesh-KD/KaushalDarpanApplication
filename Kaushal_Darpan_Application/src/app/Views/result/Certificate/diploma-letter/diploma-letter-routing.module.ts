import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DiplomaLetterComponent } from './diploma-letter.component';

const routes: Routes = [{ path: '', component: DiplomaLetterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DiplomaLetterRoutingModule { }
