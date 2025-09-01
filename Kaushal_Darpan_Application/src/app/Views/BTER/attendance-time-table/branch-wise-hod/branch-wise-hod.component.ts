import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { EnumStatus } from "../../../../Common/GlobalConstants";
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { GuestApplyForGuestRoomSearchModel, GuestStaffProfileSearchModel } from '../../../../Models/GuestRoom-Management/GuestRoomManagmentDataModel';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { BranchHODModel } from '../../../../Models/StaffMasterDataModel';
import { GuestRoomManagmentService } from '../../../../Services/GuestRoomManagment/GuestRoomManagment.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { StaffMasterService } from '../../../../Services/StaffMaster/staff-master.service';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';

@Component({
  selector: 'app-branch-wise-hod',
  standalone: false,
  templateUrl: './branch-wise-hod.component.html',
  styleUrl: './branch-wise-hod.component.css'
})
export class BranchWiseHodComponent {
  public StreamMasterDDL: any = [];
  public request = new BranchHODModel()
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public isSubmit: boolean = false;
  SemesterMasterDDL: any[] = [];
  public SSOIDExists: boolean | null = null;
  public State: number = 0;
  public key: number = 0;
  public totalRecord: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public IIPMasterFormGroup!: FormGroup;
  public SSOIDFormGroup!: FormGroup;
  public sSOLoginDataModel = new SSOLoginDataModel();
  public ApplyList: any[] = []
  public BranchHideList: any[] = []
  public searchRequest = new GuestApplyForGuestRoomSearchModel();
  public searchRequestGuestStaffProfileSearchModel = new GuestStaffProfileSearchModel()
  displayedColumns: string[] = [
    'SNo', 'FirstName', 'SSOID', 'MobileNo', 'MailPersonal', 'StreamName', 'InstituteName', 'SemesterName'
  ];
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private staffMasterService: StaffMasterService, private commonMasterService: CommonFunctionService, private guestRoomManagmentService: GuestRoomManagmentService,
    private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder,
    private Swal2: SweetAlert2, private routers: Router) {
  }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.searchRequestGuestStaffProfileSearchModel.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.searchRequestGuestStaffProfileSearchModel.SSOID = this.sSOLoginDataModel.SSOID;
    this.searchRequestGuestStaffProfileSearchModel.RoleID = this.sSOLoginDataModel.RoleID;
    this.searchRequestGuestStaffProfileSearchModel.InstituteID = this.sSOLoginDataModel.InstituteID;
    this.SSOIDFormGroup = this.formBuilder.group({
      SSOID: ['', Validators.required]
    });
    this.IIPMasterFormGroup = this.formBuilder.group(
      {
        SemesterID: [0, []],
        StreamIDs: [[]],
        DisplayName: ['', []],
        MailPersonal: ['', []],
        MobileNo: ['', []]
      });

    await this.GetBranchHODApplyList();

    //await this.commonMasterService.StreamMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID).then((data: any) => {
    //  data = JSON.parse(JSON.stringify(data));
    //  this.StreamMasterDDL = data.Data;
    //})

    await this.commonMasterService.SemesterMaster().then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      this.SemesterMasterDDL = data.Data;
    })
  }

  async loadData() {

    await this.guestRoomManagmentService.GuestStaffProfile(this.searchRequestGuestStaffProfileSearchModel)
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.State = data['State'];
        this.Message = data['Message'];
        this.ErrorMessage = data['ErrorMessage'];
        this.request.CollegeID = data['Data'];
        this.request.CollegeID = data['Data'][0]['InstituteID'];
        this.request.DisplayName = data['Data'][0]['DisplayName'];
        this.request.FirstName = data['Data'][0]['DisplayName'];
        this.request.MailPersonal = data['Data'][0]['Email'];
        this.request.MobileNo = data['Data'][0]['MobileNumber'];
      }, error => console.error(error));
    this.request.ModifyBy = this.sSOLoginDataModel.UserID;
    this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
  }
  get _IIPMasterFormGroup() { return this.IIPMasterFormGroup.controls; }
  get _SSOIDFormGroup() { return this.SSOIDFormGroup.controls; }

  async CheckUserExists(SSOID: any) {
    if (SSOID.target.value != null) {
      debugger
      this.isSubmit = true;
      await this.commonMasterService.CheckSSOIDExists(SSOID.target.value, this.sSOLoginDataModel.RoleID, this.sSOLoginDataModel.InstituteID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data.body));
          this.searchRequestGuestStaffProfileSearchModel.SSOID = SSOID.target.value;
          if (data['State'] === 1) {
            this.toastr.success(data.Message);
            this.SSOIDExists = true;
          } else {
            this.toastr.warning(data.Message);
            this.SSOIDExists = false;
          }
        }, error => console.error(error));
    }

  }

  async PostUserExists() {
    if (this.SSOIDExists) {

      await this.loadData();
    } else {
      this.toastr.warning("Not Exists SSOID");
    }

  }


  async GetBranchHODApplyList() {
    try {
      debugger
      this.request.Action = "GETALL";
      this.request.StreamID = 0;
      this.request.StreamIDs = this.IIPMasterFormGroup.value.StreamIDs?.join(',');
      await this.staffMasterService.AllBranchHOD(this.request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.ApplyList = data['Data'];
          this.totalRecord = data['Data'].length;
          this.initTable();
          this.ResetControls();
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

  async btnDeleteOnClick(item: any) {
    this.Swal2.Confirmation("Are you sure you want to delete this ?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          try {
            this.request.DeleteStatus = true;
            this.request.ActiveStatus = false;
            this.request.ModifyBy = this.sSOLoginDataModel.UserID;
            this.request.Action = "SAVE";
            this.request.ID = item.ID;
            await this.staffMasterService.AllBranchHOD(this.request)
              .then((data: any) => {
                data = JSON.parse(JSON.stringify(data));
                this.State = data['State'];
                this.Message = data['Message'];
                this.ErrorMessage = data['ErrorMessage'];
                this.ApplyList = data['Data'];
                this.totalRecord = data['Data'].length;
                this.initTable();
                this.ResetControls();
              }, error => console.error(error));
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

  // get detail by id
  async SaveData() {
    try {
      this.isSubmitted = true;
      debugger


      const formValue = this.IIPMasterFormGroup.value;

      if (!formValue.SemesterID || formValue.SemesterID === 0) {
        this.toastr.warning('Please select Semester');
        return;
      }
      if (!formValue.StreamIDs || formValue.StreamIDs.length === 0) {
        this.toastr.warning('Please select at least one Branch');
        return;
      }

      if (!formValue.DisplayName || formValue.DisplayName.trim() === '') {
        this.toastr.warning('Please enter Name');
        return;
      }




      const isSSOID = this.ApplyList.some((x: { SSOID: string }) =>
        x.SSOID === this.SSOIDFormGroup.value.SSOID
      );
      //if (this.IIPMasterFormGroup.invalid || isSSOID) {
      //  this.toastr.warning("Not Exists SSOID");
      //  return
      //}
      this.request.StreamID = 0;
      this.request.ModifyBy = this.sSOLoginDataModel.UserID;
      this.request.SSOID = this.SSOIDFormGroup.value.SSOID;
      /*this.request.StreamID = this.IIPMasterFormGroup.value.StreamID;*/
      this.request.StreamIDs = this.IIPMasterFormGroup.value.StreamIDs?.join(',');
      /*   this.request.StreamIDs = this.IIPMasterFormGroup.value.StreamIDs?.join(',');*/
      this.request.Action = "Save";
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.request.UserID = this.sSOLoginDataModel.UserID;
      this.request.RoleID = this.sSOLoginDataModel.RoleID;
      this.request.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.request.SemesterID = this.IIPMasterFormGroup.value.SemesterID;


      await this.staffMasterService.AllBranchHOD(this.request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.ApplyList = data['Data'];
          this.totalRecord = data['Data'].length;

          this.initTable();
          this.ResetControls();
          if (data.State === EnumStatus.Success) {
            this.toastr.success('Data saved successfully!');
          }
          else if (data.State === EnumStatus.Success) {
            this.toastr.error(this.ErrorMessage || 'Something went wrong!');
          }

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

  // reset
  ResetControls() {
    this.request = new BranchHODModel();
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.request.ModifyBy = this.sSOLoginDataModel.UserID;
    this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.request.CollegeID = 0;
    this.request.DisplayName = '';
    this.request.FirstName = '';
    this.request.LastName = '';
    this.request.MailPersonal = '';
    this.request.MobileNo = '';
    this.request.SSOID = '';
    this.request.StreamIDs = [];
    this.request.SemesterID = 0;
    this.IIPMasterFormGroup.get('StreamIDs')?.setValue([]);
    this.SSOIDFormGroup.get('SSOID')?.setValue('');
    this.SSOIDExists = null;
    this.StreamMasterDDL = [];
    

    
  }

  initTable() {
    this.dataSource = new MatTableDataSource(this.ApplyList);
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

  //async GetBranchHideList() {
  //  try {


  //    let request = {
  //      EndTermID: this.sSOLoginDataModel.EndTermID,
  //      SemesterID: this.IIPMasterFormGroup.value.SemesterID,
  //      InstituteID: this.sSOLoginDataModel.InstituteID
  //    };

  //    await this.staffMasterService.GetStreamIDBySemester(request)
  //      .then((data: any) => {
  //        data = JSON.parse(JSON.stringify(data));
  //        this.State = data['State'];
  //        this.Message = data['Message'];
  //        this.ErrorMessage = data['ErrorMessage'];
  //        this.BranchHideList = data['Data'];
  //        debugger
  //        const hideIDs = this.BranchHideList.map((b: any) => b.StreamID);

  //        // Step 2: Filter StreamMasterDDL
  //        this.StreamMasterDDL = this.StreamMasterDDL.filter(
  //          (x: any) => !hideIDs.includes(x.StreamID)
  //        );
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

  async GetBranchHideList() {
    try {
      let request = {
        EndTermID: this.sSOLoginDataModel.EndTermID,
        SemesterID: this.IIPMasterFormGroup.value.SemesterID,
        InstituteID: this.sSOLoginDataModel.InstituteID
      };
      
      await this.staffMasterService.GetStreamIDBySemester(request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.BranchHideList = data['Data'];

          const hideIDs = this.BranchHideList.map((b: any) => b.StreamID);

          // Filter StreamMasterDDL to hide existing branches
          this.StreamMasterDDL = this.StreamMasterDDL.filter(
            (x: any) => !hideIDs.includes(x.StreamID)
          );

       
          const semester = this.IIPMasterFormGroup.value.SemesterID;
          if (semester === 1 || semester === 2) {
           
            const allIDs = this.StreamMasterDDL.map((x: any) => x.StreamID);
            this.IIPMasterFormGroup.get('StreamIDs')?.setValue(allIDs);
          } else {
        
            this.IIPMasterFormGroup.get('StreamIDs')?.setValue([]);
          }
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


  async onSemesterChange(event: any) {
    if (this.request.SemesterID && this.request.SemesterID != 0) {
      debugger
      await this.commonMasterService.StreamMaster(
        this.sSOLoginDataModel.DepartmentID,
        this.sSOLoginDataModel.Eng_NonEng,
        this.sSOLoginDataModel.EndTermID
      ).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.StreamMasterDDL = data.Data;
      });

    
      await this.GetBranchHideList();
    }
  }
}
