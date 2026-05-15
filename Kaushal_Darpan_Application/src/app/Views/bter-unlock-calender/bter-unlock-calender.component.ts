import { Component } from '@angular/core';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ItiCollegesSearchModel, ItiTradeSearchModel } from '../../Models/CommonMasterDataModel';
import { BranchStreamTypeWiseSearchModel } from '../../Models/BTER/BTERSeatsDistributions';
import { PublicInfoDataModel } from '../../Models/PublicInfoDataModel';
import { PublicAddType } from '../../Common/GlobalConstants';
import { CalendarEventModel, CalendarEventModelBter } from '../../Models/StaffMasterDataModel';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { ItiSeatIntakeService } from '../../Services/ITI/ItiSeatIntake/iti-seat-intake.service';
import { BTERSeatsDistributionsService } from '../../Services/BTER/Seats-Distributions/seats-distributions.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../Services/Loader/loader.service';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AppsettingService } from '../../Common/appsetting.service';
import { AttendanceServiceService } from '../../Services/AttendanceServices/attendance-service.service';
import { StaffMasterDDLDataModel } from '../../Models/CenterObserverDataModel';
import { CommonDDLSubjectMasterModel } from '../../Models/CommonDDLSubjectMasterModel';
import { StaffMasterService } from '../../Services/StaffMaster/staff-master.service';

@Component({
  selector: 'app-bter-unlock-calender',
  standalone: false,
  templateUrl: './bter-unlock-calender.component.html',
  styleUrl: './bter-unlock-calender.component.css'
})
export class BterUnlockCalenderComponent {
  public SSOLoginDataModel = new SSOLoginDataModel()
  public PublicInfoFormGroup!: FormGroup;
  public requestStaff = new StaffMasterDDLDataModel();
  public SubjectID: number = 0
  public AttandanceTimeID: number = 0
  public StaffID: number = 0
  GetSectionData: any[] = [];
  currentMonth: number = new Date().getMonth() + 1;
  currentYear: number = new Date().getFullYear();

  allowedDates: string[] = [];
  SectionID: number = 0
  //public request = new SeatIntakeDataModel()
  IsFinalSubmit: boolean = false
  subjectsearch = new CommonDDLSubjectMasterModel()
  public isSubmitted = false;
  public SSOID: string = ''
  public tradeSearchRequest = new ItiTradeSearchModel()
  public collegeSearchRequest = new ItiCollegesSearchModel()
  public ItiTradeListAll: any = [];
  public CollegesListAll: any = [];
  public StudentAttandanceTimeDDL: any = [];
  public StaffList: any = [];
  public InstituteList: any = [];
  public SubjectMasterDDL: any = [];
  public BranchList: any = [];
  public ITIRemarkList: any = [];
  public SanctionedList: any = [];
  public FinancialYearList: any = [];
  public SeatIntakeID: number | null = null;
  public branchSearchRequest = new BranchStreamTypeWiseSearchModel()
  public BranchID: number = 0 
  public InstituteID: number = 0
  public request = new PublicInfoDataModel()
  public State: number = 0;
  public key: number = 0;
  public RoasterID: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public IsUpload: boolean = false;
  public LableText: string = '';
  public _PublicAddType = PublicAddType
  public _startl: string = ''
  public _startf: string = ''
  public weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  monthDays: number[] = [];
  startDay = 0;
  monthName = '';
  year = 0;
  month = 0;
  public events: CalendarEventModelBter[] = [];
  public eventsList: CalendarEventModelBter[] = [];
  public eventsSearch = new CalendarEventModelBter();

  constructor(
    private commonFunctionService: CommonFunctionService,
    private formBuilder: FormBuilder,
    private ItiSeatIntakeService: ItiSeatIntakeService,

    private SeatsDistributionsService: BTERSeatsDistributionsService,

    private toastr: ToastrService,
    private loaderService: LoaderService,

    private router: Router,
    private routers: ActivatedRoute,
    public appsettingConfig: AppsettingService,
    private attendanceServiceService: AttendanceServiceService,
    private staffMasterService: StaffMasterService

  ) { this.populateMonthDays(); }

