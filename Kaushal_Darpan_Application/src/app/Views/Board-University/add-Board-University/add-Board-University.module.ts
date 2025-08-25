import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { addBoardUniversityRoutingModule } from './add-Board-University-routing.module';
import { addBoardUniversityComponent } from './add-Board-University.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';


@NgModule({
  declarations: [
    addBoardUniversityComponent
  ],
  imports: [
    CommonModule,
    addBoardUniversityRoutingModule,
    FormsModule,
    LoaderModule,
    ReactiveFormsModule
  ]
})
export class addBoardUniversityModule { }
