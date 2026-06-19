import { Component,NgModule } from '@angular/core';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EnumRole, EnumStatus, MONTH_LIST } from '../../../../Common/GlobalConstants';
import { ITIApprenticeshipService } from '../../../../Services/ITI/ITI-Apprenticeship/iti-apprenticeship.service';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
import { UploadBTERFileModel, UploadFileModel } from '../../../../Models/UploadFileModel';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { DocumentDetailsService } from '../../../../Common/document-details'; 
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-iti-college-approved-contract-rpt',
  // imports: [],
   standalone: false,
  templateUrl: './iti-college-approved-contract-rpt.component.html',
  styleUrl: './iti-college-approved-contract-rpt.component.css'
})
export class ItiCollegeApprovedContractRPTComponent {
  public sSOLoginDataModel = new SSOLoginDataModel();
  public request : any = {};

  CollegeApprovedContractForm!: FormGroup; 
  public FinancialYearList: any = [];
  public Divisionlist: any = [];
  public Districtlist: any = [];
  public Institutelist: any = [];
  public DivisionData: any = []; 
  _enumRole = EnumRole;
  months = MONTH_LIST;
  //deletedContracts: number[] = [];
  deletedContracts: any[] = [];
  minDate: string = '';
  maxDate: string = '';
  public Message: string = '';
  public ErrorMessage: string = '';
  public State: any = false;
  constructor(
  private commonMasterService: CommonFunctionService,
  private toastr: ToastrService,
  private loaderService: LoaderService,
  private Swal2: SweetAlert2,
  private router: Router,
  private route: ActivatedRoute,
  private formBuilder: FormBuilder,
  private apprenticeshipService: ITIApprenticeshipService,
  private documentDetailsService: DocumentDetailsService,
  public appsettingConfig: AppsettingService,
  ) { }
  async ngOnInit() {
    this.CollegeApprovedContractForm = this.formBuilder.group({
      DivisionID: [{ value: '', disabled: true }, [DropdownValidators]],
      DistrictID: [{ value: '', disabled: true }, [DropdownValidators]],
      //FinancialYearID: [{value: '0' }, [DropdownValidators]],
       FinancialYearID: [0, [DropdownValidators]],   // ✅ fixed
    })
   
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    if(this.sSOLoginDataModel.RoleID == 212) {
      this.CollegeApprovedContractForm.get('DivisionID')?.enable();
      this.CollegeApprovedContractForm.get('DistrictID')?.enable();
    }
    await this.GetFinancialYear();
    await this.GetDivisionMaster();
    this.request.DistrictID = this.sSOLoginDataModel.DistrictID
    await this.DivisionData_ByDistrict();
    await this.GetDistictData();

    this.request.FinancialYearID = this.sSOLoginDataModel.FinancialYearID;

    await this.GetInstituteMaster();
  }

  get _CollegeApprovedContractForm() { return this.CollegeApprovedContractForm.controls; }
async GetFinancialYear(){
  await this.commonMasterService.GetFinancialYear().then((data: any) => {
  this.FinancialYearList = data.Data;
  console.log(this.FinancialYearList, "FinancialYearList")
});
}
  async GetDivisionMaster() {   
    try {
      await this.commonMasterService.GetDivisionMaster().then((data: any) => {
        this.Divisionlist = data.Data;
      });
    } catch (error) {
      console.error(error);
    }
  }
    async DivisionData_ByDistrict() {
    try {
        
      await this.commonMasterService.DivisionData_ByDistrict(Number(this.request.DistrictID))
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.DivisionData = data.Data[0];
          this.request.DivisionID = this.DivisionData.DivisionID
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
  }
    async GetDistictData() {
    try {
        
      
      // this.request.DistrictID = 0
      // this.Institutelist = [];
      await this.onChange();
      await this.commonMasterService.DistrictMaster_DivisionIDWise(Number(this.request.DivisionID))
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if(data.State === EnumStatus.Success){
            this.Districtlist = data['Data'];
            this.request.DistrictID = this.sSOLoginDataModel.DistrictID
          } else {
            this.Districtlist = [];
          }
          
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
  }
    async onChange() {
    this.Institutelist = [];
    this.request.MonthID = 0;
  }
    GetMonthNumber() {
    let today = new Date();
    let month = today.getMonth() + 1; // January is 0
    return month;
  }
  async GetInstituteMaster() {
    try {
          const curr_month = this.GetMonthNumber();
          if (curr_month <= this.request.MonthID) {
          this.Institutelist = [];
          this.request.MonthID = 0;
          this.toastr.error('Please select correct month as You cannot select future or present month');
          return;
        }   const request: any = {};
      request.DistrictID = this.request.DistrictID;
      request.EndTermID = this.sSOLoginDataModel.EndTermID;
      request.MonthID = this.request.MonthID;
      //request.AcademicYearID = this.sSOLoginDataModel.FinancialYearID;
      request.AcademicYearID=this.request.FinancialYearID;
      request.action = "GetAll";
      await this.apprenticeshipService.GetITI_InstituteList_ApprenticeshipRPT(request).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.Institutelist =data['Data'];
      })
    } catch (error) {
      console.log(error);
    } 
  }
    // exportToExcel(): void {
    //   const unwantedColumns = [
    //    'InstituteID'
    //   ]; 
    //   const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.Institutelist);
    //   // Create a new Excel workbook this.PreExamStudentData
    //   const wb: XLSX.WorkBook = XLSX.utils.book_new();
    //   XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  
    //   // Export the Excel file
    //   XLSX.writeFile(wb, 'ITICollegeApprovedContractReport.xlsx');
    // }
  exportToExcel(): void {
    const unwantedColumns = [
      'InstituteID', 'AcademicYearID'
    ];
    const filteredData = this.Institutelist.map((item: any) => {
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
    const timestamp = new Date().getTime();
    XLSX.writeFile(wb, `ITICollegeApprovedContractReport-${timestamp}.xlsx`);
  }
}
