import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppsettingService } from '../../../Common/appsetting.service';
import { EnumPaperSetterStatus, EnumStatus, GlobalConstants } from '../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { CommonDDLCommonSubjectModel } from '../../../Models/CommonDDLCommonSubjectModel';
import { CommonDDLSubjectMasterModel } from '../../../Models/CommonDDLSubjectMasterModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ReportService } from '../../../Services/Report/report.service';
import { PaperSetterService } from '../../../Services/PaperSetter/paper-setter.service';
import { AppointPaperSetterDataModel, PaperSetterDataModel, PaperSetterSearchModel, VerifyPaperSetterDataModel } from '../../../Models/PaperSetterDataModel';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-paper-setter-verify',
  standalone: false,
  templateUrl: './paper-setter-verify.component.html',
  styleUrl: './paper-setter-verify.component.css'
})
export class PaperSetterVerifyComponent {
  public SemesterMasterDDLList: any[] = [];
  public StreamMasterDDLList: any[] = [];
  public SubjectMasterDDLList: any[] = [];
  public ExaminersList: any[] = [];
  public ExamList: any[] = [];
  public Table_SearchText: any = '';
  public isSubmitted: boolean = false;
  public sSOLoginDataModel = new SSOLoginDataModel();
  public searchRequest = new PaperSetterSearchModel();
  public UserID: number = 0;
  public StaffID: number = 0

  public commonDDLCommonSubjectModel = new CommonDDLCommonSubjectModel();
  public CommonSubjectYesNo: number = 1;
  public CommonSubjectDDLList: any[] = [];
  _EnumPaperSetterStatus = EnumPaperSetterStatus;
  modalReference: NgbModalRef | undefined;
  public PaperSetterID: number = 0;
  public StaffDetails: any = [];

