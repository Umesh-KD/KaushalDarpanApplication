
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as XLSX from 'xlsx';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../Services/Loader/loader.service';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DesignationMasterService } from '../../Services/DesignationMaster/Designation-master.service';
import { SweetAlert2 } from '../../Common/SweetAlert2';
import { EnumStatus } from '../../Common/GlobalConstants';
import { QueryRequestModel } from '../../Models/DesignationMasterDataModel';

@Component({
  selector: 'app-query-request-submission',
  templateUrl: './query-request-submission.component.html',
  styleUrls: ['./query-request-submission.component.css'],
  standalone: false
})
export class QueryRequestSubmissionComponent implements OnInit {

  // Form
  RequestFormGroup!: FormGroup;

  // General properties
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public isLoadingExport: boolean = false;

  public UserID: number = 0;
  public RequestList: any[] = [];

  public sSOLoginDataModel = new SSOLoginDataModel();

  // Current request
  public request: any = new QueryRequestModel();
  // getDefaultRequest

  // Search properties
  public searchText: string = '';
  public Table_SearchText: string = '';

  public searchRequest: any = {
    DepartmentName: '',
    RequestType: '',
    Status: ''
  };

  // Modal
  public closeResult: string | undefined;
  public modalReference: NgbModalRef | undefined;

  // Filtered data used for sorting and pagination
  private filteredRequestList: any[] = [];

  // Table feature default - same pattern as Designation Master
  public paginatedInTableData: any[] = [];
  public currentInTablePage: number = 1;
  public pageInTableSize: string = '10';
  public totalInTablePage: number = 0;
  public sortInTableColumn: string = '';
  public sortInTableDirection: string = 'asc';
  public startInTableIndex: number = 0;
  public endInTableIndex: number = 0;
  public AllInTableSelect: boolean = false;
  public totalInTableRecord: number = 0;
  // End table feature default


  constructor(
    private designationMasterService: DesignationMasterService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private Swal2: SweetAlert2
  ) { }


  // Initialisation
  async ngOnInit(): Promise<void> {

    this.RequestFormGroup = this.formBuilder.group({
      RequestID: [0],
      RequesterName: ['', [
        Validators.required,
        Validators.maxLength(150)
      ]],
      DepartmentName: ['', Validators.required],
      RequestType: ['', Validators.required],
      RequestDescription: ['', [
        Validators.required,
        Validators.maxLength(2000)
      ]],
      Priority: ['Medium', Validators.required],
      Status: ['Pending']
    });

    try {
      const loginData = localStorage.getItem('SSOLoginUser');

      if (loginData) {
        this.sSOLoginDataModel = JSON.parse(loginData);
        this.UserID = Number(this.sSOLoginDataModel.UserID || 0);
      }
    } catch (error) {
      console.error('Error reading logged-in user:', error);
    }

    await this.GetRequestList();
  }


  // Default request object
  // private getDefaultRequest(): any {
  //   return {
  //     RequestID: 0,
  //     RequesterName: '',
  //     DepartmentName: '',
  //     RequestType: '',
  //     RequestDescription: '',
  //     Priority: 'Medium',
  //     Status: 'Pending',
  //     UserID: 0
  //   };
  // }


  // Form controls
  get form() {
    return this.RequestFormGroup.controls;
  }


  // Parse API response safely
  private parseResponse(response: any): any {

    if (response == null) {
      return {};
    }

    if (typeof response === 'string') {
      try {
        return JSON.parse(response);
      } catch {
        return {};
      }
    }

    return response;
  }


