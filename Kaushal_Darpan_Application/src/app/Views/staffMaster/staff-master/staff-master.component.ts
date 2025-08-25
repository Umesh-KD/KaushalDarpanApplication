import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { StaffDetailsDataModel, StaffMasterSearchModel, StaffSubjectList } from '../../../Models/StaffMasterDataModel';
import { StaffMasterService } from '../../../Services/StaffMaster/staff-master.service';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { ToastrService } from 'ngx-toastr';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AssignRoleRightsModel } from '../../../Models/UserMasterDataModel';
import { EnumDepartment, EnumRole, EnumStatus, EnumStatusOfStaff, GlobalConstants } from '../../../Common/GlobalConstants';
import { SMSMailService } from '../../../Services/SMSMail/smsmail.service';
import { AppsettingService } from '../../../Common/appsetting.service';
@Component({
    selector: 'app-staff-master',
    templateUrl: './staff-master.component.html',
    styleUrls: ['./staff-master.component.css'],
    standalone: false
})
export class StaffMasterComponent implements OnInit {
  public searchRequest = new StaffMasterSearchModel();
  public StateMasterList: any = [];
  public RoleMasterList: AssignRoleRightsModel[] = [];
  staffDetailsFormData = new StaffDetailsDataModel();
  public DesignationMasterList: any = [];
  public ExaminerStatusList: any = [];
  public BranchesMasterList: any = [];
  public SubjectMasterDDL: any = [];
  public DistrictMasterList: any = [];
  public sSOLoginDataModel = new SSOLoginDataModel();
  public stateID: number = 0;
  public StaffMasterList: any = [];
  public Table_SearchText: string = "";
  public InstituteList: any = []
  public StaffTypeList: any = []
  public _EnumRole = EnumRole
  _EnumStatusOfStaff = EnumStatusOfStaff;
  allSelected = false;
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  public isModalOpen = false;
  public isFormSubmitted: boolean = false;
  public GeneratedOTP: string = '';
  showResendButton: boolean = false;
  timeLeft: number = GlobalConstants.DefaultTimerOTP;
  private interval: any;
  public OTP: string = '';
  public MobileNo: string = '';
  @ViewChild('modal_GenrateOTP') modal_GenrateOTP: any;
  public isLoading: boolean = false;
  _enumDepartment = EnumDepartment
  public StaffSubjectListModel: StaffSubjectList[] = [];


