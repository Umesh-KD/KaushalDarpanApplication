import { Component, ElementRef, ViewChild } from '@angular/core';
import { EnumDeploymentStatus, EnumRole, EnumStatus, GlobalConstants } from '../../../../Common/GlobalConstants';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CenterObserverDataModel, CenterObserverDeployModel, CenterObserverSearchModel } from '../../../../Models/CenterObserverDataModel';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { StreamMasterService } from '../../../../Services/BranchesMaster/branches-master.service';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { TimeTableDataModels, TimeTableInvigilatorModel } from '../../../../Models/TimeTableModels';
import { CenterObserverService } from '../../../../Services/CenterObserver/center-observer.service';
import { ITIFlyingSquadService } from '../../../../Services/ITI/ITIFlyingSquad/itiflying-squad.service';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { ReportService } from '../../../../Services/Report/report.service';

@Component({
  selector: 'app-iti-flying-squad',
  standalone: false,
  templateUrl: './iti-flying-squad.component.html',
  styleUrl: './iti-flying-squad.component.css'
})
export class ItiCenterObserverComponent {
  public State: number = -1;
  public Message: any = [];
  public _EnumRole = EnumRole;
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  FlyingSquadForm!: FormGroup;
  public TimeTableList: any = [];
  public UserID: number = 0;
  searchText: string = '';
  public isDisabledGrid: boolean = false;
  public isDisabledDOJ: boolean = false;
  isSubmittedItemDetails: boolean = false;
  public isLoadingExport: boolean = false;
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  searchbySemester: string = '';
  searchbyExamShift: string = '';
  searchbySubject: string = ''
  public Table_SearchText: string = '';
  public SearchTimeTableList: any = []
  serchrequest = new CenterObserverSearchModel();
  public StreamMasterList: any = [];
  public ExamShiftList: any = [];
  public PaperList: any = [];
  public SubjectList: any = [];
  public SemesterList: any = [];
  public TimeTableDataExcel: any = [];
  public searchRequest = new CenterObserverSearchModel();
  public _GlobalConstants = GlobalConstants

  public CenterObserverData: any = [];
  public CenterObserverTeamID: number = 0
  DistrictMasterDDL: any;
  SemesterMasterDDL: any[] = [];
  StreamMasterDDL: any[] = [];
  ExaminerDDL: any[] = [];
  ExamShiftDDL: any[] = [];
  InstituteMasterDDL: any[] = [];
  filterData: any[] = [];
  public requestDeploy = new CenterObserverDeployModel()
  _EnumDeploymentStatus = EnumDeploymentStatus
  
  sSOLoginDataModel = new SSOLoginDataModel();
  MapKeyEng: number = 0;
  public DateConfigSetting: any = [];
  public requestObs = new CenterObserverDataModel()
  isForwardToVerify: boolean = false;
  public AllInTableSelect: boolean = false;
  public ApproveRemark: string = '';
  _DeploymentID :number = 0
  constructor(
    private streamService: StreamMasterService, 
    private commonMasterService: CommonFunctionService,
    private appsettingConfig: AppsettingService,
    private http: HttpClient,
    private reportService: ReportService, 
    private toastr: ToastrService,
    private loaderService: LoaderService, 
    private formBuilder: FormBuilder,
    private modalService: NgbModal, 
    private Swal2: SweetAlert2,
    private centerObserverService: CenterObserverService,
    private ITIFlyingSquadService: ITIFlyingSquadService,
  ) {}

  async ngOnInit() {
    this.FlyingSquadForm = this.formBuilder.group({
      SubjectID: [0, Validators.required],
      StreamID: [0, Validators.required],
      SSOID: [0, Validators.required],
      SemesterID: [0, Validators.required],
      DistrictID: [0, Validators.required],
      InstituteID: [0, Validators.required],
      ShiftID: [0, Validators.required],
      DeploymentDate: ['', Validators.required],
    });
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    console.log("sSOLoginDataModel", this.sSOLoginDataModel)
    this.UserID = this.sSOLoginDataModel.UserID;
    // await this.GetTimeTableList();
    await this.GetStreamMasterList()
    await this.GetExamShift()
    await this.GetSubjectList()
    await this.GetSemesterList()
    await this.getMasterData()
    await this.GetDateConfig();
    await this.GetAllData();

  }
  // get _InvigilatorFormGroup() { return this.InvigilatorFormGroup.controls; }

