import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { EnumGrievanceCategory, EnumGrievanceStaus, EnumRole, EnumStatus } from '../../Common/GlobalConstants';
import { SweetAlert2 } from '../../Common/SweetAlert2';
import { SeatSearchModel, SeatMetrixModel } from '../../Models/SeatMatrixDataModel';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { DropdownValidators } from '../../Services/CustomValidators/custom-validators.service';
import { SeatMatrixService } from '../../Services/ITISeatMatrix/seat-matrix.service';
import { LoaderService } from '../../Services/Loader/loader.service';
import { GrievanceDataModel, GrivienceReopenModelsDataModel, GrivienceResponseDataModel, GrivienceSearchModel } from '../../Models/GrievanceData/GrievanceDataModel';
import { GrievanceService } from '../../Services/Grievance/grievance.service';
import { AppsettingService } from '../../Common/appsetting.service';
import { UploadFileModel } from '../../Models/UploadFileModel';
import { DocumentDetailsService } from '../../Common/document-details';

@Component({
  selector: 'app-grievance',
  standalone: false,
  templateUrl: './grievance.component.html',
  styleUrl: './grievance.component.css'
})


export class GrievanceComponent implements OnInit {
  public Table_SearchText: string = "";
  GrievanceFormGroup!: FormGroup;
  PersonalDetailsFormGroup!: FormGroup;

  public request = new GrievanceDataModel();
  public requestReopen = new GrivienceReopenModelsDataModel();
  public searchRequest = new GrivienceSearchModel();
  public sSOLoginDataModel = new SSOLoginDataModel();
  public Responserequest = new GrivienceResponseDataModel();

  _EnumGrievanceStaus = EnumGrievanceStaus;
  _EnumRole = EnumRole;
  _EnumGrievanceCategory = EnumGrievanceCategory;

  public DepartmentList: any = [];
  public CategoryList: any = [];
  public SubMasterList: any = [];
  public ShowGrievanceList: any = [];
  public ResponseList: any = [];
  public FeeForTypeList: any = [];
  public IssueTypeList: any = [];

  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  closeResult: string | undefined;
  selectedOption: any = 0;
  public ReplyBox: boolean = false;
  public Remark: string = '';

  constructor(private fb: FormBuilder,
    private commonMasterService: CommonFunctionService,
    private seatMatrixService: SeatMatrixService,
    private grievanceService: GrievanceService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    private commonFunctionService: CommonFunctionService,
    private modalService: NgbModal,
    private Swal2: SweetAlert2,
    private appsettingConfig: AppsettingService,
    private documentDetailsService: DocumentDetailsService,
  ) { }

  async ngOnInit() {
    this.GrievanceFormGroup = this.formBuilder.group(
      {
        ddlCategoryID: ['', [DropdownValidators]],
        ddlDepartmentID: ['', [DropdownValidators]],
        ddlModuleID: ['', [DropdownValidators]],
        SubjectRelated: ['', Validators.required],
        Remark: ['', Validators.required],

        // EmployeeID: [{value:'',disabled:true},],
        // SSOID: [{value:'',disabled:true},],
        // Email: ['', Validators.required],
        // Mobile: ['', Validators.required],
        // ApplicationNo: [{value:'',disabled:true},],

        CategoryName: ['',],
        IssueTypeName: ['',],
        IssueTypeID: ['', [DropdownValidators]],
        FeeForID: ['',],
      })

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.loadDropdownData('QueryFor');
    this.loadDropdownData('Grievance Category');
    this.GetGrievanceData();
    // await this.setDepartmentId();
  }

