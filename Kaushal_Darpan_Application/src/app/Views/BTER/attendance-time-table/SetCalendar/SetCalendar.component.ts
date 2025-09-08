import { Component, OnInit } from '@angular/core';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
import { SeatIntakeDataModel } from '../../../../Models/ITI/SeatIntakeDataModel';
import { ItiSeatIntakeService } from '../../../../Services/ITI/ItiSeatIntake/iti-seat-intake.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { EnumCourseType, EnumStatus, PublicAddType } from '../../../../Common/GlobalConstants';
import { ItiCollegesSearchModel, ItiTradeSearchModel } from '../../../../Models/CommonMasterDataModel';
import { ActivatedRoute, Router } from '@angular/router';
import { BTERSeatsDistributionsService } from '../../../../Services/BTER/Seats-Distributions/seats-distributions.service';
import { BTERCollegeTradeSearchModel } from '../../../../Models/BTER/BTERSeatIntakeDataModel';
import { BranchStreamTypeWiseSearchModel, BTERCollegeBranchModel } from '../../../../Models/BTER/BTERSeatsDistributions';
import { PublicInfoDataModel } from '../../../../Models/PublicInfoDataModel';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { CalendarEventModel } from '../../../../Models/StaffMasterDataModel';
import { AttendanceServiceService } from '../../../../Services/AttendanceServices/attendance-service.service';

@Component({
  selector: 'app-SetCalendar',
  templateUrl: './SetCalendar.component.html',
  styleUrls: ['./SetCalendar.component.css'],
    standalone: false
})
export class SetCalendarComponent implements OnInit {
  public SSOLoginDataModel = new SSOLoginDataModel()
  public PublicInfoFormGroup!: FormGroup;
  //public request = new SeatIntakeDataModel()
  public isSubmitted = false;
  public tradeSearchRequest = new ItiTradeSearchModel()
  public collegeSearchRequest = new ItiCollegesSearchModel()
  public ItiTradeListAll: any = [];
  public CollegesListAll: any = [];
  public BranchList: any = [];
  public ITIRemarkList: any = [];
  public SanctionedList: any = [];
  public FinancialYearList: any = [];
  public SeatIntakeID: number | null = null;
  public branchSearchRequest = new BranchStreamTypeWiseSearchModel()
  public BranchID: number = 0
  public request = new PublicInfoDataModel()
  public State: number = 0;
  public key: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public IsUpload: boolean = false;
  public LableText: string = '';
  public _PublicAddType = PublicAddType
  public _startl: string=''
  public _startf: string=''
  public weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  monthDays: number[] = [];
  startDay = 0;
  monthName = '';
  year = 0;
  month = 0;
  public events: CalendarEventModel[] = [];
  public eventsList: CalendarEventModel[] = [];
  public eventsSearch = new  CalendarEventModel();

  constructor(
    private commonFunctionService: CommonFunctionService,
    private formBuilder: FormBuilder,
    private ItiSeatIntakeService: ItiSeatIntakeService,

    private SeatsDistributionsService: BTERSeatsDistributionsService,

    private toastr: ToastrService,
    private loaderService: LoaderService,
    private route: ActivatedRoute,
    private router: Router,
    private routers: ActivatedRoute,
    public appsettingConfig: AppsettingService,
    private attendanceServiceService: AttendanceServiceService,

  ) { this.populateMonthDays(); }