  public request = new AppointPaperSetterDataModel();
  public verifyRequest :VerifyPaperSetterDataModel[] = [];

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
    private commonMasterService: CommonFunctionService,
    private papersetterservice: PaperSetterService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    private Swal2: SweetAlert2,
    private reportService: ReportService,
    public appsettingConfig: AppsettingService,
    private http: HttpClient,
    private modalService: NgbModal, 
  ) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.UserID = this.sSOLoginDataModel.UserID;
    console.log(this.sSOLoginDataModel);
    this.getSemesterMasterList();
    this.getStreamMasterList();


    // to refresh
    await this.activatedRoute.params.subscribe(async params => {
      console.log('Query Param ID:', params['id']);
      this.searchRequest.PaperSetterStatus = params['id'];
      debugger
      await this.getExaminerData(); 
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

  async getExamMasterList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetExamName().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.ExamList = data.Data;
        console.log("ExamList", this.ExamList);
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async getStreamMasterList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.StreamMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.StreamMasterDDLList = data.Data;
        console.log("StreamMasterDDLList", this.StreamMasterDDLList);
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async ddlStream_Change() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.SubjectMaster_StreamIDWise(this.searchRequest.StreamID, this.sSOLoginDataModel.DepartmentID, this.searchRequest.SemesterID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.SubjectMasterDDLList = data.Data;
          console.log("SubjectMasterDDLList", this.SubjectMasterDDLList)
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

  async getExaminerData() {
    
    console.log("searchRequest", this.searchRequest);
    this.searchRequest.CommonSubjectYesNo = this.CommonSubjectYesNo;
    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
    this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
    try {
      await this.papersetterservice.GetExaminerData(this.searchRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.ExaminersList = data.Data;
        console.log("this.ExaminersList", this.ExaminersList)
        this.loadInTable();
      })
    } catch (error) {
      console.error(error);
    }
  }

  async btnDelete_OnClick(PaperSetterID: number) {
    this.Swal2.Confirmation("Are you sure you want to Remove this ?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          try {
            this.loaderService.requestStarted();
            await this.papersetterservice.DeleteById(PaperSetterID, this.UserID)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));

                if (data.State == EnumStatus.Success) {
                  this.getExaminerData()
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

  async ResetControl() {
    this.isSubmitted = false;
    this.SubjectMasterDDLList = [];
    this.ExaminersList = [];

    this.searchRequest.StreamID = 0;
    this.searchRequest.SubjectID = 0;
    this.searchRequest.Name = '';
    this.searchRequest.GroupCodeID = 0;
    this.searchRequest.ExamID = 0;
    this.searchRequest.CommonSubjectID = 0;

  }

  async onCancle() {
    this.isSubmitted = false;
    this.searchRequest = new PaperSetterSearchModel();
    this.SubjectMasterDDLList = [];
    this.ExaminersList = [];
  }

  DownloadFile(FileName: string, DownloadfileName: any): void {

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

  async GetCommonSubjectDDL() {
    try {
      if (this.CommonSubjectYesNo == 1 || this.searchRequest.SemesterID == 0) {//no
        this.CommonSubjectDDLList = [];
        return;
      }
      this.commonDDLCommonSubjectModel.SemesterID = this.searchRequest.SemesterID;
      this.commonDDLCommonSubjectModel.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.commonDDLCommonSubjectModel.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.commonDDLCommonSubjectModel.EndTermID = this.sSOLoginDataModel.EndTermID;
      //get
      await this.commonMasterService.GetCommonSubjectDDL(this.commonDDLCommonSubjectModel)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.CommonSubjectDDLList = data['Data'];
        }, (error: any) => console.error(error)
        );
    }
    catch (ex) {
      console.log(ex);
    }
  }

  async ViewandPaperSetterDetails(content: any, id: number) {
    this.PaperSetterID = id
    await this.GetByID()
    this.modalReference = this.modalService.open(content, { backdrop: 'static', size: 'xl', keyboard: true, centered: true });

  }

  CloseModalPopup() {
    this.modalService.dismissAll();
    this.PaperSetterID = 0;
  }

  async GetByID() {
    try {
      this.loaderService.requestStarted();
      await this.papersetterservice.GetPaperSetterStaffDetails(this.PaperSetterID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        console.log("getbyid", data)
        if (data.State == EnumStatus.Success) {
          this.request = data.Data;
          debugger
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
    this.paginatedInTableData = [...this.ExaminersList].slice(this.startInTableIndex, this.endInTableIndex);
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
    this.paginatedInTableData = ([...this.ExaminersList] as any[]).sort((a, b) => {
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
    this.totalInTableRecord = this.ExaminersList.length;
  }
  // (replace org.list here)
  get totalInTableSelected(): number {
    return this.ExaminersList.filter(x => x.Selected)?.length;
  }
  get sortInTableDirectionAero(): string {
    return this.sortInTableDirection == 'asc' ? '&uarr;' : '&darr;';
  }
  //checked all (replace org. list here)
  selectInTableAllCheckbox() {
    this.ExaminersList.forEach(x => {
      x.Selected = this.AllInTableSelect;
    });
  }
  //checked single (replace org. list here)
  selectInTableSingleCheckbox(isSelected: boolean, item: any) {
    debugger
    const data = this.ExaminersList.filter(x => x.PaperSetterID == item.PaperSetterID);
    data.forEach(x => {
      x.Selected = isSelected;
    });
    //select all(toggle)
    this.AllInTableSelect = this.ExaminersList.every(r => r.Selected);
  }
  // end table feature

  async VerifyPaperSetter() {
    debugger
    const anySelected = this.ExaminersList.some(x => x.Selected = true);
    if(!anySelected) {
      this.toastr.error("Please select at least one!");
      return;
    }
    
    const Selected = this.ExaminersList.filter(x => x.Selected == true)
    Selected.forEach((x: any) => {
      x.UserID = this.sSOLoginDataModel.UserID;
      x.PaperSetterStatus = EnumPaperSetterStatus.Verified;
    })
    
    try {
      this.loaderService.requestStarted();
      await this.papersetterservice.VerifyPaperSetter(Selected).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State == EnumStatus.Success) {
          this.toastr.success("Paper Setter Verified")
          window.location.reload();
        } else {
          this.toastr.error(data.ErrorMessage)
        }
      })
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async GenerateOrder() {
    
    if(this.ExaminersList.length == 0) {
      this.toastr.error("There is no data!");
      return;
    }

    if(this.searchRequest.SemesterID == 0) {
      this.toastr.error("Please select semester!");
      return;
    }

    this.ExaminersList.forEach((x: any) => {
      x.UserID = this.sSOLoginDataModel.UserID;
      x.PaperSetterStatus = EnumPaperSetterStatus.OrderGenerated;
      x.SemesterID = this.searchRequest.SemesterID;
      x.EndTermID = this.sSOLoginDataModel.EndTermID
    })
    
    try {
      this.loaderService.requestStarted();
      await this.papersetterservice.GeneratePaperSetterOrder(this.ExaminersList).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State == EnumStatus.Success) {
          this.toastr.success("Paper Setter Verified")
          window.location.reload();
        } else {
          this.toastr.error(data.ErrorMessage)
        }
      })
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }
}
