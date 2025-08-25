import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ResultComponent } from './result.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MaterialModule } from '../../../material.module';
import { LoaderModule } from '../../Shared/loader/loader.module';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: ResultComponent
  },
  {
    path: ':url',
    component: ResultComponent
  }
];

@NgModule({
  declarations: [ResultComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    RouterModule.forChild(routes),
    ScrollingModule,
    MaterialModule
  ]
})
export class ResultModule { }
