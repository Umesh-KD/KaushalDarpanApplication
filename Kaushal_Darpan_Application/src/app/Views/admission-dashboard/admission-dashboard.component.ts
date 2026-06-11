import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { EnumRole, EnumEMProfileStatus, EnumStatus } from "../../../app/Common/GlobalConstants";
import { SSOLoginDataModel } from "../../../app/Models/SSOLoginDataModel";
import { StaffDashboardSearchModel } from "../../../app/Models/StaffDashboardDataModel";

import { StaffMasterSearchModel, TeachearDashboardSearchModel } from "../../../app/Models/StaffMasterDataModel";
import { CommonFunctionService } from "../../../app/Services/CommonFunction/common-function.service";
import { LoaderService } from "../../../app/Services/Loader/loader.service";
import { StaffMasterService } from "../../../app/Services/StaffMaster/staff-master.service";
import { SweetAlert2 } from "../../../app/Common/SweetAlert2";
import Highcharts from 'highcharts';
import { AdminDashboardDataService } from "../../../app/Services/AdminDashboard/admin-dashboard-data.service";
import { WebsiteSettingsService } from "../../../app/Services/BTER/WebsiteSettings/website-settings.service";
import { CompanyEventSearchModel } from "../../Models/IndustryInstitutePartnershipMasterDataModel";
import { IndustryInstitutePartnershipMasterService } from "../../Services/IndustryInstitutePartnershipMaster/industryInstitutePartnership-master.service.ts";
import { GuestRoomManagmentService } from "../../Services/GuestRoomManagment/GuestRoomManagment.service";
import { GuestApplyForGuestRoomSearchModel } from "../../Models/GuestRoom-Management/GuestRoomManagmentDataModel";
import { ITIAdminDashboardServiceService } from "../../Services/ITI-Admin-Dashboard-Service/iti-admin-dashboard-service.service";

@Component({
  selector: 'app-admission-dashboard',
  standalone: false,
  templateUrl: './admission-dashboard.component.html',
  styleUrl: './admission-dashboard.component.css'
})
export class AdmissionDashboardComponent {
  Highcharts: typeof Highcharts = Highcharts;
  public transferChartOptions: Highcharts.Options | null = null;
  public guestHouseChartOptions: Highcharts.Options | null = null;
  public searchRequest2 = new CompanyEventSearchModel();
  @ViewChild('notifList') notifList!: ElementRef;
  constructor(
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    private commonMasterService: CommonFunctionService,
    private staffMasterService: StaffMasterService,
    private sweetAlert2: SweetAlert2,
    private dashboardservice: ITIAdminDashboardServiceService,
    private websiteSettingsService: WebsiteSettingsService,
    private industryInstitutePartnershipMasterService: IndustryInstitutePartnershipMasterService,
    private guestRoomManagmentService: GuestRoomManagmentService,
  ) { }