  constructor(
    private commonMasterService: CommonFunctionService,
    private loaderService: LoaderService,
    private staffMasterService: StaffMasterService,
    private Swal2: SweetAlert2,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private sMSMailService: SMSMailService,
    public appsettingConfig: AppsettingService,
  ) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    this.GetStateMaterData();
    this.GetRoleMasterData();
    this.GetDesignationMasterData();
    this.GetBranchesMasterData();
    this.GetSubjectMasterDDL();
    this.GetInstituteMasterData();
    this.GetexaminerStatusData();
    this.GetStaffTypeData();
    await this.GetAllData();
  }

  async GetStateMaterData() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetStateMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data['Data']);
          this.StateMasterList = data['Data'];
          console.log(this.StateMasterList);
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

  async GetStaffTypeData() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetStaffTypeDDL().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.StaffTypeList = data.Data;
        console.log("StaffTypeList", this.StaffTypeList);
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  async ddlState_Change() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.DistrictMaster_StateIDWise(this.searchRequest.StateID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.DistrictMasterList = data['Data'];
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

  async GetRoleMasterData() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetRoleMasterDDL(this.sSOLoginDataModel.DepartmentID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.RoleMasterList = data.Data;
        console.log("RoleMasterList", this.RoleMasterList);
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async GetInstituteMasterData() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.InstituteMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.InstituteList = data.Data;
        console.log("InstituteList", this.InstituteList);
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  async GetDesignationMasterData() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetDesignationMaster().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.DesignationMasterList = data.Data;
        console.log("DesignationMasterList", this.DesignationMasterList);
      }, error => console.error(error))
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }
  async GetexaminerStatusData() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterDDLByType('StatusOfStaff').then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.ExaminerStatusList = data.Data;
        console.log("ExaminerStatusList", this.ExaminerStatusList);
      }, error => console.error(error))
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async GetBranchesMasterData() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.StreamMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.BranchesMasterList = data.Data;
        console.log("StreamMasterList", this.BranchesMasterList);
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async GetSubjectMasterDDL() {
    var DepartmentID = this.sSOLoginDataModel.DepartmentID
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetSubjectMasterDDL(DepartmentID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.SubjectMasterDDL = data.Data;
        console.log("SubjectMasterList", this.SubjectMasterDDL);
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
    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.searchRequest.CourseTypeId = this.sSOLoginDataModel.Eng_NonEng;
    if (this.sSOLoginDataModel.RoleID == EnumRole.Principal) { this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID }
    
    try {
      this.loaderService.requestStarted();
      await this.staffMasterService.GetAllData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.StaffMasterList = data['Data'];


          console.log(this.StaffMasterList)
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

  async CheckProfileStatus() {
    try {
      this.loaderService.requestStarted();
      this.searchRequest.Action = '_checkProfileStatus'
      this.searchRequest.SSOID = this.sSOLoginDataModel.SSOID;
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;

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

  async ClearSearchData() {
    this.searchRequest = new StaffMasterSearchModel();
    this.searchRequest.StateID = 0;
    this.DistrictMasterList = [];
    await this.GetAllData();
  }

  async DeleteById(PlacementCompanyID: number) {
    this.Swal2.Confirmation("Do you want to delete?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          try {
            //Show Loading
            this.loaderService.requestStarted();

            await this.staffMasterService.DeleteById(PlacementCompanyID, this.sSOLoginDataModel.UserID)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));
                console.log(data);

                if (!data.State) {
                  this.toastr.success(data.Message)
                  //reload
                  await this.GetAllData();
                }
                else {
                  this.toastr.error(data.ErrorMessage)
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
      });
  }
  CloseModalPopup() {
    this.modalService.dismissAll();
  }

  checkMainRoleSelected(): boolean {
    // Check if any radio button with 'IsMainRole' is selected
    return this.RoleMasterList.some(role => role.IsMainRole && role.Marked);
  }

  toggleAllCheckboxes(event: Event) {
    ;
    this.allSelected = (event.target as HTMLInputElement).checked;
    this.RoleMasterList.forEach(role => {
      role.Marked = this.allSelected;
    });
  }

  toggleCheckbox(role: AssignRoleRightsModel) {
    // Toggle the Marked state of the role
    role.Marked = !role.Marked;

    // If unchecked, reset IsMainRole for that row
    if (!role.Marked) {
      role.IsMainRole = 0;
    }

    // Check if all roles are selected
    this.allSelected = this.RoleMasterList.every(r => r.Marked);
  }

  toggleIsMainRole(row: AssignRoleRightsModel): void {
    // Set IsMainRole to false for all rows
    this.RoleMasterList.forEach(r => r.IsMainRole = 0);

    // Set the clicked row's IsMainRole to true
    row.IsMainRole = 1;
  }

  ResetCheck(row: AssignRoleRightsModel) {

    this.RoleMasterList.forEach(r => r.IsMainRole = 0);
    this.RoleMasterList.forEach(r => r.Marked = false);
  }
  @ViewChild('content') content: ElementRef | any;

  open(content: any, BookingId: string) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
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
  async ViewandUpdate(content: any, UserID: number) {

    const initialState = {
      UserID: UserID,
      Type: "Admin",
    };

    try {
      await this.staffMasterService.GetByID(UserID, this.sSOLoginDataModel.DepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
     
          /*this.request.UserID = data['Data']["RoleID"];*/
          //this.request.UserID = data['Data']["UserID"];
          //this.request.SSOID = data['Data']["SSOID"];
        }, error => console.error(error));
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }


    this.modalReference = this.modalService.open(content, { backdrop: 'static', size: 'xl', keyboard: true, centered: true });
    this.modalReference.componentInstance.initialState = initialState;

    //this.modalReference.shown(CampusPostComponent, { initialState });
    //this.modalReference.show(CampusPostComponent, { initialState });
  }


  async OnConfirm(content: any, ID: number) {
    this.modalReference = this.modalService.open(content, { size: 'xl', backdrop: 'static' });
    this.isModalOpen = true;  // Open the modal
    this.GetByID(ID)
  }

  // Method to close the modal when Close button is clicked
  ClosePopup(): void {
    this.modalReference?.close();  // Close the modal
  }

  dateSetter(date: any){
    const Dateformat = new Date(date);
    const year = Dateformat.getFullYear();
    const month = String(Dateformat.getMonth() + 1).padStart(2, '0');
    const day = String(Dateformat.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate
  }

  async GetByID(id: number) {
    
    try {

      this.loaderService.requestStarted();

      await this.staffMasterService.GetByID(id, this.sSOLoginDataModel.DepartmentID)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data, 'FFFFF');
          this.staffDetailsFormData = data['Data']
          this.staffDetailsFormData.StaffID = data['Data']["StaffID"];
          this.staffDetailsFormData.StaffTypeID = data['Data']["StaffTypeID"];
          this.staffDetailsFormData.Name = data['Data']["Name"];
          this.staffDetailsFormData.SSOID = data['Data']["SSOID"];
          this.staffDetailsFormData.AdharCardNumber = data['Data']["AdharCardNumber"];
          this.staffDetailsFormData.RoleID = data['Data']["RoleID"];
          this.staffDetailsFormData.DesignationID = data['Data']["DesignationID"];
          this.staffDetailsFormData.StateID = data['Data']["StateID"];
          /*   await this.ddlState_Change();*/
          this.staffDetailsFormData.DistrictID = data['Data']["DistrictID"];

          this.staffDetailsFormData.Address = data['Data']["Address"];

          this.staffDetailsFormData.CourseID = data['Data']["CourseID"];

          /*  await this.ddlStream_Change();*/
          this.staffDetailsFormData.SubjectID = data['Data']["SubjectID"];
          this.staffDetailsFormData.Email = data['Data']["Email"];
          this.staffDetailsFormData.MobileNumber = data['Data']["MobileNumber"];
          this.staffDetailsFormData.HigherQualificationID = data['Data']["HigherQualificationID"];

          if (data['Data']["AdharCardPhoto"] != null) {
            this.staffDetailsFormData.AdharCardPhoto = data['Data']["AdharCardPhoto"];
          } else {
            this.staffDetailsFormData.AdharCardPhoto = ''
          }
          if (data['Data']["Dis_AdharCardNumber"] != null) {
            this.staffDetailsFormData.Dis_AdharCardNumber = data['Data']["Dis_AdharCardNumber"];
          } else {
            this.staffDetailsFormData.Dis_AdharCardNumber = ''
          }

          if (data['Data']["ProfilePhoto"] != null) {
            this.staffDetailsFormData.ProfilePhoto = data['Data']["ProfilePhoto"];
          } else {
            this.staffDetailsFormData.ProfilePhoto = ''
          }
          if (data['Data']["Dis_ProfileName"] != null) {
            this.staffDetailsFormData.Dis_ProfileName = data['Data']["Dis_ProfileName"];
          } else {
            this.staffDetailsFormData.Dis_ProfileName = ''
          }

          if (data['Data']["PanCardPhoto"] != null) {
            this.staffDetailsFormData.PanCardPhoto = data['Data']["PanCardPhoto"];
          } else {
            this.staffDetailsFormData.PanCardPhoto = ''
          }
          if (data['Data']["Dis_PanCardNumber"] != null) {
            this.staffDetailsFormData.Dis_PanCardNumber = data['Data']["Dis_PanCardNumber"];
          } else {
            this.staffDetailsFormData.Dis_PanCardNumber = ''
          }

          if (data['Data']["Certificate"] != null) {
            this.staffDetailsFormData.Certificate = data['Data']["Certificate"];
          } else {
            this.staffDetailsFormData.Certificate = ''
          }
          if (data['Data']["Dis_Certificate"] != null) {
            this.staffDetailsFormData.Dis_Certificate = data['Data']["Dis_Certificate"];
          } else {
            this.staffDetailsFormData.Dis_Certificate = ''
          }

          this.staffDetailsFormData.PanCardNumber = data['Data']["PanCardNumber"];

          this.staffDetailsFormData.DateOfBirth = this.dateSetter(data['Data']['DateOfBirth'])
          this.staffDetailsFormData.DateOfAppointment = this.dateSetter(data['Data']['DateOfAppointment'])
          this.staffDetailsFormData.DateOfJoining = this.dateSetter(data['Data']['DateOfJoining'])
          this.staffDetailsFormData.Experience = data['Data']["Experience"];

          this.staffDetailsFormData.SpecializationSubjectID = data['Data']["SpecializationSubjectID"];
          this.staffDetailsFormData.AnnualSalary = data['Data']["AnnualSalary"];
          this.staffDetailsFormData.PFDeduction = data['Data']["PFDeduction"];
          this.staffDetailsFormData.ResearchGuide = data['Data']["ResearchGuide"];
          this.staffDetailsFormData.StaffStatus = data['Data']["StaffStatus"];
          this.staffDetailsFormData.EduQualificationDetailsModel = data['Data']["EduQualificationDetailsModel"];
          this.staffDetailsFormData.Pincode = data['Data']['Pincode']

          this.staffDetailsFormData.BankName = data['Data']['BankName']
          this.staffDetailsFormData.BankAccountNo = data['Data']['BankAccountNo']
          this.staffDetailsFormData.BankAccountName = data['Data']['BankAccountName']
          this.staffDetailsFormData.IFSCCode = data['Data']['IFSCCode']


          if (this.staffDetailsFormData.StaffSubjectListModel != null)
            this.staffDetailsFormData.StaffSubjectListModel.forEach(e => {
              e.SubjectType = e.IsOptional ? 'Optional' : 'Teaching'

            })
          console.log(this.staffDetailsFormData.StaffSubjectListModel);

          const btnSave = document.getElementById('btnSave');
          if (btnSave) btnSave.innerHTML = "Update";

          const btnReset = document.getElementById('btnReset');
          if (btnReset) btnReset.innerHTML = "Cancel";
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
  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  async ApproveStaff(StaffID: number) {
    this.Swal2.Confirmation("Are you sure you want to Approve?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          try {
            this.loaderService.requestStarted();
            this.staffDetailsFormData.StaffID = StaffID
            this.staffDetailsFormData.ModifyBy = this.sSOLoginDataModel.UserID
            this.staffDetailsFormData.StatusOfStaff = EnumStatusOfStaff.Approved
            console.log("ApproveStaff", this.staffDetailsFormData)

            this.MobileNo = this.sSOLoginDataModel.Mobileno;

            if (this.sSOLoginDataModel.RoleID == EnumRole.Admin || this.sSOLoginDataModel.RoleID == EnumRole.AdminNon || this.sSOLoginDataModel.RoleID == EnumRole.ITIAdmin_SCVT || this.sSOLoginDataModel.RoleID == EnumRole.ITIAdmin_NCVT) {
              this.openModalGenerateOTP(this.modal_GenrateOTP);
            }
            else {
              await this.staffMasterService.ApproveStaff(this.staffDetailsFormData).then((data: any) => {
                data = JSON.parse(JSON.stringify(data));
                console.log(data);
                if (data.State === EnumStatus.Success) {
                  this.toastr.success(data.Message);
                  this.ClosePopup();
                  window.location.reload();
                } else {
                  this.toastr.error(data.ErrorMessage);
                }
              })
            }

           
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
      });

  }
  numberOnly(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }
  async UnlockStaff(StaffID: number) {

    
    this.Swal2.Confirmation("Are you sure you want to Unlock?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          try {
            this.loaderService.requestStarted();
            this.staffDetailsFormData.StaffID = StaffID
            this.staffDetailsFormData.ModifyBy = this.sSOLoginDataModel.UserID
            this.staffDetailsFormData.StatusOfStaff = EnumStatusOfStaff.Draft
            console.log("Unlock Staff", this.staffDetailsFormData)
           
            await this.staffMasterService.UnlockStaff(this.staffDetailsFormData).then((data: any) => {
              data = JSON.parse(JSON.stringify(data));
              console.log(data);
              if (data.State === EnumStatus.Success){
                this.toastr.success(data.Message);
                this.ClosePopup();
                window.location.reload();
              } else {
                this.toastr.error(data.ErrorMessage);
              }
            })
            
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
      });

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
  CloseModal() {

    this.modalService.dismissAll();
  }
  async openModalGenerateOTP(
    content: any
    //,item: DateConfigurationModel
  ) {
    this.isFormSubmitted = true;
    
    this.OTP = '';
    this.MobileNo = '8905268611';
    this.modalService.open(
      content,
      { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.MobileNo = this.MobileNo;
   /* this.request = item;*/
    this.SendOTP();
  }

  async SendOTP(isResend?: boolean) {
    
    try {
      this.GeneratedOTP = "";
      if (this.sSOLoginDataModel.RoleID == EnumRole.Admin) {
        this.sSOLoginDataModel.Mobileno = "8905268611";

        await this.sMSMailService.SendMessage(this.sSOLoginDataModel.Mobileno, "OTP")
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            if (data.State == EnumStatus.Success) {
              this.startTimer();
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
    }
    catch (Ex) {
      console.log(Ex);
    }
  }


  async VerifyOTP() {
    
    if (this.OTP.length > 0) {
      if ((this.OTP == GlobalConstants.DefaultOTP) || (this.OTP == this.GeneratedOTP)) {
        try {
          this.isLoading = true;

         
          await this.staffMasterService.ApproveStaff(this.staffDetailsFormData).then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            console.log(data);
            if (data.State === EnumStatus.Success){
              this.toastr.success(data.Message);
              this.ClosePopup();
              window.location.reload();
            } else {
              this.toastr.error(data.ErrorMessage);
            }
          })
          this.CloseModal()
        }
        catch (ex) {
          console.log(ex);
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
  
}
