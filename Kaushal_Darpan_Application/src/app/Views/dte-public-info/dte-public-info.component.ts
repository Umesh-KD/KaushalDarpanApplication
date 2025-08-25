import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';
import { LoaderService } from '../../Services/Loader/loader.service';
import { ToastrService } from 'ngx-toastr';
import { EnumStatus } from '../../Common/GlobalConstants';
import { SweetAlert2 } from '../../Common/SweetAlert2';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DropdownValidators } from '../../Services/CustomValidators/custom-validators.service';
import { DTEPublicInfoTabsComponent } from '../dtepublic-info-tabs/dtepublic-info-tabs.component';

@Component({
  selector: 'app-dte-public-info',
  standalone: false,
  templateUrl: './dte-public-info.component.html',
  styleUrl: './dte-public-info.component.css'
})



export class DTEPublicInfoComponent implements AfterViewInit, OnInit {
  groupForm!: FormGroup;
  public Message: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public isUpdate: boolean = false;
  sSOLoginDataModel = new SSOLoginDataModel();
  public State: number = -1;
  public DepartmentID: number = 1;
  public TypeId: number = 0;
  public CourseId: number = 0;

  @ViewChild(DTEPublicInfoTabsComponent) childComponent!: DTEPublicInfoTabsComponent;
 // public reqest : any
  constructor(
    private fb: FormBuilder,
    private commonMasterService: CommonFunctionService,
    private Router: Router,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private router: Router,
    private routers: ActivatedRoute,
    private modalService: NgbModal,
    private Swal2: SweetAlert2) { }

  async ngOnInit() {
    this.groupForm = this.fb.group({
      ddlDepartmentID: ['1', [DropdownValidators]],
    });
    
    this.TypeId = Number(this.routers.snapshot.queryParamMap.get('type'));
    this.TypeId = isNaN(this.TypeId) ? 0 : this.TypeId

    this.CourseId = Number(this.routers.snapshot.queryParamMap.get('courseid'));
    this.CourseId = isNaN(this.CourseId) ? 0 : this.CourseId;



    if (this.TypeId == 0) {
      localStorage.setItem('SSOLoginUser', JSON.stringify(""));
    }

  }

  ngAfterViewInit() {
    this.chooseDeparment();
  }

  chooseDeparment()
  {
    this.childComponent.ChangeDepartment(this.DepartmentID);
  }

}