  async ngOnInit() {
    this.SSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.initializeToday();
    let events = await this.generateMonthDays(this.year, this.month);
    this.events = events;


    console.log('All events:', events);


  
      this.InstituteID = this.SSOLoginDataModel.InstituteID
      this.GetStaff_InstituteWise()
    


  }

  async initializeToday() {
    const today = new Date();
    this.year = today.getFullYear();
    this.month = today.getMonth() + 1;
    this.loadMonth(this.year, this.month);
  }

  formatDate(date: Date): string {
    const yyyy = date.getFullYear();
    const mm = (date.getMonth() + 1).toString().padStart(2, '0');
    const dd = date.getDate().toString().padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  async generateMonthDays(year: number, month: number) {
    const daysInMonth = new Date(year, month, 0).getDate();
    const events: CalendarEventModelBter[] = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const event = new CalendarEventModelBter();
      event.EventId = day;
      event.EventDate = new Date(year, month - 1, day);

      const dayOfWeek = event.EventDate.getDay();
      event.WeekDayName = this.weekDays[dayOfWeek];

      if (dayOfWeek === 0 || event.WeekDayName === 'Sun') {
        event.EventType = 'Holiday';
        event.Remark = 'Weekend - Sunday';
        event.Color = 'blue';
      } else {
        event.EventType = 'Working Day';
        event.Remark = '';
        event.Color = '';
      }

      event.Day = day;
      events.push(event);
    }
    return events;
  }

