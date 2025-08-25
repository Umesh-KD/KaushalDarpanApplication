import { Component, ViewChild } from '@angular/core';
import { EnumRole, EnumStatus, GlobalConstants,  EnumITIDispatchDDlValue } from '../../../../Common/GlobalConstants';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { ScholarshipSearchModel } from '../../../../Models/ScholarshipDataModel';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { ScholarshipService } from '../../../../Services/Scholarship/Scholarship.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { FormBuilder ,FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportService } from '../../../../Services/Report/report.service';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { HttpClient } from '@angular/common/http';
import { SweetAlert2 } from '../../../../Common/SweetAlert2'
import { ITIDispatchService } from '../../../../Services/ITIDispatch/ITIDispatch.service';
import { ITIDispatchGroupSearchModel } from '../../../../Models/ITIDispatchGroupDataModel';
import { ITI_Dispatch_ShowbundleSearchModel, ITI_DispatchBundelNoSendToTheAdminByTheExaminerUpdate, ITIDispatchSearchModel, ITIUpdateFileHandovertoExaminerByPrincipalModel } from '../../../../Models/ITIDispatchFormDataModel';
import { OTPModalComponent } from '../../../otpmodal/otpmodal.component';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ITI_DispatchAdmin_ByExaminer_RptSearchModel } from '../../../../Models/TheoryMarksDataModels';

@Component({
  selector: 'app-ITI-Principal-dispatch-group',
  standalone: false,
  templateUrl: './ITI-Principal-dispatch-group.component.html',
  styleUrl: './ITI-Principal-dispatch-group.component.css'
})
export class ITIPrincipalDispatchGroupComponent {
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
  public searchRequest = new ITI_Dispatch_ShowbundleSearchModel();
  public request = new ITIDispatchSearchModel();
  

