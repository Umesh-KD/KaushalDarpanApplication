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
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

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
  GetBranchStreamData: any = [];
  public ApplyList: any[] = []
  public BranchHideList: any[] = []
  totalRecord1 = 0;
  public SemesterStreamList: any[] = []
  public searchRequest = new GuestApplyForGuestRoomSearchModel();
  public searchRequestGuestStaffProfileSearchModel = new GuestStaffProfileSearchModel()
  displayedColumns: string[] = [
    'SNo', 'FirstName', 'SSOID', 'MobileNo', 'StreamName', 'InstituteName', 'SemesterName','actions'
  ];
  @ViewChild('paginator1') paginator1!: MatPaginator;
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource1!: MatTableDataSource<any>;
  closeResult: string | undefined;
  modalRef1: NgbModalRef | null = null;
  displayedColumns1: string[] = [
    'SNo', 'FirstName', 'SSOID', 'MobileNo',  'StreamName', 'InstituteName', 'SemesterName', 'EndTermName'
  ];

  constructor(private staffMasterService: StaffMasterService, private commonMasterService: CommonFunctionService, private guestRoomManagmentService: GuestRoomManagmentService,
    private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder,
    private Swal2: SweetAlert2, private routers: Router, private modalService: NgbModal,) {
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

    if (this.ApplyList.length > 0) {
      this.createSemesterStreamMap();
    }

    //await this.commonMasterService.StreamMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID).then((data: any) => {
    //  data = JSON.parse(JSON.stringify(data));
    //  this.StreamMasterDDL = data.Data;
    //})
    await this.SemesterMaster();
    
  }
  async SemesterMaster() {
    debugger
    await this.commonMasterService.SemesterMaster().then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      this.SemesterMasterDDL = data.Data;
      console.log('Semester Master DDL List ===>', this.SemesterMasterDDL)
    })
  }

  async loadData() {
    debugger
    await this.guestRoomManagmentService.GuestStaffProfile(this.searchRequestGuestStaffProfileSearchModel)
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.State = data['State'];
        this.Message = data['Message'];
        this.ErrorMessage = data['ErrorMessage'];
        //this.request.CollegeID = data['Data'];
        this.request.CollegeID = data['Data'][0]['InstituteID'] ?? 0;
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
    debugger
    if (SSOID.target.value != null) {
      //debugger
      this.isSubmit = true;
      await this.commonMasterService.CheckSSOIDExists(SSOID.target.value, this.sSOLoginDataModel.RoleID, this.sSOLoginDataModel.InstituteID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data.body));
          this.searchRequestGuestStaffProfileSearchModel.SSOID = SSOID.target.value;
          if (data['State'] === 1) {
            this.toastr.success(data.Message);
            this.SSOIDExists = true;
            this.PostUserExists();
          } else {
            this.toastr.warning(data.Message);
            this.SSOIDExists = false;
          }
        }, error => console.error(error));
    }

  }

  async PostUserExists() {
    debugger;
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
      this.request.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.request.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.request.CollegeID = this.sSOLoginDataModel.InstituteID;
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
    debugger;
    this.Swal2.Confirmation("Are you sure you want to delete this ?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          try {
            // this.request.DeleteStatus = true;
            // this.request.ActiveStatus = false;
            this.request.StreamID = 0;
            this.request.StreamIDs = this.IIPMasterFormGroup.value.StreamIDs?.join(',');
            this.request.EndTermID = this.sSOLoginDataModel.EndTermID;
            this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
            this.request.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
            this.request.ModifyBy = this.sSOLoginDataModel.UserID;
            this.request.Action = "DELETE";
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
                this.GetBranchHODApplyList();
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

      debugger


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
      this.request.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.request.SemesterID = this.IIPMasterFormGroup.value.SemesterID;
      this.request.CollegeID = this.sSOLoginDataModel.InstituteID
  
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
          this.GetBranchHODApplyList();

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


  //async onSemesterChange(event: any) {
  //  if (this.request.SemesterID == 1) {
  //    this.request.SemesterIDs = "1,2";
  //  }
  //  else if (this.request.SemesterID == 3) {
  //    this.request.SemesterIDs = "3,4,5";
  //  }

  //  debugger
  //  if (this.request.SemesterID && this.request.SemesterID != 0) {
  //    debugger
  //    await this.commonMasterService.Stream_InstituteIdWise(
  //      this.sSOLoginDataModel.DepartmentID,
  //      this.sSOLoginDataModel.Eng_NonEng,
  //      this.sSOLoginDataModel.EndTermID,
  //      this.sSOLoginDataModel.InstituteID,
  //      this.sSOLoginDataModel.FinancialYearID
  //    ).then((data: any) => {
  //      data = JSON.parse(JSON.stringify(data));
  //      this.StreamMasterDDL = data.Data;
  //    });


  //    await this.GetBranchHideList();
  //  }
  //}


  async onSemesterChange(event: any) {
    debugger
    this.request.StreamID = 0;
    this.IIPMasterFormGroup.get('StreamIDs')?.setValue('')
    if (this.request.SemesterID == 1) {
      this.request.SemesterIDs = "1,2";
    }
    else if (this.request.SemesterID == 3) {
      this.request.SemesterIDs = "3,4,5";
    }

    if (this.request.SemesterID && this.request.SemesterID != 0) {

      // 👉 1. Load all streams
      await this.commonMasterService.Stream_InstituteIdWise(
        this.sSOLoginDataModel.DepartmentID,
        this.sSOLoginDataModel.Eng_NonEng,
        this.sSOLoginDataModel.EndTermID,
        this.sSOLoginDataModel.InstituteID,
        this.sSOLoginDataModel.FinancialYearID
      ).then((data: any) => {
        this.StreamMasterDDL = data.Data;
      });

      const selectedSem = this.request.SemesterID.toString();

      // 👉 2. Get streams to REMOVE
      const semData = this.SemesterStreamList.find(
        (x: any) => x.SemesterID === selectedSem
      );

      if (semData && semData.StreamID) {

        const removeStreams = semData.StreamID
          .split(',')
          .map((x: string) => x.trim());

        // 👉 3. Show ONLY those streams which are NOT in SemesterStreamList
        this.StreamMasterDDL = this.StreamMasterDDL.filter((item: any) =>
          !removeStreams.includes((item.StreamID || item.ID).toString())
        );

      }

      console.log('Final DDL:', this.StreamMasterDDL);

      await this.GetBranchHideList();
    }
  }

  async EditDataSection(rowData: any) {
    debugger
    this.SSOIDFormGroup.patchValue({
      SSOID: rowData.SSOID,
    
    });

    const streamIdArray = rowData.StreamID
      ? rowData.StreamID
        .toString()
        .split(',')
        .map((id: string) => Number(id.trim()))
      : [];
    if (rowData.SemesterID == "3,4,5") {
      rowData.SemesterID = 3
    }

    else if (rowData.SemesterID == "1,2") {
      rowData.SemesterID = 1
    } else {
      rowData.SemesterID = 6
    }

    this.IIPMasterFormGroup.patchValue({
      SemesterID: rowData.SemesterID,
      StreamIDs: streamIdArray,
      Name: rowData.DisplayName,
      MobileNo: rowData.MobileNo

    });


    await this.SemesterMaster();
   
    this.request.SemesterID = rowData.SemesterID
    this.request.DisplayName = rowData.DisplayName
    this.request.MobileNo = rowData.MobileNo
    this.request.MailPersonal = rowData.MailPersonal
    this.request.ID = rowData.ID
   
    await this.onSemesterChange(this.request.SemesterID);
  

  }


  createSemesterStreamMap() {

    const map = new Map<string, Set<string>>();

    this.ApplyList.forEach((item: any) => {

      const semesters = (item.SemesterID || '')
        .split(',')
        .map((x: string) => x.trim())
        .filter((x: string) => x !== '');

      const streams = (item.StreamID || '')
        .split(',')
        .map((x: string) => x.trim())
        .filter((x: string) => x !== '');

      semesters.forEach((sem: string) => {

        if (!map.has(sem)) {
          map.set(sem, new Set<string>());
        }

        const streamSet = map.get(sem);

        streams.forEach((str: string) => {
          streamSet?.add(str); // ✅ auto removes duplicates
        });

      });

    });

    // 👉 Final result
    const result: any[] = [];

    map.forEach((streamSet, sem) => {
      result.push({
        SemesterID: sem,
        StreamID: Array.from(streamSet).join(',') // ✅ unique + merged
      });
    });

    console.log('Final Clean Result:', result);

    this.SemesterStreamList = result;
  }


  async ViewHistory(content: any, rowData?: any) {
    this.isSubmitted = true;
    debugger
    // Open only once, store reference
    this.modalRef1 = this.modalService.open(content, {
      size: 'xl',
      ariaLabelledBy: 'modal-basic-title',
      backdrop: 'static'
    });

    // Handle result or dismissal
    this.modalRef1.result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason: any) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
    if (rowData != null && rowData != undefined) {
      if (rowData.StreamID != null) {
        const obj: any = {
          StreamID: 0,
          ModifyBy: this.sSOLoginDataModel?.UserID || 0,
          SSOID: this.SSOIDFormGroup?.value?.SSOID || '',

          StreamIDs: this.IIPMasterFormGroup?.value?.StreamIDs?.join(',') || '',

          Action: "gethistory",
          DepartmentID: this.sSOLoginDataModel?.DepartmentID || 0,
          UserID: rowData.UserID,
          RoleID: this.sSOLoginDataModel?.RoleID || 0,
          EndTermID: this.sSOLoginDataModel?.EndTermID || 0,
          Eng_NonEng: this.sSOLoginDataModel?.Eng_NonEng || 0,

          SemesterID: this.IIPMasterFormGroup?.value?.SemesterID || '',
          CollegeID: this.sSOLoginDataModel?.InstituteID || 0
        };

        await this.staffMasterService.AllBranchHOD(obj)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            this.GetBranchStreamData = data.Data;
            // this.GetBranchSectionData=this.GetBranchSectionData.filter((item:any)=>item.createdby==this.sSOLoginDataModel.UserID)
            debugger
            // this.GetBranchStreamData = data.Data
            this.totalRecord1 = data['Data'].length;
 
            this.initTable1(this.GetBranchStreamData);
          }, (error: any) => console.error(error)
          );
      }
    }
  }


  CloseModal1() {
    if (this.modalRef1) {
      this.modalRef1.dismiss();
      this.modalRef1 = null;
      this.isSubmitted = false;
    }
  }
  initTable1(data: any) {
    this.dataSource1 = new MatTableDataSource(data);
    this.dataSource1.paginator = this.paginator1;
    this.dataSource1.sort = this.sort;
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

}
