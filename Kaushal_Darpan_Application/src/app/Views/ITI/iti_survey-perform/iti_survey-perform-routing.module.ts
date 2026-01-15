import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ITIsurveyperformComponent } from './iti_survey-perform.component';

const routes: Routes = [{ path: '', component: ITIsurveyperformComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ITIsurveyperformRoutingModule { }
