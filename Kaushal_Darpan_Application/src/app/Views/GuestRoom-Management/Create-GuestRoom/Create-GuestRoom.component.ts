import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GuestRoomManagmentService } from '../../../Services/GuestRoomManagment/GuestRoomManagment.service';
import { ToastrService } from 'ngx-toastr';
import { EnumStatus } from '../../../Common/GlobalConstants';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CreateGuestRoomDataModel, GuestRoomSearchModel } from '../../../Models/GuestRoom-Management/GuestRoomManagmentDataModel';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-Create-GuestRoom',
  templateUrl: './Create-GuestRoom.component.html',
  styleUrls: ['./Create-GuestRoom.component.css'],
  standalone: false
})
export class CreateGuestRoomComponent {
  groupForm!: FormGroup;
  public GuestHouseID: number | null = null;
  public isUpdate: boolean = false;
  sSOLoginDataModel = new SSOLoginDataModel();
  public Table_SearchText: string = "";
  public tbl_txtSearch: string = '';
  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  request = new CreateGuestRoomDataModel()
  public searchRequest = new GuestRoomSearchModel();
  public DistrictMasterList: any = [];
  public StaffID: number | null = null;
  public GuestRoomList: any = []; 
  public totalRecords: any = 0; 
  displayedColumns: string[] = [
    'SNo', 'GuestHouseName', 'PhoneNumber', 'Address', 'Action'
  ];
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private fb: FormBuilder,
    private _GuestRoomManagmentService: GuestRoomManagmentService,
    private toastr: ToastrService,
    private loaderService: LoaderService
  ) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.groupForm = this.fb.group({
      txtGuestHouseName: ['', Validators.required],
      //txtPhoneNumber: ['', Validators.required],
      txtAddress: ['', Validators.required],
      txtPhoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]]
    });
    //this.searchRequest.DepartmentID = 2;
    await this.GetAllGuestRoomList(); 
  }

  validatePhoneNumber(event: any): void {
    // Only allow numeric characters
    const phoneNumber = event.target.value;

    // Remove all non-digit characters
    const sanitizedValue = phoneNumber.replace(/\D/g, '');

    // Set the value back to the input but limit it to 10 digits
    this.request.PhoneNumber = sanitizedValue.substring(0, 10);

    // Update the form control value to reflect the changes
    this.groupForm.controls['txtPhoneNumber'].setValue(this.request.PhoneNumber);
  }

  async saveData() {    
    this.isSubmitted = true;
    if (this.groupForm.invalid) {
      return console.log("error")
    }
    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;

    try {
      if (this.GuestHouseID) {
        this.request.GuestHouseID = this.GuestHouseID
        this.request.ModifyBy = this.sSOLoginDataModel.UserID;
      } else {
        this.request.CreatedBy = this.sSOLoginDataModel.UserID;
      }     
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;  
      await this._GuestRoomManagmentService.SaveData(this.request)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == EnumStatus.Success) {
            this.ResetControl();
            this.toastr.success(this.Message)
            this.GetAllGuestRoomList();
          } else if (this.State == EnumStatus.Warning) {
            this.toastr.warning(this.ErrorMessage)
          }
          else {
            this.toastr.error(this.ErrorMessage)
          }
        })
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isLoading = false;
      }, 200);
    }
  }

  async GetByID(id: number) {    
    try {
      this.loaderService.requestStarted();
      await this._GuestRoomManagmentService.GetByID(id).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.Data !== null) {
          this.request.GuestHouseID = data.Data.GuestHouseID;
          this.request.GuestHouseName = data.Data.GuestHouseName;
          this.request.Address = data.Data.Address;         
          this.request.PhoneNumber = data.Data.PhoneNumber;
          this.GuestHouseID = data.Data.GuestHouseID;
          this.isUpdate = true;
        }
      });
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async ResetControl() {
    this.isSubmitted = false;
    this.isUpdate = false;
    this.request = new CreateGuestRoomDataModel();
    this.groupForm.reset();
    // Reset form values if necessary
    this.groupForm.patchValue({
      GuestHouseName:''
    });

    this.GetAllGuestRoomList();
  }

  async GetAllGuestRoomList() {
      try {
        this.loaderService.requestStarted();
        this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
        await this._GuestRoomManagmentService.GetAllGuestRoomList(this.searchRequest)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            this.State = data['State'];
            this.Message = data['Message'];
            this.ErrorMessage = data['ErrorMessage'];
            this.GuestRoomList = data['Data'];
            this.totalRecords = data['Data'].length
            this.initTable();
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

  initTable() {
    this.dataSource = new MatTableDataSource(this.GuestRoomList);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource.filterPredicate = (d: any, filter: string) => {
      const dataStr = Object.values(d).join(' ').toLowerCase();
      return dataStr.includes(filter);
    };
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
