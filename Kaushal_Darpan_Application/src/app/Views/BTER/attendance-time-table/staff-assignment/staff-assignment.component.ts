import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { StaffMasterService } from '../../../../Services/StaffMaster/staff-master.service';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';

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

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private staffService: StaffMasterService,
    private commonService: CommonFunctionService,
    private loader: LoaderService,
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

    // 🔥 Convert to comma separated
    const semesterCSV = form.SemesterIDs?.join(',');
    const branchCSV = form.StreamIDs?.join(',');

    let payload = {
      StaffId: form.TeacherID,
      InstituteId: this.sSOLoginDataModel.InstituteID,
      BranchIds: branchCSV,        // 🔥 CSV
      SemesterIds: semesterCSV,    // 🔥 CSV
      FromDate: form.FromDate,
      ToDate: form.ToDate,
      Status: 1,
      CreatedBy: this.sSOLoginDataModel.UserID
    };

    await this.staffService.InsertStaffAssignmentHierarchy(payload);

    this.toastr.success('Assignment saved successfully');
    this.ResetControls();

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
      SemesterID: 0,
      StreamIDs: [],
      TeacherID: 0
    });
  }

  async GetStaff_InstituteWise() {
    let obj = {
      InstituteID: this.sSOLoginDataModel.InstituteID,
      DepartmentID: this.sSOLoginDataModel.DepartmentID,
      EndTermID: this.sSOLoginDataModel.EndTermID,
      Eng_NonEng: this.sSOLoginDataModel.Eng_NonEng,
      RoleID: this.sSOLoginDataModel.RoleID
    }
    this.commonService.GetStaff_InstituteWise(obj).then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      this.ExaminerDDL = data.Data;
    })
  }

}