  async ngOnInit() {
    this.SSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.initializeToday();
    let events = await  this.generateMonthDays(this.year, this.month);
    this.events = events;
    await this.getCalendarEventModel();

    console.log('All events:', events);

    this.updateCalendar();
    
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

  async generateMonthDays(year: number, month: number){
    const daysInMonth = new Date(year, month, 0).getDate();
    const events: CalendarEventModel[] = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const event = new CalendarEventModel();
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
    debugger
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
        debugger
        if (eventIndex !== -1) {
            // Update existing event
            events[eventIndex - 1].EventType = se.EventType;
            events[eventIndex - 1].Remark = se.Remark;
            if (se.EventType === 'Holiday') {
              if(events[eventIndex - 1].WeekDayName === 'Sun') {
                events[eventIndex - 1].Color = 'blue'; 
              } else {
                events[eventIndex - 1].Color = 'red'; 
              }
                
            }
        } else {
            
            const newEvent = new CalendarEventModel();
            newEvent.EventId = events.length + 1;  
            newEvent.EventDate = seDate;
            newEvent.Day = seDate.getDate();
            newEvent.EventType = se.EventType;
            newEvent.Remark = se.Remark;
            newEvent.Color = se.EventType === 'Holiday' ? 'red' : '';
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
    return date.toISOString().substring(0, 10); 
  }

  async getCalendarEventModel() {
    this.request.CourseTypeId = this.SSOLoginDataModel.Eng_NonEng
    this.request.CreatedBy = this.SSOLoginDataModel.UserID;
    this.request.IPAddress = "";
    this.request.AcademicYearId = this.SSOLoginDataModel.FinancialYearID;
    this.request.DepartmentId = this.SSOLoginDataModel.DepartmentID;

    this.eventsSearch.CurrentMonth = this.month
    this.eventsSearch.CurrentYear = this.year

    try {
      await this.attendanceServiceService.getCalendarEventModel(this.eventsSearch)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.eventsList = data.Data
         
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

    let events = await  this.generateMonthDays(newYear, newMonth);
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
    let events = await  this.generateMonthDays(newYear, newMonth);
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

 

  onDateClick(day: number) {
  if (day < 1 || day > this.monthDays.length) return;

  const existingEvent = this.getEvent(day);
  if (existingEvent && existingEvent.EventType === 'Holiday') {
    alert(`Holiday: ${existingEvent.Remark}`);
    return;
  }

  // Prompt for Event Type
  const eventType = prompt("Enter Event Type (Holiday / Exam / Other):", existingEvent?.EventType || "");
  if (!eventType) return; // If no event type is provided, cancel

  // Validate Event Type (only allow valid types)
  const validEventTypes = ['Holiday', 'Exam', 'Other'];
  if (!validEventTypes.includes(eventType)) {
    alert("Invalid Event Type. Please select from 'Holiday', 'Exam', or 'Other'.");
    return;
  }

  // Prompt for Remark
  const remark = prompt("Enter Remark:", existingEvent?.Remark || "");
  if (remark === null) return; // Cancel if no remark is provided

  if (existingEvent) {
    // Update the existing event
    existingEvent.EventType = eventType;
    existingEvent.Remark = remark;
  } else {
    // Add a new event to the list
    this.events.push({
      EventId: this.events.length + 1,
      Day: day,
      EventDate: new Date(this.year, this.month - 1, day),
      EventType: eventType,
      Remark: remark,
      DepartmentID: 0,
      EndTermID: 0,
      AcademicYearID: 0,
      CourseTypeID: 0,
      IsActive: true,
      IsDelete: false,
      Color: '',
      WeekDayName: ''
    });
  }

  // Optionally, you can update the UI after the changes are made
  this.updateCalendar(); // Assuming you have a method to refresh the calendar
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

      const formattedEvents = this.events.map(event => ({
        ...event,
        EventDate: this.formatDate(event.EventDate),
        DepartmentID: this.SSOLoginDataModel.DepartmentID,
        EndTermID: this.SSOLoginDataModel.EndTermID,
        AcademicYearID: this.SSOLoginDataModel.FinancialYearID,
        CourseTypeID: this.SSOLoginDataModel.Eng_NonEng,
      }));

      this.attendanceServiceService.SetCalendarEventModel(formattedEvents)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data['Data']));
          this.toastr.success('Saved Successfully');
          
        }, error => console.error(error));
    } catch (Ex) {
      console.log(Ex);
    }
  }
  get _PublicInfoFormGroup() { return this.PublicInfoFormGroup.controls; }
}
