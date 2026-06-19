import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { ToastrService } from 'ngx-toastr';
import { ITITradeDataModels, ITITradeSearchModel } from '../../../../Models/ITITradeDataModels';
import { ItiTradeService } from '../../../../Services/iti-trade/iti-trade.service';
import { EnumStatus } from '../../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { ITIPlanningBankGuarantee, ITIPlanningStatusUpdateByIdModel } from '../../../../Models/ItiPlanningDataModel';
import { ITIsService } from '../../../../Services/ITIs/itis.service';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { ItiCollegesSearchModel } from '../../../../Models/CommonMasterDataModel';
import { DropdownValidatorsString, DropdownValidatorsString1 } from '../../../../Services/CustomValidators/custom-validators.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
@Component({
  selector: 'app-list-iti-bankguarantee',
  templateUrl: './list-iti-bankguarantee.component.html',
  styleUrls: ['./list-iti-bankguarantee.component.css'],
    standalone: false
})
export class listitibankguaranteeComponent {
  public State: number = -1;
  groupForm!: FormGroup;
  public Message: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public ITITradeList: any = [];
  searchText: string = '';
  public CollegeTypeList: any[] = [];
  public BankGuaranteeList: any[] = [];
  public BankGuaranteeListByID: any[] = [];
  public TradeTypesList: any = [];
  public TradeData: ITITradeSearchModel[] = [];
  request = new ITITradeDataModels()
  public searchRequest = new ITIPlanningBankGuarantee();
  public requestById = new ITIPlanningStatusUpdateByIdModel();
  public Table_SearchText: string = '';
  public tbl_txtSearch: string = '';
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
  public sSOLoginDataModel = new SSOLoginDataModel();
  InstituteMasterDDL: any[] = [];
  public CollegeMasterList: any = [];
  public collegeRequest = new ItiCollegesSearchModel();
  modalReference: NgbModalRef | undefined;
  public bankGuaranteeFormGroup!: FormGroup;



  //end table feature default
  constructor(
    private commonMasterService: CommonFunctionService,
    private campusPostService: ITIsService,
    private Router: Router,
    private ItiTradeService: ItiTradeService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private router: Router,
    private routers: ActivatedRoute,
    private modalService: NgbModal,
    public appsettingConfig: AppsettingService,
    private fb: FormBuilder,
    private Swal2: SweetAlert2) {
  }

  async ngOnInit()
  {
    this.sSOLoginDataModel.RoleID;

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.bankGuaranteeFormGroup = this.fb.group({
      //status: ['1', Validators.required],  
      Remarks: ['', DropdownValidatorsString1],
      OrderNo: ['', Validators.required],
      Orderdate: ['', Validators.required],

    });

    this.routers.queryParams.subscribe(params => {
      this.searchRequest.status = params['status'] != null
        ? Number(params['status'])
        : 0;
  
    });

    this.getbankguaranteeList()
    await this.GetPrivateITICollege();

  }
  get _bankGuaranteeFormGroup() { return this.bankGuaranteeFormGroup.controls; }

