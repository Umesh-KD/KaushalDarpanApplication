import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApplicationListRoutingModule } from './application-list-routing.module';
import { ApplicationListComponent } from './application-list.component';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { StudentStatusHistoryModule} from '../../Student/student-status-history/student-status-history.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ApplicationListComponent
  ],
  imports: [
    CommonModule,
    ApplicationListRoutingModule,
    LoaderModule,
    StudentStatusHistoryModule,
    FormsModule
  ]

})
export class ApplicationListModule { }
