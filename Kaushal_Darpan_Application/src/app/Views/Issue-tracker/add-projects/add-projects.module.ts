import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddProjectsComponent } from './add-projects.component';
import { AddProjectsRoutingModule } from './add-projects-routing.module';


@NgModule({
  declarations: [
    AddProjectsComponent,
  ],
  imports: [
    CommonModule,
    AddProjectsRoutingModule ,
    FormsModule,
    LoaderModule,
    ReactiveFormsModule,
  ]
})
export class AddProjectsModule { }
