import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { HttpClient } from '@angular/common/http';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { GlobalConstants, EnumStatus, EnumDeploymentStatus } from '../../../../Common/GlobalConstants';
import { Acedmic } from '../../../../Models/AcedmicInterface';
import { CenterObserverSearchModel, DeploymentDataModel } from '../../../../Models/CenterObserverDataModel';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { shiftBConditionalValidator } from '../../../../Pipes/shiftBConditionalValidator';
import { CenterObserverService } from '../../../../Services/CenterObserver/center-observer.service';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { MenuService } from '../../../../Services/Menu/menu.service';
import { ReportService } from '../../../../Services/Report/report.service';
import { SMSMailService } from '../../../../Services/SMSMail/smsmail.service';
import { ITIFlyingSquadService } from '../../../../Services/ITI/ITIFlyingSquad/iti-flying-squad.service';
interface Shift {
  DistrictID: number;
  InstituteID: number;
  ShiftID: number;
  DeploymentDate: string | number | null;
}

interface TeamDeployment {
  OperationType: string;
  EndTermId: number;
  DepartmentID: number;
  CourseTypeID: number;
  ActiveStatus: number;
  DeleteStatus: number;
  CreatedBy: number;
  ModifyBy: number;
  TeamID: number;
  ShiftA: Shift;
  ShiftB?: Shift;
}
@Component({
  selector: 'app-add-iti-team-flying-squad',
  standalone: false,
  templateUrl: './add-iti-team-flying-squad.component.html',
  styleUrl: './add-iti-team-flying-squad.component.css'
})

export class AddITITeamFlyingSquadComponent {
  FlyingSquadForm!: FormGroup;
  GetFlyingSquadForm!: FormGroup;
  TeamDeploymentFlyingSquadForm!: FormGroup;
  displayedColumns: string[] = ['SrNo', 'TeamName', 'DistrictNameEnglish', 'StartTime', 'InstituteNameEnglish', 'DeploymentDate', 'Status', 'Actions'];
  AttendanceListColumns: string[] = ['SrNo', 'StaffName', 'TeamName', 'SSOID', 'Institute', 'DeploymentDate', 'IsPresent', 'Remark'];
  DistrictMasterDDL: any;
  SemesterMasterDDL: any[] = [];
  StreamMasterDDL: any[] = [];
  ExaminerDDL: any[] = [];
  ExamShiftDDL: any[] = [];
  InstituteMasterDDL: any[] = [];
  filterData: any[] = [];
  getFlyingSquadTeamData: any[] = [];
  getFlyingSquadTeamDefault: any;
  private _liveAnnouncer = inject(LiveAnnouncer);
  dataSource = new MatTableDataSource<any>([]);
  dataSource1 = new MatTableDataSource<any>([]);
  sSOLoginDataModel = new SSOLoginDataModel();
  isSubmitted: boolean = false;
  AllInTableSelect: boolean = false;
  shownTeamIDs: Set<number> = new Set<number>();
  // Pagination related variables
  totalRecords: number = 0;
  pageSize: number = 50;
  currentPage: number = 1;
  closeResult: string | undefined;
  IsDeploymentDetails: boolean = false;
  modalAddTeamRef: any;
  SSOIDExists: boolean = false;
  totalPages: number = 0;
  startInTableIndex: number = 1;
  endInTableIndex: number = 10;
  @ViewChild('pdfTable', { static: false }) pdfTable!: ElementRef;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  public searchRequest = new CenterObserverSearchModel();
  allowedDates: string[] = [];
  TimeTableDates: any = [];
  ListStatusCount :number = 0;
  ListStatus1Count :number = 0;
  AttendanceList :any[] = [];
  @ViewChild('modal_GenrateOTP') modal_GenrateOTP: any;

