import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TimeTableService } from '../../../Services/TimeTable/time-table.service';
import { StreamMasterService } from '../../../Services/BranchesMaster/branches-master.service';
import { EnumDeploymentStatus, EnumRole, EnumStatus, GlobalConstants } from '../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { TimeTableDataModels, TimeTableInvigilatorModel, TimeTableSearchModel } from '../../../Models/TimeTableModels';
import { InvigilatorSSOIDList } from '../../../Models/InvigilatorAppointmentDataModel';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { DDL_InvigilatorSSOID_DataModel } from '../../../Models/CommonMasterDataModel';
import { ReportService } from '../../../Services/Report/report.service';
import { ReportBasedModel } from '../../../Models/ReportBasedDataModel';
import { AppsettingService } from '../../../Common/appsetting.service';
import { HttpClient } from '@angular/common/http';
import { CenterObserverService } from '../../../Services/CenterObserver/center-observer.service';
import { CenterObserverDataModel, CenterObserverDeployModel, CenterObserverSearchModel, CODeploymentDataModel } from '../../../Models/CenterObserverDataModel';
import { ITICenterObserverService } from '../../../Services/ITI/ITICenterObserver/iticenter-observer.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-center-observer',
  standalone: false,
  templateUrl: './center-observer.component.html',
  styleUrl: './center-observer.component.css'
})
export class CenterObserverComponent {
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

  public CenterObserverData: CODeploymentDataModel[] = [];
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
  
  public request = new TimeTableDataModels();
  public tablerequest = new ReportBasedModel();
  public TimeTableBranchSubList: any = []
  public InvigilatorDDL: InvigilatorSSOIDList[] = []
  public InvigilatorFormGroup!: FormGroup;
  public TimeTableID: number = 0
  sSOLoginDataModel = new SSOLoginDataModel();
  public InvigilatorID: number = 0
  public requestInv = new TimeTableInvigilatorModel()
  public TimeTableInvigilatorData: any = []
  MapKeyEng: number = 0;
  public DateConfigSetting: any = [];
  public requestInvigilatorSSOID = new DDL_InvigilatorSSOID_DataModel()
  public requestObs = new CenterObserverDataModel()
  isForwardToVerify: boolean = false
  public DeploymentID: number = 0

  //table feature default
  public paginatedInTableData: any[] = [];//copy of main data
  public currentInTablePage: number = 1;
  public pageInTableSize: string = "50";
  public totalInTablePage: number = 0;
  public sortInTableColumn: string = '';
  public sortInTableDirection: string = 'asc';
  public startInTableIndex: number = 0;
  public endInTableIndex: number = 0;
  public AllInTableSelect: boolean = false;
  public totalInTableRecord: number = 0;
  //end table feature default

  constructor(
    private streamService: StreamMasterService, 
    private commonMasterService: CommonFunctionService,
    private appsettingConfig: AppsettingService,
    private http: HttpClient,
    private Router: Router,
    private reportService: ReportService, 
    private TimeTableService: TimeTableService, 
    private toastr: ToastrService,
    private loaderService: LoaderService, 
    private formBuilder: FormBuilder,
    private modalService: NgbModal, 
    private Swal2: SweetAlert2,
    private centerObserverService: CenterObserverService,
    private itiCenterObserverService: ITICenterObserverService
  ) {}