  public UpdateFileHandover = new ITIUpdateFileHandovertoExaminerByPrincipalModel();
  public UserID: number = 0;
  public StaffID: number = 0
  isInstituteDisabled: boolean = false; // Set true to disable
  public CommonSubjectYesNo: number = 1;
  public CommonSubjectDDLList: any[] = [];
  public _enumrole = EnumRole
  isAllSelected: boolean = false;
  public _DispatchDDlValue = EnumITIDispatchDDlValue
  public statusCh: number = 0;
  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];
  public AllSelect: boolean = false;
  public SelectedItemIdList: any[] = [];

  @ViewChild('otpModal') childComponent!: OTPModalComponent;
  public QueryReqFormGroup!: FormGroup;
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  @ViewChild('MyModel_ReplayQuery') MyModel_ReplayQuery: any;
  public searchRequestRDLC = new ITI_DispatchAdmin_ByExaminer_RptSearchModel();
  public SearchDDLValue: number = 0;
  public RequpdateStatus = new ITI_DispatchBundelNoSendToTheAdminByTheExaminerUpdate;
  public SubmitTypeID: number = 0;
  public DashBoardStatuID: number = -1

  public today = new Date();
  constructor(
    private commonMasterService: CommonFunctionService,
    private DispatchService: ITIDispatchService,
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
    debugger
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.UserID = this.sSOLoginDataModel.UserID;
    
   /* this.UpdateFileHandover.DueDate = this.today;*/
   

    this.GetStatusType();

    //const statusParam = this.activatedRoute.snapshot.queryParamMap.get('id');
    const statusParam = this.activatedRoute.snapshot.paramMap.get('id');
    if (statusParam !== null && !isNaN(Number(statusParam)) && statusParam.trim() !== '') {
      this.DashBoardStatuID = Number(statusParam);
    }

    console.log(this.DashBoardStatuID);

    if (this.DashBoardStatuID !== -1) {
      this.searchRequest.StatusID = this.DashBoardStatuID;
      //if (this.searchRequest.StatusID = 1) {
      //  this.searchRequest.StatusID = 1;
      //}
      this.getgroupteacherData();
      
    } else {
      this.searchRequest.StatusID = 1;
    }




   

   
    
    this.QueryReqFormGroup = this.formBuilder.group({
      Remark: ['', Validators.required],
      txtDueDateiti: ['', Validators.required],
      Dis_File: ['']
      
     
    });
  }



  async DownloadAckReportPri() {

    this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.request.EndTermID = this.sSOLoginDataModel.EndTermID;
   
    try {
      await this.DispatchService.DownloadAckReportPri(this.request).then((data: any) => {
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
    debugger

    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;

    this.SearchDDLValue = this.searchRequest.StatusID;
   
    try {
      await this.DispatchService.GetITI_Dispatch_ShowbundleByAdminToExaminerData(this.searchRequest).then((data: any) => {
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
    /*this.searchRequest.InstituteID = 0;*/
    this.searchRequest.StatusID = 0;
    this.getgroupteacherData()


  }


  async GetStatusType() {

    try {
      this.loaderService.requestStarted();
      const Type = "ITIDispatch";
      await this.commonMasterService.GetddlCenterDownloadOrReceived(Type)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.StatusTypelist = data['Data'];
          this.StatusTypelist = this.StatusTypelist.filter((item: any) => item.ID == this._DispatchDDlValue.VerifyByExaminer || item.ID == this._DispatchDDlValue.HandOverToExaminerByPrincipal || item.ID == this._DispatchDDlValue.HandOverToPrincipalByExaminer);


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

  

  async DownloadDispatchGroupCertificate(ID: number, StaffID: number) {
    debugger
    try {
      this.loaderService.requestStarted();

      this.searchRequestRDLC.ExaminerID = StaffID;
      this.searchRequestRDLC.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.searchRequestRDLC.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.searchRequestRDLC.CourseTypeID = this.sSOLoginDataModel.Eng_NonEng;
      this.searchRequestRDLC.UserID = this.sSOLoginDataModel.UserID;

      await this.reportService.GetITI_Dispatch_ShowbundleByExaminerToAdminData(this.searchRequestRDLC)
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
    debugger
    try {
      const selectedItems = this.GroupList.filter((item: any) => item.selected == true);
      console.log('Selected items:', selectedItems);




      if (selectedItems.length == 0) {
        this.toastr.warning('Please select at least one record');
        return;
      }
      else {
        this.GroupCheckSelectdList = selectedItems;
        this.ViewHistory(this.MyModel_ReplayQuery, selectedItems);
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
    this.loaderService.requestStarted();
    debugger
   

   
    const selectedItems = this.GroupList.filter((item: any) => item.selected === true);

    this.RequpdateStatus.ExaminerCode = selectedItems
      .map((item: any) => item.ExaminerCode)
      .join(',');

    this.RequpdateStatus.Status = this._DispatchDDlValue.HandOverToExaminerByPrincipal
    this.RequpdateStatus.AppointExaminerID = selectedItems.length > 0 ? selectedItems[0].AppointExaminerID : null;

    this.RequpdateStatus.ModifyBy = this.sSOLoginDataModel.UserID;

    this.GroupCheckSelectdList = [this.RequpdateStatus];
    debugger
    try {
      await this.DispatchService.UpdateBundleHandovertoExaminerByPrincipal(this.GroupCheckSelectdList).then(
        (data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == EnumStatus.Success) {

            this.toastr.success(this.Message)

            /*    this.CloseOTPModal()*/
            this.getgroupteacherData();
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

  openOTP() {
    this.childComponent.MobileNo = this.sSOLoginDataModel.Mobileno;
    debugger
    this.childComponent.OpenOTPPopup();

    this.childComponent.onVerified.subscribe(() => {
      
      this.modalService.dismissAll();
      if (this.SubmitTypeID == 1) {
        this.CheckOtpAfterSave();
        
      }
      if (this.SubmitTypeID == 2) {
        this.SaveFileData();
       

      }

      console.log("otp verified on the page")
    })
  }


  //openOTPByDueDate() {
  //  this.childComponent.MobileNo = this.sSOLoginDataModel.Mobileno;
  //  this.childComponent.OpenOTPPopup();

  //  this.childComponent.onVerified.subscribe(() => {
  //    this.SaveFileData();
  //    console.log("otp verified on the page")
  //  })
  //}


  CloseModalPopup() {
    this.isSubmitted = false;
   /* this.queryRequest = new CitizenSuggestionQueryModel();*/
    this.QueryReqFormGroup.reset();

    this.modalService.dismissAll();
  }


  async CloseModalPopup1() {
    debugger
    this.isSubmitted = false;
    this.SubmitTypeID = 1;
    /* this.queryRequest = new CitizenSuggestionQueryModel();*/
   /* this.QueryReqFormGroup.reset();*/
    await this.openOTP();
    
    
  }
  async CloseModalPopupNotOterFuncton() {
    debugger
    this.isSubmitted = false;
    this.modalService.dismissAll();
    this.GroupCheckSelectdList = [];
      this.UpdateFileHandover = new ITIUpdateFileHandovertoExaminerByPrincipalModel();
    /* this.QueryReqFormGroup.reset();*/
   


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


  SubmitDataq() {
    debugger
    this.isSubmitted = true;
    if (this.QueryReqFormGroup.invalid) {
      console.log(this.QueryReqFormGroup.value)
      return
    } 
      this.SubmitTypeID = 2;

      this.modalService.dismissAll();
      this.openOTP();
   
   
  }


  async SaveFileData() {
    debugger
    //this.AppointExaminer.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    
    const selectedItems = this.GroupList.filter((item: any) => item.selected === true);

    this.UpdateFileHandover.ExaminerCode = selectedItems
      .map((item: any) => item.ExaminerCode)
      .join(',');

    this.UpdateFileHandover.Status = this._DispatchDDlValue.HandOverToExaminerByPrincipal
    this.UpdateFileHandover.AppointExaminerID = selectedItems.length > 0 ? selectedItems[0].AppointExaminerID : null;

    this.UpdateFileHandover.CreatedBy = this.sSOLoginDataModel.UserID;
    try {
      this.isSubmitted = true;
     
      this.loaderService.requestStarted();

      try {
        await this.DispatchService.UpdateRemarkImageHandedOverToExaminerByPrincipal(this.UpdateFileHandover).then(
          (data: any) => {
            this.State = data['State'];
            this.Message = data['Message'];
            this.ErrorMessage = data['ErrorMessage'];
            if (this.State == EnumStatus.Success) {

              this.toastr.success(this.Message)

              this.UpdateFileHandover = new ITIUpdateFileHandovertoExaminerByPrincipalModel(); 
             

              this.getgroupteacherData();
               
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