  timeLeft: number = GlobalConstants.DefaultTimerOTP; // Total countdown time in seconds (2 minutes)
  showResendButton: boolean = false; // Whether to show the "Resend OTP" button
  private interval: any; // Holds the interval reference
  public MobileNo: number = 0;
  public OTP: string = '';
  public GeneratedOTP: string = '';
  lstAcedmicYear!: Acedmic;
  lstAcedmicYearList!: Acedmic[];
  constructor(private fb: FormBuilder,
    private http: HttpClient,
    private centerObserverService: CenterObserverService,
    private commonMasterService: CommonFunctionService,
    private reportService: ReportService,
    private modalService: NgbModal,
    private sMSMailService: SMSMailService,
    private activatedRoute: ActivatedRoute,
    private menuService: MenuService,
    public appsettingConfig: AppsettingService,
    private flyingSquadService: ITIFlyingSquadService,
    private toastr: ToastrService,
    private router: Router,) {

    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.getFlyingSquad();
    this.getMasterData();
  }

  ngOnInit() {
    this.FlyingSquadForm = this.fb.group({
      TeamName: ['']
    });

    this.GetFlyingSquadForm = this.fb.group({
      TeamID: [0, Validators.required],
      ShiftID: [0, Validators.required],
      DistrictID: [0, Validators.required],
      InstituteID: [0, Validators.required]
    });

    this.TeamDeploymentFlyingSquadForm = this.fb.group({
      TeamID: [0, Validators.required],
      ShiftA: this.fb.group({
        DistrictID: [0, Validators.required],
        InstituteID: [0, Validators.required],
        ShiftID: [1, Validators.required],
        DeploymentDate: ['', Validators.required]
      }),
      ShiftB: this.fb.group({
        DistrictID: [0],
        InstituteID: [0],
        ShiftID: [{ value: 2, disabled: true }],
        DeploymentDate: ['']
      }, { validators: shiftBConditionalValidator })
    });
    this.getTeamDeploymentFlyingSquad();
  }

  CloseModal() {
    this.modalService.dismissAll();
    this.isSubmitted = false;
  }
  get formGetFlyingSquad() { return this.GetFlyingSquadForm.controls; }

