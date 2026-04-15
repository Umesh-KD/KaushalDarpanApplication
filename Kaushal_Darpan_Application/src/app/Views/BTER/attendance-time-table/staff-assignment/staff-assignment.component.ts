import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { StaffMasterService } from '../../../../Services/StaffMaster/staff-master.service';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';

@Component({
  selector: 'app-staff-assignment',
  standalone: false,
  templateUrl: './staff-assignment.component.html',
  styleUrl: './staff-assignment.component.css'
})


export class StaffAssignmentComponent implements OnInit {

  public IIPMasterFormGroup!: FormGroup;
  public StreamMasterDDL: any[] = [];
  public TeacherDDL: any[] = [];
  public sSOLoginDataModel = new SSOLoginDataModel();
  public SemesterMasterDDL: any[] = [];
  ExaminerDDL: any[] = [];
  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public ApplyList: any[] = []
  public totalRecord: number = 0;

  displayedColumns: string[] = [
  'SNo',
  'Name',
  'BranchNames',
  'SemesterNames',
  'FromDate',
  'ToDate',
  'Status',
  'actions'
];

historyData: any[] = [];
historyDataSource = new MatTableDataSource<any>();

historyColumns: string[] = [
  'SNo',
  'Name',
  'BranchNames',
  'SemesterNames',
  'FromDate',
  'ToDate',
  'Status'
];
selectedAssignmentId: number | null = null;
isManualReassign: boolean = false;
isHistoryModalOpen: boolean = false;
dataSource!: MatTableDataSource<any>;
 @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private staffService: StaffMasterService,
    private commonService: CommonFunctionService,
    private loader: LoaderService,
    private Swal2: SweetAlert2
  ) { }

  async ngOnInit() {
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    this.IIPMasterFormGroup = this.fb.group({
      SemesterIDs: [[], Validators.required], 
      StreamIDs: [[], Validators.required],
      TeacherID: [0, Validators.required],
      FromDate: ['', Validators.required],
      ToDate: ['']
    });

     await this.SemesterMaster();  
     await this.GetStaff_InstituteWise();
    //await this.loadTeacherList();
    await this.GetStaffAssignmentList()
  }

  // Load Teachers
  // async loadTeacherList() {
  //   await this.staffService.GetTeacherList(this.sSOLoginDataModel.InstituteID)
  //     .then((res: any) => {
  //       res = JSON.parse(JSON.stringify(res));
  //       this.TeacherDDL = res.Data;
  //     });
  // }

  // Semester change
  async onSemesterChange() {
debugger
  const selectedSemesters = this.IIPMasterFormGroup.value.SemesterIDs;

  if (!selectedSemesters || selectedSemesters.length === 0) {
    this.StreamMasterDDL = [];
    return;
  }

  // 🔥 Load all branches (same as before)
  await this.commonService.Stream_InstituteIdWise(
    this.sSOLoginDataModel.DepartmentID,
    this.sSOLoginDataModel.Eng_NonEng,
    this.sSOLoginDataModel.EndTermID,
    this.sSOLoginDataModel.InstituteID,
    this.sSOLoginDataModel.FinancialYearID
  ).then((res: any) => {
    res = JSON.parse(JSON.stringify(res));
    this.StreamMasterDDL = res.Data;
  });

  // 🔥 Filter branches based on selected semesters
  await this.GetBranchHideList();
}

  async SemesterMaster() {
  await this.commonService.SemesterMaster().then((data: any) => {
    data = JSON.parse(JSON.stringify(data));
    this.SemesterMasterDDL = data.Data;
  });
}

// async GetBranchHideList() {
//   try {

//     let request = {
//       EndTermID: this.sSOLoginDataModel.EndTermID,
//       SemesterIDs: this.IIPMasterFormGroup.value.SemesterIDs?.join(','), // 🔥 MULTIPLE
//       InstituteID: this.sSOLoginDataModel.InstituteID
//     };

//     await this.staffService.GetStreamIDBySemester(request)
//       .then((data: any) => {
//         data = JSON.parse(JSON.stringify(data));

//         const hideIDs = data.Data.map((b: any) => b.StreamID);

//         this.StreamMasterDDL = this.StreamMasterDDL.filter(
//           (x: any) => !hideIDs.includes(x.StreamID)
//         );
//       });

//   } catch (e) {
//     console.error(e);
//   }
// }

async GetBranchHideList() {
  try {

    let request = {
      EndTermID: this.sSOLoginDataModel.EndTermID,
      SemesterIDs: this.IIPMasterFormGroup.value.SemesterIDs?.join(','),
      InstituteID: this.sSOLoginDataModel.InstituteID
    };

    debugger
    await this.staffService.GetStreamIDBySemester(request)
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));

        // 🔥 SAFE CHECK
        if (!data || !data.Data || data.Data.length === 0) {
          console.log('No branch hide data found');

          // 👉 If nothing to hide → select all branches
          const allBranchIds = this.StreamMasterDDL.map((x: any) => x.StreamID);
          this.IIPMasterFormGroup.get('StreamIDs')?.setValue(allBranchIds);

          return;
        }

        const hideIDs = data.Data.map((b: any) => b.StreamID);

        this.StreamMasterDDL = this.StreamMasterDDL.filter(
          (x: any) => !hideIDs.includes(x.StreamID)
        );

        // 🔥 AUTO SELECT
        const allBranchIds = this.StreamMasterDDL.map((x: any) => x.StreamID);
        this.IIPMasterFormGroup.get('StreamIDs')?.setValue(allBranchIds);

      });

  } catch (e) {
    console.error(e);
  }
}
  // Save Data
