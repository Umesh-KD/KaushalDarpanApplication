import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterPipe } from '../../../../Pipes/table-search-filter.pipe';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ViewStaffProfileModalComponent } from './view-staff-profile-modal.component';
import { ViewStaffProfileModalRoutingModule } from './view-staff-profile-modal-routing.model';

@NgModule({
  declarations: [
    ViewStaffProfileModalComponent
  ],
  imports: [
    CommonModule,
    ViewStaffProfileModalRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule,
    NgMultiSelectDropDownModule.forRoot(),
  ],
  exports: [ViewStaffProfileModalComponent]
})
export class ViewStaffProfileModalModule { }