  public monthList = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];


  dashboardData: {
    TOPCARD: any[],
    ATTENDANCE_SUMMARY: any[],
    TRANSFER_CHART: any[],
    GUESTHOUSE_CHART: any[]
  } = {
      TOPCARD: [],
      ATTENDANCE_SUMMARY: [],
      TRANSFER_CHART: [],
      GUESTHOUSE_CHART: []
    };
  public notifications: any[] = [];
  public CompanyEventsList: any[] = [];
  public GUESTHOUSE_CHART: any[] = [];
  public viewPlacementDashboardList: any = [];
  public GuestRoomApplyList: any = [];
  public DynamicContentData: any = [];
  public Table_SearchText: string = "";
  public searchRequest = new StaffMasterSearchModel();
  public searchRequest1 = new TeachearDashboardSearchModel();
  public sSOLoginDataModel = new SSOLoginDataModel();
  public State: number = 0;
  public SuccessMessage: string = '';
  public ErrorMessage: string = '';
  public StaffMasterList: any = [];
  public InstituteMasterDDL: any = [];
  public InstituteName: any;
  public staffDashSearchReq = new StaffDashboardSearchModel();
  public _EnumRole = EnumRole;
  public _EnumEMProfileStatus = EnumEMProfileStatus;





  async ngOnInit() {


    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    debugger
    await this.CheckProfileStatus();
    //if (this.StaffMasterList.length > 0) {
    //    debugger;
    //    let status = this.StaffMasterList[0].ProfileStatus;
    //    if (status == this._EnumEMProfileStatus.Pending || status == this._EnumEMProfileStatus.Completed || status == this._EnumEMProfileStatus.Revert) {
    //        this.sweetAlert2.Confirmation("Your Profile Is not completed please create your profile?", async (result: any) => {
    //            if (this.sSOLoginDataModel.DepartmentID == 2) {
    //                if (this.sSOLoginDataModel.EmTypeId == 2) {
    //                    window.open("/additiprivatestaffmaster?id=" + this.StaffMasterList[0].StaffID, "_Self");
    //                }
    //                else if (this.sSOLoginDataModel.EmTypeId == 1) {
    //                    if (this.sSOLoginDataModel.ProfileID == this._EnumEMProfileStatus.Pending || this.sSOLoginDataModel.ProfileID == this._EnumEMProfileStatus.Revert || this.sSOLoginDataModel.ProfileID == this._EnumEMProfileStatus.Completed) {
    //                        window.open("/ITIGOVTEMPersonalDetailsApplicationTab", "_Self");
    //                    }

    //                }

    //                else {
    //                    window.open("/addstaffmaster?id=" + this.StaffMasterList[0].StaffID, "_Self");
    //                }
    //            } else if (this.sSOLoginDataModel.DepartmentID == 1) {
    //                if (this.sSOLoginDataModel.EmTypeId == 2) {
    //                    window.open("/addstaffmaster?id=" + this.StaffMasterList[0].StaffID, "_Self");
    //                }
    //                else if (this.sSOLoginDataModel.EmTypeId == 1) {
    //                    debugger;

    //                    if (this.sSOLoginDataModel.ProfileID == this._EnumEMProfileStatus.Pending || this.sSOLoginDataModel.ProfileID == this._EnumEMProfileStatus.Revert || this.sSOLoginDataModel.ProfileID == this._EnumEMProfileStatus.Completed) {
    //                        window.open("/bter-em-add-staff-details", "_Self");
    //                    }

    //                }

    //                else {
    //                    window.open("/addstaffmaster?id=" + this.StaffMasterList[0].StaffID, "_Self");
    //                }
    //            }


    //        }, 'OK', false);
    //    }

    //    else if ((status == this._EnumEMProfileStatus.Completed || this._EnumEMProfileStatus.Revert) && this.sSOLoginDataModel.DepartmentID == 2) {
    //        if (this.sSOLoginDataModel.EmTypeId == 1) {

    //            if (this.sSOLoginDataModel.ProfileID == 0 || this.sSOLoginDataModel.ProfileID == this._EnumEMProfileStatus.Completed || this.sSOLoginDataModel.ProfileID == this._EnumEMProfileStatus.Revert) {
    //                window.open("/ITIGOVTEMPersonalDetailsApplicationTab", "_Self");
    //            }

    //        }



    //    }

    //}
    let instute = this.sSOLoginDataModel.InstituteID;
    this.commonMasterService.InstituteMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID).then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      this.InstituteMasterDDL = data.Data;
      if (this.InstituteMasterDDL?.length > 0) {
        let insti = this.InstituteMasterDDL.find(function (x: { InstituteID: number; }) {
          return x.InstituteID == instute;
        });
        this.InstituteName = insti?.InstituteName;
      }

    });

    this.initFilters()

    await this.getdashdata()
    await this.GetCompanyEvents()
    await this.GetGuestRoomApplyList()
    await this.GetAllData()

  }

  // Call this in ngOnInit to build year list and set defaults
  initFilters() {
    const current = new Date();
    this.searchRequest1.Month = current.getMonth() + 1;
    this.searchRequest1.Year = current.getFullYear();

    // Show last 5 years up to current

  }
  async onFilterChange() {
    await this.getdashdata();
/*    this.buildTransferChart();*/
  }
  async CheckProfileStatus() {
    try {
      this.loaderService.requestStarted();
      this.searchRequest.Action = '_checkProfileStatus'
      this.searchRequest.SSOID = this.sSOLoginDataModel.SSOID;
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.searchRequest.CourseTypeId = this.sSOLoginDataModel.Eng_NonEng;
      
      await this.staffMasterService.GetAllData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.StaffMasterList = data['Data'];
          console.log("CheckProfileStatus", this.StaffMasterList)
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


  async getdashdata() {
    try {
      this.loaderService.requestStarted();

      const obj = {
        RoleID: this.sSOLoginDataModel.RoleID,
        DepartmentID: this.sSOLoginDataModel.DepartmentID,
        CollegeID: this.sSOLoginDataModel.InstituteID,
        UserID: this.sSOLoginDataModel.UserID,
        FinancialYearID: this.sSOLoginDataModel.FinancialYearID
      };
      const data: any = await this.dashboardservice
        .GetAdmissionDashboardData(obj);

      const result = data?.Data || [];

      console.log("RAW API:", result);

      this.dashboardData = data?.Data['Table'] 
  
      //this.transferChartOptions =
      //  this.buildPieChart(this.dashboardData.TRANSFER_CHART);

      //this.guestHouseChartOptions =
      //  this.buildPieChart(this.dashboardData.GUESTHOUSE_CHART);

      console.log("Mapped Dashboard:", this.dashboardData);

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

  getTopCardIcon(key: string): string {
    const map: Record<string, string> = {
      calendar: 'bi-calendar-check',
      Attendance: 'bi-calendar-check',
      student: 'bi-people-fill',
      transfer: 'bi-arrow-left-right',
      Transfer: 'bi-arrow-left-right',
      event: 'bi-star',
      IIPEvents: 'bi-star',
    };
    return map[key] ?? 'bi-grid-1x2';
  }

  getAttendanceIcon(title: string): string {
    const map: Record<string, string> = {
      'Present Days': 'bi-person-check-fill',
      'Absent Days': 'bi-person-x-fill',
      'Leave Days': 'bi-person-dash-fill',
      'Working Days': 'bi-calendar2-week-fill',
    };
    return map[title] ?? 'bi-circle-fill';
  }


  //buildTransferChart(): void {
  //  const chartData = this.dashboardData.TRANSFER_CHART;
  //  if (!chartData?.length) return;

  //  const colors = ['#22c55e', '#f59e0b', '#ef4444'];
  //  const total = chartData.reduce((sum, item) => sum + (item.totalCount || 0), 0);

  //  // If all zero, show a grey placeholder slice so chart still renders
  //  const seriesData = total === 0
  //    ? [{ name: 'No Data', y: 1, color: '#e5e7eb' }]
  //    : chartData.map((item, i) => ({
  //      name: item.title,
  //      y: Number(item.totalCount) || 0,
  //      color: colors[i % colors.length]
  //    }));

  //  this.transferChartOptions = {
  //    chart: {
  //      type: 'pie',
  //      height: 260,
  //      backgroundColor: 'transparent',
  //      margin: [10, 10, 10, 10],
  //    },
  //    title: { text: '' },
  //    credits: { enabled: false },
  //    legend: { enabled: false },
  //    tooltip: {
  //      pointFormat: total === 0
  //        ? 'No requests yet'
  //        : '<b>{point.name}</b>: {point.y} ({point.percentage:.0f}%)'
  //    },
  //    plotOptions: {
  //      pie: {
  //        innerSize: '55%',
  //        borderWidth: 3,
  //        borderColor: '#ffffff',
  //        dataLabels: {
  //          enabled: total > 0,
  //          format: '{point.name}: {point.y}',
  //          style: {
  //            fontSize: '11px',
  //            fontWeight: '500',
  //            fontFamily: 'Inter, Segoe UI, sans-serif',
  //            textOutline: 'none'
  //          }
  //        }
  //      }
  //    },
  //    series: [{
  //      type: 'pie',
  //      name: 'Requests',
  //      data: seriesData
  //    }]
  //  };
  //}




  async GetAllData() {
    try {
      this.searchRequest1.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.searchRequest1.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.searchRequest1.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.searchRequest1.UserID = this.sSOLoginDataModel.UserID;
      this.searchRequest1.StaffID = this.sSOLoginDataModel.StaffID;
      this.searchRequest1.RoleID = this.sSOLoginDataModel.RoleID

      await this.websiteSettingsService.GetAllDataOrders(this.searchRequest1).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        const all = data.Data || [];

        // Take latest 5 notifications
        this.notifications = all.slice(0, 5).map((x: any) => ({
          ...x,
          timeAgoText: this.timeAgo(x.CreatedDate)
        }));
      });
    } catch (error) {
      console.log(error);
    }
  }

  //getTransferPercent(count: number): string {
  //  const total = this.dashboardData.TRANSFER_CHART
  //    .reduce((s, i) => s + (i.totalCount || 0), 0);
  //  if (total === 0) return '0%';
  //  return Math.round((count / total) * 100) + '%';
  //}
  timeAgo(dateStr: string): string {
    if (!dateStr) return '';
    const now = new Date();
    const created = new Date(dateStr);
    const diffMs = now.getTime() - created.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 30) return `${diffDays}d ago`;
    return created.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  async GetCompanyEvents() {
    try {
      this.CompanyEventsList = [];

      this.searchRequest2.RoleID = this.sSOLoginDataModel.RoleID;
      if (this.sSOLoginDataModel.RoleID == 3) {
        this.searchRequest2.StaffID = this.sSOLoginDataModel.StudentID;
      } else {
        this.searchRequest2.StaffID = this.sSOLoginDataModel.StaffID;
      }
      this.searchRequest2.DepartmentID = 1
      debugger
      await this.industryInstitutePartnershipMasterService.GetCompanyEventsStaff(this.searchRequest2)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State === EnumStatus.Success) {
            this.CompanyEventsList = (data.Data || []).filter(
              (x: any) => x.InterestedStatus == 1
            );

          } else if (data.State === EnumStatus.Warning) {
            this.toastr.warning("Event not found")
          } else {
            this.toastr.error(data.ErrorMessage)
          }
        })
    } catch (error) {
      console.error(error)
    }
  }


  async GetGuestRoomApplyList() {
    try {
      this.loaderService.requestStarted();
      this.GuestRoomApplyList = [];

      const obj = {
        RoleID: this.sSOLoginDataModel.RoleID,
        DepartmentID: this.sSOLoginDataModel.DepartmentID,
        CollegeID: this.sSOLoginDataModel.InstituteID,
        UserID: this.sSOLoginDataModel.UserID,
        IsForSelf: true
      };
      await this.guestRoomManagmentService.GetAllGuestApplyForGuestRoomList(obj)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];

          this.ErrorMessage = data['ErrorMessage'];
          this.GuestRoomApplyList = data['Data'];

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



  getCardBg(i: number): string {
    const map: Record<number, string> = {
      0: 'bg-blue-50',
      1: 'bg-orange-50',
      2: 'bg-purple-50',
      3: 'bg-emerald-50',
    };
    return map[i % 4] ?? 'bg-blue-50';
  }

  getCardIconBg(i: number): string {
    const map: Record<number, string> = {
      0: 'bg-blue-500',
      1: 'bg-orange-500',
      2: 'bg-purple-500',
      3: 'bg-emerald-500',
    };
    return map[i % 4] ?? 'bg-blue-500';
  }

  getCardTextColor(i: number): string {
    const map: Record<number, string> = {
      0: 'text-blue-600',
      1: 'text-orange-500',
      2: 'text-purple-600',
      3: 'text-emerald-600',
    };
    return map[i % 4] ?? 'text-blue-600';
  }
  getCurrentMonthYear(): string {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const m = (this.searchRequest1.Month || new Date().getMonth() + 1) - 1;
    const y = this.searchRequest1.Year || new Date().getFullYear();
    return `${months[m]} ${y}`;
  }

  getNotifIconBg(i: number): string {
    const map: Record<number, string> = {
      0: 'bg-orange-50 text-orange-500',
      1: 'bg-purple-50 text-purple-600',
      2: 'bg-emerald-50 text-emerald-600',
      3: 'bg-blue-50 text-blue-600',
    };
    return map[i % 4] ?? 'bg-gray-50 text-gray-500';
  }

  getNotifIcon(type: string): string {
    if (!type) return 'bi-bell-fill';
    const t = type.toLowerCase();
    if (t.includes('guest')) return 'bi-house-door-fill';
    if (t.includes('transfer')) return 'bi-arrow-left-right';
    if (t.includes('iip') || t.includes('event')) return 'bi-calendar-event-fill';
    if (t.includes('order') || t.includes('circular')) return 'bi-file-text-fill';
    return 'bi-bell-fill';
  }

  getAttendanceBg(i: number): string {
    const map: Record<number, string> = {
      0: 'bg-emerald-50',
      1: 'bg-red-50',
      2: 'bg-amber-50',
      3: 'bg-blue-50',
    };
    return map[i % 4] ?? 'bg-gray-50';
  }

  getAttendanceIconClass(title: string, i: number): string {
    const colorMap: Record<number, string> = {
      0: 'text-emerald-600',
      1: 'text-red-500',
      2: 'text-amber-500',
      3: 'text-blue-600',
    };
    const iconMap: Record<string, string> = {
      'Present Days': 'bi-person-check-fill',
      'Absent Days': 'bi-person-x-fill',
      'Leave Days': 'bi-person-dash-fill',
      'Working Days': 'bi-calendar2-week-fill',
    };
    const color = colorMap[i % 4] ?? 'text-gray-500';
    const icon = iconMap[title] ?? 'bi-circle-fill';
    return `${icon} ${color}`;
  }

  buildPieChart(data: any[]): Highcharts.Options | null {

    if (!data?.length) return null;

    const colors = ['#22c55e', '#f59e0b', '#ef4444'];

    const total = data.reduce(
      (sum, item) => sum + (item.totalCount || 0),
      0
    );

    const seriesData = total === 0
      ? [{
        name: 'No Data',
        y: 1,
        color: '#e5e7eb'
      }]
      : data.map((item, i) => ({
        name: item.title,
        y: Number(item.totalCount) || 0,
        color: colors[i % colors.length]
      }));

    return {
      chart: {
        type: 'pie',
        height: 260,
        backgroundColor: 'transparent',
        margin: [10, 10, 10, 10]
      },

      title: { text: '' },

      credits: {
        enabled: false
      },

      legend: {
        enabled: false
      },

      tooltip: {
        pointFormat: total === 0
          ? 'No data available'
          : '<b>{point.name}</b>: {point.y} ({point.percentage:.0f}%)'
      },

      plotOptions: {
        pie: {
          innerSize: '55%',
          borderWidth: 3,
          borderColor: '#ffffff',

          dataLabels: {
            enabled: total > 0,
            format: '{point.name}: {point.y}',
            style: {
              fontSize: '11px',
              fontWeight: '500',
              textOutline: 'none'
            }
          }
        }
      },

      series: [{
        type: 'pie',
        name: 'Requests',
        data: seriesData
      }]
    };
  }
  getGuestHousePercent(count: number): string {

    const total = this.dashboardData.GUESTHOUSE_CHART
      .reduce((s, i) => s + (i.totalCount || 0), 0);

    if (total === 0) {
      return '0%';
    }

    return Math.round((count / total) * 100) + '%';
  }

  getStatusClass(status: string): string {

    switch ((status || '').trim().toLowerCase()) {

      case 'approved':
      case 'approved by admin':
      case 'check-in':
      case 'check-out':
      case 'reserved':
        return 'status-success';

      case 'pending':
      case 'waiting list':
        return 'status-warning';

      case 'reject':
      case 'rejected':
        return 'status-danger';

      default:
        return 'status-success';
    }
  }
  getConsentStatusClass(status: string): string {

    switch ((status || '').toLowerCase()) {

      case 'approved':
        return 'status-success';

      case 'pending':
        return 'status-warning';

      case 'rejected':
        return 'status-danger';

      default:
        return 'status-secondary';
    }
  }
}
