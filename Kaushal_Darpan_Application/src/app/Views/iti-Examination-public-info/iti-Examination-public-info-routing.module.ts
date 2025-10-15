import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ITIExaminationPublicInfoComponent } from './iti-Examination-public-info.component';

const routes: Routes = [{ path: '', component: ITIExaminationPublicInfoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ITIExaminationPublicInfoRoutingModule { }