async SaveData() {

  const form = this.IIPMasterFormGroup.value;

  if (this.IIPMasterFormGroup.invalid) {
    this.toastr.warning('Please fill all required fields');
    return;
  }

  try {
    this.loader.requestStarted();

    const isReassign = this.selectedAssignmentId != null;

    const payload = {
      AssignmentId: this.selectedAssignmentId, // null = assign, value = reassign
      StaffId: form.TeacherID,
      InstituteId: this.sSOLoginDataModel.InstituteID,
      BranchIds: form.StreamIDs.join(','),
      SemesterIds: form.SemesterIDs.join(','),
      FromDate: form.FromDate,
      ToDate: form.ToDate,
      Status: 247,
      CreatedBy: this.sSOLoginDataModel.UserID
    };

    const res: any = await this.staffService.InsertStaffAssignmentHierarchy(payload);
    const response = JSON.parse(JSON.stringify(res));

    // 🔥 HANDLE RESPONSE FROM SP
    if (response.State === 1) {

      if (isReassign) {
        this.toastr.success('Reassigned successfully');
      } else {
        this.toastr.success('Assigned successfully');
      }

      this.selectedAssignmentId = null;
      this.ResetControls();
      this.GetStaffAssignmentList();

    } else {
      // 🔥 SP message (like "Teacher already active")
      this.toastr.warning(response.Message);
    }

  } catch (err) {
    console.error(err);
    this.toastr.error('Something went wrong');
  } finally {
    this.loader.requestEnded();
  }
}
  // Reset
  ResetControls() {
  this.IIPMasterFormGroup.reset();
  this.IIPMasterFormGroup.patchValue({
    SemesterIDs: [],   // ✅ FIXED
    StreamIDs: [],
    TeacherID: 0
  });
  this.selectedAssignmentId = null; // 🔥 IMPORTANT
}

  async GetStaff_InstituteWise() {
    let obj = {
      InstituteID: this.sSOLoginDataModel.InstituteID,
      DepartmentID: this.sSOLoginDataModel.DepartmentID,
      EndTermID: this.sSOLoginDataModel.EndTermID,
      Eng_NonEng: this.sSOLoginDataModel.Eng_NonEng,
      RoleID: this.sSOLoginDataModel.RoleID
    }
    this.commonService.Get_Staff_Ac_Year(obj).then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      this.ExaminerDDL = data.Data;
    })
  }

  async GetStaffAssignmentList() {
  try {

     let request = {
        CreatedBy: this.sSOLoginDataModel.UserID,
        InstituteID: this.sSOLoginDataModel.InstituteID
      };

    await this.staffService.GetStaffAssignmentHierarchy(request)
      .then((data: any) => {

        data = JSON.parse(JSON.stringify(data));

        this.State = data['State'];
        this.Message = data['Message'];
        this.ErrorMessage = data['ErrorMessage'];

        this.ApplyList = data['Data'];
        this.totalRecord = this.ApplyList.length;

        this.initTable();

      }, (error: any) => console.error(error));
  }
  catch (ex) {
    console.log(ex);
  }
}
initTable() {
  this.dataSource = new MatTableDataSource(this.ApplyList);
  this.dataSource.paginator = this.paginator;
  this.dataSource.sort = this.sort;

  this.dataSource.filterPredicate = (data: any, filter: string) => {
    return Object.values(data).join(' ').toLowerCase().includes(filter);
  };
}

applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();

  if (this.dataSource.paginator) {
    this.dataSource.paginator.firstPage();
  }
}

isExpired(toDate: string): boolean {
  if (!toDate) return false;

  const today = new Date();
  const endDate = new Date(toDate);

  // 🔥 Remove time part
  today.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);

  return endDate < today;
}
reassign(row: any) {
  debugger;

  this.selectedAssignmentId = row.AssignmentId;

  // 🔥 Prefill form
  this.IIPMasterFormGroup.patchValue({
    TeacherID: row.StaffId,
    FromDate: new Date().toISOString().split('T')[0],
    ToDate: ''
  });

  // 🔥 Optional: prefill branch & semester (if needed)
}

enableManualReassign() {
  this.isManualReassign = true;
}

disableManualReassign() {
  this.isManualReassign = false;
}

confirmReassign(row: any) {
  this.Swal2.Confirmation(
    "Are you sure you want to reassign this teacher?",
    (result: any) => {
      if (result.isConfirmed) {
        this.reassign(row);
      }
    }
  );
}

async viewHistory(row: any) {

  const request = {
    InstituteId: this.sSOLoginDataModel.InstituteID,
    CreatedBy: this.sSOLoginDataModel.UserID,
    StaffId: row.StaffId
  };

  await this.staffService.GetStaffAssignmentHistory(request)
    .then((res: any) => {

      res = JSON.parse(JSON.stringify(res));

      console.log('API Response:', res);

      this.historyData = res.Data || [];

      console.log('History Data:', this.historyData);

      this.historyDataSource = new MatTableDataSource(this.historyData);

      this.openModal();

      setTimeout(() => {
        this.historyDataSource._updateChangeSubscription();
      }, 100);

    });
}

openModal() {
  this.isHistoryModalOpen = true;
  document.body.classList.add('modal-open');
}

closeModal() {
  this.isHistoryModalOpen = false;
  document.body.classList.remove('modal-open');
}
}