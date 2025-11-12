import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddPostPlanningRoutingModule } from './add-post-planning-routing.module';
import { AddPostPlanningComponent } from './add-post-planning.component';


@NgModule({
  declarations: [
    AddPostPlanningComponent
  ],
  imports: [
    CommonModule,
    AddPostPlanningRoutingModule
  ]
})
export class AddPostPlanningModule { }