  /*  Question ADD Edit Details Start*/
  async AddTeamData(content: any) {
    this.FlyingSquadForm.patchValue({
      TeamName: ''
    });
    let getFlyingSquadTeamData = this.getFlyingSquadTeamData;
    let maxId = 0;
    if (getFlyingSquadTeamData.length > 0) {
      maxId = (Math.max(...getFlyingSquadTeamData.map(o => o.ID)) + 1)      
    } else {
      maxId = 1;
    }
    this.getFlyingSquadTeamDefault = this.lstAcedmicYear?.EndTermName + '-FS' + maxId

    this.modalService.open(content, { size: 'md', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
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

  get formFlyingSquad() { return this.FlyingSquadForm.controls; }

  get shiftAControls() {
    return (this.TeamDeploymentFlyingSquadForm.get('ShiftA') as FormGroup).controls;
  }

  get shiftBControls() {
    return (this.TeamDeploymentFlyingSquadForm.get('ShiftB') as FormGroup).controls;
  }

  

  async getMasterData() {
    try {
      await this.commonMasterService.StreamMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.StreamMasterDDL = data.Data;
      })
      await this.commonMasterService.SemesterMaster().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.SemesterMasterDDL = data.Data;
      })
      await this.commonMasterService.GetDistrictMaster().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.DistrictMasterDDL = data.Data;
      })
      
      await this.commonMasterService.GetExamShift().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.ExamShiftDDL = data.Data;
      })

      await this.commonMasterService.Examiner_SSOID(this.sSOLoginDataModel.DepartmentID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.ExaminerDDL = data.Data;
      })

      let obj = {
        EndTermId: this.sSOLoginDataModel.EndTermID,
        DepartmentID: this.sSOLoginDataModel.DepartmentID,
        Eng_NonEng: this.sSOLoginDataModel.Eng_NonEng,
      }
      await this.commonMasterService.getexamdate(obj).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State == EnumStatus.Success) {
          this.TimeTableDates = data.Data;
          this.allowedDates = this.TimeTableDates.map((item: any) => item.ExamDate);
          console.log("this.allowedDates", this.allowedDates)
        } else {
          this.toastr.error(data.ErrorMessage);
        }
      });

      this.menuService.GetAcedmicYearList()
        .then((AcedmicYear: any) => {
          
          AcedmicYear = JSON.parse(JSON.stringify(AcedmicYear));
          this.lstAcedmicYearList = AcedmicYear['Data'];
          this.lstAcedmicYear = this.lstAcedmicYearList.filter(x => x.EndTermID == this.sSOLoginDataModel.EndTermID)[0];
          //this.loaderService.requestEnded();
        }, error => console.error(error));

    } catch (error) {
      console.error(error);
    }
  }

  //GetInstituteMaster_ByDistrictWise(ID: any) {
  //  this.commonMasterService.GetInstituteMaster_ByDistrictWise(ID, this.sSOLoginDataModel.EndTermID).then((data: any) => {
  //    data = JSON.parse(JSON.stringify(data));
  //    this.InstituteMasterDDL = data.Data;
  //  })
  //}

  GetInstituteMaster_ByDistrictWise(ID: any, type:any) {
    if (type == "ShiftA") {
      this.TeamDeploymentFlyingSquadForm.patchValue({
        ShiftA: {
          InstituteID: 0
        },
        ShiftB: {
          DistrictID:0,
          InstituteID: 0,
          DeploymentDate:''
        }
      });
      this.IsDeploymentDetails = false;
    }
    if (type == "ShiftB") {
      this.TeamDeploymentFlyingSquadForm.patchValue({
        ShiftB: {
          InstituteID: 0
        }
      });
    }
    
    let obj: DeploymentDataModel = {
        InstituteID: 0,
        DistrictID: ID,
        DepartmentID: this.sSOLoginDataModel.DepartmentID,
        Eng_NonEng: this.sSOLoginDataModel.Eng_NonEng,
        EndTermID: this.sSOLoginDataModel.EndTermID,
        ShiftID: 0,
        DeploymentDate: '',
        TeamID: 0,
        UserID: 0,
        DistrictName: '',
        InstituteName: '',
        ShiftName: '',
        RoleID: 0
    }
    this.commonMasterService.GetCenter_DistrictWise(obj).then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      this.InstituteMasterDDL = data.Data;
     
    })
  }

  async getFlyingSquad() {
    try {
      //this.isSubmitted = true;
      let obj = {
        EndTermId: this.sSOLoginDataModel.EndTermID,
        DepartmentID: this.sSOLoginDataModel.DepartmentID,
        CourseTypeID: this.sSOLoginDataModel.Eng_NonEng,
      };
      await this.flyingSquadService.GetTeamFlyingSquad(obj)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data['Data']));
          this.getFlyingSquadTeamData = data;  // Populate filtered data with the fetched data
          
        }, error => console.error(error));

    } catch (Ex) {
      console.log(Ex);
    }
  }

  markFirstTeamRows(data: any[]): any[] {
    const seenTeams = new Set<number>();
    return data.map(row => {
      if (!seenTeams.has(row.TeamID)) {
        seenTeams.add(row.TeamID);
        return { ...row, showAddLink: true };
      }
      return { ...row, showAddLink: false };
    });
  }

  async getTeamDeploymentFlyingSquad() {
    try {
      //this.isSubmitted = true;
      //let obj = {
      //  EndTermId: this.sSOLoginDataModel.EndTermID,
      //  DepartmentID: this.sSOLoginDataModel.DepartmentID,
      //  CourseTypeID: this.sSOLoginDataModel.Eng_NonEng,
      //};
      
      let obj = {
        TeamID: this.GetFlyingSquadForm.value.TeamID ?? 0,
        DistrictID: this.GetFlyingSquadForm.value.DistrictID ?? 0,
        InstituteID: this.GetFlyingSquadForm.value.InstituteID ?? 0,
        ShiftID: this.GetFlyingSquadForm.value.ShiftID ?? 0,
        EndTermId: this.sSOLoginDataModel.EndTermID ?? 0,
        DepartmentID: this.sSOLoginDataModel.DepartmentID ?? 0,
        CourseTypeID: this.sSOLoginDataModel.Eng_NonEng ?? 0
      };

      await this.flyingSquadService.GetTeamDeploymentFlyingSquad(obj)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data['Data']));
          this.shownTeamIDs.clear(); // Important!
          this.filterData = this.markFirstTeamRows(data); // Populate filtered data with the fetched data
          this.dataSource.data = this.filterData;
          this.ListStatusCount = this.filterData.filter(x => x.Status === 3).length;
          this.ListStatus1Count = this.filterData.filter(x => x.Status === 2).length;
          this.dataSource.sort = this.sort;  // Set sort behavior
          this.totalRecords = this.filterData.length;
          this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
          this.updateTable();  // Update table based on pagination
        }, error => console.error(error));

    } catch (Ex) {
      console.log(Ex);
    }
  }

  isFirstTeamRow(teamID: number): boolean {
    if (this.shownTeamIDs.has(teamID)) {
      return false;
    } else {
      this.shownTeamIDs.add(teamID);
      return true;
    }
  }

  checkValidDate(event: Event): void {
    const selectedDate = (event.target as HTMLInputElement).value;
    const shiftAGroup = this.TeamDeploymentFlyingSquadForm.get('ShiftA');
    const shiftBGroup = this.TeamDeploymentFlyingSquadForm.get('ShiftB');
    if (!this.allowedDates.includes(selectedDate)) {
      this.toastr.warning('Exam not scheduled for selected date. Please choose another date.');
      /* this.requestDeploy.DeploymentDate = '';*/
      if (shiftAGroup && shiftBGroup) {
        shiftAGroup.patchValue({
          DeploymentDate: ''
        });
        shiftBGroup.patchValue({
          DeploymentDate: ''
        });
      }
    }
    //else {
    //  if (shiftAGroup && shiftBGroup) {
    //    shiftBGroup.patchValue({
    //      DeploymentDate: shiftAGroup.value.DeploymentDate
    //    });
    //  }
    //}
  }

  AddDeploymentDetails(e: any) {
    if (e.isTrusted) {
      const shiftAValue = this.TeamDeploymentFlyingSquadForm.value.ShiftA;

      const deploymentDate = shiftAValue.DeploymentDate
        ? shiftAValue.DeploymentDate.split('T')[0]
        : null;

      // If DistrictID is present, load institutes
      if (shiftAValue.DistrictID) {
        this.GetInstituteMaster_ByDistrictWise(shiftAValue.DistrictID,"");
      }

      // Patch ShiftB with ShiftA values
      const shiftBGroup = this.TeamDeploymentFlyingSquadForm.get('ShiftB');
      if (shiftBGroup) {
        shiftBGroup.patchValue({
          DistrictID: shiftAValue.DistrictID,
          InstituteID: shiftAValue.InstituteID,
          DeploymentDate: deploymentDate,
          ShiftID: 2
        });
      }
    }
  }

  postFlyingSquadForm() {
    this.isSubmitted = true;
    //if (this.FlyingSquadForm.value.TeamName == "" || this.FlyingSquadForm.value.TeamName == null || this.FlyingSquadForm.value.TeamName == undefined) {
    //  this.isSubmitted = false;

    //  this.toastr.warning('something went wrong please enter team name');
    //  return
    //}
    try {
      
      let obj = {
        OperationType: this.FlyingSquadForm.value.TeamID > 0 ? "UPDATE" : "POST",
        TeamName: this.FlyingSquadForm.value.TeamName == null || this.FlyingSquadForm.value.TeamName == "" ? this.getFlyingSquadTeamDefault : this.getFlyingSquadTeamDefault +'-'+ this.FlyingSquadForm.value.TeamName,
        EndTermId: this.sSOLoginDataModel.EndTermID,
        DepartmentID: this.sSOLoginDataModel.DepartmentID,
        CourseTypeID: this.sSOLoginDataModel.Eng_NonEng,
        ActiveStatus: 1,
        DeleteStatus: 0,
        CreatedBy: this.sSOLoginDataModel.RoleID,
        ModifyBy: this.sSOLoginDataModel.RoleID
      };
      this.flyingSquadService.postTeamFlyingSquadForm(obj)
        .then((data: any) => {
          
          data = JSON.parse(JSON.stringify(data['Data']));
          if (data == 1) {
            this.toastr.success('Update Successfully');
            this.getFlyingSquad();
            this.CloseModal();
            this.isSubmitted = false;
            
            //this.FlyingSquadForm.patchValue({
            //  TeamName: this.sSOLoginDataModel.EndTermID == 13 ? 'MAY-2025-FS' : ''
            //});
          }

        }, error => console.error(error));

    } catch (Ex) {
      console.log(Ex);
    }

  }

  postTeamDeploymentFlyingSquadForm() {
    this.isSubmitted = true;
    if (this.TeamDeploymentFlyingSquadForm.invalid || this.TeamDeploymentFlyingSquadForm.value.TeamID == 0) {
      this.toastr.warning('Something went wrong, please try again.');
      return;
    }
    
    const formValue = this.TeamDeploymentFlyingSquadForm.getRawValue();
    const teamID = formValue.TeamID;
    const shiftADate = formValue.ShiftA.DeploymentDate;
    const shiftID = formValue.ShiftA.ShiftID;
    const shiftBDate = formValue.ShiftB?.DeploymentDate;
    const instituteA = formValue.ShiftA.InstituteID;
    const instituteB = formValue.ShiftB.InstituteID;

    // Helper to format and validate date
    const formatDate = (dateStr: string): string | null => {
      if (!dateStr) return null;

      // Create a Date object from the date string
      const date = new Date(dateStr);

      // If the date is invalid, return null
      if (isNaN(date.getTime())) return null;

      // Get the local date in 'YYYY-MM-DD' format by using toLocaleDateString
      const localDate = date.toLocaleDateString('en-CA'); // 'en-CA' ensures the format is 'YYYY-MM-DD'

      return localDate;
    };
    
    const shiftADateFormatted = formatDate(shiftADate)??'';
    const shiftBDateFormatted = formatDate(shiftBDate)??'';

    const duplicateExists = this.filterData.some(item => {
      const itemDate = formatDate(item.DeploymentDate);

      const isDuplicateShiftA = item.ShiftID == shiftID && item.InstituteID === instituteA && itemDate === shiftADateFormatted;
      //const isDuplicateShiftB = item.ShiftID === 2 && item.InstituteID === instituteB && itemDate === shiftBDateFormatted;

      const isExactMatchA = item.ShiftID == shiftID && item.TeamID === teamID && itemDate === shiftADateFormatted;
      //const isExactMatchB = item.ShiftID === 1 && item.TeamID === teamID && itemDate === shiftBDateFormatted;

      //return isDuplicateShiftA || isExactMatchA || isDuplicateShiftB || isExactMatchB;
      return isDuplicateShiftA || isExactMatchA;
    });

    if (duplicateExists) {
      this.toastr.warning('Duplicate deployment data found. Please change Team or Date.');
      return;
    }

    if (this.TeamDeploymentFlyingSquadForm.valid) {
      try {
        let obj: TeamDeployment = {
          OperationType: "POST",
          EndTermId: this.sSOLoginDataModel.EndTermID,
          DepartmentID: this.sSOLoginDataModel.DepartmentID,
          CourseTypeID: this.sSOLoginDataModel.Eng_NonEng,
          ActiveStatus: 1,
          DeleteStatus: 0,
          CreatedBy: this.sSOLoginDataModel.RoleID,
          ModifyBy: this.sSOLoginDataModel.RoleID,
          TeamID: formValue.TeamID,
          ShiftA: {
            ...formValue.ShiftA,
            DeploymentDate: new Date(shiftADateFormatted).toISOString() // Convert shiftADate to ISO string
          }
        };

        // Only include ShiftB if valid
        if (formValue.ShiftB?.DistrictID > 0 && formValue.ShiftB?.InstituteID > 0 && formValue.ShiftB.DeploymentDate != null && formValue.ShiftB.DeploymentDate != 0) {
          obj.ShiftB = {
            ...formValue.ShiftB,
            DeploymentDate: new Date(shiftBDateFormatted).toISOString() // Convert shiftBDate to ISO string
          };
        }

        // Call the service to post the data
        this.flyingSquadService.PostTeamDeploymentFlyingSquadStatus(obj)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data['Data']));

            if (data === 1) {
              // Reset form values after successful post
              this.IsDeploymentDetails = false;
              this.TeamDeploymentFlyingSquadForm.reset();
              this.TeamDeploymentFlyingSquadForm.patchValue({
                TeamID: 0,
                ShiftA: {
                  DistrictID: 0,
                  InstituteID: 0,
                  ShiftID: 1,
                  DeploymentDate: null // Set to null instead of 0
                },
                ShiftB: {
                  DistrictID: 0,
                  InstituteID: 0,
                  ShiftID: 2,
                  DeploymentDate: null // Set to null instead of 0
                }
              });

              // Optionally, update filterData or fetch updated data from the backend
              this.getTeamDeploymentFlyingSquad();

              // Reset state and show success message
              this.IsDeploymentDetails = false;
              this.isSubmitted = false;
              this.toastr.success('Update Successfully');
            } else {
              this.toastr.error('Failed to post deployment data. Please try again.');
            }

          }, error => {
            console.error(error);
            this.toastr.error('An error occurred while posting deployment data.');
          });

      } catch (Ex) {
        console.log(Ex);
        this.toastr.error('An unexpected error occurred.');
      }
    }
  }


  unLockIsRequest(el: any, lock: any): void {
    Swal.fire({
      title: `Are you sure you want to ${lock == 2 ? "UnLock" : "Lock"}?`,
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: `Yes, ${lock == 2 ? "UnLock" : "Lock"} it!`,
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          let obj = {
            DeploymentID: el.ID,
            TeamID: el.TeamID,
            DeploymentDate: el.DeploymentDate,
            UserID: this.sSOLoginDataModel.UserID,
            OperationType: 'UPDATE',
            IsRequest: lock,
            EndTermId: this.sSOLoginDataModel.EndTermID,
            DepartmentID: this.sSOLoginDataModel.DepartmentID,
            CourseTypeID: this.sSOLoginDataModel.Eng_NonEng,
            CreatedBy: this.sSOLoginDataModel.RoleID,
            ModifyBy: this.sSOLoginDataModel.UserID,
          };
          this.flyingSquadService.IsRequestFlyingSquad(obj)
            .then((data: any) => {
              data = JSON.parse(JSON.stringify(data['Data']));
              this.toastr.success('Update Successfully');
              this.getTeamDeploymentFlyingSquad();
            }, error => console.error(error));
        } catch (Ex) {
          console.log(Ex);
        }
      } else {
        console.log('Action cancelled!');
      }
    });
  }


  onPaginationChange(event: PageEvent): void {
    
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex + 1;
    if (this.currentPage < 1) this.currentPage = 1;
    else if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;
    this.updateTable();  // Update table when pagination changes
  }

  updateTable(): void {
    this.shownTeamIDs.clear(); 
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, this.totalRecords);
    this.dataSource.data = this.filterData.slice(startIndex, endIndex);
    this.updatePaginationIndexes();
  }

  updatePaginationIndexes(): void {
    this.startInTableIndex = (this.currentPage - 1) * this.pageSize + 1;
    this.endInTableIndex = Math.min(this.currentPage * this.pageSize, this.totalRecords);
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  async openModalGenerateOTP(content: any) {
    
    const anyTeamSelected = this.filterData.some(x => x.Selected);
    if (!anyTeamSelected) {
      this.toastr.error("Please select at least one Team!");
      return;
    }
    this.resetOTPControls();
    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

    this.SendOTP();
  }

  async SendOTP(isResend?: boolean) {
    try {
      this.GeneratedOTP = "";
      await this.sMSMailService.SendMessage(this.sSOLoginDataModel.Mobileno, "OTP")
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.startTimer();

            //open modal popup
            this.GeneratedOTP = data['Data'];
            if (isResend) {
              this.toastr.success('OTP resent successfully');
            }
          }
          else {
            this.toastr.warning('Something went wrong');
          }
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
  }

  async VerifyOTP() {

    if (this.OTP.length > 0) {
      if ((this.OTP == GlobalConstants.DefaultOTP) || (this.OTP == this.GeneratedOTP)) {
        try {
          
          this.CloseModal();
          this.VerifyDeployment();
        } catch (ex) {
          console.log(ex);
        }
      } else {
        this.toastr.warning('Invalid OTP Please Try Again');
      }
    } else {
      this.toastr.warning('Please Enter OTP');
    }
  }

  AllGenerateOrder() {
    const Selected = this.filterData
      .filter(x => x.Selected === true || x.Selected === 1)
      .map((x: any) => ({
        ID: x.ID,
        TeamID: x.TeamID,
        OperationType: "UPDATE",
        EndTermId: this.sSOLoginDataModel.EndTermID,
        DepartmentID: this.sSOLoginDataModel.DepartmentID,
        CourseTypeID: this.sSOLoginDataModel.Eng_NonEng,
        Status: EnumDeploymentStatus.OrderGenerated
      }));

    try {
      

      this.reportService.GetAllFlyingSquadDutyOrder(Selected)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            
            for (let i = 0; i <= data.Data.length; i++){
              this.DownloadFile(data.Data[i], 'file download');
            }
            this.AllInTableSelect = false;
            this.getTeamDeploymentFlyingSquad()
          }
          else {
            this.toastr.error(data.ErrorMessage)
            //    data.ErrorMessage
          }
        }, (error: any) => console.error(error)
      );

    } catch (error) {
      console.log(error);
    }
  }

  async VerifyDeployment() {
    
    const Selected = this.filterData
      .filter(x => x.Selected === true || x.Selected === 1)
      .map((x: any) => ({
        ID:x.ID,
        TeamID: x.TeamID,
        OperationType: "UPDATE",
        ModifyBy: this.sSOLoginDataModel.RoleID,
        Status: EnumDeploymentStatus.Verified
      }));
    
    try {
      await this.flyingSquadService.PostTeamDeploymentFlyingSquad(Selected).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State == EnumStatus.Success) {
          this.toastr.success(data.Message)
          this.getTeamDeploymentFlyingSquad();
          //this.GetAllDataForVerify()
        } else {
          this.toastr.error(data.ErrorMessage)
        }

      }, (error: any) => console.error(error))
    } catch (error) {
      console.log(error);
    }

  }

  resetSearch() {
    this.GetFlyingSquadForm.reset({
      ShiftID: 0,
      DistrictID: 0,
      InstituteID: 0
    });
    this.getTeamDeploymentFlyingSquad();
  }

  resetOTPControls() {
    this.OTP = "";
    this.GeneratedOTP = "";

  }

  startTimer(): void {
    this.showResendButton = false;
    this.timeLeft = GlobalConstants.DefaultTimerOTP * 60;

    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        clearInterval(this.interval);
        this.showResendButton = true; // Show the button when time is up
      }
    }, 1000); // Update every second
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  numberOnly(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

  exportToExcel(): void {
    const unwantedColumns = [
      "TeamID", "DistrictID", "ShiftID", "InstituteID", "EndTermID", "DepartmentID", "CourseTypeID", "ActiveStatus", "DeleteStatus", "CreatedBy", "ModifyBy", "CreatedDate", "ModifiedDate"
    ];
    const filteredData = this.filterData.map((item: { [x: string]: any; }) => {
      const filteredItem: any = {};
      Object.keys(item).forEach(key => {
        if (!unwantedColumns.includes(key)) {
          filteredItem[key] = item[key];
        }
      });
      return filteredItem;
    });
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'Reports.xlsx');
  }

  downloadPDF(team: any) {
    try {
      
      let obj = {
        EndTermId: this.sSOLoginDataModel.EndTermID,
        DepartmentID: this.sSOLoginDataModel.DepartmentID,
        CourseTypeID: this.sSOLoginDataModel.Eng_NonEng,
        ...team
      };

      this.reportService.GetITIFlyingSquadDutyOrder(obj)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.DownloadFile(data.Data, 'file download');
            this.getTeamDeploymentFlyingSquad()
          }
          else {
            this.toastr.error(data.ErrorMessage)
            //    data.ErrorMessage
          }
        }, (error: any) => console.error(error)
        );
    }
    catch (ex) {
      console.log(ex);
    }
    //const margin = 10;
    //const pageWidth = 210 - 2 * margin;
    //const pageHeight = 200 - 2 * margin;

    //const doc = new jsPDF({
    //  orientation: 'p',
    //  unit: 'mm',
    //  format: [210, 300],
    //});

    //const pdfTable = this.pdfTable.nativeElement;

    //doc.html(pdfTable, {
    //  callback: function (doc) {
    //    doc.save('Report.pdf');
    //  },
    //  x: margin,
    //  y: margin,
    //  width: pageWidth,
    //  windowWidth: pdfTable.scrollWidth,
    //});
  }


  async Model_Attendance(content: any, row: any) {
    console.log(row)
    try {

      let obj = {
        EndTermId: this.sSOLoginDataModel.EndTermID,
        DepartmentID: this.sSOLoginDataModel.DepartmentID,
        CourseTypeID: this.sSOLoginDataModel.Eng_NonEng,
        TeamID: row?.TeamID,
        DeploymentDate: row?.DeploymentDate,
        ShiftID: row?.ShiftID
      };

      this.flyingSquadService.GetFlyingSquad_Attendance(obj)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.AttendanceList = data.Data
            this.dataSource1.data = this.AttendanceList;
            this.dataSource1.sort = this.sort;  // Set sort behavior
          }
          else {
            this.toastr.error(data.ErrorMessage)
            //    data.ErrorMessage
          }
        }, (error: any) => console.error(error)
        );
    }
    catch (ex) {
      console.log(ex);
    }
    this.modalService.open(content, { size: 'lg', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  GetFlyingSquadReports(team: any) {
    try {
      
      let obj = {
        EndTermId: this.sSOLoginDataModel.EndTermID,
        DepartmentID: this.sSOLoginDataModel.DepartmentID,
        CourseTypeID: this.sSOLoginDataModel.Eng_NonEng,
        ...team
      };

      this.reportService.GetITIFlyingSquadOrderReports(obj)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.DownloadFile(data.Data, 'file download');
          }
          else {
            this.toastr.error(data.ErrorMessage)
            //    data.ErrorMessage
          }
        }, (error: any) => console.error(error)
        );
    }
    catch (ex) {
      console.log(ex);
    }
    //const margin = 10;
    //const pageWidth = 210 - 2 * margin;
    //const pageHeight = 200 - 2 * margin;

    //const doc = new jsPDF({
    //  orientation: 'p',
    //  unit: 'mm',
    //  format: [210, 300],
    //});

    //const pdfTable = this.pdfTable.nativeElement;

    //doc.html(pdfTable, {
    //  callback: function (doc) {
    //    doc.save('Report.pdf');
    //  },
    //  x: margin,
    //  y: margin,
    //  width: pageWidth,
    //  windowWidth: pdfTable.scrollWidth,
    //});
  }

  DownloadFile(FileName: string, DownloadfileName: string): void {
    const fileUrl = `${this.appsettingConfig.StaticFileRootPathURL}/${GlobalConstants.ReportsFolder}/${FileName}`;
    
    this.http.get(fileUrl, { responseType: 'blob' }).subscribe((blob: any) => {
      const downloadLink = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.download = this.generateFileName(DownloadfileName); // Use DownloadfileName
      downloadLink.click();
      window.URL.revokeObjectURL(url);
    });
  }

  generateFileName(extension: string): string {
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_');
    return `file_${timestamp}.pdf`;
  }

  CloseOTPModal() {
    this.modalService.dismissAll();
  }

  //checked all (replace org. list here)
  selectInTableAllCheckbox() {
    this.filterData.forEach(x => {
      if (x.Status == EnumDeploymentStatus.ForwardToVerify) {
        x.Selected = this.AllInTableSelect;
      }

    });
  }
  selectInTableAllCheckbox1() {
    this.filterData.forEach(x => {
      if (x.Status == EnumDeploymentStatus.Verified) {
        x.Selected = this.AllInTableSelect;
      }

    });
  }
  //checked single (replace org. list here)
  selectInTableSingleCheckbox(isSelected: boolean, item: any) {
    const data = this.filterData.filter(x => x.ID == item.ID);
    data.forEach((x: any) => {
      x.Selected = isSelected;
    });
    //select all(toggle)
    this.AllInTableSelect = this.filterData.every(r => r.Selected);
  }
  // end table feature

}