  async GetTradeTypesList()
  {
    
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetTradeTypesList().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.TradeTypesList = data.Data; 
        //this.loadInTable();
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async getbankguaranteeList() {
    debugger
    try {
      this.loaderService.requestStarted();
      this.searchRequest.BankGuaranteeID = 0;
      //   this.searchRequest.CollageId = this.id;



      if (!this.searchRequest.CollageId) {
        this.searchRequest.CollageId = 0; // fallback to All
      }



      await this.campusPostService.ITIPlanningBankGuaranteeList(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.BankGuaranteeList = data['Data'];

          this.loadInTable();

          console.log('Bank Gaurentee ===>', this.BankGuaranteeList)
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


  onCancel(): void {
    
    this.searchRequest.status = 0
    this.searchRequest.dayWise = 0
    this.searchRequest.CollageId = 0
    this.searchRequest.GauranteeNo=''
  }

  onResetCancel(): void
  {
    this.onCancel();
    this.getbankguaranteeList();
  }

  onEdit(Id: number): void {

    // Navigate to the edit page with the institute ID
    this.Router.navigate(['/ititradeUpdate', Id]);
  }





  exportToExcel(): void {
    const unwantedColumns = ['ActiveStatus', 'DeleteStatus', 'CreatedBy', 'ModifyBy', 'ModifyDate', 'IPAddress'];
    const filteredData = this.BankGuaranteeList.map(item => {
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

    const fileName = `Bank_Guarantee_List_${dateStr}.xlsx`;

    XLSX.writeFile(wb, fileName);
  }


  calculateInTableTotalPage() {
    this.totalInTablePage = Math.ceil(this.totalInTableRecord / parseInt(this.pageInTableSize));
  }
  // (replace org.list here)
  updateInTablePaginatedData() {
    this.loaderService.requestStarted();
    this.startInTableIndex = (this.currentInTablePage - 1) * parseInt(this.pageInTableSize);
    this.endInTableIndex = this.startInTableIndex + parseInt(this.pageInTableSize);
    this.endInTableIndex = this.endInTableIndex > this.totalInTableRecord ? this.totalInTableRecord : this.endInTableIndex;
    this.paginatedInTableData = [...this.BankGuaranteeList].slice(this.startInTableIndex, this.endInTableIndex);
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
    this.paginatedInTableData = ([...this.BankGuaranteeList] as any[]).sort((a, b) => {
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
    this.totalInTableRecord = this.BankGuaranteeList.length;
  }


  async EditInfo(BankGuaranteeID: number) {
    debugger
    try {
      this.loaderService.requestStarted();
      this.router.navigate(['/iti-bank-guarantee', BankGuaranteeID]);

    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  async ReNew(BankGuaranteeID: number) {
    debugger
    try {
      this.loaderService.requestStarted();
      this.router.navigate(['/iti-bank-guarantee', BankGuaranteeID]);


      this.router.navigate(['/iti-bank-guarantee', BankGuaranteeID], {
        queryParams: { status: 'ReNew' }
      });

    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }
  onBankNameChange(value: string) {
    this.searchRequest.BankName = value;
    this.searchRequest.BankGuaranteeNumber = value;
    this.getbankguaranteeList();
  }

  GetStaff_InstituteWise() {
    this.searchRequest.CollageId = this.sSOLoginDataModel.InstituteID;
    this.commonMasterService.ITIGetStaff_InstituteWise(this.searchRequest).then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      debugger;
      this.InstituteMasterDDL = data.Data;
      //this.ExaminerDDL = [{ StaffID: 1, Name: 'Staff 1', SSOID: 'Staff1' },{ StaffID: 2, Name: 'Staff 2', SSOID: 'Staff2' },{ StaffID: 3, Name: 'Staff 3', SSOID: 'Staff3' }];
    })
  }


  GovtITICollege_DistrictWise(ID: any) {
    debugger
    this.InstituteMasterDDL = []
    this.searchRequest.CollageId = this.sSOLoginDataModel.InstituteID;
    this.commonMasterService.GovtITICollege_DistrictWise(ID, this.sSOLoginDataModel.EndTermID).then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      this.InstituteMasterDDL = data.Data;
      console.log("this.InstituteMasterDDL", this.InstituteMasterDDL)
    })
  }

  //async ddlITIColleges() {
  //  try {

  //    this.loaderService.requestStarted();
  //    this.collegeRequest.action = "_getDataITIcollege";
  //    this.collegeRequest.DistrictID = 0;
  //    this.collegeRequest.ManagementTypeID = 0;
  //    await this.commonMasterService.ItiCollegesGetAllData(this.collegeRequest)
  //      .then((data: any) => {
  //        data = JSON.parse(JSON.stringify(data));
  //        this.CollegeMasterList = data['Data'];
  //        console.log('College Master List', this.CollegeMasterList)
  //      }, error => console.error(error));
  //  }
  //  catch (Ex) {
  //    console.log(Ex);
  //  }
  //  finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}

  public AllCompanyMasterList: any[] = [];
  async GetPrivateITICollege() {
    try {
      this.loaderService.requestStarted();

      await this.commonMasterService
        .GetCommonMasterData('PrivateITICollege', 5)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          this.AllCompanyMasterList = data['Data'];
          this.CollegeMasterList = this.AllCompanyMasterList;

          //this.CollegeID = 0; //  default select
          //this.request.CollageId = 0;
        }, error => console.error(error));

    } catch (Ex) {
      console.log(Ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

   
  CloseModalPopup() {
    this.modalService.dismissAll();
   
  }


  async ViewandUpdate(content: any, item: any) {
    debugger
    this.isSubmitted = false;
    this.requestById.status = 2

    //this.requestById.Remarks = item.Remarks
    this.requestById.OrderNo = undefined;
    //this.requestById.Orderdate = this.requestById.Orderdate
    this.requestById.BankGuaranteeID = item.BankGuaranteeID
    this.modalReference = this.modalService.open(content, { backdrop: 'static', size: 'sm', keyboard: true, centered: true });

  }

  async ViewBankGuranteeDetails(content: any, item: any) {
    debugger
    this.requestById.BankGuaranteeID = item.BankGuaranteeID
    await this.getbankguaranteeByID();
    this.modalReference = this.modalService.open(content, { backdrop: 'static', size: 'sm', keyboard: true, centered: true });

  }

  async getbankguaranteeByID() {
    debugger
    try {
      this.loaderService.requestStarted();
      this.searchRequest.BankGuaranteeID = 0;
      //   this.searchRequest.CollageId = this.id;

      if (!this.searchRequest.CollageId) {
        this.searchRequest.CollageId = 0; // fallback to All
      }

      await this.campusPostService.ITIPlanningBankGuaranteeGetByID(this.requestById.BankGuaranteeID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.BankGuaranteeListByID = data['Data'];

          this.loadInTable();

          console.log('Bank Gaurentee ===>', this.BankGuaranteeList)
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


  async statusUpdateById() {
    debugger
    try {
      this.isSubmitted = true;
      if (this.bankGuaranteeFormGroup.invalid) {
        return;
      }

      this.isLoading = true;
      this.loaderService.requestStarted();

      await this.campusPostService.statusUpdateById(this.requestById)
     
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];

          if (this.State = EnumStatus.Success) {
            this.toastr.success(this.Message)
            this.bankGuaranteeFormGroup.reset();
            this.requestById.status = 1;
            this.requestById.Remarks = '';
            this.CloseModalPopup();
            this.getbankguaranteeList()
          } 
          else {
            this.toastr.error(this.ErrorMessage)
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

  trackById(index: number, item: any): number {
    return item.ID;
  }





  async btnDeleteOnClick(item: any) {

    this.Swal2.Confirmation("Are you sure you want to delete this ?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          try {
            //Show Loading
            this.loaderService.requestStarted();
            this.searchRequest.BankGuaranteeID = item.BankGuaranteeID;
            this.searchRequest.UserID = this.sSOLoginDataModel.UserID;
            await this.campusPostService.DeleteGuarantee(this.searchRequest)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));

                this.State = data['State'];
                this.Message = data['Message'];
                this.ErrorMessage = data['ErrorMessage'];

                if (this.State == EnumStatus.Success)
                {
                  this.toastr.success("Record Deleted Successfully");
                  //reload
                 
                }
                else {
                  this.toastr.error(this.ErrorMessage)
                }
                this.getbankguaranteeList();
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


  onSearchChange() {
    debugger

    if (this.Table_SearchText == '') {
      this.pageInTableSize = "50"; // reset pagination
      this.loadInTable();
    }
    else {
      this.pageInTableSize = this?.totalInTableRecord?.toString() ?? "50"; // reset pagination
      this.loadInTable();
    }
  }


  numberOnly(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

  exportToPDF() {
    const doc = new jsPDF('l', 'mm', 'a4');

    // Heading
    const pageWidth = doc.internal.pageSize.getWidth();

    const today = new Date().toLocaleDateString('en-GB');


    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(
      'Bank Guarantee Report',
      pageWidth / 2,
      10,
      { align: 'center' }
    );

    doc.setFontSize(9);
    doc.text(
      `Total Records : ${this.BankGuaranteeList.length}`,
      pageWidth - 20,
      10,
      { align: 'right' }
    );

    //doc.setFontSize(9);
    //doc.setFont('helvetica', 'normal');
    //doc.text(
    //  `Date: ${today}`,
    //  pageWidth - 15,
    //  10,
    //  { align: 'right' }
    //);

    const body = this.BankGuaranteeList.map((row: any, index: number) => [
      index + 1,
      row.CollegeName || '',
      row.BankName || '',
      row.BankGuaranteeNumber || '',
      //row.DateOfIssue || '',
      row.Maturitydate || '',
      row.Duration || '',
      row.Amount ? Number(row.Amount).toLocaleString('en-IN') : '0',
      row.Remarks || '',
      row.StatusName || ''
    ]);

    autoTable(doc, {
      startY: 18,

      head: [[
        'Sr No',
        'Inst_Code and Name',
        'Bank Name',
        'Bank Gurantee Number',
       // 'Issue Date',
        'Maturity Date',
        'Duration Years',
        'Amount',
        'Remarks',
        'Status'

      ]],

      body,

      theme: 'grid',

      styles: {
        fontSize: 8,
        cellPadding: 2,
        overflow: 'linebreak',
        valign: 'middle',
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

    doc.save('ITI Bank Guarantee List.pdf');
  }


}
