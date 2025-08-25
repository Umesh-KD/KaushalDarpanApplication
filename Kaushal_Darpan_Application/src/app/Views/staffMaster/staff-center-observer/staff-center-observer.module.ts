import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { StaffCenterObserverComponent } from './staff-center-observer.component';
import { StaffCenterObserverRoutingModule } from './staff-center-observer-routing.module';


@NgModule({
    declarations: [
        StaffCenterObserverComponent
    ],
    imports: [
        CommonModule,
        StaffCenterObserverRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        LoaderModule,
        TableSearchFilterModule
    ]
})
export class StaffCenterObserverModule { }
