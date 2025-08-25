import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItiGeneralInstructionsComponent } from './iti-general-Instructions.component';

const routes: Routes = [{ path: '', component: ItiGeneralInstructionsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItiGeneralInstructionsRoutingModule { }
