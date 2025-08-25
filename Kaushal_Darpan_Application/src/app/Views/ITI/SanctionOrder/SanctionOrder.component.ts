import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { EnumStatus } from '../../../Common/GlobalConstants';
import { CompanyDispatchService } from '../../../Services/CompanyDispatch/CompanyDispatch.service';
import { CompanyDispatchIUMasterModel } from '../../../Models/DispatchFormDataModel';
import { SanctionOrderModel } from '../../../Models/ITI/UserRequestModel';
import { AppsettingService } from '../../../Common/appsetting.service';
import { ItiSeatIntakeService } from '../../../Services/ITI/ItiSeatIntake/iti-seat-intake.service';
@Component({
  selector: 'app-SanctionOrder',
  templateUrl: './SanctionOrder.component.html',
  styleUrls: ['./SanctionOrder.component.css'],
    standalone: false
})
export class SanctionOrderComponent implements OnInit {
  groupForm!: FormGroup;
  groupFormUpdate!: FormGroup;
  public isUpdate: boolean = false;
  isEditing: boolean = false;
  public ID: number =0;
  public Message: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;

  public State: number = -1;
  public DistrictMasterList: any = []
  public DivisionMasterList: any = []
  public TehsilMasterList: any = []
  public SubjectMasterList: any = [];
  public ExamList: any[] = [];
  public UserID: number = 0;
  public searchText: string = '';
  public tbl_txtSearch: string = '';
  public isDisabledGrid: boolean = false;
  public isDisabledDOJ: boolean = false;
  public isSubmittedItemDetails: boolean = false;
  public isLoadingExport: boolean = false;
  public closeResult: string | undefined;
  public modalReference: NgbModalRef | undefined;
  sSOLoginDataModel = new SSOLoginDataModel();
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
  public Table_SearchText: string = "";
  pageNo: any = 1;
  pageSize: any = 50;
  isPre: boolean = false;
  isNext: boolean = false;
  totalRecord: any = 0;
  TotalPages: any = 0;
  request = new SanctionOrderModel();
  searchRequest = new SanctionOrderModel();
  newOrderNo: string = '';
  orderNos: string[] = [];
  duplicateError: string = '';
    @ViewChild('MyModel_ReplayQuery') MyModel_ReplayQuery: any;

  public SanctionOrderList: any[] = [];

  constructor(
    private fb: FormBuilder,
    private CompanyDispatchService: CompanyDispatchService,

    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private commonMasterService: CommonFunctionService,
    private loaderService: LoaderService,
    private modalService: NgbModal,
    private appsettingConfig: AppsettingService,
    private ItiSeatIntakeService: ItiSeatIntakeService,
  ) {

  }


  async ngOnInit() {
    this.ID = Number(this.route.snapshot.paramMap.get('id')) || 0;
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.groupForm = this.fb.group({
      AttachDocument: [''],
      OrderNo: ['', [ Validators.maxLength(6), Validators.pattern(/^[6-9]\d{9}$/)]],
      OrderNos: [[], Validators.required]
      
     
    });
    

    

    this.groupFormUpdate = this.fb.group({
      AttachDocument1: [''],
      OrderNoUpdate1: ['', Validators.required]
    });
    //await this.GetSubjectMasterList();
    //this.getExamMasterList()


    if (this.ID) {
      /*await this.GetByID(this.ID)*/
      this.isUpdate = true
      this.isEditing = true
    }
    await this.onSearch();
  }

  
  get _groupForm() { return this.groupForm.controls; }
 

  addOrderNo(): void {
    const newOrder = this.groupForm.get('OrderNo')?.value?.trim();
    this.duplicateError = '';

    if (newOrder) {
      const orderNos: string[] = this.groupForm.get('OrderNos')?.value || [];

      if (orderNos.includes(newOrder)) {
        this.duplicateError = `Order No "${newOrder}" already exists.`;
        return;
      }

      this.groupForm.patchValue({
        OrderNos: [...orderNos, newOrder],
        OrderNo: ''
      });
    }
  }

