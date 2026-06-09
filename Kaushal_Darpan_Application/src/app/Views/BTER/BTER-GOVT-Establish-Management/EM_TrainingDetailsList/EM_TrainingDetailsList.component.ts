import { Component } from '@angular/core';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { EnumRole, EnumStaffTrainingStatus, EnumStatus, GlobalConstants } from '../../../../Common/GlobalConstants';
import { StaffTrainingDetailDataModel, StaffTrainingDetailSearchData } from '../../../../Models/BTER/BTER_EstablishManagementDataModel';
import { BTEREstablishManagementService } from '../../../../Services/BTER/BTER-EstablishManagement/bter-establish-management.service';
import { BTEREMStaffServiceDetailsService } from '../../../../Services/BTER/BTER_EM_StaffServiceDetails/bter-em-staff-service-details.service';
import { DropdownValidators1 } from '../../../../Services/CustomValidators/custom-validators.service';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { UploadFileModel } from '../../../../Models/UploadFileModel';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
@Component({
  selector: 'app-EM_TrainingDetailsList',
  standalone: false,
  templateUrl: './EM_TrainingDetailsList.component.html',
  styleUrl: './EM_TrainingDetailsList.component.css'
})
export class EM_TrainingDetailsListComponent {
  public sSOLoginDataModel = new SSOLoginDataModel();
  public request = new StaffTrainingDetailDataModel();
  public searchRequest = new StaffTrainingDetailSearchData();

  public AddTrainingDetailsFromGroup!: FormGroup;
  public TrainingDocFromGroup!: FormGroup;

  public EM_TrainingCourseTypeList: any = [];
  public StaffTrainingDetailsDataList: any = [];
  public StaffTrainingDetailsCompletedTrainingDataList: any = [];
  public StaffTrainingDetailsNewTrainingDataList: any = [];
  public StaffTrainingStatusSearchList: any[] = [];
  isSubmitted: boolean = false;
  Table_SearchText: string = '';
  public file!: File;
  public Uploadfile: string = '';
  modalReference: NgbModalRef | undefined;
  public StaffTrainingHTS_GetDataList: any = [];
  isTrainingCom: boolean = false;
  public ID: number = 0;
  public listType: string = '';
  isDashboard: boolean = false;
  public SearchStatus: number = 0;


  constructor(
    private toastr: ToastrService,
    private commonFunctionService: CommonFunctionService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    private bterEstablishManagementService: BTEREstablishManagementService,
    private staffServiceDetailsService: BTEREMStaffServiceDetailsService,
    private appsettingConfig: AppsettingService,
    private modalService: NgbModal,
  ) { }

