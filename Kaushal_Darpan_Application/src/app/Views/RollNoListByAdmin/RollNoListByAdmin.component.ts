import { Component } from '@angular/core';
import { GenerateRollData, GenerateRollSearchModel } from '../../Models/GenerateRollDataModels';
import { EnumRollNoStatus, EnumStatus, GlobalConstants,EnumRole } from '../../Common/GlobalConstants';
import { SweetAlert2 } from '../../Common/SweetAlert2';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { GetEnrollService } from '../../Services/GenerateEnroll/generateEnroll.service';
import { GetRollService } from '../../Services/GenerateRoll/generate-roll.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../Services/Loader/loader.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';
import { SMSMailService } from '../../Services/SMSMail/smsmail.service';
import { GenerateEnrollData } from '../../Models/GenerateEnrollDataModel';
import { DropdownValidators } from '../../Services/CustomValidators/custom-validators.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-RollNoListByAdmin',
  templateUrl: './RollNoListByAdmin.component.html',
  styleUrls: ['./RollNoListByAdmin.component.css'],
  standalone: false
})
export class RollNoListByAdminComponent {
  public SearchForm!: FormGroup
  public SemesterMasterDDLList: any[] = [];
  public StreamMasterDDLList: any[] = [];
  public SubjectMasterDDLList: any[] = [];
  public ExaminersList: any[] = [];
  public ExamList: any[] = [];
  public GroupMasterDDLList: any[] = [];
  public StudentTypeList: any[] = [];
  public Table_SearchText: any = '';
  public StudentList: GenerateRollData[] = []
  public InstituteMasterList: any = []
  public isSubmitted: boolean = false;
  public sSOLoginDataModel = new SSOLoginDataModel();
  public searchRequest = new GenerateRollSearchModel()
  public InitialValue: number = 0
  public Requestmob = new GenerateRollData()
  public UserID: number = 0
  public AllSelect: boolean = false
  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];
  public filteredSemesterList: any = []
  public isGenerateDisabled: boolean = false;
  public isReGenerateVisible: boolean = false;
  public SemesterMasterList: any = [];
  public ShowGenrateRollNo: boolean = true;
  public ShowPublishButton: boolean = false;
  public ShowForwardedButton: boolean = false;

  public RollStatusList: GenerateRollData[] = []

  public PublishVisible: boolean = false
  public OTP: string = '';
  public GeneratedOTP: string = '';
  public MobileNo: number = 0;
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  timeLeft: number = GlobalConstants.DefaultTimerOTP; // Total countdown time in seconds (2 minutes)
  showResendButton: boolean = false; // Whether to show the "Resend OTP" button
  private interval: any; // Holds the interval reference
  //table feature default
  public paginatedInTableData: any[] = [];//copy of main data
  public currentInTablePage: number = 1;
  public pageInTableSize: string = "50";
  public totalInTablePage: number = 0;
  public sortInTableColumn: string = '';
  public sortInTableDirection: string = 'asc';
  public startInTableIndex: number = 0;
  public endInTableIndex: number = 0;
  public AllInTableSelect: boolean = false;
  public totalInTableRecord: number = 0;
  //end table feature default
  public rollnostatus: number = 0;

  public _EnumRollStatus = EnumRollNoStatus;
  public VerifierStatusDDL: any = [];
  public _EnumRole = EnumRole
  constructor(
    private commonMasterService: CommonFunctionService,
    private GetRollService: GetRollService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    private Swal2: SweetAlert2,
    private modalService: NgbModal,
    private sMSMailService: SMSMailService, private cookieService: CookieService
  ) { }

  async ngOnInit() {

    this.SearchForm = this.formBuilder.group(
      {
        ddlInstitute: [''],
        ddlSemester: [''],
        ddlStream: [''],
        ddlStudentTypeID: [''],
        VerifierStatusID: [''],
        IsYearly:['']
      })

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.UserID = this.sSOLoginDataModel.UserID;
    this.MobileNo = Number(this.sSOLoginDataModel.Mobileno ?? 0)

    await this.getSemesterMasterList();
    await this.getStreamMasterList();
    await this.ddlStream_Change();
     
    await this.getExamMasterList();
    await this.getInstituteMasterList();
    await this.GetVerifierStatusDDL();
    await this.ExaminationSchemeChange()
    await this.commonMasterService.SemesterMaster(1)
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.SemesterMasterList = data['Data'];
      }, (error: any) => console.error(error));

  }

  async getSemesterMasterList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.SemesterMaster().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.SemesterMasterDDLList = data.Data;
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  ExaminationSchemeChange() {
    this.searchRequest.SemesterID = 0
    if (this.searchRequest.IsYearly == 0) {
      this.filteredSemesterList = this.SemesterMasterDDLList.filter((item: any) => item.SemesterID <= 6);
    } else if (this.searchRequest.IsYearly == 1) {
      this.filteredSemesterList = this.SemesterMasterDDLList.filter((item: any) => item.SemesterID >= 7);
    } else {
      this.filteredSemesterList = this.SemesterMasterDDLList
    }
  }


  async getExamMasterList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetExamName().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.ExamList = data.Data;
      });

      await this.commonMasterService.StudentType()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.StudentTypeList = data['Data'];
        }, (error: any) => console.error(error));

    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  async getStreamMasterList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.StreamMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.StreamMasterDDLList = data.Data;
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async GetAllData() {
    try {
      this.isSubmitted = true;
      if (this.SearchForm.invalid) {
        return
      }
      this.StudentList = []
      //session
      this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID;
      this.loaderService.requestStarted();
      //call
      await this.GetRollService.ViewGenerateRollData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          if (data.State == EnumStatus.Success) {
            this.StudentList = data['Data'];

            //this.updateButtonStates();
            //this.GetVerifyRollData();
            this.loadInTable()

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

  async getInstituteMasterList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.InstituteMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.InstituteMasterList = data.Data;
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  checkboxthView_checkboxchange(isChecked: boolean) {
    this.AllSelect = isChecked;
    for (let item of this.StudentList) {
      item.Selected = this.AllSelect;
    }
  }



  //async SaveAllData() {
  //  try {

  //    const isAnySelected = this.StudentList.some(x => x.Selected)
  //    if (!isAnySelected) {
  //      this.toastr.error('Please select at least one student!');
  //      return;
  //    }

  //    this.isSubmitted = true;
  //    this.loaderService.requestStarted();

  //    //if (this.InitialValue <= 0) {

  //    //  this.toastr.error('Please Select Valid Initial value')
  //    //  return
  //    //}

  //    const selectedStudents = this.StudentList.filter(student => student.Selected)
  //    this.StudentList.forEach((item) => {
  //      item.ModifyBy = this.sSOLoginDataModel.UserID
  //    })

  //    await this.GetRollService.SaveRolledData(selectedStudents)
  //      .then(async (data: any) => {
  //        this.State = data['State'];
  //        this.Message = data['Message'];
  //        this.ErrorMessage = data['ErrorMessage'];
  //        if (this.State == EnumStatus.Success) {

  //          this.toastr.success(this.Message)

  //          
  //          await this.ResetControl()
  //          await this.GetAllData();


  //        }
  //        else {

  //          this.toastr.error(this.ErrorMessage)

  //        }
  //      })
  //      .catch((error: any) => {
  //        console.error(error);
  //        this.toastr.error('Failed to Action Short List!');
  //      });
  //  }
  //  catch (ex) {
  //    console.log(ex);
  //  }
  //  finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}


  async SaveAllData() {
    try {


      //if any pending to publish
      if (this.isAnyForwarded() || this.isAnyVerified()) {
        this.toastr.warning("Please clear the pending process of verifier then generate!");
        return;
      }
      //
      this.Swal2.Confirmation("Are you sure you want to Generate Roll No?", async (result: any) => {
        if (result.isConfirmed) {
          this.isSubmitted = true;
          this.loaderService.requestStarted();

          // Optional: If you're using InitialValue later, uncomment this
          // if (this.InitialValue <= 0) {
          //   this.toastr.error('Please Select Valid Initial value');
          //   return;
          // }
          if (this._EnumRole.ACP == this.sSOLoginDataModel.RoleID || this._EnumRole.ACP_NonEng == this.sSOLoginDataModel.RoleID) {
            const selectedStudents = this.StudentList.filter(student => student.Selected);
            this.StudentList.forEach((item) => {
              item.ModifyBy = this.sSOLoginDataModel.UserID;
              item.DepartmentID = this.sSOLoginDataModel.DepartmentID;
              item.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
              item.EndTermID = this.sSOLoginDataModel.EndTermID;
              item.RoleID = this.sSOLoginDataModel.RoleID;
            });

            await this.GetRollService.SaveRolledData(selectedStudents)
              .then(async (data: any) => {
                this.State = data['State'];
                this.Message = data['Message'];
                this.ErrorMessage = data['ErrorMessage'];

                if (this.State == EnumStatus.Success) {
                  this.toastr.success(this.Message);
                  await this.ResetControl();
                  await this.GetAllData();
                } else {
                  this.toastr.error(this.ErrorMessage);
                }
              })
              .catch((error: any) => {
                console.error(error);
              })
              .finally(() => {
                setTimeout(() => {
                  this.loaderService.requestEnded();
                }, 200);
              });
          }

        
        }
      });
    } catch (ex) {
      console.log(ex);
    }
  }


  updateButtonStates() {

    const hasEnrollmentNumbers = this.StudentList.some((student) => student.RollNumber)
    if (hasEnrollmentNumbers) {

      this.isGenerateDisabled = true;
      this.isReGenerateVisible = true
    } else {
      this.isGenerateDisabled = false;

    }

    const allEnroll = this.StudentList.every((student) => student.RollNumber)
    if (allEnroll == true) {
      this.PublishVisible = true
    }
    // Disable "Generate Enroll" button



  }

  async ddlStream_Change() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.SubjectMaster_StreamIDWise(this.searchRequest.StreamID, this.sSOLoginDataModel.DepartmentID, this.searchRequest.SemesterID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.SubjectMasterDDLList = data.Data;
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




  async ResetControl() {
    this.isSubmitted = false;
    this.searchRequest = new GenerateRollSearchModel()

    this.SubjectMasterDDLList = [];
    this.StudentList = [];
    this.AllInTableSelect = false


  }

  async OnPublish() {

    this.isSubmitted = true;
    //
    /*    this.refreshBranchRefValidation(true);*/
    //
    //if (this.PlacementShortListStudentForm.invalid) {CloseViewStudentDetailsEditStudentData
    //  return console.log("error")
    //}



    try {
      this.loaderService.requestStarted();

      this.StudentList.forEach((item) => {
        item.ModifyBy = this.sSOLoginDataModel.UserID;
        item.RoleID = this.sSOLoginDataModel.RoleID;
      });

      const selectedStudents = this.StudentList.filter(student => student.VerifyerStatus == EnumRollNoStatus.Verified)
      console.log(' student Subjects:', selectedStudents);

      await this.GetRollService.OnPublish(selectedStudents)
        .then(async (data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == EnumStatus.Success) {

            this.toastr.success(this.Message)


            this.CloseModal()
            await this.ResetControl()
            await this.GetAllData();


          }
          else {
            this.CloseModal()
            await this.ResetControl()
            await this.GetAllData();
            this.toastr.error(this.ErrorMessage)

          }
        })
        .catch((error: any) => {
          console.error(error);
        });
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





  async VerifyOTP() {
    if (this.OTP.length > 0) {
      if ((this.OTP == GlobalConstants.DefaultOTP) || (this.OTP == this.GeneratedOTP)) {
        try {
          await this.OnPublish()
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
      else {
        this.toastr.warning('Invalid OTP Please Try Again');
      }
    }
    else {
      this.toastr.warning('Please Enter OTP');
    }
  }

  async SendOTP(isResend?: boolean) {
    try {
      this.GeneratedOTP = "";
      this.loaderService.requestStarted();
      //this.sSOLoginDataModel.Mobileno = "8905268611";
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
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }



  //Start Section Model
  async openModalGenerateOTP(content: any) {

    const isAnySelected = this.StudentList.some(x => x.Selected)
    if (!isAnySelected) {
      this.toastr.error('Please select at least one students(s)!');
      return;
    }
    const studentsWithoutRollNumber = this.StudentList.filter(x => x.Selected && !x.RollNumber);

    if (studentsWithoutRollNumber.length > 0) {
      // Collect names of students without a roll number
      const names = studentsWithoutRollNumber.map(student => student.StudentName).join(', ');
      this.toastr.error(`The Selected students do not have roll number: ${names}`);
      return;
    }

    this.Swal2.Confirmation("Are you sure you want to publish?", async (result: any) => {
      // Check if the user confirmed the action
      if (result.isConfirmed) {
        this.isSubmitted = true;
        // Any additional logic or actions can be placed here if needed
        this.OTP = '';



        this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
          this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
        await this.SendOTP();
      }
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
  CloseModal() {

    this.modalService.dismissAll();
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
  //Modal Section END

  //For Revel
  //async GetRevelData() {
  //  try {
  //    this.isSubmitted = true;
  //    if (this.SearchForm.invalid) {
  //      return
  //    }
  //    this.StudentList = []
  //    //session
  //    this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
  //    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
  //    this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
  //    this.loaderService.requestStarted();
  //    //call
  //    await this.GetRollService.GetGenerateRevelData(this.searchRequest)
  //      .then((data: any) => {
  //        data = JSON.parse(JSON.stringify(data));

  //        if (data.State == EnumStatus.Success) {
  //          this.StudentList = data['Data'];
  //          this.updateButtonStates()
  //        }
  //      }, (error: any) => console.error(error)
  //      );
  //  }
  //  catch (ex) {
  //    console.log(ex);
  //  }
  //  finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}
  //Generate Revel
  //async SaveAllRevelData() {
  //  try {
  //    //
  //    /*    this.refreshBranchRefValidation(true);*/
  //    //
  //    //if (this.PlacementShortListStudentForm.invalid) {CloseViewStudentDetailsEditStudentData
  //    //  return console.log("error")
  //    //} 

  //    const isAnySelected = this.StudentList.some(x => x.Marked)
  //    if (!isAnySelected) {
  //      this.toastr.error('Please select at least one student!');
  //      return;
  //    }

  //    this.isSubmitted = true;
  //    this.loaderService.requestStarted();

  //    //if (this.InitialValue <= 0) {

  //    //  this.toastr.error('Please Select Valid Initial value')
  //    //  return
  //    //}

  //    const selectedStudents = this.StudentList.filter(student => student.Marked)
  //    this.StudentList.forEach((item) => {
  //      item.ModifyBy = this.sSOLoginDataModel.UserID
  //    })

  //    await this.GetRollService.SaveAllRevelData(selectedStudents)
  //      .then(async (data: any) => {
  //        this.State = data['State'];
  //        this.Message = data['Message'];
  //        this.ErrorMessage = data['ErrorMessage'];
  //        if (this.State == EnumStatus.Success) {
  //          this.toastr.success(this.Message)
  //          await this.ResetControl();
  //          await this.GetRevelData();
  //          //await this.GetAllData();
  //        }
  //        else {
  //          this.toastr.error(this.ErrorMessage)
  //        }
  //      })
  //      .catch((error: any) => {
  //        console.error(error);
  //        this.toastr.error('Failed to Action Short List!');
  //      });
  //  }
  //  catch (ex) {
  //    console.log(ex);
  //  }
  //  finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}

  async OnPublishRevelData() {

    this.isSubmitted = true;
    //
    /*    this.refreshBranchRefValidation(true);*/
    //
    //if (this.PlacementShortListStudentForm.invalid) {CloseViewStudentDetailsEditStudentData
    //  return console.log("error")
    //}
    try {
      this.loaderService.requestStarted();
      const selectedStudents = this.StudentList.filter(student => student.Selected)
      console.log(' student Subjects:', selectedStudents);

      this.StudentList.forEach((item) => {
        item.ModifyBy = this.sSOLoginDataModel.UserID
      })
      await this.GetRollService.OnPublishRevelData(selectedStudents)
        .then(async (data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == EnumStatus.Success) {
            this.toastr.success(this.Message)
            this.CloseModal()
            await this.ResetControl()
            /*await this.GetRevelData();*/
          }
          else {
            this.CloseModal()
            await this.ResetControl()
            /*await this.GetRevelData();*/
            this.toastr.error(this.ErrorMessage)

          }
        })
        .catch((error: any) => {
          console.error(error);
        });
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

  //table feature 
  calculateInTableTotalPage() {
    this.totalInTablePage = Math.ceil(this.totalInTableRecord / parseInt(this.pageInTableSize));
  }
  // (replace org. list here)
  updateInTablePaginatedData() {
    this.loaderService.requestStarted();
    this.startInTableIndex = (this.currentInTablePage - 1) * parseInt(this.pageInTableSize);
    this.endInTableIndex = this.startInTableIndex + parseInt(this.pageInTableSize);
    this.endInTableIndex = this.endInTableIndex > this.totalInTableRecord ? this.totalInTableRecord : this.endInTableIndex;
    this.paginatedInTableData = [...this.StudentList].slice(this.startInTableIndex, this.endInTableIndex);
    this.loaderService.requestEnded();
  }
  previousInTablePage() {
    if (this.currentInTablePage > 1) {
      this.currentInTablePage--;
      this.updateInTablePaginatedData();
    }
  }
  nextInTablePage() {
    if (this.currentInTablePage < this.totalInTablePage && this.totalInTablePage > 0) {
      this.currentInTablePage++;
      this.updateInTablePaginatedData();
    }
  }
  firstInTablePage() {
    if (this.currentInTablePage > 1) {
      this.currentInTablePage = 1;
      this.updateInTablePaginatedData();
    }
  }
  lastInTablePage() {
    if (this.currentInTablePage < this.totalInTablePage && this.totalInTablePage > 0) {
      this.currentInTablePage = this.totalInTablePage;
      this.updateInTablePaginatedData();
    }
  }
  randamInTablePage() {
    if (this.currentInTablePage <= 0 || this.currentInTablePage > this.totalInTablePage) {
      this.currentInTablePage = 1;
    }
    if (this.currentInTablePage > 0 && this.currentInTablePage < this.totalInTablePage && this.totalInTablePage > 0) {
      this.updateInTablePaginatedData();
    }
  }

  resetInTableValiable() {
    this.paginatedInTableData = [];//copy of main data
    this.currentInTablePage = 1;
    this.totalInTablePage = 0;
    this.sortInTableColumn = '';
    this.sortInTableDirection = 'asc';
    this.startInTableIndex = 0;
    this.endInTableIndex = 0;
    this.totalInTableRecord = this.StudentList.length;
  }

  loadInTable() {
    this.resetInTableValiable();
    this.calculateInTableTotalPage();
    this.updateInTablePaginatedData();
  }

  exportToExcel(): void {
    // Define the columns in the exact order you want for the export
    const columnOrder = [
      'SrNo', 'StudentName', 'FatherName', 'DOB', 'InstituteName',
      'StreamName', 'SemesterName', 'EnrollmentNo', 'RollNumber'
    ];

    // Define the list of columns to exclude from the export
    const unwantedColumns = ['StudentID', 'dob_org', 'StreamID', 'SemesterID', 'InstituteID', 'InstituteCode', 'streamCode', 'MobileNo', 'EndTermID'];

    // Filter the data based on unwanted columns and map it to the correct order
    const filteredData = this.StudentList.map((item: any, index: number) => {
      const filteredItem: any = {};

      // Manually order the columns based on the columnOrder array
      columnOrder.forEach((column, idx) => {
        // Add 'SrNo' as the first column (index + 1 for numbering)
        if (column === 'SrNo') {
          filteredItem[column] = index + 1;
        } else if (item[column] && !unwantedColumns.includes(column)) {
          filteredItem[column] = item[column];
        }
      });

      return filteredItem;
    });

    // Create worksheet from filtered data
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);

    // Calculate column widths based on max length of content in each column
    const columnWidths = columnOrder.map(column => ({
      wch: Math.max(
        column.length, // Header length
        ...filteredData.map((item: any) => (item[column] ? item[column].toString().length : 0)) // Max content length
      ) + 2 // Add extra padding
    }));

    // Apply column widths
    ws['!cols'] = columnWidths;

    // Apply header styling (bold + background color)
    const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
    if (range.s && range.e) {
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellAddress = XLSX.utils.encode_col(col) + '1'; // First row (headers)
        if (!ws[cellAddress]) continue;

        // Bold the header text and apply a background color
        ws[cellAddress].s = {
          font: { bold: true, color: { rgb: "FFFFFF" } }, // Bold text, white color
          fill: { fgColor: { rgb: "#f3f3f3" } }, // Light background color
          alignment: { horizontal: "center", vertical: "center" } // Center-align text
        };
      }
    }

    // Create a new workbook and append the sheet
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Export the file as "GeneratedRollNumber.xlsx"
    XLSX.writeFile(wb, 'GeneratedRollNumber.xlsx');
  }



  get totalInTableSelected(): number {
    return this.StudentList.filter(x => x.Selected)?.length;
  }

  get sortInTableDirectionAero(): string {
    return this.sortInTableDirection == 'asc' ? '&uarr;' : '&darr;';
  }
  //checked all (replace org. list here)
  selectInTableAllCheckbox() {
    this.StudentList.forEach(x => {
      x.Selected = this.AllInTableSelect;
    });
  }
  //checked single (replace org. list here)
  selectInTableSingleCheckbox(isSelected: boolean, item: any) {
    const data = this.StudentList.filter(x => x.StudentID == item.StudentID && x.SemesterID == item.SemesterID);
    data.forEach(x => {
      x.Selected = isSelected;
    });
    //select all(toggle)
    this.AllInTableSelect = this.StudentList.every(r => r.Selected);
  }
  // end table feature


  async GetVerifyRollData() {
    try {
      this.RollStatusList = [];
      //session
      this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.searchRequest.action = "_GenerateRollNumbers"
      this.searchRequest.Status = EnumRollNoStatus.Forwarded;
      this.searchRequest.StatusID = EnumRollNoStatus.Generated;
      this.searchRequest.UserID = this.sSOLoginDataModel.UserID;
      this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID;
      this.loaderService.requestStarted();
      //call
      await this.GetRollService.GetVerifyRollData(this.searchRequest).then(
        (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.RollStatusList = data['Data'];
            if (this.RollStatusList?.length > 0) {
              this.ShowHideButtons(this.RollStatusList[0].Status);
            }
          }
        },
        (error: any) => console.error(error)
      );
    } catch (ex) {
      console.log(ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  ShowHideButtons(status: number) {

    this.rollnostatus = status;
    if (status == EnumRollNoStatus.Generated) {
      this.ShowForwardedButton = true;
    }
    else if (status == EnumRollNoStatus.Forwarded) {
      this.ShowGenrateRollNo = false;
      this.ShowForwardedButton = false;
    }
    else if (status == EnumRollNoStatus.Verified) {
      this.ShowPublishButton = true;
      this.ShowGenrateRollNo = false;
    }
    else if (status == EnumRollNoStatus.Reverted) {
      this.ShowGenrateRollNo = true;
    }
    else if (status == EnumRollNoStatus.Published) {
      this.ShowPublishButton = false;
      this.ShowGenrateRollNo = true;
    }
  }

  async ForwardRollNo() {
    
    //if any pending to publish
    if (this.isAnyForwarded() || this.isAnyVerified()) {
      this.toastr.warning("Please clear the pending process of verifier then forward!");
      return;
    }

    //all temp roll no. generated
    let isAllRollNoNotGenerated = this.StudentList.some(x => x.RollNumber == '' || x.RollNumber == '0');
    let ZeroRollNo = this.StudentList.filter((x: any) => x.RollNumber == '0');
    let ZeroRollNoMsg = ''  
    if(ZeroRollNo?.length > 0){
      ZeroRollNoMsg = `<br><br>Students do not have roll number: ${ZeroRollNo.map((x: any) => x.EnrollmentNo).join(', ')}`
    }
    if (isAllRollNoNotGenerated) {
      this.toastr.warning("Please generate all student(s) roll number then forward!"+ ZeroRollNoMsg);
      return;
    }

    this.Swal2.Confirmation("Are you sure you want to forward the roll Number for verification? Once forwarded, you will not be able to generate it again.<br> Forwarding to Examiner In-charge and Registrar", async (result: any) => {
      // Check if the user confirmed the action
      if (result.isConfirmed) {
        await this.ChangeRollNoStatus("_UpdateStatusForward");
      }
    });
  }


  async ChangeRollNoStatus(action: string) {
    try {

      this.RollStatusList = [];
      //session
      this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID;
      this.searchRequest.UserID = this.sSOLoginDataModel.UserID;
      this.searchRequest.ModuleID = 1
      this.searchRequest.action = action;

      this.loaderService.requestStarted();
      //call
      await this.GetRollService.ChangeRollNoStatus(this.searchRequest).then(
        async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.toastr.success('Status Changed Successfully');
            //await this.GetVerifyRollData();
            await this.GetAllData();
          }
          else {
            this.toastr.error(data.Message);
          }
        },
        (error: any) => console.error(error)
      );
    } catch (ex) {
      console.log(ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  // forward
  isAnyForwarded(): boolean {
    return this.StudentList?.some(student => student.VerifyerStatus === EnumRollNoStatus.Forwarded) ?? false;
  }
  // verified
  isAnyVerified(): boolean {
    return this.StudentList?.some(student => student.VerifyerStatus === EnumRollNoStatus.Verified) ?? false;
  }
  // verified
  isAllVerified(): boolean {
    return (this.StudentList?.length ?? 0) > 0 &&
      this.StudentList.every(student => student.VerifyerStatus === EnumRollNoStatus.Verified);
  }
  //have students
  get hasStudentList(): boolean {
    return (this.StudentList?.length ?? 0) > 0;
  }

  async GetVerifierStatusDDL() {
    try {
      //await this.commonMasterService.GetCommonMasterDDLByType('RollNoStatus')
      await this.commonMasterService.GetCommonMasterDDLStatusByType('RollNoStatus')
        .then((data: any) => {
          this.VerifierStatusDDL = data['Data'];

          /*this.VerifierStatusDDL = this.VerifierStatusDDL.filter((f: any) => f.ID != EnumRollNoStatus.Published);*/
        }, (error: any) => console.error(error)
        );
    }
    catch (ex) {
      console.log(ex);
    }
  }
}