  async applySpecialEvents(events: any) {
    const specialEvents = [
      { day: 1, type: 'Holiday', remark: 'School Closed' },
      { day: 10, type: 'Exam', remark: 'Midterm Exam' },
      { day: 15, type: 'Holiday', remark: 'Independence Day' },
      { day: 20, type: 'Exam', remark: 'Math Exam' },
      { day: 26, type: 'Holiday', remark: 'Foundation Day' }
    ];

    specialEvents.forEach(special => {
      const event = events.find((e: any) => e.Day === special.day);
      if (event) {
        event.EventType = special.type;
        event.Remark = special.remark;
        event.Color = special.type === 'Holiday' ? 'red' : '';
      }
    });
  }
  async mergeEvents(events: any[], overrideEvents: any[]) {

    // store allowed dates coming from SP
    this.allowedDates = overrideEvents.map((x: any) =>
      this.getDateString(new Date(x.EventDate))
    );

    overrideEvents.forEach((se: any) => {

      const seDate = new Date(se.EventDate);

      if (isNaN(seDate.getTime())) {
        console.warn('Invalid se.EventDate:', se.EventDate);
        return;
      }

      const seDateStr = this.getDateString(seDate);

      const eventIndex = events.findIndex((e: any) => {
        const eventDateStr = this.getDateString(new Date(e.EventDate));
        return seDateStr === eventDateStr;
      });

      if (eventIndex !== -1) {

        const targetEvent = events[eventIndex];

        targetEvent.EventType = se.EventType;
        targetEvent.Remark = se.Remark;
        targetEvent.IsLocked = se.IsLocked;

        // GREEN = locked
      

      } else {

        const newEvent = new CalendarEventModelBter();

        newEvent.EventId = events.length + 1;
        newEvent.EventDate = seDate;
        newEvent.Day = seDate.getDate();
        newEvent.EventType = se.EventType;
        newEvent.Remark = se.Remark;
        newEvent.IsLocked = se.IsLocked;

        newEvent.Color = se.IsLocked == 1 ? 'green' : '';

        newEvent.DepartmentID = 0;
        newEvent.EndTermID = 0;
        newEvent.AcademicYearID = 0;
        newEvent.CourseTypeID = 0;
        newEvent.IsActive = true;
        newEvent.IsDelete = false;
        newEvent.WeekDayName = this.weekDays[seDate.getDay()];

        events.push(newEvent);
      }
    });
  }
  private getDateString(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
  async getCalendarEventModel() {
    this.request.CourseTypeId = this.SSOLoginDataModel.Eng_NonEng
    this.request.CreatedBy = this.SSOLoginDataModel.UserID;
    this.request.IPAddress = "";
    this.request.AcademicYearId = this.SSOLoginDataModel.FinancialYearID;
    this.request.DepartmentId = this.SSOLoginDataModel.DepartmentID;

    this.eventsSearch.CurrentMonth = this.month
    this.eventsSearch.CurrentYear = this.year
    this.eventsSearch.SSOID = this.SSOID
    this.eventsSearch.SubjectID = this.SubjectID
    this.eventsSearch.EndTermID = this.SSOLoginDataModel.EndTermID
    this.eventsSearch.InstituteID = this.InstituteID
    this.eventsSearch.SectionID = this.SectionID
    this.eventsSearch.TimeID = this.AttandanceTimeID
    this.eventsSearch.StaffID = this.StaffID
    try {
      await this.attendanceServiceService.getAssignCalendarEventModelBter(this.eventsSearch)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.eventsList = data.Data
          this.RoasterID = this.eventsList[0]['RosterID']??0
          this.mergeEvents(this.events, this.eventsList);
        }, error => console.error(error));

      // Storing the events data
    } catch (Ex) {
      console.log(Ex);  // Handle any error that occurs during the async call
    }
  }

  populateMonthDays() {
    const daysInMonth = new Date(this.year, this.month, 0).getDate();
    this.monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    // Calculate the start day (which day of the week the month starts on)
    this.startDay = new Date(this.year, this.month - 1, 1).getDay();
  }

  loadMonth(year: number, month: number) {
    this.year = year;
    this.month = month;

    const firstDay = new Date(year, month - 1, 1);
    this.monthName = firstDay.toLocaleString('default', { month: 'long' });
    this.startDay = firstDay.getDay();
    const daysInMonth = new Date(year, month, 0).getDate();

    this.monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  }

  async prevMonth() {
    let newYear = this.year;
    let newMonth = this.month - 1;
    if (newMonth < 1) {
      newMonth = 12;
      newYear--;
    }
    this.loadMonth(newYear, newMonth);

    let events = await this.generateMonthDays(newYear, newMonth);
    this.events = events
    await this.getCalendarEventModel();
  }

  async nextMonth() {
    let newYear = this.year;
    let newMonth = this.month + 1;
    if (newMonth > 12) {
      newMonth = 1;
      newYear++;
    }
    this.loadMonth(newYear, newMonth);
    let events = await this.generateMonthDays(newYear, newMonth);
    this.events = events
    await this.getCalendarEventModel();
  }

  onYearChange(event: any) {
    let newYear = +event.target.value;
    if (!newYear || newYear < 1900 || newYear > 2100) {
      newYear = this.year;
    }
    this.loadMonth(newYear, this.month);
  }

  async ResetControl() {
    this.SubjectID = 0
    this.SSOID = ''
    this.eventsList = []
  }

  onDateClick(day: number) {

    // validate day
    if (day < 1 || day > this.monthDays.length) return;

    // required selections
    if (!this.StaffID || !this.SubjectID) {
      alert("Please select Staff and Subject first");
      return;
    }

    if (!this.SectionID) {
      alert("Please select Section first");
      return;
    }

    if (!this.AttandanceTimeID) {
      alert("Please select Attendance Time");
      return;
    }

    const existingEvent = this.getEvent(day);
    if (!existingEvent) return;

    // prevent holiday editing
    if (existingEvent.EventType === 'Holiday') {
      alert(`Holiday: ${existingEvent.Remark}`);
      return;
    }

    const isLocked = Number(existingEvent.IsLocked) === 1;

    // ===============================
    // LOCKED → UNLOCK
    // ===============================
    if (isLocked) {

      const remark = prompt(
        "Enter remark for unlock:",
        existingEvent.Remark || ""
      );

      if (remark === null || remark.trim() === "") {
        alert("Remark is required to unlock");
        return;
      }

      existingEvent.IsLocked = 0;   // ✅ unlock
      existingEvent.Remark = remark.trim();
      existingEvent.Color = '';

    }
    // ===============================
    // UNLOCKED → LOCK
    // ===============================
    else {

      const confirmLock = confirm("Do you want to lock this date?");
      if (!confirmLock) return;

      existingEvent.IsLocked = 1;   // ✅ lock
      existingEvent.Color = 'green';
    }

    this.updateCalendar();
  }
  // Sample getEvent method (ensure it exists and works correctly)
  getEvent(day: number) {
    return this.events.find(event => event.Day === day);
  }

  // Update the calendar view after event changes (if needed)
  updateCalendar() {
    // Refresh the calendar after the event is added/modified
    // For example, you may need to re-render the calendar view to reflect changes
  }

  saveAllEvents() {
    try {
      if (!this.StaffID) {
        this.toastr.warning('Please select Staff');
        return;
      }

      if (!this.SubjectID || this.SubjectID <= 0) {
        this.toastr.warning('Please select Subject');
        return;
      }

      if (!this.SectionID) {
        alert("Please select Section first");
        return;
      }


      if (!this.AttandanceTimeID) {
        alert("Please select Attendence Time");
        return;
      }

      debugger
      const formattedEvents = (this.events || [])
        .filter((event: any) => {

          if (!event || !event.EventDate || event.Day <= 0) return false;

          const dateStr = this.getDateString(new Date(event.EventDate));
          const dayOfWeek = new Date(event.EventDate).getDay();

          if (event.EventType === 'Holiday') return false;

          if (dayOfWeek === 0) return false;

          if (!this.allowedDates.includes(dateStr)) return false;

          return true;   // ✅ DO NOT filter IsLocked
        })

        .map((event: any) => ({
          ...event,

          EventDate: this.formatDate(new Date(event.EventDate)),

          DepartmentID: this.SSOLoginDataModel.DepartmentID,
          EndTermID: this.SSOLoginDataModel.EndTermID,
          AcademicYearID: this.SSOLoginDataModel.FinancialYearID,
          CourseTypeID: this.SSOLoginDataModel.Eng_NonEng,

          InstituteID: this.InstituteID,
          SubjectID: this.SubjectID,
          SSOID: this.SSOID,

          Remark: (event.Remark || '').trim(),

          IsActive: event.IsActive ?? true,
          IsDelete: event.IsDelete ?? false,

          SectionID: this.SectionID,
          StaffID: this.StaffID,
          RosterID: this.RoasterID
        }));

      if (formattedEvents.length === 0) {
        this.toastr.warning('No non-holiday dates available to save');
        return;
      }

      this.attendanceServiceService.UpdateCalendarEventModelBter(formattedEvents)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data['Data']));
          this.toastr.success('Saved Successfully');
        }, error => {
          console.error(error);
          this.toastr.error('Failed to save data');
        });

    } catch (Ex) {
      console.log(Ex);
      this.toastr.error('Something went wrong');
    }
  }
  get _PublicInfoFormGroup() {
    return this.PublicInfoFormGroup.controls;
  }

  async GetStaff_InstituteWise(SemesterID: number = 0) {

    let SSOID = ''
    let RoleID = 0

    SSOID = this.SSOLoginDataModel.SSOID
    RoleID = this.SSOLoginDataModel.RoleID


    await this.commonFunctionService.StaffAttendence(SSOID, this.SSOLoginDataModel.Eng_NonEng, this.SSOLoginDataModel.EndTermID, this.SSOLoginDataModel.InstituteID, RoleID).then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      this.StaffList = data.Data;
    })
  }




  async GetInstituteList() {



    await this.commonFunctionService.Iticollege(2, this.SSOLoginDataModel.Eng_NonEng).then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      debugger;
      if (data.Data.length > 0) {
        this.InstituteList = data.Data;
      }
      else {
        this.InstituteList = [];
      }

      //this.ExaminerDDL = [{ StaffID: 1, Name: 'Staff 1', SSOID: 'Staff1' },{ StaffID: 2, Name: 'Staff 2', SSOID: 'Staff2' },{ StaffID: 3, Name: 'Staff 3', SSOID: 'Staff3' }];
    })
  }

  Onyearchange() {
    debugger
    this.SubjectMasterDDL = []
    this.commonFunctionService.GetNonsubstitutesubject(this.SSOID, this.SSOLoginDataModel.EndTermID).then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      this.SubjectMasterDDL = data.Data;
    })
  }
  getCellClass(w: number, i: number): any {

    const day = w * 7 + i - this.startDay + 1;

    if (this.isEmptyCell(w, i)) {
      return 'empty';
    }

    const date = new Date(this.year, this.month - 1, day);

    const dateStr = this.getDateString(date);

    const weekday = date.getDay();

    const event = this.getEvent(day);

    // Sunday freeze grey
    if (weekday === 0) {
      return 'freeze';
    }

    // dates not coming from SP freeze
    if (!this.allowedDates.includes(dateStr)) {
      return 'freeze';
    }

    // Holiday = RED
    if (event?.EventType === 'Holiday') {
      return 'holiday';
    }

    // Locked = GREEN
    if (event?.IsLocked == 1) {
      return 'locked';
    }

    return '';
  }

  isEmptyCell(w: number, i: number): boolean {
    const day = w * 7 + i - this.startDay + 1;
    return (w * 7 + i) < this.startDay || day > this.monthDays.length;
  }

  isWithinLast7Days(date: Date): boolean {
    const today = new Date();
    const past7Days = new Date();
    past7Days.setDate(today.getDate() - 7);

    // remove time part for safe compare
    const checkDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const past7Only = new Date(past7Days.getFullYear(), past7Days.getMonth(), past7Days.getDate());

    return checkDate >= past7Only && checkDate <= todayOnly;
  }


  getSubjectMasterDDL(ID: any = 0, SemesterID: any = 0) {
    debugger

    this.subjectsearch.StreamID = ID

    this.subjectsearch.SemesterID = SemesterID
    this.subjectsearch.DepartmentID = 1
    this.subjectsearch.SchemeID = 1348
    this.subjectsearch.RoleID = this.SSOLoginDataModel.RoleID
    this.subjectsearch.UserID = this.SSOLoginDataModel.UserID
    this.subjectsearch.EndTermID = this.SSOLoginDataModel.EndTermID
    this.subjectsearch.StaffID = this.StaffID


    this.commonFunctionService.GetSubjectMasterDDL_New(this.subjectsearch).then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      this.SubjectMasterDDL = data.Data;
    })



  }

  async ChangeSubjectDDL() {

    debugger

    const GetSubjectID = this.SubjectID

    debugger
    let obj = {
      SemesterID: 0,
      StreamID: 0,
      SubjectID: GetSubjectID,
      StaffID: this.StaffID,
      DepartmentID: this.SSOLoginDataModel.DepartmentID,
      Eng_NonEng: this.SSOLoginDataModel.Eng_NonEng,
    }
    await this.staffMasterService.GetBranchSectionAcRosterData(obj)
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.GetSectionData = data.Data;

      }, (error: any) => console.error(error)
      );


    //let obj = {
    //  Action: "GET_BY_ID",
    //  DepartmentID: this.sSOLoginDataModel.DepartmentID,
    //  EndTermID: this.sSOLoginDataModel.EndTermID,
    //  Eng_NonEng: this.sSOLoginDataModel.Eng_NonEng,
    //  StreamID: StreamID,
    //}
    // this.staffMasterService.GetBranchSectionData(obj)
    //  .then((data: any) => {
    //    data = JSON.parse(JSON.stringify(data));
    //    this.GetSectionData = data.Data
    //  }, (error: any) => console.error(error)
    //);



    this.GetStudentAttandanceTimeDDL()


  }

  async GetStudentAttandanceTimeDDL() {

    await this.commonFunctionService.GetStudentAttandanceTimeDDL(this.StaffID, this.SubjectID, 0, this.SectionID).then((data: any) => {
      data = JSON.parse(JSON.stringify(data));

      debugger
      this.StudentAttandanceTimeDDL = data.Data;
    })

  }

}
