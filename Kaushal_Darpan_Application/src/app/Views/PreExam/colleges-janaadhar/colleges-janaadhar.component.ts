import { Component, OnInit, Input, Injectable, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { CollegesJanaadharService } from '../../../Services/CollegesJanaadhar/colleges-janaadhar.service';
import { CollegesJanAadharSearchModel } from '../../../Models/CollegesJanAadharSearchModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
export * from '../../Shared/loader/loader.component';

@Component({
    selector: 'app-colleges-janaadhar',
    templateUrl: './colleges-janaadhar.component.html',
    styleUrls: ['./colleges-janaadhar.component.css'],
    standalone: false
})
export class CollegesJanaadharComponent implements OnInit {

  public CollegesJanaadharList: any = [];
  public Table_SearchText: string = "";
  public searchRequest = new CollegesJanAadharSearchModel();
  public sSOLoginDataModel = new SSOLoginDataModel();

  constructor(private commonMasterService: CommonFunctionService, private collegesJanaadharService: CollegesJanaadharService, private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private routers: Router, private modalService: NgbModal) {
  }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetAllData();
  }

  // get all data
  async GetAllData() {
    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
    try {
      this.loaderService.requestStarted();
      await this.collegesJanaadharService.GetAllData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.CollegesJanaadharList = data['Data'];
        }, (error: any) => console.error(error)
        );
    }
    catch (ex) {
      console.log(ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  // get all data
  async ClearSearchData() {
    this.searchRequest.InstituteCode = '';
    this.searchRequest.InstituteNameEnglish = '';
    await this.GetAllData();
  }

}//
