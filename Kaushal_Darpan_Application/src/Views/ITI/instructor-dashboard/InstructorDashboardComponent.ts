import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { EnumRole, EnumEMProfileStatus } from "../../../app/Common/GlobalConstants";
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

@Component({
    selector: 'app-instructor-dashboard',
    standalone: false,
    templateUrl: './instructor-dashboard.component.html',
    styleUrl: './instructor-dashboard.component.css'
})
export class InstructorDashboardComponent implements OnInit {
  Highcharts: typeof Highcharts = Highcharts;
  public transferChartOptions: Highcharts.Options | null = null;
    constructor(
        private toastr: ToastrService,
        private loaderService: LoaderService,
        private formBuilder: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private routers: Router,
        private commonMasterService: CommonFunctionService,
        private staffMasterService: StaffMasterService,
      private sweetAlert2: SweetAlert2,
      private dashboardservice: AdminDashboardDataService,
      private websiteSettingsService: WebsiteSettingsService
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
    TRANSFER_CHART: any[]
  } = {
      TOPCARD: [],
      ATTENDANCE_SUMMARY: [],
      TRANSFER_CHART: []
    };
  public notifications: any[] = [];
    public viewPlacementDashboardList: any = [];
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
              let insti = this.InstituteMasterDDL.find(function(x: { InstituteID: number; }) {
                  return x.InstituteID == instute;
              });
              this.InstituteName = insti?.InstituteName;
          }

    });

    this.initFilters() 

      await this.getdashdata()
      await this.GetAllData()
   this.buildTransferChart();      // ← then build chart()
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
    this.buildTransferChart();
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

      this.searchRequest1.SSOID = this.sSOLoginDataModel.SSOID;
      this.searchRequest1.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.searchRequest1.UserID = this.sSOLoginDataModel.UserID;
      this.searchRequest1.EndTermID = this.sSOLoginDataModel.EndTermID;

      const data: any = await this.dashboardservice
        .GetITI_TeacherDashboardNew(this.searchRequest1);

      const result = data?.Data || [];

      console.log("RAW API:", result);

      // ✅ RESET CONTAINER
      this.dashboardData = {
        TOPCARD: [],
        ATTENDANCE_SUMMARY: [],
        TRANSFER_CHART: []
      };

      // ✅ GROUP DATA BY SectionType
      result.forEach((item: any) => {

        const model = {
          id: item.ID,
          title: item.Title,
          titleHindi: item.TitleHindi,
          totalCount: Number(item.TotalCount),
          url: item.URL,
          icon: item.Icon,
          menuCode: item.MenuCode,
          statusText: item.StatusText
        };

        if (item.SectionType === 'TOPCARD') {
          this.dashboardData.TOPCARD.push(model);
        }

        else if (item.SectionType === 'ATTENDANCE_SUMMARY') {
          this.dashboardData.ATTENDANCE_SUMMARY.push(model);
        }

        else if (item.SectionType === 'TRANSFER_CHART') {
          this.dashboardData.TRANSFER_CHART.push(model);
        }
      });

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


  buildTransferChart(): void {
    const chartData = this.dashboardData.TRANSFER_CHART;
    if (!chartData?.length) return;

    const colors = ['#22c55e', '#f59e0b', '#ef4444'];
    const total = chartData.reduce((sum, item) => sum + (item.totalCount || 0), 0);

    // If all zero, show a grey placeholder slice so chart still renders
    const seriesData = total === 0
      ? [{ name: 'No Data', y: 1, color: '#e5e7eb' }]
      : chartData.map((item, i) => ({
        name: item.title,
        y: Number(item.totalCount) || 0,
        color: colors[i % colors.length]
      }));

    this.transferChartOptions = {
      chart: {
        type: 'pie',
        height: 260,
        backgroundColor: 'transparent',
        margin: [10, 10, 10, 10],
      },
      title: { text: '' },
      credits: { enabled: false },
      legend: { enabled: false },
      tooltip: {
        pointFormat: total === 0
          ? 'No requests yet'
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
              fontFamily: 'Inter, Segoe UI, sans-serif',
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



  async GetAllData() {
    try {
      this.searchRequest1.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.searchRequest1.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.searchRequest1.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.searchRequest1.UserID = this.sSOLoginDataModel.UserID;

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

  getTransferPercent(count: number): string {
    const total = this.dashboardData.TRANSFER_CHART
      .reduce((s, i) => s + (i.totalCount || 0), 0);
    if (total === 0) return '0%';
    return Math.round((count / total) * 100) + '%';
  }
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
  getNotifIcon(type: string): string {
    if (!type) return 'bi-bell-fill';
    const t = type.toLowerCase();
    if (t.includes('guest')) return 'bi-house-door-fill';
    if (t.includes('transfer')) return 'bi-arrow-left-right';
    if (t.includes('iip') || t.includes('event')) return 'bi-calendar-event-fill';
    if (t.includes('order') || t.includes('circular')) return 'bi-file-text-fill';
    return 'bi-bell-fill';
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
}