  async getMasterData() {
    try {
      await this.commonMasterService.StreamMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.StreamMasterDDL = data.Data;
      })
      await this.commonMasterService.SemesterMaster().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.SemesterMasterDDL = data.Data;
      })
      await this.commonMasterService.GetDistrictMaster().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.DistrictMasterDDL = data.Data;
      })

      await this.commonMasterService.GetExamShift().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.ExamShiftDDL = data.Data;
      })

      await this.commonMasterService.Examiner_SSOID(this.sSOLoginDataModel.DepartmentID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.ExaminerDDL = data.Data;
      })

    } catch (error) {
      console.error(error);
    }
  }

  GetInstituteMaster_ByDistrictWise(ID: any) {
    this.commonMasterService.GetInstituteMaster_ByDistrictWise(ID, this.sSOLoginDataModel.EndTermID).then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      this.InstituteMasterDDL = data.Data;
    })
  }

  async ViewandUpdate(content: any, id: number) {
    this.CenterObserverTeamID = id
    await this.GetByID()
    this.modalReference = this.modalService.open(content, { backdrop: 'static', size: 'xl', keyboard: true, centered: true });

  }

  async DeployModelOpen(content: any, id: number) {
    this.CenterObserverTeamID = id
    this.requestDeploy.TeamID = id
    // await this.GetTimeTableByID(id)
   
    this.modalReference = this.modalService.open(content, { backdrop: 'static', size: 'xl', keyboard: true, centered: true });

  }

  async GetByID() {
    try {
      this.loaderService.requestStarted();
      await this.ITIFlyingSquadService.GetByID(this.CenterObserverTeamID, this.sSOLoginDataModel.DepartmentID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        console.log("getbyid", data)
        if (data.State == EnumStatus.Success) {
          this.requestObs = data.Data;
        }
      })
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200)
    }
  }

  async DeployTeam() {
    try {
      this.requestDeploy.UserID = this.sSOLoginDataModel.UserID
      this.requestDeploy.DepartmentID = this.sSOLoginDataModel.DepartmentID
      this.requestDeploy.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng
      this.requestDeploy.EndTermID = this.sSOLoginDataModel.EndTermID
      this.loaderService.requestStarted();
      await this.ITIFlyingSquadService.DeployTeam(this.requestDeploy)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          if(data.State === EnumStatus.Success){
            this.toastr.success(data.Message);
            this.CloseModalPopup();
          } else {
            this.toastr.error(data.ErrorMessage);
          }
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

  async DownloadChecklist(TeamID: number, DeploymentID: number) {
    try {
      this.searchRequest.DeploymentID = DeploymentID
      this.searchRequest.TypeID = 1
      this.loaderService.requestStarted();
      await this.ITIFlyingSquadService.GenerateCOAnsweredReport(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log("DownloadChecklist", data)
          if(data.State === EnumStatus.Success){
            // this.toastr.success(data.Message);
            this.DownloadFile(data.Data)
          } else {
            this.toastr.error(data.ErrorMessage);
          }
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


  async GetStreamMasterList() {
    try {
      this.loaderService.requestStarted();
      await this.streamService.GetAllData()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.StreamMasterList = data['Data'];
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

  async GetExamShift() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetExamShift()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.ExamShiftList = data['Data'];
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

  async GetSemesterList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.SemesterMaster(1)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.SemesterList = data['Data'];
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

  async GetSubjectList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetSubjectMaster(this.sSOLoginDataModel.DepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.SubjectList = data['Data'];
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

  ResetControl() {
    this.searchRequest = new CenterObserverSearchModel()
  }

  async GetAllData() {
    try {
      this.loaderService.requestStarted();
      this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID
      this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID
      await this.ITIFlyingSquadService.GetAllData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CenterObserverData = data['Data'];
          this.isForwardToVerify = this.CenterObserverData.some((x: any) => x.DeploymentStatus === EnumDeploymentStatus.Assigned);
          console.log("CenterObserverData",this.CenterObserverData)
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      })}
  }

  async btnDelete_OnClick(ID: number) {

    this.Swal2.Confirmation("Are you sure you want to delete this ?",
      async (result: any) => {
        if (result.isConfirmed) {
          try {
            this.loaderService.requestStarted();
            this.requestObs.TeamID = ID
            this.requestObs.UserID = this.sSOLoginDataModel.UserID

            console.log(this.requestObs);
            await this.ITIFlyingSquadService.DeleteDataByID(this.requestObs)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));
                console.log(data);

                if (data.State = EnumStatus.Success) {
                  this.toastr.success(data.Message)
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

  async DeleteDeploymentDataByID(ID: number) {

    this.Swal2.Confirmation("Are you sure you want to delete this ?",
      async (result: any) => {
        if (result.isConfirmed) {
          try {
            this.loaderService.requestStarted();
            this.requestObs.TeamID = ID
            this.requestObs.UserID = this.sSOLoginDataModel.UserID

            console.log(this.requestObs);
            await this.ITIFlyingSquadService.DeleteDeploymentDataByID(this.requestObs)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));
                console.log(data);

                if (data.State = EnumStatus.Success) {
                  this.toastr.success(data.Message)
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

  CloseModalPopup() {
    this.modalService.dismissAll();
  }

  @ViewChild('content') content: ElementRef | any;

  open(content: any, BookingId: string) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
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

  async GetDateConfig() {
    
    var data = {
      DepartmentID: this.sSOLoginDataModel.DepartmentID,
      CourseTypeId: this.sSOLoginDataModel.Eng_NonEng,
      AcademicYearID: this.sSOLoginDataModel.FinancialYearID,
      EndTermID: this.sSOLoginDataModel.EndTermID,
      Key: "TimeTable",
      SSOID: this.sSOLoginDataModel.SSOID
    }

    await this.commonMasterService.GetDateConfigSetting(data)
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.DateConfigSetting = data['Data'][0];
        this.MapKeyEng = this.DateConfigSetting.TimeTable;
      }, (error: any) => console.error(error)
      );
  }

  DownloadFile(FileName: string): void {

    const fileUrl = this.appsettingConfig.StaticFileRootPathURL + "/" + GlobalConstants.ReportsFolder + "/" + FileName;; // Replace with your URL
    // Fetch the file as a blob
    this.http.get(fileUrl, { responseType: 'blob' }).subscribe((blob: any) => {
      const downloadLink = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.download = this.generateFileName('pdf'); // Set the desired file name
      downloadLink.click();
      // Clean up the object URL
      window.URL.revokeObjectURL(url);
    });
  }
  generateFileName(extension: string): string {
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_'); // Replace invalid characters
    return `file_${timestamp}.${extension}`;
  } 


  //checked all (replace org. list here)
    selectInTableAllCheckbox() {
      this.CenterObserverData.forEach((x: any) => {
        if (x.DeploymentStatus == EnumDeploymentStatus.Assigned) {
          x.Selected = this.AllInTableSelect;
        }
      });
    }
    // checked single (replace org. list here)
    selectInTableSingleCheckbox(isSelected: boolean, item: any) {
      const data = this.CenterObserverData.filter((x: any)=> x.DeploymentID == item.DeploymentID);
      data.forEach((x: any) => {
        x.Selected = isSelected;
      });
      //select all(toggle)
      this.AllInTableSelect = this.CenterObserverData.every((r: any) => r.Selected);
    }
    // end table feature

    //async ForwardToVerify() {
    //    const anyTeamSelected = this.CenterObserverData.some((x :any) => x.Selected);
    //    if (!anyTeamSelected) {
    //      this.toastr.error("Please select at least one Team!");
    //      return;
    //    }
    //    this.Swal2.Confirmation("Are you sure you want to Forward to Verify ?",
    //      async (result: any) => {
    //        if (result.isConfirmed) {
    //          const Selected = this.CenterObserverData.filter((x: any) => x.Selected == true)
    //          Selected.forEach((x: any) => {
    //            x.UserID = this.sSOLoginDataModel.UserID;
    //            x.DeploymentStatus = EnumDeploymentStatus.ForwardToVerify;

    //          })

    //          try {
    //            this.loaderService.requestStarted();
    //            await this.ITIFlyingSquadService.ForwardToVerify(Selected).then((data: any) => {
    //              data = JSON.parse(JSON.stringify(data));
    //              if (data.State == EnumStatus.Success) {
    //                this.toastr.success("Forward to Verify Successfully")
    //                this.AllInTableSelect = false
    //                this.GetAllData()
    //              } else {
    //                this.toastr.error(data.ErrorMessage)
    //              }

    //            }, (error: any) => console.error(error))
    //          } catch (error) {
    //            console.log(error);
    //          } finally {
    //            setTimeout(() => {
    //              this.loaderService.requestEnded();
    //            }, 200)
    //          }
    //        }
    //      });
  //  }



  async openModal(content: any, DeploymentID: number) {
     
   this._DeploymentID = DeploymentID;
    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;

    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReasonnew(reason)}`;
    });
  }

  private getDismissReasonnew (reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  CloseModal() {
    this.ApproveRemark = '';
    this._DeploymentID = 0;
    this.modalService.dismissAll();
  }

 //async RequestApproveByAdmin()
 // {
 //  try {
 //   // this.searchRequest.DeploymentID = DeploymentID
 //    this.loaderService.requestStarted();
 //    await this.ITIFlyingSquadService.RequestApprove(this._DeploymentID , this.ApproveRemark)
 //      .then((data: any) => {
 //        data = JSON.parse(JSON.stringify(data));
 //        console.log("DownloadChecklist", data)
 //        if (data.State === EnumStatus.Success) {
 //          // this.toastr.success(data.Message);
 //          this.toastr.success("Request Status Successfully Updated");
 //          this.CloseModal();
 //           this.GetAllData();

 //        } else {
 //          this.toastr.error(data.ErrorMessage);
 //        }
 //      }, error => console.error(error));
 //  }
 //  catch (Ex) {
 //    console.log(Ex);
 //  }
 //  finally {
 //    setTimeout(() => {
 //      this.loaderService.requestEnded();
 //    }, 200);
 //  }
  // }

  async RequestApproveByAdmin(Req_Remark: string, DeplomentId: number) {
    this.Swal2.Confirmation("Are you sure you want to Approve this ? <br><h2>User Remark</h2>" + Req_Remark + "",
      async (result: any) => {
        if (result.isConfirmed) {
          try {
            debugger;
            // this.searchRequest.DeploymentID = DeploymentID
            this.loaderService.requestStarted();
            await this.ITIFlyingSquadService.RequestApprove(DeplomentId)
              .then((data: any) => {
                data = JSON.parse(JSON.stringify(data));

                if (data.State === EnumStatus.Success) {
                  // this.toastr.success(data.Message);
                  this.toastr.success("Request Status Successfully Updated");

                  this.GetAllData();

                } else {
                  this.toastr.error(data.ErrorMessage);
                }
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
      });
  }

}
