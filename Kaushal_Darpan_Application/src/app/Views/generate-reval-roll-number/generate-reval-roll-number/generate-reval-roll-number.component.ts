import { Component } from '@angular/core';
import { EnumRole, EnumRollNoStatus, EnumStatus, GlobalConstants } from '../../../Common/GlobalConstants';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GenerateRevalRollData, GenerateRollData, GenerateRollSearchModel } from '../../../Models/GenerateRollDataModels';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { SMSMailService } from '../../../Services/SMSMail/smsmail.service';
import { GetRollService } from '../../../Services/GenerateRoll/generate-roll.service';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-generate-reval-roll-number',
  templateUrl: './generate-reval-roll-number.component.html',
  styleUrl: './generate-reval-roll-number.component.css',
  standalone: false
})
export class GenerateRevalRollNumberComponent {
  public SearchForm!: FormGroup
  public SemesterMasterDDLList: any[] = [];
  public StreamMasterDDLList: any[] = [];
  public SubjectMasterDDLList: any[] = [];
  public ExaminersList: any[] = [];
  public ExamList: any[] = [];
  public GroupMasterDDLList: any[] = [];
  public Table_SearchText: any = '';
  public StudentList: GenerateRollData[] = []
  public InstituteMasterList: any = []
  public VerifierStatusDDL: any = [];


  public sSOLoginDataModel = new SSOLoginDataModel();
  public searchRequest = new GenerateRollSearchModel()
  public Requestmob = new GenerateRollData()

