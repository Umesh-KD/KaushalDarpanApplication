import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ITIExaminationPublicInfoTabsComponent } from '../iti-Examination-public-info-Tabs/iti-Examination-public-info-Tabs.component';

const routes: Routes = [{ path: '', component: ITIExaminationPublicInfoTabsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ITIExaminationPublicInfoTabsRoutingModule { }
