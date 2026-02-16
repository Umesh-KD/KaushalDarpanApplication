import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { bterSanctionedPostsComponent } from './bter-Sanctioned-posts.component';
import { TableSearchFilterPipe } from '../../../Pipes/table-search-filter.pipe';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { bterSanctionedPostsRoutingModule } from './bter-Sanctioned-posts-routing.module';
import { LoaderModule } from '../../Shared/loader/loader.module';

@NgModule({
  declarations: [
    bterSanctionedPostsComponent
  ],
  imports: [
    CommonModule,
    bterSanctionedPostsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule,
    NgMultiSelectDropDownModule.forRoot(),
  ]
})
export class bterSanctionedPostsModule { }
