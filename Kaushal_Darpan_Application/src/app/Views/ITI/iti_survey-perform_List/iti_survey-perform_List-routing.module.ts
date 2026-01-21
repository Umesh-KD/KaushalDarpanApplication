import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ITIsurveyperformListComponent } from './iti_survey-perform_List.component';

const routes: Routes = [{ path: '', component: ITIsurveyperformListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ITIsurveyperformListRoutingModule { }
