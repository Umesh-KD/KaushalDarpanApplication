import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ITISeatIntakesModel, ITIsDataModels, ITIsSearchModel } from '../../../../Models/ITIsDataModels';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';

import { LoaderService } from '../../../../Services/Loader/loader.service';
import { ITIsService } from '../../../../Services/ITIs/itis.service';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ItiTradeSearchModel } from '../../../../Models/CommonMasterDataModel';
import { EnumRole, EnumStatus, GlobalConstants } from '../../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { CollegeMasterDataModels, CollegeMasterSearchModel } from '../../../../Models/CollegeMasterDataModels';
import { AppsettingService } from '../../../../Common/appsetting.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
    selector: 'app-itis',
    templateUrl: './itis.component.html',
    styleUrls: ['./itis.component.css'],
    standalone: false
})
export class ITIsComponent implements OnInit {
  groupForm!: FormGroup;
  public isSubmitted: boolean = false;
  public State: number = -1;
  public Message: any = [];

  _EnumRole = EnumRole;
  public CompanyMasterList: any = [];
  public AllCompanyMasterList: any[] = [];
  public CollegeID: number = 0;
  public ITItypeID: number = 0;
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public InstituteCategoryList: any = [];
  public ItiTradeList: any = [];
  public ITITradeSchemeList: any = [];
  public ManagmentTypeList: any = [];
  public ITIRemarkList: any = [];
  public Districtlist: any = [];
  public Tehsillist: any = [];
  public CourseTypeList: any = [];
  public itiList: any = [];
  public rows: ITISeatIntakesModel[] = []
  request = new ITIsSearchModel();
  sSOLoginDataModel = new SSOLoginDataModel();
  public searchrequest = new ITIsSearchModel()
  modalReference: NgbModalRef | undefined;
  closeResult: string | undefined;
  public CollegeTradeList: any = [];
  public tradeSearchRequest = new ItiTradeSearchModel()
  @ViewChild('dropdownMenu') dropdownMenu!: ElementRef;
  public Table_SearchText: string = "";
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
  collegesemrequest = new CollegeMasterSearchModel();
  public Type1List: any = []
  public Type2List: any = []
  public govCollegeList: any = [];
  _GlobalConstants = GlobalConstants;

  public SemesterDetails: any[] = [];//copy of main data
  ManagementTypeId: number = 0;
  IsCampus: number = 0;
  flag: number = 0;
  key: number = 0;
  //end table feature default

  constructor(
    private fb: FormBuilder,
    private commonMasterService: CommonFunctionService,
    private ITIsService: ITIsService,
    private addITIsService: ITIsService,
    private router: Router,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private routers: ActivatedRoute,
    private modalService: NgbModal,
    private Swal2: SweetAlert2, private renderer: Renderer2,
    private appsettingConfig: AppsettingService,
    private route: ActivatedRoute,
    private activatedRoute: ActivatedRoute
  ) { }

  async ngOnInit() {
    this.groupForm = this.fb.group({
      ddlInstituteCategoryId: ['', [DropdownValidators]],
      txtSSOID: ['', Validators.required],
      txtName: ['', Validators.required],
      txtEmailAddress: ['', Validators.required],
      txtFaxNumber: ['', Validators.required],
      ddlManagementType: ['', [DropdownValidators]],
      txtCollegeCode: ['', Validators.required],
      txtDGTCode: ['', Validators.required],
      txtMobileNumber: ['', Validators.required],
      txtPincode: ['', Validators.required],
      check8th: [false],
      check10th: [false],
      check12th: [false]
    });

    this.flag = Number(this.activatedRoute.snapshot.queryParamMap.get('flag')?.toString());
    this.key = Number(this.activatedRoute.snapshot.queryParamMap.get('key')?.toString());

    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.searchrequest.FeeStatus = -1;
    this.searchrequest.Status = -1;
    this.GetInstituteCategoryList();
    this.GetManagmentType();
    this.GetTradeListDDL();
    this.GetTradeSchemeDDL();
    this.GetDistrictMaster();
    this.GettehsilMaster();
    this.GetStreamType();
    this.GetRemark();
    
    await this.GetPrintRollAdmitCardSetting();
    this.loadDropdownData('GovtIti')
    await this.getItiNameAndCode()

    // CALLING for query dashboard parameter
    this.route.queryParams.subscribe(params => {
      const ITItypeID = Number(params['ManagementTypeId']);

      if (!isNaN(ITItypeID) && ITItypeID > 0) {
        this.ManagementTypeId = ITItypeID;
        this.searchrequest.ITItypeID = ITItypeID;
      }


      const isCampus = params['IsCampus'];

      if (isCampus === '1' || isCampus === '0') {
        this.IsCampus = isCampus;
        this.searchrequest.IsCampus = isCampus;
      }
    });

    this.searchrequest.Status = 1;
    if (this.key != 0) {
      if (this.flag == 1 && this.key == 1) {
        this.searchrequest.ITItypeID = 1;
        this.searchrequest.Status = -1;
      }
      else if (this.flag == 1 && this.key == 5) {
        this.searchrequest.ITItypeID = 5;
        this.searchrequest.Status = -1;
      }
      else if (this.flag == 2 && this.key == 1) {
        this.searchrequest.Status = 1;
      }
      else {
        this.searchrequest.Status = 1;
      }
    }
    await this.GetAllData();



  }

