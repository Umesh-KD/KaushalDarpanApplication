import { Component } from '@angular/core';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { EnumCourseType, EnumRole, EnumStatus, GlobalConstants } from '../../Common/GlobalConstants';
import { PrometedStudentMasterModel } from '../../Models/PrometedStudentMasterModel';
import { BridgeCourseStudentMarkedModel, BridgeCourseStudentMasterModel, BridgeCourseStudentSearchModel } from '../../Models/ApplyBridgeCourseDataModel';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { PromotedStudentService } from '../../Services/PromotedStudent/promoted-student.service';
import { LoaderService } from '../../Services/Loader/loader.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserMasterService } from '../../Services/UserMaster/user-master.service';
import { SweetAlert2 } from '../../Common/SweetAlert2'
import { AppsettingService } from '../../Common/appsetting.service';
import { ActivatedRoute } from '@angular/router';
import { MenuService } from '../../Services/Menu/menu.service';
import { BridgeCourseStudentService } from '../../Services/BridgeCourse/ApplyBridgeCourse.service';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-bridge-course',
  standalone: false,
  
  templateUrl: './bridge-course.component.html',
  styleUrl: './bridge-course.component.css'
})
export class BridgeCourseComponent {
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

  public request = new BridgeCourseStudentSearchModel();//search
  public BridgeCourseStudentData: BridgeCourseStudentMasterModel[] = [];//grid
  public nextAcedmicYearDDl: any[] = [];//grid
  public NextEndTermID: string = '0'


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
    private BridgeCourseStudentService: BridgeCourseStudentService,
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
    await this.GetDateConfig();
  }

  async GetMasterData() {
    try {
      await this.commonMasterService.InstituteMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID)
        .then((data: any) => {
          this.InstituteMasterList = data['Data'];
        }, (error: any) => console.error(error));

      await this.commonMasterService.StreamMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID)
        .then((data: any) => {
          this.StreamMasterList = data['Data'];
        }, (error: any) => console.error(error));

      await this.commonMasterService.SemesterMaster()
        .then((data: any) => {
          this.SemesterMasterList = data['Data'];
        }, (error: any) => console.error(error));

      await this.commonMasterService.StudentType()
        .then((data: any) => {
          this.StudentTypeMasterList = data['Data'];
        }, (error: any) => console.error(error));

      await this.menuService.GetAcedmicYearList()
        .then((res: any) => {
          this.nextAcedmicYearDDl = res['Data'];
          //less then selected year
          this.nextAcedmicYearDDl = this.nextAcedmicYearDDl.filter(x => x.EndTermID > this.sSOLoginDataModel.EndTermID) ?? [];
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
  }

  async GetAllStudent() {
    try {
      //session
      this.request.EndTermID = this.sSOLoginDataModel.EndTermID
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID
      this.request.Eng_NonEng = EnumCourseType.Lateral
      this.request.SemesterID=3
      //call
      await this.BridgeCourseStudentService.GetAllStudent(this.request)
        .then(async (data: any) => {
          //
          if (data.State == EnumStatus.Success) {
            this.AllInTableSelect = false;
            this.BridgeCourseStudentData = data['Data'];
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
      await this.GetAllStudent();
    }
    catch (Ex) {
      console.log(Ex);
    }
  }

  async btn_Clear() {
    this.request = new BridgeCourseStudentSearchModel();
    this.NextEndTermID = '0';
    this.GetAllStudent();
  }

  async sortInTableData(field: string) {
    this.loaderService.requestStarted();
    this.sortInTableDirection = this.sortInTableDirection == 'asc' ? 'desc' : 'asc';
    this.paginatedInTableData = ([...this.BridgeCourseStudentData] as any[]).sort((a, b) => {
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
    this.totalInTableRecord = this.BridgeCourseStudentData.length;
  }

  get totalInTableSelected(): number {
    return this.BridgeCourseStudentData.filter(x => x.Selected)?.length;
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
    this.paginatedInTableData = [...this.BridgeCourseStudentData].slice(this.startInTableIndex, this.endInTableIndex);
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
    this.BridgeCourseStudentData.forEach(x => {
      x.Selected = this.AllInTableSelect;
    });
  }
  //checked single (replace org. list here)
  selectInTableSingleCheckbox(isSelected: boolean, item: any) {
    const data = this.BridgeCourseStudentData.filter(x => x.StudentID == item.StudentID);
    data.forEach(x => {
      x.Selected = isSelected;
    });
    //select all(toggle)
    this.AllInTableSelect = this.BridgeCourseStudentData.every(r => r.Selected);
  }

  exportToExcel(): void {
    const unwantedColumns = ['ActiveStatus', 'DeleteStatus', 'CreatedBy', 'ModifyBy', 'ModifyDate', 'IPAddress', 'Selected', 'status', 'StudentID',
      'EndTermID', 'StreamID', 'SemesterID', 'StudentType'
    ];
    const filteredData = this.BridgeCourseStudentData.map((item: any) => {
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
    XLSX.writeFile(wb, 'Apply Bridge Course.xlsx');
  }

  async SaveStudent() {
    //validation    
    
    const isSelected = this.BridgeCourseStudentData.some(x => x.Selected);
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
          const selectedStudents = this.BridgeCourseStudentData.filter(x => x.Selected);
          var request: BridgeCourseStudentMarkedModel[] = [];
          selectedStudents.forEach(x => {
            request.push({
              StudentId: x.StudentID,
              SemesterId: 1 ,
              StudentTypeId: x.StudentTypeID,
              Marked: x.Selected,
              ModifyBy: this.sSOLoginDataModel.UserID,
              RoleId: this.sSOLoginDataModel.RoleID,
              EndTermID: this.sSOLoginDataModel.EndTermID,
           
              IsBridge: true,
              StreamID: x.StreamID,
              InstituteID: x.InstituteID,
              MotherName: x.MotherName,
              FatherName: x.FatherName,
              DepartmentID: this.sSOLoginDataModel.DepartmentID,
              Dis_DOB: x.Dis_DOB,
              EnrollmentNo: x.EnrollmentNo,
              FinancialYearID: this.sSOLoginDataModel.FinancialYearID_Session,
              StudentName: x.StudentName
            })
          });
          // Call service to save student exam status
          await this.BridgeCourseStudentService.SaveStudent(request)
            .then(async (data: any) => {
              this.State = data['State'];
              this.Message = data['Message'];
              this.ErrorMessage = data['ErrorMessage'];
              //
              if (this.State == EnumStatus.Success) {
                this.toastr.success(this.Message)
                await this.GetAllStudent();
              }
              else if (this.State == EnumStatus.Warning) {
                this.toastr.warning(this.Message)
              }
              else {  
                this.toastr.error(this.ErrorMessage)
              }
            })
        } catch (ex) {
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
      Key: "Bridgecourse",
      SSOID: this.sSOLoginDataModel.SSOID
    }

    await this.commonMasterService.GetDateConfigSetting(data)
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.DateConfigSetting = data['Data'][0];
        this.MapKeyEng = this.DateConfigSetting.Bridgecourse;

      }, (error: any) => console.error(error)
      );
  }
}
