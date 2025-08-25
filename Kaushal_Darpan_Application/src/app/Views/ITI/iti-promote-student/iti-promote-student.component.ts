import { Component } from '@angular/core';
import { EnumRole, EnumStatus, GlobalConstants } from '../../../Common/GlobalConstants';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AppsettingService } from '../../../Common/appsetting.service';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { UserMasterService } from '../../../Services/UserMaster/user-master.service';
import * as XLSX from 'xlsx';
import { PromotedStudentService } from '../../../Services/PromotedStudent/promoted-student.service';
import { PrometedStudentMasterModel, PromotedStudentMarkedModel, PromotedStudentSearchModel } from '../../../Models/PrometedStudentMasterModel';
import { MenuService } from '../../../Services/Menu/menu.service';

@Component({
  selector: 'app-iti-promote-student',
  standalone: false,
  templateUrl: './iti-promote-student.component.html',
  styleUrl: './iti-promote-student.component.css'
})
export class ItiPromoteStudentComponent {
  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];
  public isSubmitted: boolean = false;

  public sSOLoginDataModel = new SSOLoginDataModel();

  public _GlobalConstants: any = GlobalConstants;
  public _EnumRole = EnumRole;

  public UserID: number = 0
  public RoleID: number = 0
  public InstituteMasterList: any = [];
  public StreamMasterList: any = [];
  public SemesterMasterList: any = [];
  public StudentTypeMasterList: any = [];

  public request = new PromotedStudentSearchModel();//search
  public prometedStudentData: PrometedStudentMasterModel[] = [];//grid


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
  MapKeyEng: number = 0;
  public DateConfigSetting: any = [];

  //end table feature default

  constructor(private commonMasterService: CommonFunctionService,
    private promotedstudentservice: PromotedStudentService,
    private loaderService: LoaderService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private UserMasterService: UserMasterService,
    private Swal2: SweetAlert2,
    public appsettingConfig: AppsettingService,
    private activatedRoute: ActivatedRoute,
    private menuService: MenuService
  ) {

  }

  async ngOnInit() {
    //session
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.UserID = this.sSOLoginDataModel.UserID
    //load
    await this.GetMasterData();
    await this.GetItiTrade()
    await this.GetDateConfig();
  }

  async GetMasterData() {
    try {
      this.loaderService.requestStarted();



      await this.commonMasterService.Iticollege(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.InstituteMasterList = data.Data;
        console.log("InstituteMasterDDLList", this.InstituteMasterList);
      })
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

  async GetItiTrade() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.ItiTrade(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID,
        Number(this.request.InstituteID))
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.StreamMasterList = data['Data'];
        }, error => console.error(error));


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


  async GetPromotedStudent() {
    try {
      //session
      this.request.EndTermID = this.sSOLoginDataModel.EndTermID
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID
      this.request.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng
      //call
      await this.promotedstudentservice.GetITIPromotedStudent(this.request)
        .then(async (data: any) => {
          //
          if (data.State == EnumStatus.Success) {
            this.AllInTableSelect = false;
            this.prometedStudentData = data['Data'];

            console.log("this.prometedStudentData", this.prometedStudentData);
            //table feature load
            this.loadInTable();
            //end table feature load
          }
          else {
            this.toastr.error(data.ErrorMessage);
          }
        }, (error: any) => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
  }

  async btn_SearchClick() {
    try {
      await this.GetPromotedStudent();
    }
    catch (Ex) {
      console.log(Ex);
    }
  }

  async btn_Clear() {
    this.request = new PromotedStudentSearchModel();
    this.GetPromotedStudent();
  }

  async sortInTableData(field: string) {
    this.loaderService.requestStarted();
    this.sortInTableDirection = this.sortInTableDirection == 'asc' ? 'desc' : 'asc';
    this.paginatedInTableData = ([...this.prometedStudentData] as any[]).sort((a, b) => {
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
    this.totalInTableRecord = this.prometedStudentData.length;
  }

  get totalInTableSelected(): number {
    return this.prometedStudentData.filter(x => x.Selected)?.length;
  }

  //table feature 
  calculateInTableTotalPage() {
    this.totalInTablePage = Math.ceil(this.totalInTableRecord / parseInt(this.pageInTableSize));
  }

  // (replace org. list here)
  updateInTablePaginatedData() {
    this.loaderService.requestStarted();
    this.startInTableIndex = (this.currentInTablePage - 1) * parseInt(this.pageInTableSize);
    this.endInTableIndex = this.startInTableIndex + parseInt(this.pageInTableSize);
    this.endInTableIndex = this.endInTableIndex > this.totalInTableRecord ? this.totalInTableRecord : this.endInTableIndex;
    this.paginatedInTableData = [...this.prometedStudentData].slice(this.startInTableIndex, this.endInTableIndex);
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

  //checked all (replace org. list here)
  selectInTableAllCheckbox() {
    this.prometedStudentData.forEach(x => {
      x.Selected = this.AllInTableSelect;
    });
  }
  //checked single (replace org. list here)
  selectInTableSingleCheckbox(isSelected: boolean, item: any) {
    const data = this.prometedStudentData.filter(x => x.StudentID == item.StudentID);
    data.forEach(x => {
      x.Selected = isSelected;
    });
    //select all(toggle)
    this.AllInTableSelect = this.prometedStudentData.every(r => r.Selected);
  }

  exportToExcel(): void {
    const unwantedColumns = ['ActiveStatus', 'DeleteStatus', 'CreatedBy', 'ModifyBy', 'ModifyDate', 'IPAddress', 'Selected', 'status', 'StudentID',
      'EndTermID', 'StreamID', 'SemesterID',
    ];
    const filteredData = this.prometedStudentData.map((item: any) => {
      const filteredItem: any = {};
      Object.keys(item).forEach(key => {
        if (!unwantedColumns.includes(key)) {
          filteredItem[key] = item[key];
        }
      });
      return filteredItem;
    });
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'PreExamStudentsData.xlsx');
  }

  async SavePromoteStudent() {
    const isSelected = this.prometedStudentData.some(x => x.Selected);
    if (!isSelected) {
      this.toastr.error("Please select at least one Student!");
      return;
    }
    // confirm
    this.Swal2.Confirmation("Are you sure to continue?", async (result: any) => {
      //confirmed
      if (result.isConfirmed) {
        try {
          this.isSubmitted = true;
          // Filter out only the selected students
          const selectedStudents = this.prometedStudentData.filter(x => x.Selected);
          var request: PromotedStudentMarkedModel[] = [];
          selectedStudents.forEach(x => {
            request.push({
              StudentId: x.StudentID,
              Marked: x.Selected,
              ModifyBy: this.sSOLoginDataModel.UserID,
              RoleId: this.sSOLoginDataModel.RoleID,
              EndTermID: this.sSOLoginDataModel.EndTermID
            })
          });
          // Call service to save student exam status
          await this.promotedstudentservice.SaveITIPromotedStudent(request)
            .then(async (data: any) => {
              this.State = data['State'];
              this.Message = data['Message'];
              this.ErrorMessage = data['ErrorMessage'];
              //
              if (this.State == EnumStatus.Success) {
                this.toastr.success(this.Message)
                await this.GetPromotedStudent();
              }
              else if (this.State == EnumStatus.Warning) {
                this.toastr.warning(this.Message)
              }
              else {
                this.toastr.error(this.Message)
                console.log(this.ErrorMessage);
              }
            })
        } catch (ex) {
          this.toastr.error(GlobalConstants.MSG_ERROR_OCCURRED);
          console.log(ex);
        }
      }
    });
  }
  async GetDateConfig() {

    var data = {
      DepartmentID: this.sSOLoginDataModel.DepartmentID,
      CourseTypeId: this.sSOLoginDataModel.Eng_NonEng,
      AcademicYearID: this.sSOLoginDataModel.FinancialYearID,
      EndTermID: this.sSOLoginDataModel.EndTermID,
      Key: "PromotedStudent",
      SSOID: this.sSOLoginDataModel.SSOID
    }

    await this.commonMasterService.GetDateConfigSetting(data)
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.DateConfigSetting = data['Data'][0];
        this.MapKeyEng = this.DateConfigSetting.PromotedStudent;
        console.log(data, 'Dataa');

      }, (error: any) => console.error(error)
      );
  }
}
