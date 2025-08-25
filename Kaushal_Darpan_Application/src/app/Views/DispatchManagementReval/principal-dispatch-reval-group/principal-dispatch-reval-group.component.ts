import { Component, ViewChild } from '@angular/core';
import { EnumRole, EnumStatus, GlobalConstants, EnumRevalDispatchDDlValue } from '../../../Common/GlobalConstants';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { ScholarshipSearchModel } from '../../../Models/ScholarshipDataModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ScholarshipService } from '../../../Services/Scholarship/Scholarship.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { FormBuilder ,FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportService } from '../../../Services/Report/report.service';
import { AppsettingService } from '../../../Common/appsetting.service';
import { HttpClient } from '@angular/common/http';
import { SweetAlert2 } from '../../../Common/SweetAlert2'
import { DispatchRevalService } from '../../../Services/Dispatch-Reval/DispatchReval.service';
import { DispatchGroupSearchModel } from '../../../Models/DispatchGroupDataModel';
import { DispatchSearchModel, UpdateFileHandovertoExaminerByPrincipalModel } from '../../../Models/DispatchFormDataModel';
import { OTPModalComponent } from '../../otpmodal/otpmodal.component';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-principal-dispatch-reval-group',
  standalone: false,
  templateUrl: './principal-dispatch-reval-group.component.html',
  styleUrl: './principal-dispatch-reval-group.component.css'
})
export class PrincipalDispatchRevalGroupComponent {
  public SemesterMasterDDLList: any[] = [];
  public StreamMasterDDLList: any[] = [];
  public InstituteMasterDDLList: any[] = [];
  public GroupList: any[] = [];
  public GroupCheckSelectdList: any[] = [];
  public ExamList: any[] = [];
  public GroupMasterDDLList: any[] = [];
  public StatusTypelist: any[] = [];
  public Table_SearchText: any = '';

  public isSubmitted: boolean = false;
  public sSOLoginDataModel = new SSOLoginDataModel();
  public searchRequest = new DispatchSearchModel();
  public UpdateFileHandover = new UpdateFileHandovertoExaminerByPrincipalModel();
  public UserID: number = 0;
  public StaffID: number = 0
  isInstituteDisabled: boolean = false; // Set true to disable
  public CommonSubjectYesNo: number = 1;
  public CommonSubjectDDLList: any[] = [];
  public _enumrole = EnumRole
  isAllSelected: boolean = false;
  public _DispatchDDlValue = EnumRevalDispatchDDlValue
  public statusCh: number = 0;
  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];
  public AllSelect: boolean = false;
  public SelectedItemIdList: any[] = [];
  public FileHandoverPrincipal: string = '';

  @ViewChild('otpModal') childComponent!: OTPModalComponent;
  public QueryReqFormGroup!: FormGroup;
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  @ViewChild('MyModel_ReplayQuery') MyModel_ReplayQuery: any;


  constructor(
    private commonMasterService: CommonFunctionService,
    private DispatchRevalService: DispatchRevalService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    private Swal2: SweetAlert2,
    private reportService: ReportService,
    public appsettingConfig: AppsettingService,
    private http: HttpClient,
    private modalService: NgbModal 
  ) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.UserID = this.sSOLoginDataModel.UserID;

    this.statusCh = 1;

    this.searchRequest.Status = 0;

    this.GetStatusType()
