import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoaderComponent } from './loader.component';
import { CommonModule } from '@angular/common';

const routes: Routes = [
  {
    path: '',
    component: LoaderComponent
  }
];

@NgModule({
  declarations: [
    LoaderComponent
  ],
  imports: [CommonModule],
  exports: [LoaderComponent],
})
export class LoaderModule { }