  async ngOnInit() {
    this.InvigilatorFormGroup = this.formBuilder.group({
      InvigilatorID: ['', [DropdownValidators]],
    })
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
    this.request.UserID = this.sSOLoginDataModel.UserID;
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
  get _InvigilatorFormGroup() { return this.InvigilatorFormGroup.controls; }

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

  async AttendanceView(content: any, id: number) {
    this.DeploymentID = id
    await this.GetById_Attendance()
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
      await this.centerObserverService.GetByID(this.CenterObserverTeamID, this.sSOLoginDataModel.DepartmentID).then((data: any) => {
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

  async GetById_Attendance() {
    try {
      
      this.loaderService.requestStarted();
      await this.centerObserverService.GetById_Attendance(this.DeploymentID, this.sSOLoginDataModel.DepartmentID).then((data: any) => {
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

  async DownloadChecklist(TeamID: number, DeploymentID: number) {
    try {
      this.searchRequest.DeploymentID = DeploymentID
      this.searchRequest.TypeID = 1
      this.loaderService.requestStarted();
      await this.centerObserverService.GenerateCOAnsweredReport(this.searchRequest)
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
    this.searchRequest.DeploymentStatus = -1
    this.searchRequest.ExamDate = ''
    this.searchRequest.TeamName = ''
    this.GetAllData();
  }

  async GetAllData() {
    try {
      this.loaderService.requestStarted();
      this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID
      this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID
      
      await this.centerObserverService.GetAllData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CenterObserverData = data['Data'];
          this.isForwardToVerify = this.CenterObserverData.some((x: any) => x.DeploymentStatus === EnumDeploymentStatus.Assigned);
          
          this.loadInTable()
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
            await this.centerObserverService.DeleteDataByID(this.requestObs)
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
            await this.itiCenterObserverService.DeleteDeploymentDataByID(this.requestObs)
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
    this.requestInv = new TimeTableInvigilatorModel()
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

  async ForwardToVerify() {
    const anyTeamSelected = this.CenterObserverData.some(x => x.Selected);
    if (!anyTeamSelected) {
      this.toastr.error("Please select at least one Team!");
      return;
    }
    this.Swal2.Confirmation("Are you sure you want to Forward to Verify ?",
      async (result: any) => {
        if (result.isConfirmed) {
          const Selected = this.CenterObserverData.filter(x => x.Selected == true)
          Selected.forEach((x: any) => {
            x.UserID = this.sSOLoginDataModel.UserID;
            x.DeploymentStatus = EnumDeploymentStatus.ForwardToVerify;
            
          })

          try {
            this.loaderService.requestStarted();
            await this.centerObserverService.ForwardToVerify(Selected).then((data: any) => {
              data = JSON.parse(JSON.stringify(data));
              if (data.State == EnumStatus.Success) {
                this.toastr.success("Forward to Verify Successfully")
                this.AllInTableSelect = false
                this.GetAllData()
              } else {
                this.toastr.error(data.ErrorMessage)
              }

            }, (error: any) => console.error(error))
          } catch (error) {
            console.log(error);
          } finally {
            setTimeout(() => {
              this.loaderService.requestEnded();
            }, 200)
          }
        }
      });
  }

    
  //table feature
  calculateInTableTotalPage() {
    this.totalInTablePage = Math.ceil(this.totalInTableRecord / parseInt(this.pageInTableSize));
  }
  // (replace org.list here)
  updateInTablePaginatedData() {
    this.loaderService.requestStarted();
    this.startInTableIndex = (this.currentInTablePage - 1) * parseInt(this.pageInTableSize);
    this.endInTableIndex = this.startInTableIndex + parseInt(this.pageInTableSize);
    this.endInTableIndex = this.endInTableIndex > this.totalInTableRecord ? this.totalInTableRecord : this.endInTableIndex;
    this.paginatedInTableData = [...this.CenterObserverData].slice(this.startInTableIndex, this.endInTableIndex);
    this.loaderService.requestEnded();
  }

  previousInTablePage() {
    if (this.currentInTablePage > 1) {
      this.currentInTablePage--;
      this.updateInTablePaginatedData();
    }
  }
  nextInTablePage() {
    if (this.currentInTablePage < this.totalInTablePage && this.totalInTablePage > 0) {
      this.currentInTablePage++;
      this.updateInTablePaginatedData();
    }
  }
  firstInTablePage() {
    if (this.currentInTablePage > 1) {
      this.currentInTablePage = 1;
      this.updateInTablePaginatedData();
    }
  }
  lastInTablePage() {
    if (this.currentInTablePage < this.totalInTablePage && this.totalInTablePage > 0) {
      this.currentInTablePage = this.totalInTablePage;
      this.updateInTablePaginatedData();
    }
  }
  randamInTablePage() {
    if (this.currentInTablePage <= 0 || this.currentInTablePage > this.totalInTablePage) {
      this.currentInTablePage = 1;
    }
    if (this.currentInTablePage > 0 && this.currentInTablePage < this.totalInTablePage && this.totalInTablePage > 0) {
      this.updateInTablePaginatedData();
    }
  }
  // (replace org.list here)
  sortInTableData(field: string) {
    this.loaderService.requestStarted();
    this.sortInTableDirection = this.sortInTableDirection == 'asc' ? 'desc' : 'asc';
    this.paginatedInTableData = ([...this.CenterObserverData] as any[]).sort((a, b) => {
      const comparison = a[field] < b[field] ? -1 : a[field] > b[field] ? 1 : 0;
      return this.sortInTableDirection == 'asc' ? comparison : -comparison;
    }).slice(this.startInTableIndex, this.endInTableIndex);
    this.sortInTableColumn = field;
    this.loaderService.requestEnded();
  }
  //main 
  loadInTable() {
    this.resetInTableValiable();
    this.calculateInTableTotalPage();
    this.updateInTablePaginatedData();
  }
  // (replace org. list here)
  resetInTableValiable() {
    this.paginatedInTableData = [];//copy of main data
    this.currentInTablePage = 1;
    this.totalInTablePage = 0;
    this.sortInTableColumn = '';
    this.sortInTableDirection = 'asc';
    this.startInTableIndex = 0;
    this.endInTableIndex = 0;
    this.totalInTableRecord = this.CenterObserverData.length;
  }
  // (replace org.list here)
  get totalInTableSelected(): number {
    return this.CenterObserverData.filter((x: any) => x.Selected)?.length;
  }
  get sortInTableDirectionAero(): string {
    return this.sortInTableDirection == 'asc' ? '&uarr;' : '&darr;';
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


  openModalMap(latitude: string, longitude: string) {
    const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
    window.open(mapUrl, '_blank');
  }
  openModalPhoto(photo: string) {
    const mapUrl = `${this.appsettingConfig.StaticFileRootPathURL}${photo}`;
    window.open(mapUrl, '_blank');
  }

  unLockIsRequest(el: any, lock: any): void {
    Swal.fire({
      title: `Are you sure you want to ${lock == 2 ? "UnLock" : "Lock"}?`,
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: `Yes, ${lock == 2 ? "UnLock" : "Lock"} it!`,
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          let obj = {
            DeploymentID: el.DeploymentID,
            TeamID: el.CenterObserverTeamID,
            DeploymentDate: el.DeploymentDate,
            UserID: this.sSOLoginDataModel.UserID,
            OperationType: 'UPDATE',
            IsRequest: lock,
            EndTermId: this.sSOLoginDataModel.EndTermID,
            DepartmentID: this.sSOLoginDataModel.DepartmentID,
            CourseTypeID: this.sSOLoginDataModel.Eng_NonEng,
            CreatedBy: this.sSOLoginDataModel.RoleID,
            ModifyBy: this.sSOLoginDataModel.UserID,
          };
          this.centerObserverService.IsRequestCenterObserver(obj)
            .then((data: any) => {
              data = JSON.parse(JSON.stringify(data['Data']));
              this.toastr.success('Update Successfully');
              this.GetAllData();
            }, error => console.error(error));
        } catch (Ex) {
          console.log(Ex);
        }
      } else {
        console.log('Action cancelled!');
      }
    });
  }
}