/*    this.getgroupteacherData()*/
    this.QueryReqFormGroup = this.formBuilder.group({
      Remark: [''],
      Dis_File: [''],
      txtDueDate:['']
     
    });
  }

  async getSemesterMasterList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.SemesterMaster().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.SemesterMasterDDLList = data.Data;
        console.log("SemesterMasterDDLList", this.SemesterMasterDDLList);
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async DownloadAckReportPri() {
    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.searchRequest.CourseTypeID = this.sSOLoginDataModel.Eng_NonEng;
    this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID
    if (this.searchRequest.Status == 0) {
      this.searchRequest.Status = 2
    }
    if (this.searchRequest.Status == 1) {
      this.searchRequest.Status = 0
    }

    try {
      await this.DispatchRevalService.RevalDownloadAckReportPri(this.searchRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State === EnumStatus.Success) {
          this.DownloadFile(data.Data)
        }
      })
    } catch (error) {
      console.error(error);
    }
  }

  async getgroupteacherData() {
    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.searchRequest.CourseTypeID = this.sSOLoginDataModel.Eng_NonEng;
    this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID
    try {
      await this.DispatchRevalService.getgroupteacherData(this.searchRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.GroupList = data.Data;
        console.log("this.ExaminersList", this.GroupList)
      })
    } catch (error) {
      console.error(error);
    }
  }
  async ResetControl() {
    this.isSubmitted = false;
    /*    this.SubjectMasterDDLList = [];*/
    this.searchRequest.InstituteID = 0;
    this.searchRequest.Status = 0;
    this.getgroupteacherData()


  }


  async GetStatusType() {

    try {
      this.loaderService.requestStarted();
      const Type = "RevalDispatch";
      await this.commonMasterService.GetddlCenterDownloadOrReceived(Type)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.StatusTypelist = data['Data'];
          this.StatusTypelist = this.StatusTypelist.filter((item: any) => item.ID == this._DispatchDDlValue.PrincipalToExaminer ||
            item.ID == this._DispatchDDlValue.ExaminerVerifiedByToPrincipal ||
            item.ID == this._DispatchDDlValue.ExaminerSendBundle
            
          );


        }, error => console.error(error));
    } catch (Ex) {
      console.log(Ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  toggleAllSelection() {
    this.GroupList.forEach((item: any) => {
      item.selected = this.isAllSelected;
    });
  }


  checkIfAllSelected() {
    this.isAllSelected = this.GroupList.length > 0 &&
      this.GroupList.every((item: any) => item.selected);
  }

  

  async DownloadDispatchGroupCertificate(ID: number, StaffID:number) {
    try {
      this.loaderService.requestStarted();

      await this.reportService.DownloadRevalDispatchGroupCertificate(ID, StaffID ,this.sSOLoginDataModel.DepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.DownloadFile(data.Data, 'file download');
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
  DownloadFile(FileName: string, DownloadfileName?: any): void {

    const fileUrl = this.appsettingConfig.StaticFileRootPathURL + "/" + GlobalConstants.ReportsFolder + "/" + FileName;

    this.http.get(fileUrl, { responseType: 'blob' }).subscribe((blob: any) => {
      const downloadLink = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.download = this.generateFileName('pdf');
      downloadLink.click();
      window.URL.revokeObjectURL(url);
    });
  }
  generateFileName(extension: string): string {
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_');
    return `file_${timestamp}.${extension}`;
  }

  async submitSelected() {
    
    try {
      const selectedItems = this.GroupList.filter((item: any) => item.selected == true);
      console.log('Selected items:', selectedItems);




      if (selectedItems.length == 0) {
        this.toastr.warning('Please select at least one record');
        return;
      }
      else {
        this.GroupCheckSelectdList = selectedItems;
        await this.ViewHistory(this.MyModel_ReplayQuery, selectedItems);
      }

      
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
       // this.isLoading = false;

      }, 200);
    }
    }

  async ViewHistory(content: any, item: any) { 

    console.log('item', item);


    /*this.SelectedItemIdList=[]*/

    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  async CheckOtpAfterSave() {
    debugger
    const Selected = this.GroupCheckSelectdList.filter(x => x.Selected == true)
    Selected.forEach((e: any) => { e.Status = this._DispatchDDlValue.PrincipalToExaminer, e.ModifyBy = this.sSOLoginDataModel.UserID })


    this.loaderService.requestStarted();

    try {
      await this.DispatchRevalService.UpdateBundleHandovertoExaminerByPrincipal(this.GroupCheckSelectdList).then(
        (data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == EnumStatus.Success) {

            this.toastr.success(this.Message)

            /*    this.CloseOTPModal()*/
            this.getgroupteacherData()
            this.GroupCheckSelectdList = [];
            this.GroupList.forEach(item => item.Selected = false);
            this.AllSelect = false

          } else {
            this.toastr.error(data.ErrorMessage)
          }
        },
        (error: any) => console.error(error)
      );


    } catch (ex) {
      console.log(ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }

  }

  async openOTP() {
    this.CloseModalPopup1();
    this.childComponent.MobileNo = this.sSOLoginDataModel.Mobileno;
    await this.childComponent.OpenOTPPopup();
   
    this.childComponent.onVerified.subscribe(async () => {
      await this.SaveFileData();
      await this.CheckOtpAfterSave();
      console.log("otp verified on the page")
    })
  }


  CloseModalPopup() {
    this.isSubmitted = false;
   /* this.queryRequest = new CitizenSuggestionQueryModel();*/
    this.QueryReqFormGroup.reset();

    this.modalService.dismissAll();
  }


  CloseModalPopup1() {
    this.isSubmitted = false;
    /* this.queryRequest = new CitizenSuggestionQueryModel();*/
   /* this.QueryReqFormGroup.reset();*/
    this.UpdateFileHandover = new UpdateFileHandovertoExaminerByPrincipalModel();
    this.modalService.dismissAll();
    //this.openOTP();
  }

 

  get _QueryReqFormGroup() {
    return this.QueryReqFormGroup.controls;
  }


  public file!: File;
  async onFilechange(event: any, Type: string) {
    try {
      this.file = event.target.files[0];
      if (this.file) {
        if (
          this.file.type == 'image/jpeg' ||
          this.file.type == 'image/jpg' ||
          this.file.type == 'image/png'
        ) {
          //size validation
          if (this.file.size > 2000000) {
            this.toastr.error('Select less then 2MB File');
            return;
          }
          //if (this.file.size < 100000) {
          //  this.toastr.error('Select more then 100kb File')
          //  return
          //}
        } else {
          // type validation
          this.toastr.error('Select Only jpeg/jpg/png file');
          return;
        }
        // upload to server folder
        this.loaderService.requestStarted();

        await this.commonMasterService
          .UploadDocument(this.file)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));

            this.State = data['State'];
            this.Message = data['Message'];
            this.ErrorMessage = data['ErrorMessage'];

            if (this.State == EnumStatus.Success) {
              if (Type == 'Photo') {
                //this.request.Dis_CompanyName = data['Data'][0]["Dis_FileName"];
                this.UpdateFileHandover.FileName =
                  data['Data'][0]['FileName'];

                this.FileHandoverPrincipal = this.UpdateFileHandover.FileName;
              }
              //else if (Type == "Sign") {
              //  this.request.Dis_CompanyName = data['Data'][0]["Dis_FileName"];
              //  this.request.CompanyPhoto = data['Data'][0]["FileName"];
              //}
              /*              item.FilePath = data['Data'][0]["FilePath"];*/
              event.target.value = null;
            }
            if (this.State == EnumStatus.Error) {
              this.toastr.error(this.ErrorMessage);
            } else if (this.State == EnumStatus.Warning) {
              this.toastr.warning(this.ErrorMessage);
            }
          });
      }
    } catch (Ex) {
      console.log(Ex);
    } finally {
      /*setTimeout(() => {*/
      this.loaderService.requestEnded();
      /*  }, 200);*/
    }
  }

  async DeleteImage(FileName: any, Type: string) {
    try {

      
      // delete from server folder
      this.loaderService.requestEnded();
      await this.commonMasterService
        .DeleteDocument(FileName)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == 0) {
            if (Type == 'Photo') {
              //this.request.Dis_CompanyName = '';
             /* this.UpdateFileHandover.FileName = '';*/
            }
            //else if (Type == "Sign") {
            //  this.requestStudent.Dis_StudentSign = '';
            //  this.requestStudent.StudentSign = '';
            //}
            this.toastr.success(this.Message);
          }
          if (this.State == 1) {
            this.toastr.error(this.ErrorMessage);
          } else if (this.State == 2) {
            this.toastr.warning(this.ErrorMessage);
          }
        });
    } catch (Ex) {
      console.log(Ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  async SaveFileData() {
    //this.AppointExaminer.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    
    const selectedItems = this.GroupList.filter((item: any) => item.selected === true);

    this.UpdateFileHandover.GroupCodeIDs = selectedItems
      .map((item: any) => item.GroupCodeID)
      .join(',');

    this.UpdateFileHandover.Status = this._DispatchDDlValue.PrincipalToExaminer
    this.UpdateFileHandover.DispatchGroupID = selectedItems.length > 0 ? selectedItems[0].DispatchGroupID : null;
    this.UpdateFileHandover.FileName = this.FileHandoverPrincipal;
    this.UpdateFileHandover.CreatedBy = this.sSOLoginDataModel.UserID;
    try {
      this.isSubmitted = true;
     
      this.loaderService.requestStarted();

      try {
        await this.DispatchRevalService.UpdateRemarkImageHandedOverToExaminerByPrincipal(this.UpdateFileHandover).then(
          async (data: any) => {
            this.State = data['State'];
            this.Message = data['Message'];
            this.ErrorMessage = data['ErrorMessage'];
            if (this.State == EnumStatus.Success) {

              this.toastr.success(this.Message)

              this.UpdateFileHandover = new UpdateFileHandovertoExaminerByPrincipalModel(); 
              this.FileHandoverPrincipal = "";

              //this.CloseModalPopup1();
              //await this.openOTP();
               
             /* this.getgroupteacherData()*/
              //this.GroupList.forEach(item => item.Selected = false);
              //this.AllSelect = false

            } else {
              this.toastr.error(data.ErrorMessage)
            }
          },
          (error: any) => console.error(error)
        );


      } catch (ex) {
        console.log(ex);
      } finally {
        setTimeout(() => {
          this.loaderService.requestEnded();
        }, 200);
      }


      

     
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

}