  removeOrderNo(index: number): void {
    const orderNos = this.groupForm.get('OrderNos')?.value || [];
    orderNos.splice(index, 1);
    this.groupForm.patchValue({ OrderNos: [...orderNos] });
  }

  



  async saveData() {
    debugger
    this.isSubmitted = true;

    if (!this.groupForm.valid) {
      
      this.toastr.error('Kindly provide at least one Order No.');
      return;
    }

    const formValues = this.groupForm.value;

   
   
       this.request.OrderNo = formValues.OrderNos.join(', ');
    
   
    try {
      this.loaderService.requestStarted();

      this.request.CreatedBy = this.sSOLoginDataModel.UserID;
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;

    

      this.request.ActiveStatus = true;
      await this.ItiSeatIntakeService.SaveSanctionOrderData(this.request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State = EnumStatus.Success) {
            this.toastr.success(data.Message)
            this.ResetControl();
            this.onSearch();
            /*this.router.navigate(['/SeatIntakesList'])*/
          }
          else {
            this.toastr.error(data.ErrorMessage)
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



    console.log('Mapped Request Model:', this.request);

    // Start loading
   

    
  }


 


  async ResetControl() {
    this.groupForm.reset();              // Clear the form
    this.isEditing = false;             // Reset editing mode
    this.isUpdate = false;              // Optional if you're using isUpdate
    this.request = new SanctionOrderModel();                  // Clear request object if needed
    this.ID = 0;                        // Reset ID
    this.groupForm.patchValue({ OrderNos: [] }); // Clear the OrderNos list
  }

  onCancel(): void {
    this.router.navigate(['/groups']);
  }


  public file!: File;
  async onFilechange(event: any, Type: string) {

    try {
      this.file = event.target.files[0];
      if (this.file) {
        if (this.file.type === 'application/pdf' || this.file.type === 'image/jpeg' || this.file.type === 'image/png') {
          //size validation
          if (this.file.size > 2000000) {
            this.toastr.error('Select less then 2MB File')
            return
          }
          //if (this.file.size < 100000) {
          //  this.toastr.error('Select more then 100kb File')
          //  return
          //}
        }
        else {// type validation
          this.toastr.error('error this file ?')
          return
        }
        // upload to server folder
        this.loaderService.requestStarted();
        await this.commonMasterService.UploadPublicInfoDocument(this.file)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));

            this.State = data['State'];
            this.Message = data['Message'];
            this.ErrorMessage = data['ErrorMessage'];

            if (this.State == EnumStatus.Success) {
              if (Type == "Photo") {

                this.request.AttachDocument = data['Data'][0]["FileName"]; 
                this.request.AttachDocumentUrl = data['Data'][0]["Dis_FileName"];

              }
             
              event.target.value = null;
            }
            if (this.State == EnumStatus.Error) {
              this.toastr.error(this.ErrorMessage)
            }
            else if (this.State == EnumStatus.Warning) {
              this.toastr.warning(this.ErrorMessage)
            }
          });
      }
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      /*setTimeout(() => {*/
      this.loaderService.requestEnded();
      /*  }, 200);*/
    }
  }

  async DeleteImage(FileName: any, Type: string) {
    try {
      // delete from server folder
      this.loaderService.requestEnded();
      await this.commonMasterService.DeleteDocument(FileName).then((data: any) => {
        this.State = data['State'];
        this.Message = data['Message'];
        this.ErrorMessage = data['ErrorMessage'];
        if (this.State == 0) {
          if (Type == "Photo") {
            this.request.AttachDocument = '';
            this.request.AttachDocumentUrl = '';
          }
         
          this.toastr.success(this.Message)
        }
        if (this.State == 1) {
          this.toastr.error(this.ErrorMessage)
        }
        else if (this.State == 2) {
          this.toastr.warning(this.ErrorMessage)
        }
      });
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


  async onSearch() {
    try {
      this.loaderService.requestStarted();
    
      await this.ItiSeatIntakeService.GetSanctionOrderData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State = EnumStatus.Success) {

            this.SanctionOrderList = Array.isArray(data?.Data) ? data.Data : [];
            this.loadInTable();
            //this.SanctionOrderList = data.Data
            console.log(this.SanctionOrderList, "SanctionOrderList")
            //table feature load
           
            //end table feature load
          }
          else {
            this.toastr.error(data.ErrorMessage)
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

  validateNumber(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab'];
    if (!/^[0-9]$/.test(event.key) && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }
 
  //btnEdit_OnClick(item: any) {
  //  this.isEditing = true;
  //  this.isUpdate = true;

  //  this.ID = item.SanctionOrderID;
  //  this.request.SanctionOrderID = item.SanctionOrderID;
  //  this.request.AttachDocument = item.AttachDocument;
  //  this.request.AttachDocumentUrl = item.AttachDocumentUrl;

  //  const splitOrderNos = item.OrderNo ? item.OrderNo.split(',').map((o: string) => o.trim()) : [];

  //  this.groupForm.patchValue({
  //    AttachDocument: item.AttachDocument,
  //    OrderNo: '', // empty input so user can type a new one
  //    OrderNos: splitOrderNos
  //  });
  //}
  btnEdit_OnClick(item: any) {
    debugger
    //this.isEditing = true;
    //this.isUpdate = true;

    
    
  }

  async onSubmitStaffRequest(model: any, item: any) {
    debugger
    try {

      this.ID = item.SanctionOrderID;
      this.request.SanctionOrderID = item.SanctionOrderID;
      this.request.AttachDocument = item.AttachDocument;
      this.request.AttachDocumentUrl = item.AttachDocumentUrl;
      this.request.OrderNo = item.OrderNo;

      //const splitOrderNos = item.OrderNo ? item.OrderNo.split(',').map((o: string) => o.trim()) : [];

      //this.groupForm.patchValue({
      //  AttachDocument: item.AttachDocument,
      //  OrderNo: '', // Don't allow entering new during edit
      //  OrderNos: '',
      //  OrderNoUpdate: splitOrderNos
      //});
      //this.groupForm.get('OrderNo')?.disable();


      //this.RowlistData = { ...userSubmitData };
      //console.log(this.RequestUpdateStatus, "modal");
      this.modalReference = this.modalService.open(model, { size: 'sm', backdrop: 'static' });

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }



  async UpdateData() {
    debugger
    this.isSubmitted = true;

    if (!this.groupFormUpdate.valid) {
      this.toastr.error('Please enter Order No.');
      return;
    }


    console.log(this.request.OrderNo);

    try {
      this.loaderService.requestStarted();

      this.request.CreatedBy = this.sSOLoginDataModel.UserID;
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;



      this.request.ActiveStatus = true;
      await this.ItiSeatIntakeService.SaveSanctionOrderData(this.request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State = EnumStatus.Success) {
            this.toastr.success(data.Message)
            this.ResetControl()
            this.CloseModal();
             this.onSearch();
          }
          else {
            this.toastr.error(data.ErrorMessage)
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



    console.log('Mapped Request Model:', this.request);

    // Start loading



  }



  CloseModal() {
    this.modalService.dismissAll();
    this.modalReference?.close();
    this.request = new SanctionOrderModel();
   
  }


  loadInTable() {
    this.resetInTableValiable();
    this.calculateInTableTotalPage();
    this.updateInTablePaginatedData();
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
    this.paginatedInTableData = [...this.SanctionOrderList].slice(this.startInTableIndex, this.endInTableIndex);
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

  resetInTableValiable() {
    this.paginatedInTableData = [];//copy of main data
    this.currentInTablePage = 1;
    this.totalInTablePage = 0;
    this.sortInTableColumn = '';
    this.sortInTableDirection = 'asc';
    this.startInTableIndex = 0;
    this.endInTableIndex = 0;
    this.totalInTableRecord = this.SanctionOrderList.length;
  }
}

