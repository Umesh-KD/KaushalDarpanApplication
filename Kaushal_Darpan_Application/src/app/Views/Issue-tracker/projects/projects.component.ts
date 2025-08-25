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
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],
  standalone: false
})
export class ProjectsComponent {
  public State: number = -1;
  groupForm!: FormGroup;
  public Message: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public isUpdate: boolean = false;
  public TradeId: number | null = null;
  public TradeTypesList: any = [];
  public ProjectList: any[] = [];
  public UserID: number = 0;
  request = new ProjectsModel();
  requestSearch = new ProjectsSearchModel();
  sSOLoginDataModel = new SSOLoginDataModel();
  public searchByProjectName: string = ''
  public searchByVendor: string = ''
  public searchByWorkorderNo: string = ''
  public searchByWorkorderDate: string = ''
  public Table_SearchText: string = '';
  public searchRequest = new ProjectsSearchModel();
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
    private Swal2: SweetAlert2) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.request.UserID = this.sSOLoginDataModel.UserID;
    this.UserID = this.sSOLoginDataModel.UserID;
    await this.GetAllData();
  }

  async GetAllData() {
    console.log("searchRequest", this.searchRequest);
    //debugger;
    //this.searchRequest.CommonSubjectYesNo = this.CommonSubjectYesNo;
    //this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    //this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
    //this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
    try {
      await this.ProjectsServices.GetAllData(this.searchRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.ProjectList = data.Data;
        console.log("this.ProjectList", this.ProjectList)
      })
    } catch (error) {
      console.error(error);
    }
  }

  async btnDelete_OnClick(ProjectID: number) {

    this.Swal2.Confirmation("Are you sure you want to delete this ?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          try {
            //Show Loading
            this.loaderService.requestStarted();

            await this.ProjectsServices.DeleteDataByID(ProjectID, this.UserID)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));
                console.log(data);

                if (data.State == EnumStatus.Success) {
                  this.toastr.success(data.Message)
                  //this.router.navigate(['/Projects']);
                  //reload
                  this.GetAllData()
                }
                else {
                  this.toastr.error(data.ErrorMessage)
                }

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
      });
  }

  get() { return this.groupForm.controls; }

  GenerateOTP_save() {
    this.isSubmitted = true;
    if (this.groupForm.invalid) {
      return console.log("error")
    }
    this.childComponent.MobileNo = this.sSOLoginDataModel.Mobileno;
    this.childComponent.OpenOTPPopup();

    this.childComponent.onVerified.subscribe(() => {
      //this.SaveData();
    })
  }


  ResetControl() {
    //debugger;
    // Reset all filter fields
    this.searchRequest.ProjectName = '';
    this.searchRequest.Vendor = '';
    this.searchRequest.WorkorderNo = '';

    this.searchByProjectName = '';
    this.searchByVendor = '';
    this.searchByWorkorderNo = '';

    this.GetAllData();
  }


  onSearchClick() {
    //debugger;
    this.searchRequest.ProjectName = this.searchByProjectName;
    this.searchRequest.Vendor = this.searchByVendor;
    this.searchRequest.WorkorderNo = this.searchByWorkorderNo;
    this.GetAllData()
 
  }




  async onEdit(ID: any) {
    this.router.navigate(['/AddProjects'], { queryParams: { id: ID } });
  }

}