  _EnumRollNoStatus = EnumRollNoStatus;
  _EnumRole = EnumRole;
  public isSubmitted: boolean = false;
  public UserID: number = 0
  public AllSelect: boolean = false
  public InitialValue: number = 0
  public isGenerateDisabled: boolean = false;
  public isReGenerateVisible: boolean = false;
  public PublishVisible: boolean = false
  public OTP: string = '';
  public GeneratedOTP: string = '';
  public MobileNo: number = 0;
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  timeLeft: number = GlobalConstants.DefaultTimerOTP;
  showResendButton: boolean = false;
  private interval: any;
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
        // ddlInstitute: [''],
        ddlSemester: ['', [DropdownValidators]],
        ddlSchemeID: ['', [DropdownValidators]],
        // ddlStream: [''],
        VerifierStatusID: ['']
      })

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.UserID = this.sSOLoginDataModel.UserID;
    await this.getSemesterMasterList();
    await this.getStreamMasterList();
    await this.ddlStream_Change()
    await this.GetVerifierStatusDDL();
    await this.getExamMasterList()
    await this.getInstituteMasterList()
  }

  async GetVerifierStatusDDL() {
    try {
      //await this.commonMasterService.GetCommonMasterDDLByType('RollNoStatus')
      await this.commonMasterService.GetCommonMasterDDLStatusByType('RollNoStatus')
        .then((data: any) => {
          this.VerifierStatusDDL = data['Data'];

          this.VerifierStatusDDL = this.VerifierStatusDDL.filter((f: any) => f.ID == EnumRollNoStatus.Generated || f.ID == EnumRollNoStatus.Published);
        }, (error: any) => console.error(error)
        );
    }
    catch (ex) {
      console.log(ex);
    }
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

  async getExamMasterList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetExamName().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.ExamList = data.Data;
      })
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
      await this.commonMasterService.StreamMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng).then((data: any) => {
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
      item.Marked = this.AllSelect;
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
    this.AllSelect = false
  }

  async VerifyOTP() {
    if (this.OTP.length > 0) {
      if ((this.OTP == GlobalConstants.DefaultOTP) || (this.OTP == this.GeneratedOTP)) {
        try {
          await this.OnPublishRevelData();
        }
        catch (ex) {
          console.log(ex);
        }
      } else {
        this.toastr.warning('Invalid OTP Please Try Again');
      }
    } else {
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

    // const isAnySelected = this.StudentList.some(x => x.Marked)
    // if (!isAnySelected) {
    //   this.toastr.error('Please select at least one students(s)!');
    //   return;
    // }

    // Collect names of students without a roll number
    const studentsWithoutRollNumber = this.StudentList.filter(x => !x.RollNumber || x.RollNumber == '' || x.RollNumber == '0' || x.RollNumber == null || x.RollNumber == undefined);
    if (studentsWithoutRollNumber.length > 0) {
      const names = studentsWithoutRollNumber.map(student => student.StudentName).join(', ');
      this.toastr.error(`The Selected students do not have a roll number: ${names}`);
      return;
    }

    this.Swal2.Confirmation("Are you sure you want to Publish Reval Roll No?", async (result: any) => {
      // Check if the user confirmed the action
      if (result.isConfirmed) {
        this.isSubmitted = true;
        // Any additional logic or actions can be placed here if needed

        this.OTP = '';
        const studentWithMobile = this.StudentList.find(x => x.MobileNo);

        if (studentWithMobile) {
          this.MobileNo = studentWithMobile.MobileNo;
        } else {
          this.MobileNo = 0; // Default value if no student has a mobile number
        }
        this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
          this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
        this.SendOTP();
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
  async GetRevelData() {
    try {

      this.isSubmitted = true;
      if (this.SearchForm.invalid) {
        return
      }
      this.isSubmitted = false;

      this.StudentList = []
      //session
      this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;

      //call
      await this.GetRollService.GetGenerateRevelData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          //debugger
          if (data.State == EnumStatus.Success) {
            this.StudentList = data['Data'];
            this.updateButtonStates()
          }
        }, (error: any) => console.error(error)
        );
    }
    catch (ex) {
      console.log(ex);
    }
  }
  //Generate Revel
  async SaveAllRevelData() {
    try {

      if (this.StudentList.length == 0) {
        this.toastr.error('There is no data!');
        return;
      }

      //if any pending to publish
      //if (this.isAnyForwarded() || this.isAnyVerified()) {
      //  this.toastr.warning("Please clear the pending process of verifier then generate!");
      //  return;
      //}

      this.Swal2.Confirmation("Are you sure you want to Generate Reval Roll No?", async (result: any) => {
        if (result.isConfirmed) {
          // const isAnySelected = this.StudentList.some(x => x.Marked)
          // if (!isAnySelected) {
          //   this.toastr.error('Please select at least one student!');
          //   return;
          // }

          this.isSubmitted = true;

          // const selectedStudents = this.StudentList.filter(student => student.Marked)

          // set new model
          let generateRevalRollDataModel: GenerateRevalRollData[] =
            this.StudentList.map(item => {
              let model = new GenerateRevalRollData();

              model.StudentID = item.StudentID;
              model.StudentExamID = item.StudentExamID;
              model.EnrollmentNo = item.EnrollmentNo;
              model.InstituteID = item.InstituteID;
              model.StreamID = item.StreamID;
              model.SemesterID = item.SemesterID;
              model.PublishOrder = item.PublishOrder;

              model.SubjectCode = item.SubjectCode;
              model.CCCode = item.CCCode;
              model.GroupCode = item.GroupCode;
              model.StreamCode = item.StreamCode;
              model.StudentExamPaperID = item.StudentExamPaperID;
              model.EndTermID = item.EndTermID;
              model.Eng_NonEng = item.Eng_NonEng;
              model.DepartmentID = item.DepartmentID;
              model.SchemeID = item.SchemeID;

              // session / extra fields
              model.ModifyBy = this.sSOLoginDataModel.UserID;
              model.VerifyerStatus = EnumRollNoStatus.Generated;
              model.RoleID = this.sSOLoginDataModel.RoleID;

              return model;
            });

          // call
          await this.GetRollService.SaveAllRevelData(generateRevalRollDataModel)
            .then(async (data: any) => {

              if (data.State == EnumStatus.Success) {
                this.toastr.success(data.Message)
                await this.ResetControl();
                await this.GetRevelData();
                //await this.GetAllData();
              }
              else {
                this.toastr.error(data.Message);
                console.log(data.ErrorMessage);
              }
            })
            .catch((error: any) => {
              console.error(error);
              this.toastr.error('Error!');
            });
        }
      });
    }
    catch (ex) {
      console.log(ex);
    }
  }

  async OnPublishRevelData() {
    //debugger
    this.isSubmitted = true;
    try {
      //debugger
      // verified
      //let selectedStudents = this.StudentList.filter(student => student.VerifyerStatus == EnumRollNoStatus.Verified)
      let selectedStudents = this.StudentList.filter(student => student.VerifyerStatus == EnumRollNoStatus.Generated)

      // set new model
      let generateRevalRollDataModel: GenerateRevalRollData[] =
        selectedStudents.map(item => {
          let model = new GenerateRevalRollData();

          model.StudentID = item.StudentID;
          model.StudentExamID = item.StudentExamID;
          model.EnrollmentNo = item.EnrollmentNo;
          model.InstituteID = item.InstituteID;
          model.StreamID = item.StreamID;
          model.SemesterID = item.SemesterID;
          model.PublishOrder = item.PublishOrder;

          model.SubjectCode = item.SubjectCode;
          model.CCCode = item.CCCode;
          model.GroupCode = item.GroupCode;
          model.StreamCode = item.StreamCode;
          model.StudentExamPaperID = item.StudentExamPaperID;
          model.EndTermID = item.EndTermID;
          model.Eng_NonEng = item.Eng_NonEng;
          model.DepartmentID = item.DepartmentID;
          model.SchemeID = item.SchemeID;

          // session / extra fields
          model.ModifyBy = this.sSOLoginDataModel.UserID;
          model.VerifyerStatus = EnumRollNoStatus.Published;
          model.RoleID = this.sSOLoginDataModel.RoleID;

          return model;
        });

      // call
      await this.GetRollService.OnPublishRevelData(generateRevalRollDataModel)
        .then(async (data: any) => {

          if (data.State == EnumStatus.Success) {
            this.toastr.success(data.Message)
          }
          else {
            this.toastr.error(data.Message);
            console.log(data.ErrorMessage);

          }
          // reset
          this.CloseModal()
          await this.ResetControl()
          await this.GetRevelData();
        })
        .catch((error: any) => {
          console.error(error);
          this.toastr.error('Error!');
        });
    }
    catch (ex) {
      console.log(ex);
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

  async ForwardRevalRollNo() {

    //if any pending to publish
    if (this.isAnyForwarded() || this.isAnyVerified()) {
      this.toastr.warning("Please clear the pending process of verifier then forward!");
      return;
    }

    //all temp roll no. generated
    let isAllRollNoNotGenerated = this.StudentList.some(x => x.RollNumber == '' || x.RollNumber == '0');
    let ZeroRollNo = this.StudentList.filter((x: any) => x.RollNumber == '0');
    let ZeroRollNoMsg = ''
    if (ZeroRollNo?.length > 0) {
      ZeroRollNoMsg = `<br><br>Students do not have reval roll number: ${ZeroRollNo.map((x: any) => x.EnrollmentNo).join(', ')}`
    }
    if (isAllRollNoNotGenerated) {
      this.toastr.warning("Please generate all student(s) reval roll number then forward!" + ZeroRollNoMsg);
      return;
    }

    this.Swal2.Confirmation("Are you sure you want to forward the reval roll Number for verification? Once forwarded, you will not be able to generate it again.<br> Forwarding to Examiner In-charge and Registrar", async (result: any) => {
      // Check if the user confirmed the action
      if (result.isConfirmed) {
        await this.ChangeRevalRollNoStatus("_UpdateStatusForward");
      }
    });
  }

  async ChangeRevalRollNoStatus(action: string) {
    try {

      // this.RollStatusList = [];
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
      await this.GetRollService.ChangeRevalRollNoStatus(this.searchRequest).then(
        async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.toastr.success('Status Changed Successfully');
            //await this.GetVerifyRollData();
            await this.GetRevelData();
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

  exportToExcel(): void {

    // sort order with original column 
    const columnOrder = [
      'SrNo', 'GroupCode', 'CCCode', 'StreamName', 'Org_Stu_RollNumber',
      'SubjectCode', 'EnrollmentNo', 'StudentName', 'FatherName',
      'InstituteName', 'SemesterName', 'RollNumber', 'ObtainedTheoryOld'
    ];

    // remove unwanted column
    const unwantedColumns = [
      'StudentID', 'dob_org', 'StreamID', 'SemesterID',
      'InstituteID', 'InstituteCode', 'streamCode',
      'MobileNo', 'EndTermID'
    ];

    // Custom Header Mapping with original column name as key and header name as value
    const headerMap: any = {
      SrNo: 'Sr No',
      GroupCode: 'Group Code',
      CCCode: 'CC Code',
      StreamName: 'Stream Name',
      Org_Stu_RollNumber: 'Roll Number',
      SubjectCode: 'Subject Code',
      EnrollmentNo: 'Enrollment No',
      StudentName: 'Student Name',
      FatherName: 'Father Name',
      InstituteName: 'Institute Name',
      SemesterName: 'Semester',
      RollNumber: 'Reval Roll Number',
      ObtainedTheoryOld: 'Old Theory Marks'
    };

    const filteredData = this.StudentList.map((item: any, index: number) => {
      const filteredItem: any = {};

      columnOrder.forEach((column) => {
        if (column === 'SrNo') {
          filteredItem[column] = index + 1;
        } else if (!unwantedColumns.includes(column)) {
          // always include column even if value is empty
          filteredItem[column] = item[column] ?? '';
        }
      });

      return filteredItem;
    });

    // Replace keys with custom headers
    const finalData = filteredData.map((row: any) => {
      const newRow: any = {};
      columnOrder.forEach(col => {
        newRow[headerMap[col] || col] = row[col];
      });
      return newRow;
    });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(finalData);

    // Column width
    const columnWidths = columnOrder.map(col => {
      const header = headerMap[col] || col;
      return {
        wch: Math.max(
          header.length,
          ...finalData.map((row: any) =>
            row[header] ? row[header].toString().length : 0
          )
        ) + 2
      };
    });

    ws['!cols'] = columnWidths;

    // Header Styling
    const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
    if (range.s && range.e) {
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellAddress = XLSX.utils.encode_col(col) + '1';
        if (!ws[cellAddress]) continue;

        ws[cellAddress].s = {
          font: { bold: true, color: { rgb: "FFFFFF" } },
          fill: { fgColor: { rgb: "808080" } },
          alignment: { horizontal: "center", vertical: "center" }
        };
      }
    }

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, 'GeneratedRevalRollNumber.xlsx');
  }
}
