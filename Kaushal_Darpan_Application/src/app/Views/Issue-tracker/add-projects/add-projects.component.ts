import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';
import { ToastrService } from 'ngx-toastr';
import { EnumStatus } from '../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { OTPModalComponent } from '../../otpmodal/otpmodal.component';
import { ProjectsService } from '../../../Services/Projects/projects.service';
import { ProjectsModel, ProjectsSearchModel } from '../../../Models/ProjectsModel';

@Component({
  selector: 'app-add-projects',
  standalone: false,
  templateUrl: './add-projects.component.html',
  styleUrl: './add-projects.component.css'
})
export class AddProjectsComponent {
  groupForm!: FormGroup;
  public isUpdate: boolean = false;
  public ProjectID: number | null = null;
  public Message: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  //public TradeTypesList: any = [];
  request = new ProjectsModel();
  requestSearch = new ProjectsSearchModel();
  sSOLoginDataModel = new SSOLoginDataModel();
  public searchByProjectName: string = ''
  public searchByVendorName: string = ''
  public searchByWorkorderNo: string = ''
  public searchByWorkorderDate: string = ''
  public Table_SearchText: string = '';
  @ViewChild('otpModal') childComponent!: OTPModalComponent;


  constructor(
    private fb: FormBuilder,
    private loaderService: LoaderService,
    private commonMasterService: CommonFunctionService,
    private Router: Router,
    private ProjectsServices: ProjectsService,
    private toastr: ToastrService,
    private router: Router,
    private routers: ActivatedRoute,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private Swal2: SweetAlert2) { }

  async ngOnInit() {
    this.groupForm = this.fb.group({
      txtProjectName: ['', Validators.required],
      txtVendorName:  ['', Validators.required],
      txtWorkOrderNo: ['', Validators.required],
      txtWorkOrderDate: ['', Validators.required]
    });
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    // console.log(this.sSOLoginDataModel);
    this.ProjectID = Number(this.route.snapshot.queryParamMap.get('id')?.toString());
    if (this.ProjectID) {
      await this.GetByID(this.ProjectID)
    }
  }


  get() { return this.groupForm.controls; }

  async SaveData() {
    this.isSubmitted = true
    if (this.groupForm.invalid) {
      this.toastr.error("Form invalid")
      return;
    }
    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;
    this.request.EndTermID = this.sSOLoginDataModel.EndTermID
    this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID
    this.request.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng
    
    try {

      await this.ProjectsServices.SaveData(this.request)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.ResetControl();
            this.toastr.success(data.Message)
            this.router.navigate(['/Projects']);
          }
          else {
            this.toastr.error(this.ErrorMessage)
          }
        })
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isLoading = false;

      }, 200);
    }
  }

  async GetByID(id: number) {
    try {
      this.loaderService.requestStarted();

      await this.ProjectsServices.GetByID(id)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log("data", data)
          this.request.ProjectID = data['Data']["ProjectID"];
          this.request.ProjectName = data['Data']["ProjectName"];
          this.request.Vendor = data['Data']["Vendor"];
          this.request.WorkorderNo = data['Data']["WorkorderNo"];
          this.request.WorkorderDate = this.dateSetter(data['Data']["WorkorderDate"]);
          const btnSave = document.getElementById('btnSave');
          if (btnSave) btnSave.innerHTML = "Update";

          const btnReset = document.getElementById('btnReset');
          if (btnReset) btnReset.innerHTML = "Cancel";

        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  dateSetter(date: any): string {
    if (date != null) {
      const parsedDate = new Date(date);
      if (!isNaN(parsedDate.getTime())) {
        // Check for '1900-01-01'
        const isDefaultDate = parsedDate.getFullYear() === 1900 &&
          parsedDate.getMonth() === 0 &&
          parsedDate.getDate() === 1;
        if (isDefaultDate) {
          return '';
        }

        const year = parsedDate.getFullYear();
        const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
        const day = String(parsedDate.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      }
    }
    return '';
  }


  ResetControl() {
    // Reset all filter fields
    //this.searchByProjectName = '';
    //this.searchByVendorName = '';
    //this.searchByWorkorderNo = '';
    //this.searchByWorkorderDate = '';

    this.request.ProjectName = '';
    this.request.Vendor = '';
    this.request.WorkorderNo = '';
    this.request.WorkorderDate = '';

  }

  onSearchClick() {
    const searchCriteria: any = {
      ProjectName: this.searchByProjectName.trim().toLowerCase(),
      VendorName: this.searchByVendorName.trim().toLowerCase(),
      WorkorderNo: this.searchByWorkorderNo.trim().toLowerCase(),
      WorkorderDate: this.searchByWorkorderDate.trim().toLowerCase(),
      //StreamTypeID: Number(this.searchByBranchType)
    };

  }


}






