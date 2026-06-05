import { Component } from '@angular/core';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { ITIGovtEMStaffMaster } from '../../../../Services/ITIGovtEMStaffMaster/ITIGovtEMStaffMaster.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ItiSeatIntakeService } from '../../../../Services/ITI/ItiSeatIntake/iti-seat-intake.service';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { HiringRoleMasterService } from '../../../../Services/HiringRoleMaster/hiring-role-master.service';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { ITIOfficeVacancyModel } from '../../../../Models/ITIGovtEMStaffMasterDataModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
import { ItiTradeSearchModel } from '../../../../Models/CommonMasterDataModel';
import { EnumRole, EnumStatus } from '../../../../Common/GlobalConstants';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


@Component({
  selector: 'app-office-vacancy-list',
  standalone: false,
  templateUrl: './office-vacancy-list.component.html',
  styleUrl: './office-vacancy-list.component.css'
})





export class OfficeVacancyListComponent {

  public sSOLoginDataModel = new SSOLoginDataModel(); 
  public SearchData = new ITIOfficeVacancyModel();
  OfficeVacancyList: ITIOfficeVacancyModel[] = [];
  public groupForm!: FormGroup;
  public formData = new ITIOfficeVacancyModel();
  public OfficeList: any[] = [];
  public InstituteMasterDDLList: any = [];
  public tradeSearchRequest = new ItiTradeSearchModel();
  public TradeList: any[] = [];
  public PostList: any = [];
  public StaffTypeList: any[] = [];
  public DataExcel: any = [];

  constructor(
    private commonMasterService: CommonFunctionService, 
    private ITIGovtEMStaffMaster: ITIGovtEMStaffMaster, 
    private toastr: ToastrService, 
    private loaderService: LoaderService, 
    private formBuilder: FormBuilder, 
    private activatedRoute: ActivatedRoute, 
    private routers: Router, 
    private modalService: NgbModal, 
    private Swal2: SweetAlert2,
    private ITICollegeTradeService: ItiSeatIntakeService, 
    private ScholarshipService: HiringRoleMasterService,
  ) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
  
    this.groupForm = this.formBuilder.group({
      OfficeID: [0, []],
      InstituteID: [0, []],
      TradeID: [0, []],
      DesignationID: [0, []],     
      StaffTypeID: [0, []],     
    });


    // if(this.sSOLoginDataModel.RoleID == EnumRole.ITIPrincipal || this.sSOLoginDataModel.RoleID == EnumRole.Principal_NCVT) {
    //   this.formData.OfficeID = 11;
    //   this.formData.InstituteID = this.sSOLoginDataModel.InstituteID

    //   this.groupForm.get('OfficeID')?.disable();
    //   this.groupForm.get('InstituteID')?.disable();
    // } else {
    //   this.groupForm.get('OfficeID')?.enable();
    //   this.groupForm.get('InstituteID')?.enable();
    // }

