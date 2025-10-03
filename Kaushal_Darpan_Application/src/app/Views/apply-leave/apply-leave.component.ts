import { Component } from '@angular/core';
import { LeaveMaster } from '../../Models/LeaveMasterDataModel';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { LeaveMasterService } from '../../Services/LeaveMaster/leave-master.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../Services/Loader/loader.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { DropdownValidators } from '../../Services/CustomValidators/custom-validators.service';
import { EnumStatus, EnumLeaveTypeFSFDay, EnumLeaveType } from '../../Common/GlobalConstants';

@Component({
  selector: 'app-apply-leave',
  standalone: false,
  templateUrl: './apply-leave.component.html',
  styleUrl: './apply-leave.component.css'
})
export class ApplyLeaveComponent {

  public ID: number = 0;
  public LeaveTypeList: any[] = [];
  public LeaveTypeFSFList: any[] = [];
 public today: string='';
  public request = new LeaveMaster()
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public State: number = 0;
  public key: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public LeaveMasterFormGroup!: FormGroup;
  public sSOLoginDataModel = new SSOLoginDataModel();


  constructor(private commonMasterService: CommonFunctionService,
    private LeaveMasterService: LeaveMasterService,
    private toastr: ToastrService, private loaderService: LoaderService,
    private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private routers: Router, private modalService: NgbModal) {

  }

  async ngOnInit() {


    // form group
    this.LeaveMasterFormGroup = this.formBuilder.group(
      {
        txtFromDate: ['', Validators.required],
        txtToDate: ['', Validators.required],
        remark: ['', Validators.required],
        LeaveID: ['', [DropdownValidators]],
        TotalDays: [''],
        IsHeadQuarter: [0],
        LeaveTypeID: ['', [DropdownValidators]]

      });


    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.ID = Number(this.activatedRoute.snapshot.queryParamMap.get('ID')?.toString());
    this.key = Number(this.activatedRoute.snapshot.queryParamMap.get('key')?.toString());//student list key
    const now = new Date();
    this.today = now.toISOString().split('T')[0]; // "2025-04-11" format
    this.LeaveMasterFormGroup.get('TotalDays')?.disable()
    await this.GetCompanyMatserDDL();
    await this.GetLeaveTypeFSF();


    //edit
    if (this.ID > 0) {
      await this.GetById();
    }
  }
  get _LeaveMasterFormGroup() { return this.LeaveMasterFormGroup.controls; }

  checkValue(event: any) {
    const value = event.target.value;
    if (value <= 0) {
      event.target.value = '';
    }
  }

