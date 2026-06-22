import { Component } from '@angular/core';
import { EnumInspectionDeploymentType, EnumRole, EnumStatus, GlobalConstants } from '../../../../Common/GlobalConstants';
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
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';

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
  public StatusHistoryList:any=[];
  requestCenter = new CenterMasterDDLDataModel();
  // public consentDeploy = new ConsentModel();
  modalReference: NgbModalRef | undefined;
  _EnumInspectionDeploymentType = EnumInspectionDeploymentType;
  _EnumRole = EnumRole;

  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  public Table_SearchText: string = '';
  constructor(
    private itiInspectionService: ITIInspectionService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private Swal2: SweetAlert2,
    private http: HttpClient,
    private appsettingConfig: AppsettingService,
    private modalService: NgbModal,
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
    this.consentRequest.InstituteID= 0
    this.consentRequest.DistrictID= 0
    this.consentRequest.TentativeDate= ''
    this.consentRequest.consentTypeID= 0
    this.GetAllData();
  }
  async GetAllData() {
    debugger
    try {
      this.loaderService.requestStarted();
     
      this.consentRequest.UserID = this.sSOLoginDataModel.UserID
      this.consentRequest.DistrictID //= this.consentDeploy.DistrictID;
      this.consentRequest.InstituteID //= this.consentDeploy.InstituteID;
      this.consentRequest.EndTermID = this.sSOLoginDataModel.EndTermID
      this.consentRequest.FinancialYearID=this.sSOLoginDataModel.FinancialYearID

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

  exportToExcel(): void {
    const unwantedColumns = ['ActiveStatus', 'DeleteStatus', 'CreatedBy', 'ModifyBy', 'ModifyDate', 'IPAddress', 'InspectionTeamID', 'ZoneID', 'DistrictID', 'InstituteID', 'EndTermID','FinancialYearID',];
    const filteredData = this.ConsentData.map((item: any) => {
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

    const today = new Date();
    const dateStr = today.toLocaleDateString('en-GB').split('/').join('-');

    const fileName = `ConsentDetails_${dateStr}.xlsx`;

    XLSX.writeFile(wb, fileName);
  }

  exportToPDF() {
    const doc = new jsPDF('l', 'mm', 'a4');

    // Heading
    const pageWidth = doc.internal.pageSize.getWidth();

    const today = new Date().toLocaleDateString('en-GB');


    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(
      'ITI Consent List',
      pageWidth / 2,
      10,
      { align: 'center' }
    );

    doc.setFontSize(9);
    doc.text(
      `Total Records : ${this.ConsentData.length}`,
      pageWidth - 20,
      10,
      { align: 'right' }
    );


    const body = this.ConsentData.map((row: any, index: number) => [
      index + 1,
      //`${row.Code || ''} (${row.Name || ''})`,  //concate in one column
      row.DistrictName || '',
      row.InstituteName || '',
      row.consentTypeID === 1 ? 'Planned (Affiliation)' : (row.consentTypeID === 3 ? 'General Inspection (Planned)' : ''),
      row.TentativeDate || '',
      row.UpdatedDate ,
      row.status == 0 ? 'Pending' : (row.status == 1 ? 'Approved' : (row.status == 2 ? 'Rejected' : '')),      
      //row.campusName || '',
      //row.ActiveStatus ? 'Active' : 'Inactive'
    ]);

    autoTable(doc, {
      startY: 18,

      head: [[
        'Sr No',
        'District',
        'Institute Name',
        'Consent Type',
        'Tentative Date',
        'Updated Date',
        'Status',
        //'Campus Name',
        //'Status'
      ]],

      body,

      theme: 'grid',

      styles: {
        fontSize: 7,
        textColor: [0, 0, 0],
        fillColor: [255, 255, 255],
        lineColor: [0, 0, 0],
        lineWidth: 0.1
      },

      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontStyle: 'bold'
      },

    });


    //(Page X of Y) : show pages at footer
    const totalPages = doc.getNumberOfPages();

    for (let i = 1; i <= totalPages; i++) {

      doc.setPage(i);

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      doc.setFontSize(8);

      doc.text(
        `Page ${i} of ${totalPages}`,
        pageWidth / 2,
        pageHeight - 5,
        { align: 'center' }
      );

      doc.text(
        `Generated On: ${today}`,
        10,
        pageHeight - 5
      );
    }

    doc.save('ITI Consent List.pdf');
  }


  //exportToExcel(): void {
  //  const wantedColumns = [
  //    'CollegeCode', 'CollegeName', 'TradeCode', 'TradeName', 'Shift', 'Unit_no', 'NCVT_SCVT',
  //    'Sanctioned', 'Sanction_Order', 'OrderDate', 'Remark', 'NoOfSanctionedSeats',
  //    'aff_date', 'wef_aff', 'file_ref', 'deaff_order', 'deaff_date', 'de_aff_wef', 'Key'
  //  ];

  //  const filteredData = this.ConsentData.map((item: any) => {
  //    const obj: any = {};
  //    wantedColumns.forEach(col => obj[col] = item[col] ?? '');
  //    return obj;
  //  });

  //  const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);

  //  // 🔥 Auto-fit column width
  //  ws['!cols'] = wantedColumns.map(col => {
  //    const maxLen = Math.max(
  //      col.length,
  //      ...filteredData.map((row: any) => String(row[col]).length)
  //    );

  //    return {
  //      wch: Math.min(maxLen + 3, 40) // auto + limit width
  //    };
  //  });

  //  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  //  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  //  XLSX.writeFile(wb, `ConsentDetails_${new Date().toISOString().split('T')[0]}.xlsx`);
  //}


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

  async DeleteConsentByID(id:number){
    //debugger;
    try {
      this.loaderService.requestStarted();
      await this.itiInspectionService.DeleteConsentByID(id,this.sSOLoginDataModel.UserID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if(data.State === EnumStatus.Success){
          this.toastr.success(data.Message);
          this.GetAllData();
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

  async onStatusHistorylist (model: any, InspectionConsentID: number) {
     
    try {
      this.loaderService.requestStarted();

      await await this.itiInspectionService.GetHistoryDataById_Team(InspectionConsentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.StatusHistoryList = data.Data;
          //this.UserProfileStatusHistoryList=this.UserProfileStatusHistoryList.filter((item:any)=>item.UserProfileStatus==='Revert');

        }, (error: any) => console.error(error))

      this.modalReference = this.modalService.open(model, { size: 'lg', backdrop: 'static' });
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

  CloseModalProfileStatuslist() {
    this.modalService.dismissAll();
    this.modalReference?.close();
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

