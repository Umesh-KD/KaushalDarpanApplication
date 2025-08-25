import { NgModule } from '@angular/core';
import { CollegeMasterRoutingModule } from './college-master-routing.module';
import { CollegeMasterComponent } from './college-master.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';

import { TableSearchFilterPipe } from '../../../Pipes/table-search-filter.pipe';
import { MaterialModule } from '../../../material.module';


@NgModule({
  declarations: [
    CollegeMasterComponent
    


  ],
  imports: [
    CommonModule,MaterialModule,
    FormsModule, ReactiveFormsModule, CommonModule, LoaderModule,
    CollegeMasterRoutingModule, TableSearchFilterModule
  ],
  exports: [TableSearchFilterPipe]
    

  
  
})
export class CollegeMasterModule { }