  validateNumber(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab'];
    if (!/^[0-9]$/.test(event.key) && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }

  async Back() {

      this.routers.navigate(['/LeaveList'])
    

  }
  GotoCommonSubject(): void {
    this.routers.navigate(['/commonsubjects']);
  }

  // get semestar ddl
  async GetCompanyMatserDDL() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterData('LeaveType')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.LeaveTypeList = data['Data'];
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

  async GetLeaveTypeFSF() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterData('LeaveTypeFSF')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.LeaveTypeFSFList = data['Data'];
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
  


  // get detail by id
  async GetById() {
    try {
      
      this.loaderService.requestStarted();

      await this.LeaveMasterService.GetById(this.ID)

        .then((data: any) => {          
          data = JSON.parse(JSON.stringify(data));
          this.request = data['Data'];
          const dob = new Date(data['Data']['From_Date']);
          const year = dob.getFullYear();
          const month = String(dob.getMonth() + 1).padStart(2, '0');
          const day = String(dob.getDate()).padStart(2, '0');
          this.request.From_Date = `${year}-${month}-${day}`;
          const dob1 = new Date(data['Data']['To_Date']);
          const year1 = dob1.getFullYear();
          const month1 = String(dob1.getMonth() + 1).padStart(2, '0');
          const day1 = String(dob1.getDate()).padStart(2, '0');
          this.request.To_Date = `${year1}-${month1}-${day1}`;
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

  // get detail by id
  async SaveData() {

    try {
      this.isSubmitted = true;
      if (this.LeaveMasterFormGroup.invalid) {
        return
      }
      this.isLoading = true;

      this.loaderService.requestStarted();

      this.request.ModifyBy = this.sSOLoginDataModel.UserID;
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.request.InstituteID = this.sSOLoginDataModel.InstituteID
      this.request.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng
      this.request.Action = 'Pending'
      this.request.SSOID = this.sSOLoginDataModel.SSOID
      //save
      await this.LeaveMasterService.SaveData(this.request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];

          if (this.State == EnumStatus.Success) {
            this.toastr.success(this.Message)
            this.ResetControls();
            this.routers.navigate(['/LeaveList']);
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

  // reset
  ResetControls() {

    this.request.LeaveID = 0
    this.request.From_Date = ''
    this.request.To_Date = ''
    this.request.Remark = ''
    this.request.TotalDays = 0
    this.request.LeaveTypeID = 0
    this.request.IsHeadQuarter = false
    //this.multiSelect.toggleSelectAll();
  }

  // Enum for Leave Types (leave category)


calculateDays() {
  debugger;
  const fromDateStr = this.request.From_Date;
  const toDateStr = this.request.To_Date;

  // session type: 1=FirstHalf, 2=SecondHalf, 3=FullDay
  const sessionType = this.request.LeaveTypeID;

  // leave category: 1 to 5 as per EnumLeaveType
  const leaveType = this.request.LeaveID;

  if (!fromDateStr || !toDateStr) {
    this.request.TotalDays = 0;
    return;
  }

  const fromDate = new Date(fromDateStr);
  const toDate = new Date(toDateStr);

  if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime()) || fromDate > toDate) {
    this.request.TotalDays = 0;
    return;
  }

  // Calculate inclusive day difference between two dates
  const diffDaysInclusive = (start: Date, end: Date): number => {
    const diffTime = end.getTime() - start.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  // Weekend check: Sunday=0, Saturday=6
  const isWeekend = (date: Date): boolean => {
    const day = date.getDay();
    return day == 0 || day == 6;
  };

  // Holiday check (customize with real holiday list if needed)
  const isHoliday = (date: Date): boolean => {
    return isWeekend(date);  // weekends are holidays
  };

  // Count holidays/weekends between two dates (exclusive)
  const countSandwichDays = (start: Date, end: Date): number => {
    let count = 0;
    let current = new Date(start);
    current.setDate(current.getDate() + 1);

    while (current < end) {
      if (isHoliday(current)) {
        count++;
      }
      current.setDate(current.getDate() + 1);
    }
    return count;
  };

  // Single day leave
  if (fromDate.toDateString() == toDate.toDateString()) {
    if (sessionType == EnumLeaveTypeFSFDay.FirstHalf || sessionType == EnumLeaveTypeFSFDay.SecondHalf) {
      this.request.TotalDays = 0.5;
    } else {
      this.request.TotalDays = 1;
    }
  }
  // Multiple day leave
  else {
    if (sessionType == EnumLeaveTypeFSFDay.FirstHalf || sessionType == EnumLeaveTypeFSFDay.SecondHalf) {
      // Half day leave across multiple days counts as 0.5 days
      this.request.TotalDays = 0.5;
    } else {
      let totalDays = diffDaysInclusive(fromDate, toDate);

      // Sandwich leave for PrivilegeLeave
      if (leaveType == EnumLeaveType.PrivilegeLeave) {
        const sandwichDays = countSandwichDays(fromDate, toDate);
        totalDays += sandwichDays;
      }

      // SickLeave example: double total days
      if (leaveType == EnumLeaveType.SickLeave) {
        totalDays = totalDays * 2;
      }

      this.request.TotalDays = totalDays;
    }
  }
}



  //calculateDays() {
  //  debugger
  //  const fromDateStr = this.request.From_Date;
  //  const toDateStr = this.request.To_Date;
  //  const leaveType = this.request.LeaveTypeID;  // This represents session like FirstHalf, SecondHalf, FullDay
  //  const ApplyleaveType = this.request.LeaveID;  // This represents session like FirstHalf, SecondHalf, FullDay

  //  if (!fromDateStr || !toDateStr) {
  //    this.request.TotalDays = 0;
  //    return;
  //  }

  //  const fromDate = new Date(fromDateStr);
  //  const toDate = new Date(toDateStr);

  //  if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime()) || fromDate > toDate) {
  //    this.request.TotalDays = 0;
  //    return;
  //  }

  //  // Single day leave
  //  if (fromDate.toDateString() == toDate.toDateString()) {
  //    if (leaveType == EnumLeaveTypeFSFDay.FirstHalf || leaveType == EnumLeaveTypeFSFDay.SecondHalf) {
  //      this.request.TotalDays = 0.5;
  //    } else {
  //      this.request.TotalDays = 1;
  //    }
  //  }
  //  // Multiple day leave
  //  else {
  //    if (leaveType === EnumLeaveTypeFSFDay.FirstHalf || leaveType === EnumLeaveTypeFSFDay.SecondHalf) {
  //      // If multiple days and leave type is half day, total leave is just 0.5
  //      this.request.TotalDays = 0.5;
  //    } else {
  //      // Full days difference inclusive
  //      const diffTime = toDate.getTime() - fromDate.getTime();
  //      const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
  //      this.request.TotalDays = totalDays;
  //    }
  //  }
  //}




  

  validateTimes(): boolean {
    if (this.request.From_Date && this.request.To_Date) {
      const fromDate = new Date(this.request.From_Date);
      const toDate = new Date(this.request.To_Date);

      if (fromDate > toDate) {
        this.toastr.error('From Date cannot be after To Date');
        this.request.From_Date = ''
        this.request.To_Date=''
        return false;
      }

      return true;
    }

    this.toastr.error('Both From Date and To Date are required');
    return false;
  }

}
