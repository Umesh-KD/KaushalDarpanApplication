import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { PlacementDataComponent } from './placement-data.component';
import { MaterialModule } from '../../../material.module';

const routes: Routes = [
  {
    path: '',
    component: PlacementDataComponent
  }
];

@NgModule({
  declarations: [PlacementDataComponent],
  imports: [
    CommonModule, RouterModule.forChild(routes), FormsModule, ReactiveFormsModule, CommonModule, MaterialModule
  ]
})

export class PlacementDataModule { }
