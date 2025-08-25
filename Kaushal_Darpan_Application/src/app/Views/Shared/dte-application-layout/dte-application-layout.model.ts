import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DTEApplicationLayoutComponent } from './dte-application-layout.component';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { NgScrollbarModule } from 'ngx-scrollbar';
const routes: Routes = [
  {
    path: '',
    component: DTEApplicationLayoutComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), RouterModule, MatSelectModule, MatInputModule, MatFormFieldModule, MatIconModule, FormsModule, NgScrollbarModule],
  exports: [RouterModule, MatSelectModule, MatInputModule, MatFormFieldModule, NgScrollbarModule],
})
export class DTEApplicationLayoutModule { }
