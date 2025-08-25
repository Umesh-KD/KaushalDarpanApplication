import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { EnumStatus } from '../../Common/GlobalConstants';
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

@Component({
  selector: 'app-grievance',
  standalone: false,
  templateUrl: './grievance.component.html',
  styleUrl: './grievance.component.css'
})


export class GrievanceComponent implements OnInit {
  State: any;
  Message: any;
  ErrorMessage: any;
  public Table_SearchText: string = "";
  GrievanceFormGroup!: FormGroup;
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  closeResult: string | undefined;
  public request = new GrievanceDataModel();
  public requestReopen = new GrivienceReopenModelsDataModel();
  public searchRequest = new GrivienceSearchModel();
  selectedOption: any = 0;
  //public ShowSeatMetrixList: SeatMetrixModel[] = [];
  public DepartmentList: any = [];
  public CategoryList: any = [];
  public SubMasterList: any = [];
  public ShowGrievanceList: any = [];
  public ResponseList: any = [];
  public sSOLoginDataModel = new SSOLoginDataModel();
  public Responserequest = new GrivienceResponseDataModel();
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
    private appsettingConfig: AppsettingService) {

  }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.GrievanceFormGroup = this.formBuilder.group(
      {
        ddlCategoryID: ['', [DropdownValidators]],
        ddlDepartmentID: ['', [DropdownValidators]],
        ddlModuleID: ['', [DropdownValidators]],
        SubjectRelated: ['', Validators.required],
        Remark: ['', Validators.required],
        textApplicationNo: [''],
        //ApplicationNo: [''],
        //fileStudentPhoto: [''],
      })
    this.loadDropdownData('QueryFor');
    this.loadDropdownData('Grievance Category');
    this.ShowAllData();
    await this.setDepartmentId();
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
          console.log(this.CategoryList,"CategoryList")
          break;
        default:
          break;
      }
    });
  }
  async setDepartmentId() {
    this.GrievanceFormGroup.get('ddlDepartmentID')?.disable();
    if (this.sSOLoginDataModel.DepartmentID === 1) {
      this.request.DepartmentID = 89;
      this.GetMasterSubDDL();
    }
    else {
      this.request.DepartmentID = 88;
      this.GetMasterSubDDL();
    }
  }
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

  async ShowAllData() {
    //this.isSubmitted = true;
    //alert(this.sSOLoginDataModel.StudentID);
    if (this.sSOLoginDataModel.StudentID > 0) {
      this.searchRequest.CreatedBy = this.sSOLoginDataModel.StudentID;
      this.searchRequest.RoleID = 0;
    }
    else {
      this.searchRequest.CreatedBy = this.sSOLoginDataModel.UserID;
      this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID;
    }
    try {
      this.loaderService.requestStarted();
      //await this.grievanceService.GetAllData(this.searchRequest)
      await this.grievanceService.GetAllData(this.searchRequest)
        .then((data: any) => {
          this.ShowGrievanceList = data['Data'];
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          console.log(this.ShowGrievanceList, "list")
          if (this.State = EnumStatus.Success) {
            //this.toastr.success(this.Message)
            //this.ShowSeatMetrix();
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


      //    .then((data: any) => {
      //      data = JSON.parse(JSON.stringify(data));
      //      
      //      if (data.State === EnumStatus.Success) {
      //        this.ShowGrievanceList = data['Data'];
      //        this.ResetControl();
      //      } else {
      //        this.toastr.error(data.ErrorMessage || 'Error fetching data.');
      //      }
      //    }, error => console.error(error));
      //} catch (Ex) {
      //  console.log(Ex);
      //} finally {
      //  setTimeout(() => {
      //    this.loaderService.requestEnded();
      //  }, 200);
      //}
    

  async SaveData() {
    
    //alert(this.request.ApplicationNo);
    debugger;
    if (this.sSOLoginDataModel.StudentID > 0) {
      this.request.CreatedBy = this.sSOLoginDataModel.StudentID;
      this.request.ModifyBy = this.sSOLoginDataModel.StudentID;
      this.request.RoleID = 0;
    }
    else {
      this.request.CreatedBy = this.sSOLoginDataModel.UserID;
      this.request.ModifyBy = this.sSOLoginDataModel.UserID;
      this.request.RoleID = this.sSOLoginDataModel.RoleID;
    }

    if (this.request.ApplicationNo === "" || this.request.ApplicationNo === null || this.request.ApplicationNo === undefined) {
      this.request.ApplicationNo = ""
    }
    else if (this.request.ApplicationNo !== "" || this.request.ApplicationNo !== null || this.request.ApplicationNo !== undefined) {
      if (this.request.ApplicationNo.toString().length !== 12) {
        this.Message = "Please Enter Correct Application/Enrollment No.";
        this.toastr.error(this.Message);
        return;
      }
      else {
        this.request.ApplicationNo = ""
      }
    }
    

    this.isSubmitted = true;
    //Show Loading

    if (this.GrievanceFormGroup.invalid) {
      return
    }
    this.loaderService.requestStarted();
    this.isLoading = true;
    try {
      await this.grievanceService.SaveData(this.request)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State = EnumStatus.Success) {
            this.toastr.success(this.Message)
            //this.CloseModalPopup();
            //this.ShowSeatMetrix();
            this.ShowAllData();
            this.ResetControl();
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

  async ResetControl() {
    this.isSubmitted = false;
    this.selectedOption = 0;
    this.request = new GrievanceDataModel();
    //this.GrievanceFormGroup.reset();
    this.setDepartmentId();
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
          this.toastr.error('Select Only jpeg/jpg/png file')
          return
        }
        this.loaderService.requestStarted();

        await this.commonFunctionService.UploadDocument(this.file)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));

            this.State = data['State'];
            this.Message = data['Message'];
            this.ErrorMessage = data['ErrorMessage'];

            if (this.State == EnumStatus.Success) {
              if (Type == "Photo") {
                this.request.FileAttachment = data['Data'][0]["FileName"];
                this.request.DisAttachmentFileName = data['Data'][0]["Dis_FileName"];
                console.log(this.request,'ListRequest')
              }
              event.target.value = null;
            }
            if (this.State == EnumStatus.Error) {
              this.toastr.error(this.ErrorMessage)
            }
            else if (this.State == EnumStatus.Warning) {
              this.toastr.warning(this.ErrorMessage)
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



  async onFilechangePop(event: any, Type: string) {
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
          this.toastr.error('Select Only jpeg/jpg/png file')
          return
        }
        this.loaderService.requestStarted();

        await this.commonFunctionService.UploadDocument(this.file)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));

            this.State = data['State'];
            this.Message = data['Message'];
            this.ErrorMessage = data['ErrorMessage'];

            if (this.State == EnumStatus.Success) {
              if (Type == "Photo") {
                this.requestReopen.FileAttachment = data['Data'][0]["FileName"];
                this.requestReopen.DisAttachmentFileName = data['Data'][0]["Dis_FileName"];
                console.log(this.requestReopen, 'ListRequest')
              }
              event.target.value = null;
            }
            if (this.State == EnumStatus.Error) {
              this.toastr.error(this.ErrorMessage)
            }
            else if (this.State == EnumStatus.Warning) {
              this.toastr.warning(this.ErrorMessage)
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
                this.State = data['State'];
                this.Message = data['Message'];
                this.ErrorMessage = data['ErrorMessage'];
                console.log(data);

                if (this.State == EnumStatus.Success) {
                  this.toastr.warning(this.Message)
                  await this.ShowAllData();
                }
                else {
                  this.toastr.error(this.ErrorMessage)
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
    

    /*    this.IsShowViewStudent = true;*/
    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    //if (MenuId > 0) {
    //  await this.GetMenuMaster(MenuId)
    //}
    this.Responserequest = item
    console.log(this.Responserequest, 'Responserequest')
    await this.GetResponseData();

    if (this.Responserequest.StatusID == 206) {
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
          console.log(this.ResponseList, 'ResponseList Data')
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State = EnumStatus.Success) {
            this.toastr.success(this.Message)
            this.ResetControl();
            //this.ShowSeatMetrix();
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
    
    //this.searchRequest.UserId = this.sSOLoginDataModel.UserID;
    this.isSubmitted = true;
    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;
    this.requestReopen.GrivienceID = this.Responserequest.GrivienceID;
    this.requestReopen.Remark = this.Remark;
    try {
      await this.grievanceService.SaveReopenData(this.requestReopen)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State = EnumStatus.Success) {
            this.toastr.success(this.Message)
            this.CloseModal();
            this.ShowAllData();
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
}