  async ngOnInit() {
    debugger
    
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetEM_TrainingCourseType();
    await this.StaffTrainingDetailsCompletedTraining_GetData();
    await this.StaffTrainingDetailsNewTraining_GetData();
    this.ID = Number(this.activatedRoute.snapshot.queryParamMap.get('status'));
    this.listType = this.activatedRoute.snapshot.queryParamMap.get('ListType') ?? '';

    if (this.ID > 0 && this.listType.trim()) {
      this.isDashboard = true;
      this.SearchStatus = this.ID;
    } else {
      this.isDashboard = false;
      this.SearchStatus = 0;
    }

    await this.commonFunctionService.GetCommonMasterDDLByType('StaffTrainingStatus')
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        
        this.StaffTrainingStatusSearchList = data['Data'];

        if (this.sSOLoginDataModel.RoleID == EnumRole.Principal || this.sSOLoginDataModel.RoleID == EnumRole.PrincipalNon) {
          
          this.StaffTrainingStatusSearchList = this.StaffTrainingStatusSearchList.filter((item: any) => item.ID == EnumStaffTrainingStatus.Reject || item.ID == EnumStaffTrainingStatus.Applied || item.ID == EnumStaffTrainingStatus.PrincipalApprove)

          this.StaffTrainingDetailsNewTraining_Search(this.SearchStatus);
          this.StaffTrainingDetailsCompletedTraining_Search(this.SearchStatus);
        }
        else if (this.sSOLoginDataModel.RoleID == EnumRole.EM_ADTE_GAZETTED_STAFF || this.sSOLoginDataModel.RoleID == EnumRole.EM_ADTE_NON_GAZETTED_STAFF) {
          
          
          this.StaffTrainingStatusSearchList =
            this.StaffTrainingStatusSearchList
              .filter((item: any) =>
                item.ID == EnumStaffTrainingStatus.Reject ||
                item.ID == EnumStaffTrainingStatus.PrincipalApprove ||
                item.ID == EnumStaffTrainingStatus.ADTE
              )
              .map((item: any) => {
                if (item.ID == EnumStaffTrainingStatus.PrincipalApprove) {
                  return {
                    ...item,
                    Name: 'Under Review'
                  };
                }
                return item;
              });
          
          this.StaffTrainingDetailsNewTraining_Search(this.SearchStatus);
          this.StaffTrainingDetailsCompletedTraining_Search(this.SearchStatus);
        }
        else if (this.sSOLoginDataModel.RoleID == EnumRole.EM_JDTE) {
          debugger
          this.StaffTrainingStatusSearchList =
            this.StaffTrainingStatusSearchList
              .filter((item: any) =>
                item.ID == EnumStaffTrainingStatus.Reject ||
                item.ID == EnumStaffTrainingStatus.JDTE ||
                item.ID == EnumStaffTrainingStatus.ADTE
              )
              .map((item: any) => {

                if (item.ID == EnumStaffTrainingStatus.ADTE) {
                  return {
                    ...item,
                    Name: 'Under Review'
                  };
                }

                return item;
              });
          
          this.StaffTrainingDetailsNewTraining_Search(this.SearchStatus);
          this.StaffTrainingDetailsCompletedTraining_Search(this.SearchStatus);
        }
        else if (this.sSOLoginDataModel.RoleID == EnumRole.DTE) {
          
          this.StaffTrainingStatusSearchList =
            this.StaffTrainingStatusSearchList
              .filter((item: any) =>
                item.ID == EnumStaffTrainingStatus.Reject || item.ID == EnumStaffTrainingStatus.JDTE || item.ID == EnumStaffTrainingStatus.DTE
              )
              .map((item: any) => {

                if (
                  item.ID == EnumStaffTrainingStatus.JDTE
                ) {
                  return {
                    ...item,
                    Name: 'Under Review'
                  };
                }

                return item;
              });
          
          this.StaffTrainingDetailsNewTraining_Search(this.SearchStatus);
          this.StaffTrainingDetailsCompletedTraining_Search(this.SearchStatus);
        } else {
          
          this.StaffTrainingDetailsNewTraining_Search(this.SearchStatus);
          this.StaffTrainingDetailsCompletedTraining_Search(this.SearchStatus);
        }

      }, (error: any) => console.error(error));
  }

  get _AddTrainingDetailsFromGroup() { return this.AddTrainingDetailsFromGroup.controls; }

  async GetEM_TrainingCourseType() {
    try {
      await this.commonFunctionService.GetCommonMasterData('EM_TrainingCourseType')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.EM_TrainingCourseTypeList = data['Data'];
        }, (error: any) => console.error(error)
      );
    } catch (error) {
      console.error(error);
    }
  }
  
  async StaffTrainingDetailsCompletedTraining_GetData() {
    debugger
    try {
      this.searchRequest.StaffID = this.sSOLoginDataModel.StaffID
      this.searchRequest.UserID = this.sSOLoginDataModel.UserID
      this.searchRequest.Action = "GetCompletedTrainingList";

      await this.staffServiceDetailsService.StaffTrainingDetails_GetData(this.searchRequest).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State === EnumStatus.Success) {
          this.StaffTrainingDetailsCompletedTrainingDataList = data.Data;
          if (this.SearchStatus != 0) {
            this.StaffTrainingDetailsCompletedTrainingDataList = this.StaffTrainingDetailsCompletedTrainingDataList.filter((item: any) => item.StatusID == this.SearchStatus)
          } else {
            this.StaffTrainingDetailsCompletedTrainingDataList = data.Data;
          }
        }
      })
    } catch (error) {
      console.error(error);
    }
  }
  async onEmtrainingStatusHistory(model: any, StaffTrainingDetailId: number) {
    debugger
    try {
      this.loaderService.requestStarted();
      this.StaffTrainingHTS_GetData(StaffTrainingDetailId)
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


  async StaffTrainingHTS_GetData(id: number) {
    try {
      debugger
      this.searchRequest.StaffTrainingDetailID = id;
      await this.staffServiceDetailsService.StaffTrainingHTS_GetData(this.searchRequest).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State === EnumStatus.Success) {
          this.StaffTrainingHTS_GetDataList = data.Data;
        }
        else {
          this.StaffTrainingHTS_GetDataList = [];
        }
      })
    } catch (error) {
      console.error(error);
    }
  }

  CloseModal() {
    this.modalService.dismissAll();
    this.modalReference?.close();
  }

  exportToExcelNew(): void {

    if (this.StaffTrainingDetailsNewTrainingDataList.length == 0) {
      this.toastr.warning('No records available for Excel export.');
      return;
    }

    const unwantedColumns = [
      'StaffTrainingDetailID',
      'StaffID',
      'UserID',
      'StaffTypeID',
      'StatusID',
      'ISNonGazetted',
      'RoleID',
      'StaffUserID'
    ];

    const filteredData = this.StaffTrainingDetailsNewTrainingDataList.map(
      (item: any, index: number) => {

        const filteredItem: any = {};

        // Add Serial Number
        filteredItem["Sr. No"] = index + 1;

        Object.keys(item).forEach(key => {
          if (!unwantedColumns.includes(key)) {
            filteredItem[key] = item[key];
          }
        });

        return filteredItem;
      });

    const ws: XLSX.WorkSheet =
      XLSX.utils.json_to_sheet(filteredData);

    const wb: XLSX.WorkBook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, 'Report');

    const timestamp = new Date()
      .toISOString()
      .replace(/[:.-]/g, '_');

    XLSX.writeFile(
      wb,
      `StaffDetailsNewTraining_${timestamp}.xlsx`
    );
  }

  exportToExcelCom(): void {

    const unwantedColumns = [
      'StaffTrainingDetailID',
      'StaffID',
      'UserID',
      'StaffTypeID',
      'StatusID',
      'ISNonGazetted',
      'RoleID',
      'StaffUserID'
    ];

    if (this.StaffTrainingDetailsCompletedTrainingDataList.length == 0) {
      this.toastr.warning('No records available for Excel export.');
      return;
    }

    const filteredData = this.StaffTrainingDetailsCompletedTrainingDataList.map(
      (item: any, index: number) => {

        const filteredItem: any = {};

        // Add Serial Number
        filteredItem["Sr. No"] = index + 1;

        Object.keys(item).forEach(key => {
          if (!unwantedColumns.includes(key)) {
            filteredItem[key] = item[key];
          }
        });

        return filteredItem;
      });

    const ws: XLSX.WorkSheet =
      XLSX.utils.json_to_sheet(filteredData);

    const wb: XLSX.WorkBook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, 'Report');

    const timestamp = new Date()
      .toISOString()
      .replace(/[:.-]/g, '_');

    XLSX.writeFile(
      wb,
      `StaffDetailsCompletedTraining_${timestamp}.xlsx`
    );
  }

  exportToPDFNew() {

    const doc = new jsPDF('l', 'mm', 'a4');

    // Heading
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(
      'Staff  Details New Training List',
      pageWidth / 2,
      10,
      { align: 'center' }
    );

    const body = this.StaffTrainingDetailsNewTrainingDataList.map((row: any, index: number) => [
      index + 1,
      row.SSOID ?? '',
      row.StaffName ?? '',
      row.OrganizinglnstituteName ?? '',
      row.TrainingCourseType_str ?? '',
      row.TrainingCourseName ?? '',
      row.DurationUnit_str ?? '',
      row.Duration ?? '',
      `${row.StartDate ?? ''} - ${row.EndDate ?? ''}`,
      row.Venue ?? '',
      row.ModeOfTraining_str ?? '',
      row.Venue ?? '',
      row.IsNodal ?? ''
    ]);

    autoTable(doc, {
      startY: 18,

      head: [[
        'Sr. No.',
        'SSOID',
        'Name',
        'Organizing lnstitute Name',
        'Course Type',
        'Course Name',
        'Duration Unit',
        'Duration',
        'Start Date - End Date',
        'Venue',
        'Mode Of Training'
        
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
      }
    });

    doc.save('StaffDetailsNewTrainingList.pdf');
  }

  exportToPDFCom() {

    const doc = new jsPDF('l', 'mm', 'a4');

    // Heading
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(
      'Staff  Details Completed Training List',
      pageWidth / 2,
      10,
      { align: 'center' }
    );

    const body = this.StaffTrainingDetailsCompletedTrainingDataList.map((row: any, index: number) => [
      index + 1,
      row.SSOID ?? '',
      row.StaffName ?? '',
      row.OrganizinglnstituteName ?? '',
      row.TrainingCourseType_str ?? '',
      row.TrainingCourseName ?? '',
      row.DurationUnit_str ?? '',
      row.Duration ?? '',
      `${row.StartDate ?? ''} - ${row.EndDate ?? ''}`,
      row.Venue ?? '',
      row.ModeOfTraining_str ?? '',
      row.Venue ?? '',
      row.IsNodal ?? ''
    ]);

    autoTable(doc, {
      startY: 18,

      head: [[
        'Sr. No.',
        'SSOID',
        'Name',
        'Organizing lnstitute Name',
        'Course Type',
        'Course Name',
        'Duration Unit',
        'Duration',
        'Start Date - End Date',
        'Venue',
        'Mode Of Training'

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
      }
    });

    doc.save('StaffDetailsCompletedTrainingList.pdf');
  }


  async StaffTrainingDetailsNewTraining_Search(statusID: number) {
    await this.StaffTrainingDetailsNewTraining_GetData();
  }

  async StaffTrainingDetailsCompletedTraining_Search(statusID: number) {
    await this.StaffTrainingDetailsCompletedTraining_GetData();
  }

  async StaffTrainingDetailsNewTraining_GetData() {
    debugger
    try {
      this.searchRequest.StaffID = this.sSOLoginDataModel.StaffID
      this.searchRequest.UserID = this.sSOLoginDataModel.UserID
      this.searchRequest.Action = "GetNewTrainingList";

      await this.staffServiceDetailsService.StaffTrainingDetails_GetData(this.searchRequest).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State === EnumStatus.Success) {
          this.StaffTrainingDetailsNewTrainingDataList = data.Data;
          if (this.SearchStatus != 0) {
            this.StaffTrainingDetailsNewTrainingDataList = this.StaffTrainingDetailsNewTrainingDataList.filter((item: any) => item.StatusID == this.SearchStatus)
          } else {
            this.StaffTrainingDetailsNewTrainingDataList = data.Data;
          }
        }
      })
    } catch (error) {
      console.error(error);
    }
  }

}
