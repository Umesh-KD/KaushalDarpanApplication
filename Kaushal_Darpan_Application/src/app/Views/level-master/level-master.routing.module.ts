 import { NgModule } from '@angular/core';
 import { Routes, RouterModule } from '@angular/router';

 import { FormsModule, ReactiveFormsModule } from '@angular/forms';
 import { CommonModule } from '@angular/common';


 import { LevelMasterComponent } from './level-master.component';
import { LoaderModule } from '../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';
 const routes: Routes = [
   {
     path: '',
     component: LevelMasterComponent
   }
 ];

 @NgModule({
   declarations: [
     LevelMasterComponent,
   
   ],

   imports: [RouterModule.forChild(routes), FormsModule, ReactiveFormsModule, CommonModule, TableSearchFilterModule, LoaderModule],
   exports: [RouterModule],
 })


 export class LevelRoutingModule { }