    await this.GetPostList();
    await this.GetOfficeList();
    await this.GetStaffTypeData();
    await this.GetTradeData();
    await this.GetInstitute();
    await this.OfficeVacancyDataList();    
  }
  get _groupForm() { return this.groupForm.controls;}

  async GetOfficeList() {


    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.DDL_ITI_GovtEMDDLOfficeVacancy(this.sSOLoginDataModel.DepartmentID, 0)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.OfficeList = data['Data'];
          console.log(this.OfficeList, "OfficeList");
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

  async GetInstitute() {
    await this.commonMasterService
      .InstituteMaster(
        this.sSOLoginDataModel.DepartmentID,
        this.sSOLoginDataModel.Eng_NonEng,
        this.sSOLoginDataModel.EndTermID
      )
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));

        //  Filter only InstitutionManagementTypeID = 1
        this.InstituteMasterDDLList = data.Data;

        console.log("Filtered Institute Master List ==>", this.InstituteMasterDDLList);
      });
  }

  async GetTradeData() {
    this.tradeSearchRequest.action = 'Posttrade'
    
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.TradeListGetAllData(this.tradeSearchRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.TradeList = data.Data
        console.log(this.TradeList, "ItiTradeListAll")
      })

      //this.collegeSearchRequest.action = '_getAllData'
      //await this.commonFunctionService.ItiCollegesGetAllData(this.collegeSearchRequest).then((data: any) => {
      //  data = JSON.parse(JSON.stringify(data));
      //  this.ItiCollegesListAll = data.Data
      //  console.log(this.ItiCollegesListAll, "ItiCollegesListAll")
      //})
    } catch (error) {
      console.error(error)
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async GetPostList() {
    try {

      this.loaderService.requestStarted();
      const data: any = await this.commonMasterService.GetCommonMasterData('PostMaster', this.formData.StaffTypeID);
      this.PostList = data['Data'];
      //this.PostList = this.PostList.filter((item: any) => item.TypeID == this.formData.StaffTypeID);
      // Keep original list for filtering later
      console.log(this.PostList, "PostList");
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async GetStaffTypeData() {

    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterData('PostType').then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.StaffTypeList = data.Data;
      });
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }
  async fillupDesignation() {


    await this.GetPostList();
  }

  async OfficeVacancyDataList() {

    try {
      this.loaderService.requestStarted();
      this.formData.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.formData.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.formData.RoleID = this.sSOLoginDataModel.RoleID;
      this.formData.UserID = this.sSOLoginDataModel.UserID;

      await this.ITIGovtEMStaffMaster.ITI_OfficeVacancyReport(this.formData)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.OfficeVacancyList = data['Data'];
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

  async GetTradeDDl() {
    debugger
    try {
      this.loaderService.requestStarted();

      this.tradeSearchRequest.CollegeID = this.formData.InstituteID

      this.GetTradeData();

    }
    catch (error) {
      console.error(error);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  async Search() {
    debugger
    try {
      this.loaderService.requestStarted();
      this.formData.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.formData.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.formData.TradeID = this.groupForm.get('TradeID')?.value;
      this.formData.StaffTypeID = this.groupForm.get('StaffTypeID')?.value;
 
     
      await this.ITIGovtEMStaffMaster.ITI_OfficeVacancyReport(this.formData)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.OfficeVacancyList = data['Data'];
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

  async Clear() {
    this.formData = new ITIOfficeVacancyModel();
    this.formData.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.formData.EndTermID = this.sSOLoginDataModel.EndTermID;
    await this.OfficeVacancyDataList();

  }

  async exportExcelData() {
    try {
      this.loaderService.requestStarted();

      const response: any = await this.ITIGovtEMStaffMaster.ITI_OfficeVacancyReport(this.formData);

      const data = JSON.parse(JSON.stringify(response));

      this.OfficeVacancyList = data?.Data || [];
      this.DataExcel = data?.Data || [];

      if (!this.DataExcel.length) {
        this.toastr.error("No data available for export.");
        return;
      }

      const unwantedColumns = [
        "CreatedBy", "ID", "OfficeID", "InstituteID", "DesignationID",
        "DepartmentID", "TradeID", "EndTermId", "CourseTypeID", "DeleteStatus", "ModifyBy",
        "ModifyDate", "IPAddress", "StaffTypeID", "RTS", "ActiveStatus"
      ];

      const filteredData = this.DataExcel.map((item: any) => {
        const filteredItem: any = {};
        Object.keys(item).forEach(key => {
          if (!unwantedColumns.includes(key)) {
            filteredItem[key] = item[key];
          }
        });
        return filteredItem;
      });

      if (!filteredData.length) {
        this.toastr.error("No columns left after filtering.");
        return;
      }

      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
      const keys = Object.keys(filteredData[0]);

      const MIN_WIDTH = 8;
      const PADDING = 2;

      const columnWidths = keys.map(key => {
        let maxLength = key.length;

        filteredData.forEach((row: any) => {
          let text = row[key] ?? "";

          if (typeof text === "object") {
            text = JSON.stringify(text);
          }

          const longestLine = String(text)
            .split(/\r?\n/)
            .reduce((a, b) => (a.length > b.length ? a : b), "");

          maxLength = Math.max(maxLength, longestLine.length);
        });

        return { wch: Math.max(MIN_WIDTH, maxLength + PADDING) };
      });

      ws['!cols'] = columnWidths;
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      const now = new Date();
      const y = now.getFullYear();
      const m = String(now.getMonth() + 1).padStart(2, '0');
      const d = String(now.getDate()).padStart(2, '0');
      const fileName = `OfficeVacancyReport_${y}-${m}-${d}.xlsx`;


      XLSX.writeFile(wb, fileName);

    } catch (error) {
      console.error(error);
      this.toastr.error("Export failed. See console for details.");
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }
  exportToPDF(): void {

    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');

    doc.text(
      'Office Vacancy List',
      pageWidth / 2,
      10,
      { align: 'center' }
    );

    const body = this.OfficeVacancyList.map((row: any, index: number) => [
      index + 1,
      row.OfficeName || '',
      row.StaffTypeName || '',
      row.InstituteName || '',
      row.DesignationName || '',
      row.TotalSeatID || '',
      row.PostedSeat || '',
      row.RemainingSeatID || '',
      row.OrderName || '',
      row.Comments || ''
    ]);

    autoTable(doc, {
      startY: 18,

      head: [[
        'S No',
        'Office Name',
        'Service Category(Cadre)',
        'Institute Name',
        'Name of Post',
        'No. of Post Sanctioned',
        'Deployed Post',
        'Vacant Seat',
        'Order No',
        'Comments'
      ]],

      body,

      theme: 'grid',

      styles: {
        fontSize: 7,
        cellPadding: 1.5,
        textColor: [0, 0, 0],
        fillColor: [255, 255, 255],
        lineColor: [0, 0, 0],
        lineWidth: 0.1,
        overflow: 'linebreak'
      },

      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontStyle: 'bold'
      },

      columnStyles: {
        1: { cellWidth: 35 },
        2: { cellWidth: 25 },
        3: { cellWidth: 40 },
        4: { cellWidth: 25 },
        9: { cellWidth: 35 }
      },

      didDrawPage: function () {
        const pageSize = doc.internal.pageSize;
        const pageHeight = pageSize.height || pageSize.getHeight();

        const today = new Date().toLocaleString('en-IN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });

        doc.setFontSize(8);

        // Bottom Left
        doc.text(
          `Generated On: ${today}`,
          10,
          pageHeight - 5
        );

        // Bottom Right - Page Number
        doc.text(
          `Page ${doc.getCurrentPageInfo().pageNumber}`,
          pageSize.getWidth() - 20,
          pageHeight - 5
        );
      }
    });

    doc.save('OfficeVacancyList.pdf');
  }

  exportToExcel() {
    const excelData = this.OfficeVacancyList.map((item: any, index: number) => ({
      'S.No': index + 1,
      'Office Name': item.OfficeName,
      'Service Category(Cadre)': item.StaffTypeName,
      'Institute Name': item.InstituteName,
      'Name of Post': item.DesignationName,
      'No. of Post Sanctioned': item.TotalSeatID,
      'Deployed Post': item.PostedSeat,
      'Vacant Seat': item.RemainingSeatID,
      'Order No': item.OrderName,
      'Comments': item.Comments
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(excelData);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Office Vacancy': worksheet },
      SheetNames: ['Office Vacancy']
    };

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array'
    });

    const data = new Blob(
      [excelBuffer],
      { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
    );

    saveAs(data, 'Office_Vacancy_Report.xlsx');
  }


}
