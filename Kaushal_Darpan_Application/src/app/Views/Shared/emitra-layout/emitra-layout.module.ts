import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmitraLayoutRoutingModule } from './emitra-layout-routing.module';
import { EmitraLayoutComponent } from './emitra-layout.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { RouterModule, Routes } from '@angular/router';
/*import { routes } from '../../../routes';*/
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { NgScrollbarModule } from 'ngx-scrollbar';
const routes: Routes = [
  {
    path: '',
    component: EmitraLayoutComponent
  }
];

@NgModule({

  //imports: [RouterModule.forChild(routes), RouterModule, MatSelectModule, MatInputModule, MatFormFieldModule,
  //  MatIconModule, FormsModule, NgScrollbarModule, FormsModule],
  //exports: [RouterModule, MatSelectModule, MatInputModule, MatFormFieldModule, NgScrollbarModule],

  imports: [RouterModule.forChild(routes), RouterModule, MatSelectModule, MatInputModule, MatFormFieldModule, MatIconModule, FormsModule, NgScrollbarModule],
  exports: [RouterModule, MatSelectModule, MatInputModule, MatFormFieldModule, NgScrollbarModule],

})
export class EmitraLayoutModule { }