  get form() { return this.GrievanceFormGroup.controls; }
  // Load data for dropdown based on MasterCode
  loadDropdownData(MasterCode: string): void {
    this.commonMasterService.GetCommonMasterData(MasterCode).then((data: any) => {
      switch (MasterCode) {
        case 'QueryFor':
          this.DepartmentList = data['Data'];
          break;
        case 'Grievance Category':
          this.CategoryList = data['Data'];
          console.log(this.CategoryList, "CategoryList")
          break;
        default:
          break;
      }
    });
  }
  // async setDepartmentId() {
  //   // this.GrievanceFormGroup.get('ddlDepartmentID')?.disable();
  //   if (this.sSOLoginDataModel.DepartmentID === 1) {
  //     this.request.DepartmentID = 89;
  //     this.GetMasterSubDDL();
  //   }
  //   else {
  //     this.request.DepartmentID = 88;
  //     this.GetMasterSubDDL();
  //   }
  // }
  async GetMasterSubDDL() {
    try {
      this.selectedOption = this.request.DepartmentID
      this.loaderService.requestStarted();
      await this.commonMasterService.GetSubjectForCitizenSugg(this.selectedOption)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.SubMasterList = data['Data'];
          console.log("QueryFor", this.SubMasterList);
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

  async GetGrievanceData() {
    try {

      if(this.sSOLoginDataModel.RoleID == EnumRole.Student) {
        this.searchRequest.StudentID = this.sSOLoginDataModel.StudentID
        this.searchRequest.UserID = this.sSOLoginDataModel.UserID
      } else {
        this.searchRequest.UserID = this.sSOLoginDataModel.UserID
      }
      this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID;
      this.searchRequest.Action = "GetData_OwnQuery";

      await this.grievanceService.GetGrievanceData(this.searchRequest).then((data: any) => {
        this.ShowGrievanceList = data['Data'];
        console.log(this.ShowGrievanceList, "list")
        if (data.State == EnumStatus.Success) {
          this.ShowGrievanceList = data['Data'];
        } else if(data.State == EnumStatus.Warning) {
          this.toastr.warning(data.Message);
          this.ShowGrievanceList = [];
        }
        else {
          this.toastr.error(data.ErrorMessage)
          this.ShowGrievanceList = [];
        }
      })
    } catch (error) {
      console.error(error);
    }
  }

  async refreshValidations() {
    if(this.request.CategoryID == EnumGrievanceCategory.Other) {
      this.GrievanceFormGroup.get('CategoryName')?.setValidators([Validators.required]);
    } else { 
      this.GrievanceFormGroup.get('CategoryName')?.clearValidators();
    }    

    if(this.request.IssueTypeID == 1) {
      this.GrievanceFormGroup.get('IssueTypeName')?.setValidators([Validators.required]);
    } else {
      this.GrievanceFormGroup.get('IssueTypeName')?.clearValidators();
    }    

    if(this.request.CategoryID == EnumGrievanceCategory.Transactional_Payment_Issue) {
      this.GrievanceFormGroup.get('FeeForID')?.setValidators([DropdownValidators]);
    } else {
      this.GrievanceFormGroup.get('FeeForID')?.clearValidators();
    }

    this.GrievanceFormGroup.get('FeeForID')?.updateValueAndValidity();
    this.GrievanceFormGroup.get('IssueTypeName')?.updateValueAndValidity();
    this.GrievanceFormGroup.get('CategoryName')?.updateValueAndValidity();

  }

  async SaveData() {
    debugger;
    // make dashboards more attractive and user friendly for example Admin nodal dashboard is not good 

    this.request.CreatedBy = this.sSOLoginDataModel.UserID;
    this.request.ModifyBy = this.sSOLoginDataModel.UserID;

    if(this.sSOLoginDataModel.RoleID == EnumRole.Student) {
      this.request.StudentID = this.sSOLoginDataModel.StudentID
    } else {
      this.request.UserID = this.sSOLoginDataModel.UserID
    }

    this.request.RoleID = this.sSOLoginDataModel.RoleID;

    this.refreshValidations();

    this.isSubmitted = true;
    //Show Loading

    if (this.GrievanceFormGroup.invalid) {
      this.toastr.error('Please fill required fields')

      Object.keys(this.GrievanceFormGroup.controls).forEach(key => {
          const control = this.GrievanceFormGroup.get(key);

          if (control && control.invalid) {
            // this.toastr.error(`Control ${key} is invalid`);
            console.error(`Control ${key} is invalid`);
            Object.keys(control.errors!).forEach(errorKey => {
              // this.toastr.error(`Error on control ${key}: ${errorKey} - ${control.errors![errorKey]}`);
            });
          }
        });
      return
    }
    this.loaderService.requestStarted();
    this.isLoading = true;
    try {
      await this.grievanceService.SaveData(this.request)
        .then(async (data: any) => {
          if (data.State = EnumStatus.Success) {
            this.toastr.success(data.Message)
            //this.CloseModalPopup();
            //this.ShowSeatMetrix();
            await this.GetGrievanceData();
            this.ResetControl();
          }
          else {
            this.toastr.error(data.ErrorMessage)
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

  async ResetControl() {
    this.isSubmitted = false;
    this.selectedOption = 0;
    this.request = new GrievanceDataModel();
    //this.GrievanceFormGroup.reset();
    // this.setDepartmentId();
    // Reset form values if necessary
    //this.CitizenSuggestionFormGroup.patchValue({});
  }

  public file!: File;
  async onFilechange(event: any, Type: string) {
    try {
      this.file = event.target.files[0];
      if (this.file) {
        if (this.file.type == 'image/jpeg' || this.file.type == 'image/jpg' || this.file.type == 'image/png' || this.file.type == 'application/pdf') {
          //size validation
          if (this.file.size > 2000000) {
            this.toastr.error('Select less then 2MB File')
            return
          }
        }
        else {
          this.toastr.error('Select Only jpeg/jpg/png/pdf file')
          return
        }
        this.loaderService.requestStarted();
        await this.commonFunctionService.UploadDocument(this.file)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));

            if (data.State == EnumStatus.Success) {
              if (Type == "Photo") {
                this.request.FileAttachment = data['Data'][0]["FileName"];
                this.request.DisAttachmentFileName = data['Data'][0]["Dis_FileName"];

              }
              else if (Type == "requestReopenPhoto") {
                this.requestReopen.FileAttachment = data['Data'][0]["FileName"];
                this.requestReopen.DisAttachmentFileName = data['Data'][0]["Dis_FileName"];
              }
              event.target.value = null;
            }
            if (data.State == EnumStatus.Error) {
              this.toastr.error(data.ErrorMessage)
            }
            else if (data.State == EnumStatus.Warning) {
              this.toastr.warning(data.ErrorMessage)
            }
          });
      }
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      this.loaderService.requestEnded();
    }
  }

  async DeleteById(GrivienceID: number) {

    this.Swal2.Confirmation("Do you want to delete?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          try {
            //Show Loading
            this.loaderService.requestStarted();

            await this.grievanceService.DeleteById(GrivienceID, this.sSOLoginDataModel.UserID)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));

                if (data.State == EnumStatus.Success) {
                  this.toastr.success(data.Message)
                  await this.GetGrievanceData();
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
  async openGriviencePopup(content: any, item: any) {
    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

    this.Responserequest = item
    await this.GetResponseData();

    if (this.Responserequest.StatusID == EnumGrievanceStaus.Resolved) {
      this.ReplyBox = true;
    }

  }
  private getDismissReason(reason: any): string {

    return `with: ${reason}`;

  }

  async GetResponseData() {
    //this.isSubmitted = true;
    try {
      this.loaderService.requestStarted();
      this.searchRequest.GrivienceID = this.Responserequest.GrivienceID;
      await this.grievanceService.GetResponseData(this.searchRequest)
        .then((data: any) => {
          this.ResponseList = data['Data'];
          if (data.State = EnumStatus.Success) {
            this.ResetControl();
          }
          else {
            this.toastr.error(data.ErrorMessage)
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
  CloseModal() {
    this.modalService.dismissAll();
    this.isSubmitted = false;
  }

  async IsReplyBox() {
    this.ReplyBox = true;
  }
  async closeReply() {
    this.ReplyBox = false;
  }

  async SaveReopenData() {

    this.isSubmitted = true;
    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;
    this.requestReopen.GrivienceID = this.Responserequest.GrivienceID;
    this.requestReopen.Remark = this.Remark;
    try {
      await this.grievanceService.SaveReopenData(this.requestReopen)
        .then(async (data: any) => {
          if (data.State = EnumStatus.Success) {
            this.toastr.success(data.Message)
            this.CloseModal();
            await this.GetGrievanceData();
          }
          else {
            this.toastr.error(data.ErrorMessage)
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

  async GetFeeForTypeDDL() {
    try {
      const request: any = {};
      request.Action = "GetFeeForDDL";
      request.Role = this.sSOLoginDataModel.RoleID;
      request.UserID = this.sSOLoginDataModel.UserID;
      request.DepartmentID = this.sSOLoginDataModel.DepartmentID;

      await this.grievanceService.GetGrievanceCommonDDL(request).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.FeeForTypeList = data['Data'];
      })
    } catch (error) {
      console.error(error);
    }
  }
  async GetIssueTypeDDL() {
    try {
      const request: any = {};
      request.Action = "GetIssueTypeDDL";
      request.Role = this.sSOLoginDataModel.RoleID;
      request.UserID = this.sSOLoginDataModel.UserID;
      request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      request.CategoryID = this.request.CategoryID;

      await this.grievanceService.GetGrievanceCommonDDL(request).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.IssueTypeList = data['Data'];
      })
    } catch (error) {
      console.error(error);
    }
  }

  async onChangeCategory() {
    debugger
    if (this.request.CategoryID > 0 && this.request.CategoryID != EnumGrievanceCategory.Other) {
      await this.GetIssueTypeDDL();
    }
    
    if (this.request.CategoryID == EnumGrievanceCategory.Transactional_Payment_Issue) {
      await this.GetFeeForTypeDDL();
    }
  }

}
