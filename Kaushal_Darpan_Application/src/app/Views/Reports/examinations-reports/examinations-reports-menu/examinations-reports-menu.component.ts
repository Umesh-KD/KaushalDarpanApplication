import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { MaterialModule } from '../../../../material.module';
import { LoaderModule } from '../../../Shared/loader/loader.module';

@Component({
  selector: 'app-examinations-reports-menu',
  imports: [FormsModule, RouterModule, ReactiveFormsModule, NgSelectModule,CommonModule, LoaderModule, MaterialModule],
  templateUrl: './examinations-reports-menu.component.html',
  styleUrl: './examinations-reports-menu.component.css'
})
export class ExaminationsReportsMenuComponent {
  @Output() pageInfo = new EventEmitter<{
    exam_cat: string;   
    menu: string;
    semester: number;
    pageType: string;
    extType: string;
    action: string;
    sp: string;
  }>();

  PageHref(exam_cat: string, menu: string, semester: number, pageType: string, extType: string, action: string, sp: string) {
    this.pageInfo.emit({
      exam_cat: exam_cat,
      semester: semester,
      menu: menu,
      pageType: pageType,
      extType: extType,
      action: action,
      sp: sp
    });
  }
}
