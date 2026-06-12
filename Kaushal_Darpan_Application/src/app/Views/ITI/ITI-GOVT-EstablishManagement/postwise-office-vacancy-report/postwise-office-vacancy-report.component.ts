import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ToastrService } from 'ngx-toastr';
import { ITIOfficeVacancyModel } from '../../../../Models/ITIGovtEMStaffMasterDataModel';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { ITIGovtEMStaffMaster } from '../../../../Services/ITIGovtEMStaffMaster/ITIGovtEMStaffMaster.service';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';

@Component({
  selector: 'app-postwise-office-vacancy-report',
  standalone: false,
  templateUrl: './postwise-office-vacancy-report.component.html',
  styleUrl: './postwise-office-vacancy-report.component.css'
})
export class PostwiseOfficeVacancyReportComponent {
  public sSOLoginDataModel = new SSOLoginDataModel(); 
  public SearchData = new ITIOfficeVacancyModel();

  OfficeVacancyList: ITIOfficeVacancyModel[] = [];
  PostList: any = [];
  public StaffTypeList: any[] = []

  constructor(
    private ITIGovtEMStaffMaster: ITIGovtEMStaffMaster, 
    private toastr: ToastrService, 
    private loaderService: LoaderService, 
    private commonMasterService: CommonFunctionService,
  ) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetStaffTypeData();
    await this.GetPostList();
    await this.GetVacancyReportPostWise();
  }

  async GetVacancyReportPostWise() {
    try {
      const searchRequest: any = {};
      searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      searchRequest.RoleID = this.sSOLoginDataModel.RoleID;
      searchRequest.UserID = this.sSOLoginDataModel.UserID;
      searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID;
      searchRequest.OfficeID = this.sSOLoginDataModel.OfficeID;
      searchRequest.PostTypeID = this.SearchData.StaffTypeID;
      searchRequest.PostID = this.SearchData.DesignationID;

      await this.ITIGovtEMStaffMaster.GetVacancyReportPostWise(searchRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.OfficeVacancyList = data['Data'];
      })
    } catch (error) {
      console.error(error);
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

  async GetPostList() {
    try {

      this.loaderService.requestStarted();
      const data: any = await this.commonMasterService.GetCommonMasterData('PostMaster', this.SearchData.StaffTypeID);
      this.PostList = data['Data'];
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async ResetControl() {
    this.SearchData = new ITIOfficeVacancyModel();
    this.GetPostList();
    this.GetVacancyReportPostWise();
  }
  exportToExcel() {
    const excelData = this.OfficeVacancyList.map((item: any, index: number) => ({
      'S.No': index + 1,
      'Service Category(Cadre)': item.ServiceCategory,
      'Name of Post': item.NameOfPost,
      'No. of Post Sanctioned': item.TotalSanctionedPost,
      'Deployed Post': item.DeployedPost,
      'Vacant Post': item.VacantPost,
      'Additional Post': item.AdditionalPostCount,
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
      row.ServiceCategory || '',
      row.NameOfPost || '',
      row.TotalSanctionedPost || '',
      row.DeployedPost || '',
      row.VacantPost || '',
      row.AdditionalPostCount || ''
    ]);

    autoTable(doc, {
      startY: 18,

      head: [[
        'S No',
        'Service Category(Cadre)',
        'Name of Post',
        'No. of Post Sanctioned',
        'Deployed Post',
        'Vacant Post',
        'Additional Post'
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
}
