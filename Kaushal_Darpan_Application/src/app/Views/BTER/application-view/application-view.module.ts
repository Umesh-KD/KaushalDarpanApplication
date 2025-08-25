import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { ViewApplicationComponent } from './application-view.component';
import { ViewApplicationRoutingModule } from './application-view-routing.module';


@NgModule({
    declarations: [
        ViewApplicationComponent
    ],
    imports: [
        CommonModule,
        ViewApplicationRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        LoaderModule
    ],
  exports: [ViewApplicationComponent]
})
export class ViewApplicationModule { }
