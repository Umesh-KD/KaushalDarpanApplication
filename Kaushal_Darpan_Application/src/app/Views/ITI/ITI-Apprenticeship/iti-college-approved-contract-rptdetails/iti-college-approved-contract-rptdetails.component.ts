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
  selector: 'app-iti-college-approved-contract-rptdetails',
  standalone:false,
  templateUrl: './iti-college-approved-contract-rptdetails.component.html',
  styleUrl: './iti-college-approved-contract-rptdetails.component.css'
})
export class ItiCollegeApprovedContractRptdetailsComponent {
  public InstituteID: number=0;
  public MonthID: number=0;
  public YearID: number=0;
  public sSOLoginDataModel = new SSOLoginDataModel();
  public request : any = {};
  public Institutelist: any = [];
  public Message: string = '';
  public ErrorMessage: string = '';
  public State: any = false;
  constructor(
    private commonMasterService: CommonFunctionService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private Swal2: SweetAlert2,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private apprenticeshipService: ITIApprenticeshipService,
    private documentDetailsService: DocumentDetailsService,
    public appsettingConfig: AppsettingService,
  ) { }
async ngOnInit() {
  this.InstituteID = Number(this.activatedRoute.snapshot.paramMap.get('instituteId') ?? 0);
  this.MonthID = Number(this.activatedRoute.snapshot.paramMap.get('monthId') ?? 0); 
  this.YearID = Number(this.activatedRoute.snapshot.paramMap.get('yearId') ?? 0); 
  this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
  await this.GetInstituteMaster();
}
async GetInstituteMaster() {
    try { 
      const request: any = {};
      request.DistrictID = this.sSOLoginDataModel.DistrictID;
      request.EndTermID = this.sSOLoginDataModel.EndTermID;
      request.MonthID = this.MonthID;
      request.AcademicYearID = this.YearID;
      request.action = "GetByID";
      request.instituteId=this.InstituteID;
      await this.apprenticeshipService.GetITI_InstituteList_ApprenticeshipRPT(request).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.Institutelist =data['Data'];
      })
    } catch (error) {
      console.log(error);
    } 
  }
  exportToExcel(): void {
        const unwantedColumns = [
         'InstituteID','MonthID','fileUrl'
        ]; 
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.Institutelist);
        // Create a new Excel workbook this.PreExamStudentData
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    
        // Export the Excel file
        XLSX.writeFile(wb, 'ITICollegeApprovedContractMonthWiseReport.xlsx');
  }
}