  exportToPDF() {
    const doc = new jsPDF('l', 'mm', 'a4');

    // Heading
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(
      'ITI College List Report',
      pageWidth / 2,
      10,
      { align: 'center' }
    );

    doc.setFontSize(9);
    doc.text(
      `Total Records : ${this.itiList.length}`,
      pageWidth - 20,
      10,
      { align: 'right' }
    );


    const body = this.itiList.map((row: any, index: number) => [
      index + 1,
      //`${row.Code || ''} (${row.Name || ''})`,  //concate in one column
      row.Code || '',
      row.Name || '',
      row.DistrictNameEnglish || '',
      row.Phone || '',
      row.Email || '',
      row.DgetCode || '',
      row.campusName || '',
      row.ActiveStatus ? 'Active' : 'Inactive'
    ]);

    autoTable(doc, {
      startY: 18,

      head: [[
        'Sr No',
        'College Code',
        'College Name',
        'District',
        'Phone',
        'Email',
        'DGET Code',
        'Campus Name',
        'Status'
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

      //columnStyles: {
      //  0: { cellWidth: 12 },
      //  1: { cellWidth: 20 },
      //  2: { cellWidth: 70 },
      //  3: { cellWidth: 25 },
      //  4: { cellWidth: 25 },
      //  5: { cellWidth: 45 },
      //  6: { cellWidth: 25 },
      //  7: { cellWidth: 55 },
      //  8: { cellWidth: 18 }
      //},
    });

    doc.save('ITI College List.pdf');
  }


  async GetInstituteCategoryList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCollegeCategory().then((data: any) => {
        this.InstituteCategoryList = data.Data;
      });
    } catch (error) {
      console.error(error);
    } finally {
      this.loaderService.requestEnded();
    }
  }

