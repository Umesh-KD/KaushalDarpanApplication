import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../Shared/loader/loader.module';
import { TheoryMarksComponent } from './theory-marks.component';
import { theorymarksRoutingModule } from './theorymarks-routing.module';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    TheoryMarksComponent
  ],
  imports: [
    CommonModule,
    theorymarksRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule
  ],
})
export class theorymarksModule { }
