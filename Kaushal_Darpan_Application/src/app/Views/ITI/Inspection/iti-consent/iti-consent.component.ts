import { Component } from '@angular/core';
import { EnumStatus, GlobalConstants } from '../../../../Common/GlobalConstants';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import {
         InspectionMemberDetailsDataModel, ITI_InspectionDataModel,
         ITI_InspectionSearchModel, ConsentModel, CenterMasterDDLDataModel
       } from '../../../../Models/ITI/ITI_InspectionDataModel';
import { FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ITIInspectionService } from '../../../../Services/ITI/ITI-Inspection/iti-inspection.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { HttpClient } from '@angular/common/http';
import { AppsettingService } from '../../../../Common/appsetting.service';

@Component({
  selector: 'app-iti-consent',
  standalone: false,
  templateUrl: './iti-consent.component.html',
  styleUrl: './iti-consent.component.css'
})
export class ITIConsentComponent {
  public sSOLoginDataModel = new SSOLoginDataModel();
  searchRequest = new ITI_InspectionSearchModel();
  public request = new ITI_InspectionDataModel();
  public requestMember = new InspectionMemberDetailsDataModel();
  public consentForm!: FormGroup;
  public consentRequest = new ConsentModel();
  public ConsentData: any = [];
  public InstituteMasterDDL: any = [];
  public DistrictMasterDDL: any = [];
  requestCenter = new CenterMasterDDLDataModel();
  public consentDeploy = new ConsentModel();
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  public Table_SearchText: string = '';
  constructor(
    private itiInspectionService: ITIInspectionService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private Swal2: SweetAlert2,
    private http: HttpClient,
    private appsettingConfig: AppsettingService
  ) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    
    this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID
    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID
    
    this.GetAllData()
    this.getMasterData()
  }

  async ResetControl() {
    this.searchRequest = new ITI_InspectionSearchModel();
    this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID
    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID
    this.searchRequest.UserID = this.sSOLoginDataModel.UserID
    this.searchRequest.LevelId = this.sSOLoginDataModel.LevelId
    this.GetAllData();
  }
  async GetAllData() {
    debugger
    try {
      this.loaderService.requestStarted();
     
      this.consentRequest.UserID = this.sSOLoginDataModel.UserID
      this.consentRequest.DistrictID = this.consentDeploy.DistrictID;
      this.consentRequest.InstituteID = this.consentDeploy.InstituteID;

      await this.itiInspectionService.GetAllConsentData(this.consentRequest).then((data: any) => {
     
        data = JSON.parse(JSON.stringify(data));
        if(data.State === EnumStatus.Success){
          this.ConsentData = data.Data
          console.log("Consent Data ==>", this.ConsentData)
        } else if (data.State === EnumStatus.Warning) {
          this.toastr.warning(data.Message);
        } else {
          this.toastr.error(data.ErrorMessage);
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

  async GetInstitute_ById(id: number): Promise<any> {
    try {
      const data = await this.itiInspectionService.GetById_Team(id);
      return JSON.parse(JSON.stringify(data));
    } catch (error) {
      console.log(error);
      return null;
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async DownloadPdf(FileName: string) {
    debugger;
    const fileUrl = this.appsettingConfig.StaticFileRootPathURL + "/" + GlobalConstants.ReportsFolder + "/" + FileName;; 
    this.http.get(fileUrl, { responseType: 'blob' }).subscribe((blob: any) => {
      const downloadLink = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.download = "InspectionDutyOrder.pdf"; 
      downloadLink.click();
      window.URL.revokeObjectURL(url);
    });
  }
  
  async getMasterData() {
    debugger
    try {

      this.searchRequest.LevelId = this.sSOLoginDataModel.LevelId;
      this.searchRequest.DistrictID = this.sSOLoginDataModel.DistrictID;
      this.searchRequest.UserID = this.sSOLoginDataModel.UserID;
      await this.itiInspectionService.GetDistrictMaster(this.searchRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.DistrictMasterDDL = data.Data;
        console.log('District ==>', this.DistrictMasterDDL)
      })

    } catch (error) {
      console.error(error);
    }
  }

  GetInstituteMaster_ByDistrictWise(ID: any) {
    this.requestCenter.action = 'GetInstituteMaster_ByDistrictWise'
    this.requestCenter.DistrictID = ID;
    this.itiInspectionService.GetITIInspectionDropdown(this.requestCenter).then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      this.InstituteMasterDDL = data.Data;
      console.log("this.InstituteMasterDDL", this.InstituteMasterDDL)
    })
  }


  onSort(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.ConsentData = [...this.ConsentData.sort((a: any, b: any) => {
      let valA = a[column];
      let valB = b[column];
      if (valA == null) valA = '';
      if (valB == null) valB = '';

      if (column.toLowerCase().includes('date')) {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      } else {
        valA = valA.toString().toLowerCase();
        valB = valB.toString().toLowerCase();
      }

      if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    })];
  }
}