  async GetManagmentType() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetManagType().then((data: any) => {
        this.ManagmentTypeList = data.Data;
      });
    } catch (error) {
      console.error(error);
    } finally {
      this.loaderService.requestEnded();
    }
  }

  async GetRemark() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterDDLByType('Remark').then((data: any) => {
        this.ITIRemarkList = data.Data;
      });
    } catch (error) {
      console.error(error);
    } finally {
      this.loaderService.requestEnded();
    }
  }

  async GetDistrictMaster() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetDistrictMaster().then((data: any) => {
        this.Districtlist = data.Data;
      });
    } catch (error) {
    } finally {
      this.loaderService.requestEnded();
    }
  }

  async GettehsilMaster() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetTehsilMaster().then((data: any) => {
        this.Tehsillist = data.Data;
      });
    } catch (error) {
      console.error(error);
    } finally {
      this.loaderService.requestEnded();
    }
  }

  async GetStreamType() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetStreamType().then((data: any) => {
        this.CourseTypeList = data.Data;
      });
    } catch (error) {
      console.error(error);
    } finally {
      this.loaderService.requestEnded();
    }
  }

  async GetTradeListDDL()
  {
    try {
      this.loaderService.requestStarted();
      this.tradeSearchRequest.action = "_getAllData"

      await this.commonMasterService.TradeListGetAllData(this.tradeSearchRequest).then((data: any) => {
        const parsedData = JSON.parse(JSON.stringify(data));
        this.ItiTradeList = parsedData.Data;
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async GetTradeSchemeDDL() {
    const MasterCode = "IITTradeScheme";
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterData(MasterCode).then((data: any) => {
        const parsedData = JSON.parse(JSON.stringify(data));
        this.ITITradeSchemeList = parsedData.Data;
      });
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async GetAllData() {
    debugger
    this.searchrequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.searchrequest.CourseTypeID = this.sSOLoginDataModel.Eng_NonEng;
    this.searchrequest.InstituteID = this.sSOLoginDataModel.InstituteID;
    try {
      this.loaderService.requestStarted();
      await this.ITIsService.GetAllData(this.searchrequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.itiList = data['Data'];

          this.loadInTable();
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

  async ResetSearch() {
    this.searchrequest = new ITIsSearchModel();
    this.searchrequest.FeeStatus = -1;
    this.searchrequest.Status = -1;
    this.GetAllData()
  }

  async toggleDropdown(index: number) {
    this.itiList[index].isDropdownOpen = !this.itiList[index].isDropdownOpen;
  }

  async Get_ITIsData_ByID(Id: number) {
   try {
     this.loaderService.requestStarted();

     await this.addITIsService.Get_ITIsData_ByID(Id)
       .then(async (data: any) => {
         data = JSON.parse(JSON.stringify(data));
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

  async ViewandUpdate(content: any, id: number) {
    await this.GetByID(id)
    this.modalReference = this.modalService.open(content, { backdrop: 'static', size: 'xl', keyboard: true, centered: true });
  }

  async GetByID(id: number) {
    try {
      this.loaderService.requestStarted();

      await this.addITIsService.GetItiTradeData_ByID(id)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CollegeTradeList = data.Data;
          const btnSave = document.getElementById('btnSave');
          if (btnSave) btnSave.innerHTML = "Update";

          const btnReset = document.getElementById('btnReset');
          if (btnReset) btnReset.innerHTML = "Cancel";

        }, (error: any) => console.error(error));
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

  CloseModalPopup() {
    this.modalService.dismissAll();
  }

  @ViewChild('content') content: ElementRef | any;

  open(content: any, BookingId: string) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  //async ResetSSOID(ID: number) {
  //  this.Swal2.Confirmation("Do you want to Reset SSOID?",
  //    async (result: any) => {
  //      if (result.isConfirmed) {
  //        try {
  //          this.loaderService.requestStarted();
  //          await this.addITIsService.ResetSSOID(ID, this.sSOLoginDataModel.UserID)
  //            .then(async (data: any) => {
  //              data = JSON.parse(JSON.stringify(data));
  //              if (data.State = EnumStatus.Success) {
  //                this.toastr.success(data.Message)
  //                await this.GetAllData();
  //              } else {
  //                this.toastr.error(data.ErrorMessage)
  //              }
  //            }, (error: any) => console.error(error)
  //            );
  //        }
  //        catch (ex) {
  //          console.log(ex);
  //        }
  //        finally {
  //          setTimeout(() => {
  //            this.loaderService.requestEnded();
  //          }, 200);
  //        }
  //      }
  //    });
  //}

  //async DeleteDataById(ID: number) {
  //  this.Swal2.Confirmation("Do you want to Delete?",
  //    async (result: any) => {
  //      if (result.isConfirmed) {
  //        try {
  //          this.loaderService.requestStarted();
  //          await this.addITIsService.DeleteDataById(ID, this.sSOLoginDataModel.UserID)
  //            .then(async (data: any) => {
  //              data = JSON.parse(JSON.stringify(data));
  //              if (data.State = EnumStatus.Success) {
  //                this.toastr.success(data.Message)
  //                await this.GetAllData();
  //              } else {
  //                this.toastr.error(data.ErrorMessage)
  //              }
  //            }, (error: any) => console.error(error)
  //            );
  //        }
  //        catch (ex) {
  //          console.log(ex);
  //        }
  //        finally {
  //          setTimeout(() => {
  //            this.loaderService.requestEnded();
  //          }, 200);
  //        }
  //      }
  //    });
  //}

  exportToExcel(): void {
    const unwantedColumns = ['ActiveStatus', 'DeleteStatus', 'CreatedBy', 'ModifyBy', 'ModifyDate', 'IPAddress', 
      'Id', 'Status', 'RemarkForStatus', 'FeePdf', 'RTS'
    ];
    const filteredData = this.itiList.map((item: { [x: string]: any; }) => {
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
    XLSX.writeFile(wb, 'ItiList.xlsx');
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
    this.paginatedInTableData = [...this.itiList].slice(this.startInTableIndex, this.endInTableIndex);
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
    this.paginatedInTableData = ([...this.itiList] as any[]).sort((a, b) => {
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
    this.totalInTableRecord = this.itiList.length;
  }

  //async btnActive_OnClick(InstitudeID: number) {
  //  const { value, isConfirmed } = await Swal.fire({
  //    title: 'Are you sure you want to activate this?',
  //    input: 'textarea',
  //    inputLabel: 'Remark',
  //    inputPlaceholder: 'Enter your remark here...',
  //    inputAttributes: {
  //      'aria-label': 'Type your remark here'
  //    },
  //    showCancelButton: true,
  //    confirmButtonText: 'Save Remark',
  //    cancelButtonText: 'Cancel',
  //    preConfirm: (value) => {
  //      const remark = (value || '').toString().trim();
  //      if (!remark) {
  //        Swal.showValidationMessage('Remark is required');
  //        return false;
  //      }
  //      return remark;
  //    }
  //  });

  //  const remark = (value || '').toString().trim();

  //  if (isConfirmed && remark) {
  //    try {
  //      this.loaderService.requestStarted();

  //      await this.addITIsService.ActiveStatusByID(InstitudeID, this.sSOLoginDataModel.UserID, remark)
  //        .then(async (data: any) => {
  //          data = JSON.parse(JSON.stringify(data));

  //          this.State = data['State'];
  //          this.Message = data['Message'];
  //          this.ErrorMessage = data['ErrorMessage'];

  //          if (this.State == EnumStatus.Success) {
  //            this.toastr.success(this.Message);
  //            this.GetAllData();
  //          } else {
  //            this.toastr.error(this.ErrorMessage);
  //          }
  //        })
  //        .catch((error: any) => console.error(error));
  //    } catch (ex) {
  //      console.log(ex);
  //    } finally {
  //      setTimeout(() => {
  //        this.loaderService.requestEnded();
  //      }, 200);
  //    }
  //  }
  //}


  // async btnActive_OnClick(InstitudeID: number) {
  //   this.Swal2.ConfirmationWithRemark('Are you sure you want to activate this?', async (remark: string) => {
  //     try {
  //       this.loaderService.requestStarted();


  //       await this.addITIsService.ActiveStatusByID(InstitudeID, this.sSOLoginDataModel.UserID, remark,)
  //               .then(async (data: any) => {
  //                 data = JSON.parse(JSON.stringify(data));

  //                 this.State = data['State'];
  //                 this.Message = data['Message'];
  //                 this.ErrorMessage = data['ErrorMessage'];

  //                 if (this.State == EnumStatus.Success) {
  //                   this.toastr.success(this.Message);
  //                   this.GetAllData();
  //                 } else {
  //                   this.toastr.error(this.ErrorMessage);
  //                 }
  //               })
  //     } catch (ex) {
  //       console.error(ex);
  //     } finally {
  //       setTimeout(() => {
  //         this.loaderService.requestEnded();
  //       }, 200);
  //     }
  //   });
  // }


async btnActive_OnClick(InstitudeID: number) {
  const { value: formValues, isConfirmed } = await Swal.fire({
  title: 'Activate / Deactivate ITI',
  width: '650px',
  customClass: {
    popup: 'swal-popup-custom'
  },
  html: `
    <div style="text-align:left; font-size:13px;">

      <!-- Order No -->
      <label style="font-weight:600;">Order No</label>
      <input id="orderNo" placeholder="Enter Order No"
        style="width:100%; height:34px; padding:6px 10px; margin:4px 0 10px 0;
        border:1px solid #d1d5db; border-radius:6px; outline:none;" />

      <!-- Dates Row -->
      <div style="display:flex; gap:10px; margin-bottom:10px;">
        <div style="flex:1;">
          <label style="font-weight:600;">Order Date</label>
          <input id="orderDate" type="date"
            style="width:100%; height:34px; padding:6px 10px; margin-top:4px;
            border:1px solid #d1d5db; border-radius:6px; outline:none;" />
        </div>

        <div style="flex:1;">
          <label style="font-weight:600;">Effective Date</label>
          <input id="effectiveDate" type="date"
            style="width:100%; height:34px; padding:6px 10px; margin-top:4px;
            border:1px solid #d1d5db; border-radius:6px; outline:none;" />
        </div>
      </div>

      <!-- Remark -->
      <label style="font-weight:600;">Remark</label>
      <textarea id="remark" placeholder="Enter Remark"
        style="width:100%; height:70px; padding:6px 10px; margin-top:4px;
        border:1px solid #d1d5db; border-radius:6px; outline:none; resize:none;"></textarea>

    </div>
  `,
  focusConfirm: false,
  showCancelButton: true,
  confirmButtonText: 'Submit',

  preConfirm: () => {
    const orderNo = (document.getElementById('orderNo') as HTMLInputElement).value;
    const orderDate = (document.getElementById('orderDate') as HTMLInputElement).value;
    const effectiveDate = (document.getElementById('effectiveDate') as HTMLInputElement).value;
    const remark = (document.getElementById('remark') as HTMLTextAreaElement).value;

    if (!orderNo || !orderDate || !effectiveDate || !remark) {
      Swal.showValidationMessage('All fields are required');
      return false;
    }

    return { orderNo, orderDate, effectiveDate, remark };
  }
});

  if (isConfirmed && formValues) {
    try {
      this.loaderService.requestStarted();
debugger
      await this.addITIsService.ActiveStatusByIDCollegeMaster({
        id: InstitudeID,
        modifyBy: this.sSOLoginDataModel.UserID,
        remark: formValues.remark,
        orderNo: formValues.orderNo,
        orderDate: formValues.orderDate,
        effectiveDate: formValues.effectiveDate
      }).then((data: any) => {
debugger
        data = JSON.parse(JSON.stringify(data));

        this.State = data['State'];
        this.Message = data['Message'];
        this.ErrorMessage = data['ErrorMessage'];

        if (this.State == EnumStatus.Success) {
          this.toastr.success(this.Message);
          this.GetAllData();
        } else {
          this.toastr.error(this.ErrorMessage);
        }
      });

    } catch (ex) {
      console.error(ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }
}



  async DeleteDataById(ID: number) {
    this.Swal2.ConfirmationWithRemark('Are you sure you want to Delete this?', async (remark: string) => {
      try {
        this.loaderService.requestStarted();


        await this.addITIsService.DeleteDataById(ID, this.sSOLoginDataModel.UserID, remark)
          .then(async (data: any) => {
            data = JSON.parse(JSON.stringify(data));

            this.State = data['State'];
            this.Message = data['Message'];
            this.ErrorMessage = data['ErrorMessage'];

            if (this.State == EnumStatus.Success) {
              this.toastr.success(this.Message);
              this.GetAllData();
            } else {
              this.toastr.error(this.ErrorMessage);
            }
          })
      } catch (ex) {
        console.error(ex);
      } finally {
        setTimeout(() => {
          this.loaderService.requestEnded();
        }, 200);
      }
    });
  }


  async ResetSSOID(ID: number,SSOID:string='') {
    this.Swal2.ConfirmationWithRemark('Are you sure you want to Reset SSOID ?', async (remark: string) => {
      try {
        this.loaderService.requestStarted();


        await this.addITIsService.ResetSSOID(ID, this.sSOLoginDataModel.UserID,remark,SSOID)
          .then(async (data: any) => {
            data = JSON.parse(JSON.stringify(data));

            this.State = data['State'];
            this.Message = data['Message'];
            this.ErrorMessage = data['ErrorMessage'];

            if (this.State == EnumStatus.Success) {
              this.toastr.success(this.Message);
              this.GetAllData();
            } else {
              this.toastr.error(this.ErrorMessage);
            }
          })
      } catch (ex) {
        console.error(ex);
      } finally {
        setTimeout(() => {
          this.loaderService.requestEnded();
        }, 200);
      }
    });
  }


  //async ResetSSOID(ID: number) {
  //  this.Swal2.ConfirmationWithRemark("Do you want to Reset SSOID?",
  //    async (result: any) => {
  //      if (result.isConfirmed) {
  //        try {
  //          this.loaderService.requestStarted();
  //          await this.addITIsService.ResetSSOID(ID, this.sSOLoginDataModel.UserID)
  //            .then(async (data: any) => {
  //              data = JSON.parse(JSON.stringify(data));
  //              if (data.State = EnumStatus.Success) {
  //                this.toastr.success(data.Message)
  //                await this.GetAllData();
  //              } else {
  //                this.toastr.error(data.ErrorMessage)
  //              }
  //            }, (error: any) => console.error(error)
  //            );
  //        }
  //        catch (ex) {
  //          console.log(ex);
  //        }
  //        finally {
  //          setTimeout(() => {
  //            this.loaderService.requestEnded();
  //          }, 200);
  //        }
  //      }
  //    });
  //}



  async UnlockFee(ID: number, isfee: number) {
    const message = isfee == 1
      ? 'Are you sure you want to unlock the fee?'
      : 'Are you sure you want to lock the fee?';

    this.Swal2.ConfirmationWithRemark(message, async (remark: string) => {
      try {
        this.loaderService.requestStarted();

        await this.addITIsService.unlockfee(ID, this.sSOLoginDataModel.UserID, remark)
          .then(async (data: any) => {
            data = JSON.parse(JSON.stringify(data));

            this.State = data['State'];
            this.Message = data['Message'];
            this.ErrorMessage = data['ErrorMessage'];

            if (this.State == EnumStatus.Success) {
              this.toastr.success(this.Message);
              this.GetAllData();
            } else {
              this.toastr.error(this.ErrorMessage);
            }
          });
      } catch (ex) {
        console.error(ex);
      } finally {
        setTimeout(() => {
          this.loaderService.requestEnded();
        }, 200);
      }
    });
  }


  async GetPrintRollAdmitCardSetting() {

    this.collegesemrequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.collegesemrequest.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.collegesemrequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
    this.collegesemrequest.RoleID = this.sSOLoginDataModel.RoleID;

    if (this.sSOLoginDataModel.RoleID == EnumRole.ITIPrincipal || this.sSOLoginDataModel.RoleID == EnumRole.PrincipalNon) {
      this.collegesemrequest.InstituteID = this.sSOLoginDataModel.InstituteID;
    }
    else {
      this.collegesemrequest.InstituteID = 0;
    }

    await this.commonMasterService.Get_ITIPrintRollAdmitCardSetting(this.collegesemrequest)
      .then((data: any) => {

        data = JSON.parse(JSON.stringify(data));
        this.SemesterDetails = data.Data;
        console.log(this.SemesterDetails)
        if (this.sSOLoginDataModel.RoleID == EnumRole.ITIPrincipal || this.sSOLoginDataModel.RoleID == EnumRole.PrincipalNon) {
          debugger
          this.Type1List = this.SemesterDetails.filter(x => x.PDFType == 1)//roll list
          this.Type2List = this.SemesterDetails.filter(x => x.PDFType == 2)//admit card
        }

        console.log(this.SemesterDetails, "type")

      }, (error: any) => console.error(error)
      );
  }

  loadDropdownData(MasterCode: string): void {
    
    this.commonMasterService.GetCommonMasterData(MasterCode).then((data: any) => {
      switch (MasterCode) {
        case 'GovtIti':
          this.govCollegeList = data['Data'];
          console.log("govCollegeList ==>", this.govCollegeList)
          break;
        default:
          break;
      }
    });
  }
  onCampusChange(value: boolean) {
    if (!value) {
      this.request.CampusID = 0;
    }
  }

  async getItiNameAndCode() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterData('PrivateITICollege', this.ITItypeID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.AllCompanyMasterList = data['Data'];   // full list
          this.CompanyMasterList = this.AllCompanyMasterList; // default
          
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

}