  // Get all Query / Request records
  async GetRequestList(): Promise<void> {

    debugger
    try {
      this.loaderService.requestStarted();

      const response: any =
        await this.designationMasterService.GetAllRequests(
          this.searchRequest
        );

      const data = this.parseResponse(response);

      if (data.State === EnumStatus.Success) {

        this.RequestList = Array.isArray(data.Data)
          ? data.Data
          : [];

        this.loadInTable();

      } else if (Array.isArray(data.Data)) {

        this.RequestList = data.Data;
        this.loadInTable();

      } else {

        this.RequestList = [];
        this.loadInTable();

        if (data.ErrorMessage || data.Message) {
          this.toastr.error(
            data.ErrorMessage || data.Message
          );
        }
      }

    } catch (error) {

      console.error('GetRequestList error:', error);
      this.RequestList = [];
      this.loadInTable();
      this.toastr.error('Unable to load request records.');

    } finally {

      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);

    }
  }


  // Get request by ID
  async GetRequestByID(RequestID: number): Promise<void> {

    debugger
    try {
      this.loaderService.requestStarted();

      // const response: any =
      //   await this.designationMasterService.GetQueryRequestByID(RequestID);

      // const data = this.parseResponse(response);
     await this.designationMasterService.GetQueryRequestByID(RequestID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.request = data['Data'];

          if (data.State !== undefined && data.State !== EnumStatus.Success) {
            this.toastr.error(
              data.ErrorMessage || data.Message || 'Unable to get request.'
            );
            return;
          }

          const record = data.Data ?? data;

          if (!record || typeof record !== 'object') {
            this.toastr.error('Request record not found.');
            return;
          }
          // Patch the form group with the fetched data

          this.RequestFormGroup.patchValue({
            RequestID: this.request.RequestID ?? RequestID,
            RequesterName: this.request.RequesterName ?? '',
            DepartmentName: this.request.DepartmentName ?? '',
            RequestType: this.request.RequestType ?? '',
            RequestDescription: this.request.RequestDescription ?? '',
            Priority: this.request.Priority ?? 'Medium',
            Status: this.request.Status ?? 'Pending'
          });

        }, error => console.error(error));      


    } catch (error) {

      console.error('GetRequestByID error:', error);
      this.toastr.error('Unable to load request details.');

    } finally {

      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);

    }
  }


  // Save new request or update existing request
  async SaveData(): Promise<void> {

    this.isSubmitted = true;

    if (this.RequestFormGroup.invalid) {
      this.RequestFormGroup.markAllAsTouched();
      this.toastr.error('Please fill in all required fields.');
      return;
    }

    const formValue = this.RequestFormGroup.getRawValue();
    const requestID = Number(formValue.RequestID || 0);

    const payload: any = {
      ...this.request,
      ...formValue,
      RequestID: requestID,
      UserID: this.sSOLoginDataModel.UserID || 0
    };

    try {

      this.loaderService.requestStarted();
      this.isLoading = true;

      let response: any;
    debugger
      // if (requestID > 0) {

      //   response =
      //     await this.designationMasterService.UpdateRequest(payload);

      // } else {

      //   response =
      //     await this.designationMasterService.SaveQueryRequest(payload);

      // }

      response =
          await this.designationMasterService.SaveQueryRequest(payload);

      const data = this.parseResponse(response);

      if (data.State === EnumStatus.Success) {

        this.toastr.success(
          data.Message ||
          (requestID > 0
            ? 'Request updated successfully.'
            : 'Request submitted successfully.')
        );

        await this.CloseModalPopup();
        await this.GetRequestList();

      } else {

        this.toastr.error(
          data.ErrorMessage || data.Message || 'Unable to save request.'
        );

      }

    } catch (error) {

      console.error('SaveData error:', error);
      this.toastr.error('An error occurred while saving the request.');

    } finally {

      this.isLoading = false;

      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);

    }
  }


  // Edit request
  async btnEdit_OnClick(RequestID: number): Promise<void> {

    this.isSubmitted = false;
    // this.request = this.getDefaultRequest();

    this.RequestFormGroup.reset({
      RequestID: 0,
      RequesterName: '',
      DepartmentName: '',
      RequestType: '',
      RequestDescription: '',
      Priority: 'Medium',
      Status: 'Pending'
    });

    await this.GetRequestByID(RequestID);
  }


  // Delete request - same confirmation callback pattern as Designation Master
  async btnDelete_OnClick(RequestID: number): Promise<void> {

    this.isSubmitted = false;

    if (!RequestID || RequestID <= 0) {
      this.toastr.error('Invalid request ID.');
      return;
    }

    this.Swal2.Confirmation(
      'Do you want to delete?',
      async (result: any) => {
        if (result.isConfirmed) {
          try {
            this.loaderService.requestStarted();
            await this.designationMasterService.DeleteQueryRequest(RequestID, this.sSOLoginDataModel.UserID)
              .then(async (response: any) => {
                const data = this.parseResponse(response);
                if (data.State === EnumStatus.Success) {
                  this.toastr.success(
                    data.Message || 'Request deleted successfully.'
                  );
                  await this.GetRequestList();
                } else {
                  this.toastr.error(
                    data.ErrorMessage || data.Message || 'Unable to delete request.'
                  );
                }
              });

          } catch (error) {
            console.error('Delete request error:', error);
          } 

        }
      }
    );
  }


  // Reset form
  async ResetControl(): Promise<void> {

    this.isSubmitted = false;

    const requestID = Number(
      this.RequestFormGroup.get('RequestID')?.value || 0
    );

    this.request = new QueryRequestModel();

    this.RequestFormGroup.reset({
      RequestID: requestID,
      RequesterName: '',
      DepartmentName: '',
      RequestType: '',
      RequestDescription: '',
      Priority: 'Medium',
      Status: 'Pending'
    });
  }


  // Open Add / Edit modal
  async ViewandUpdate(content: any, id: number = 0): Promise<void> {
    debugger
    this.isSubmitted = false;
    this.request = new QueryRequestModel();

    this.RequestFormGroup.reset({
      RequestID: 0,
      RequesterName: '',
      DepartmentName: '',
      RequestType: '',
      RequestDescription: '',
      Priority: 'Medium',
      Status: 'Pending'
    });

    if (id > 0) {
      await this.btnEdit_OnClick(id);
    }

    this.modalReference = this.modalService.open(content, {
      backdrop: 'static',
      size: 'xl',
      keyboard: true,
      centered: true
    });
  }


  // Close modal
  async CloseModalPopup(): Promise<void> {

    this.request = new QueryRequestModel();
    this.isSubmitted = false;

    this.modalService.dismissAll();
    this.modalReference = undefined;
  }


  // Reset search fields
  async ResetSearch(): Promise<void> {

    this.searchRequest = {
      DepartmentName: '',
      RequestType: '',
      Status: ''
    };

    this.Table_SearchText = '';
    this.searchText = '';

    await this.GetRequestList();
  }


  // Export request data to Excel
  exportToExcel(): void {

    if (!this.filteredRequestList || this.filteredRequestList.length === 0) {
      this.toastr.warning('No data available to export.');
      return;
    }

    try {

      this.isLoadingExport = true;

      const exportData = this.RequestList.map(
        (item: any, index: number) => ({
          'Sr. No.': index + 1,
          'Request ID': item.RequestID ?? '',
          'Requester Name': item.RequesterName ?? '',
          'Department': item.DepartmentName ?? '',
          'Request Type': item.RequestType ?? '',
          'Description': item.RequestDescription ?? '',
          'Priority': item.Priority ?? '',
          'Status': item.Status ?? ''
        })
      );

      const worksheet: XLSX.WorkSheet =
        XLSX.utils.json_to_sheet(exportData);

      worksheet['!cols'] = [
        { wch: 10 },
        { wch: 14 },
        { wch: 25 },
        { wch: 18 },
        { wch: 24 },
        { wch: 50 },
        { wch: 12 },
        { wch: 18 }
      ];

      const workbook: XLSX.WorkBook = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        'Query Request'
      );

      const timestamp = new Date()
        .toISOString()
        .replace(/[:.-]/g, '_');

      XLSX.writeFile(
        workbook,
        `query_request_${timestamp}.xlsx`
      );

    } catch (error) {

      console.error('Excel export error:', error);
      this.toastr.error('Unable to export Excel file.');

    } finally {

      this.isLoadingExport = false;

    }
  }


  // Get filtered records using search criteria
  private getFilteredData(): any[] {
    debugger
    let data = [...(this.RequestList || [])];

    // Department filter
    if (this.searchRequest.DepartmentName) {
      data = data.filter((item: any) =>
        String(item.DepartmentName ?? '') ===
        String(this.searchRequest.DepartmentName)
      );
    }

    // Request type filter
    if (this.searchRequest.RequestType) {
      data = data.filter((item: any) =>
        String(item.RequestType ?? '') ===
        String(this.searchRequest.RequestType)
      );
    }

    // Status filter
    if (this.searchRequest.Status) {
      data = data.filter((item: any) =>
        String(item.Status ?? '') ===
        String(this.searchRequest.Status)
      );
    }

    // Text search
    const search = String(this.Table_SearchText || '')
      .trim()
      .toLowerCase();

    if (search) {
      data = data.filter((item: any) => {

        const values = [
          item.RequestID,
          item.RequesterName,
          item.DepartmentName,
          item.RequestType,
          item.RequestDescription,
          item.Priority,
          item.Status
        ];

        return values.some((value: any) =>
          String(value ?? '').toLowerCase().includes(search)
        );
      });
    }

    // Sorting
    if (this.sortInTableColumn) {
      const field = this.sortInTableColumn;
      const direction = this.sortInTableDirection;

      data.sort((a: any, b: any) => {

        const valueA = a[field] ?? '';
        const valueB = b[field] ?? '';

        const comparison = String(valueA).localeCompare(
          String(valueB),
          undefined,
          { numeric: true, sensitivity: 'base' }
        );

        return direction === 'asc' ? comparison : -comparison;
      });
    }

    return data;
  }


  // Calculate total pages
  calculateInTableTotalPage(): void {

    const pageSize = parseInt(this.pageInTableSize, 10);

    this.totalInTablePage = pageSize > 0
      ? Math.ceil(this.totalInTableRecord / pageSize)
      : 0;
  }


  // Update paginated data
  updateInTablePaginatedData(): void {

    const pageSize = parseInt(this.pageInTableSize, 10);

    if (pageSize <= 0) {
      this.paginatedInTableData = [];
      this.startInTableIndex = 0;
      this.endInTableIndex = 0;
      return;
    }

    if (this.totalInTablePage === 0) {
      this.currentInTablePage = 1;
    } else if (this.currentInTablePage > this.totalInTablePage) {
      this.currentInTablePage = this.totalInTablePage;
    }

    this.startInTableIndex =
      (this.currentInTablePage - 1) * pageSize;

    this.endInTableIndex = Math.min(
      this.startInTableIndex + pageSize,
      this.totalInTableRecord
    );

    this.paginatedInTableData = [
      ...this.RequestList
    ].slice(
      this.startInTableIndex,
      this.endInTableIndex
    );
  }


  // Previous page
  previousInTablePage(): void {

    if (this.currentInTablePage > 1) {
      this.currentInTablePage--;
      this.updateInTablePaginatedData();
    }
  }


  // Next page
  nextInTablePage(): void {

    if (
      this.currentInTablePage < this.totalInTablePage &&
      this.totalInTablePage > 0
    ) {
      this.currentInTablePage++;
      this.updateInTablePaginatedData();
    }
  }


  // First page
  firstInTablePage(): void {

    if (this.currentInTablePage > 1) {
      this.currentInTablePage = 1;
      this.updateInTablePaginatedData();
    }
  }


  // Last page
  lastInTablePage(): void {

    if (
      this.currentInTablePage < this.totalInTablePage &&
      this.totalInTablePage > 0
    ) {
      this.currentInTablePage = this.totalInTablePage;
      this.updateInTablePaginatedData();
    }
  }


  // Go to entered page number
  randamInTablePage(): void {

    const page = Number(this.currentInTablePage);

    if (
      !Number.isInteger(page) ||
      page <= 0 ||
      page > this.totalInTablePage
    ) {
      this.currentInTablePage = 1;
    }

    this.updateInTablePaginatedData();
  }


  // Sort table data
  async sortInTableData(field: string): Promise<void> {

    if (this.sortInTableColumn === field) {
      this.sortInTableDirection =
        this.sortInTableDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortInTableColumn = field;
      this.sortInTableDirection = 'asc';
    }

    this.loadInTable();
  }


  // Load table and apply filters
  loadInTable(): void {

    this.resetInTableValiable();

    // this.filteredRequestList = this.getFilteredData();

    // this.totalInTableRecord = this.filteredRequestList.length;
    this.totalInTableRecord = this.RequestList.length;

    this.calculateInTableTotalPage();

    this.updateInTablePaginatedData();
  }


  // Reset table variables
  resetInTableValiable(): void {

    this.paginatedInTableData = [];
    this.currentInTablePage = 1;
    this.totalInTablePage = 0;
    this.startInTableIndex = 0;
    this.endInTableIndex = 0;
    this.totalInTableRecord = 0;
    this.AllInTableSelect = false;
  }


  // Sorting arrow
  get sortInTableDirectionAero(): string {
    return this.sortInTableDirection === 'asc'
      ? '&uarr;'
      : '&darr;';
  }

  // End table feature
}
