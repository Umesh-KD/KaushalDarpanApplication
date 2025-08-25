import { Component } from '@angular/core';
import { StudentRequestDataModal } from '../../../Models/Hostel-Management/StudentRequestDataModal';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { StudentRequestService } from '../../../Services/StudentRequest/student-request.service';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { EnumStatus } from '../../../Common/GlobalConstants';
import { RoomAllotmentDataModel } from '../../../Models/Hostel-Management/RoomAllotmentDataModel';
import { HostelManagmentService } from '../../../Services/HostelManagment/HostelManagment.service';
import * as XLSX from 'xlsx';
import * as CryptoJS from 'crypto-js';
import { AppsettingService } from '../../../Common/appsetting.service';
const secretKey = 'your-secret-key';

@Component({
  selector: 'app-Hostel-Warden-Student-Merit-list',
  standalone: false,
  
  templateUrl: './Hostel-Warden-Student-Merit-list.component.html',
  styleUrl: './Hostel-Warden-Student-Merit-list.component.css'
})
export class HostelWardenStudentMeritlistComponent {
  public Searchrequest = new StudentRequestDataModal()
  public ViewRequest: any = {};
  public Request: any;
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public showColumn: boolean = false;
  public UserID: number = 0;
  public ReqId: number = 0;
  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public SearchRequestFormGroup!: FormGroup;
  public RequestFormGroup!: FormGroup;
  public CancelRequestFormGroup!: FormGroup;
  public sSOLoginDataModel = new SSOLoginDataModel();
  modalReference: NgbModalRef | undefined;
  public Table_SearchText: string = "";
  public StudentReqListList: any = [];
  public SemesterDDLList: any = [];
  public BrachDDLList: any = [];
  public MarksDetailsList: any = [];
  public Allotmentrequest = new RoomAllotmentDataModel();
  public titleDDLBranchTrade: string = ''
  meritMultiSelected: boolean = false;
  decryptedIdsArray: any[] = [];




  constructor(
    private toastr: ToastrService,
    private studentRequestService: StudentRequestService,
    private commonFunctionService: CommonFunctionService,
    private _HostelManagmentService: HostelManagmentService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    private Swal2: SweetAlert2,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private appsettingConfig: AppsettingService) { }


  async ngOnInit() {

    this.route.queryParams.subscribe(params => {
      const encrypted = params['ids'];
      if (encrypted) {
        try {
          const bytes = CryptoJS.AES.decrypt(decodeURIComponent(encrypted), secretKey);
          const decryptedIds = bytes.toString(CryptoJS.enc.Utf8); // e.g., "1,2"

          // ✅ Convert "1,2" → [1, 2] and store in array
          this.decryptedIdsArray = decryptedIds.split(',').map(id => Number(id));
          console.log('Decrypted IDs ===>', this.decryptedIdsArray);
        } catch (err) {
          console.error("Decryption failed:", err);
        }
      }
    });

    this.ReqId = Number(this.activatedRoute.snapshot.queryParamMap.get('id')?.toString());
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.UserID = this.sSOLoginDataModel.UserID;

    if (this.sSOLoginDataModel.DepartmentID == 1) {
      this.titleDDLBranchTrade='Branch'
    }
    else if (this.sSOLoginDataModel.DepartmentID == 2) {
      this.titleDDLBranchTrade = 'Trade'
    }




    this.RequestFormGroup = this.formBuilder.group({
      StudentName: [''], 
      ClassPercentage: [''], 
      StreamName: [''] 
    });

    this.CancelRequestFormGroup = this.formBuilder.group({
      remark: ['', Validators.required],
    });

    await this.GetAllGenerateHostelWardenStudentMeritlist();
    await this.GetBranchMaster();
    await this.GetSemesterMaster();
    //await this.GetMarksDetails();
    
  }
  get _RequestFormGroup() { return this.RequestFormGroup.controls; }
  get _CancelRequestFormGroup() { return this.CancelRequestFormGroup.controls; }

  
  async GetAllGenerateHostelWardenStudentMeritlist1() {
    debugger
    try {
      this.Searchrequest.InstituteID = this.sSOLoginDataModel.InstituteID;
      this.Searchrequest.RoleID = this.sSOLoginDataModel.RoleID;
      this.Searchrequest.HostelID = this.sSOLoginDataModel.HostelID;
      this.Searchrequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.Searchrequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.Searchrequest.ReqId = this.Searchrequest.ReqId;
/*      this.Searchrequest.ReqId = this.decryptedIdsArray;*/

      this.loaderService.requestStarted();
      //await this.studentRequestService.GetAllData(this.Searchrequest)
      await this.studentRequestService.GetAllGenerateHostelWardenStudentMeritlist(this.Searchrequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.StudentReqListList = data['Data'];

          
          this.StudentReqListList.forEach((item: any) => {
            item.selected = false;
          });

          console.log('Student List ==>',this.StudentReqListList)
        }, error => console.error(error));
    } catch (Ex) {
      console.log(Ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }



  async GetAllGenerateHostelWardenStudentMeritlist() {
    debugger
    try {
      this.Searchrequest.InstituteID = this.sSOLoginDataModel.InstituteID;
      this.Searchrequest.HostelID = this.sSOLoginDataModel.HostelID;
      this.Searchrequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.Searchrequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.Searchrequest.Action = "getall_A_O";

      this.loaderService.requestStarted();
      await this.studentRequestService.GetAllGenerateHostelWardenStudentMeritlist(this.Searchrequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.StudentReqListList = data['Data'];

          this.StudentReqListList.forEach((item: any) => {
            item.selected = false;
          });

          console.log('Student List ==>', this.StudentReqListList)
        }, error => console.error(error));
    } catch (Ex) {
      console.log(Ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }








  exportToExcel(): void {
    const unwantedColumns = ['InstituteId', 'InstituteId', 'ApplicationId', 'StudentId', 'SemesterId', 'AllotmentStatus', 'BrachId', 'AllotmentStatus1', 'EndTermID'];
    const filteredData = this.StudentReqListList.map((item: any) => {
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
    XLSX.writeFile(wb, 'StudentApplyHostelReportData.xlsx');
  }


  async GetBranchMaster() {
    try {
      this.loaderService.requestStarted();
      await this.commonFunctionService.StreamMaster(this.sSOLoginDataModel.DepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.BrachDDLList = data['Data'];
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

  async GetSemesterMaster() {
    try {
      this.loaderService.requestStarted();
      await this.commonFunctionService.SemesterMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.SemesterDDLList = data['Data'];
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
    this.Searchrequest = new StudentRequestDataModal();
    this.RequestFormGroup.reset();
  }
  

  //async GetMarksDetails() {
  //  try {
  //    let obj = {
  //      StudentID: 7,
  //      Action: "_MarksDetails"
  //    }
  //    await this._HostelManagmentService.GetStudentDetailsForApply(obj)
  //      .then((data: any) => {
  //        data = JSON.parse(JSON.stringify(data));
  //        this.State = data['State'];
  //        this.Message = data['Message'];
  //        this.ErrorMessage = data['ErrorMessage'];
  //        this.MarksDetailsList = data['Data'];
  //      }, error => console.error(error));
  //  }
  //  catch (Ex) {
  //    console.log(Ex);
  //  }
  //}


  async onView(model: any, studentData: any) {
    try {
      this.ViewRequest = { ...studentData };
      this.RequestFormGroup.patchValue({
        StudentName: this.ViewRequest.StudentName,
        ClassPercentage: this.ViewRequest.ClassPercentage,
        StreamName: this.ViewRequest.StreamName
      });
      this.modalReference = this.modalService.open(model, { size: 'sm', backdrop: 'static' });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }


  CloseModal() {
    this.modalService.dismissAll();
    this.modalReference?.close();
  }


  async btnUserApprove_OnClick(ReqId: number) {
    
    this.Swal2.Confirmation("Are you sure you want to Approve this  ?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          try {
            //Show Loading
            this.loaderService.requestStarted();

            await this.studentRequestService.ApprovedReq(ReqId, this.UserID)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));

                this.State = data['State'];
                this.Message = data['Message'];
                this.ErrorMessage = data['ErrorMessage'];

                if (this.State = EnumStatus.Success) {
                  this.toastr.success(this.Message)
                  //reload
                  this.GetAllGenerateHostelWardenStudentMeritlist()
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
      });
  }
 

  async onCancelAllotment(model: any, userData: any) {
    
    try {
      this.Request = { ...userData };
      this.modalReference = this.modalService.open(model, { size: 'sm', backdrop: 'static' });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }


  async AllotmentCancelData() {
    
    console.log("remark value is", this.Allotmentrequest.Remark)
    this.Allotmentrequest.ReqId = this.Request.ReqId;
    this.Allotmentrequest.AllotmentStatus = 5;
    this.isSubmitted = true;
    if (this.RequestFormGroup.invalid) {
      return console.log("Form is invalid, cannot submit")
    }
    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;

    try {
      if (this.ReqId) {
        this.Allotmentrequest.ReqId = this.ReqId
        this.Allotmentrequest.ModifyBy = this.sSOLoginDataModel.UserID;
      } else {
        this.Allotmentrequest.CreatedBy = this.sSOLoginDataModel.UserID;
      }
      await this.studentRequestService.AllotmentCancelData(this.Allotmentrequest)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];

          if (this.State == EnumStatus.Success) {
            this.toastr.success(this.Message)
            this.ResetControl();
            this.CloseModal();
            this.GetAllGenerateHostelWardenStudentMeritlist();
          }
          else if (this.State == EnumStatus.Error) {
            this.toastr.error(this.ErrorMessage);
          }
        })
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isLoading = false;

      }, 200);
    }
  }

  getSelectedItems(): any[] {
    return this.StudentReqListList.filter((item: any) => item.selected);
  }

  selectAllItems() {
    for (let item of this.StudentReqListList) {
      item.selected = this.meritMultiSelected;
    }
  }


  onAffidavitApproved() {
    const selected = this.getSelectedItems();

    if (selected.length === 0) {
      this.toastr.warning("Please select at least one student.");
      return;
    }

    const selectedCount = selected.length;

    try {
      this.Swal2.Confirmation(
        `Are you sure you want to approve affidavit for ${selectedCount} selected student(s)?`,
        async (result: any) => {
          if (result.isConfirmed) {
            this.isSubmitted = true;
            this.loaderService.requestStarted();

            // Update only selected items
            selected.forEach((item: any) => {
              item.ModifyBy = this.sSOLoginDataModel.UserID;
            });

            await this.studentRequestService.GetAllAffidavitApproved(selected)
              .then(async (data: any) => {
                this.State = data['State'];
                this.Message = data['Message'];
                this.ErrorMessage = data['ErrorMessage'];

                if (this.State == EnumStatus.Success) {
                  this.toastr.success(this.Message);
                  await this.ResetControl();
                  await this.GetAllGenerateHostelWardenStudentMeritlist();
                } else {
                  this.toastr.error(this.ErrorMessage);
                }
              })
              .catch((error: any) => {
                console.error('Affidavit approval failed:', error);
                this.toastr.error("An error occurred while processing your request.");
              })
              .finally(() => {
                setTimeout(() => {
                  this.loaderService.requestEnded();
                }, 200);
              });
          }
        }
      );
    } catch (ex) {
      console.log("Affidavit Approval Exception:", ex);
      this.toastr.error("Something went wrong.");
    }
  }


  

  //onAffidavitObjection() {
  //  const selected = this.getSelectedItems();

  //  if (selected.length === 0) {
  //    this.toastr.warning("Please select at least one student.");
  //    return;
  //  }

  //  try {
  //    debugger
  //    this.Swal2.Confirmation("Are you sure you want to Affidavit Objection ?", async (result: any) => {
  //      if (result.isConfirmed) {
  //        this.isSubmitted = true;
  //        this.loaderService.requestStarted();
  //        this.StudentReqListList.forEach((item: any) => {
  //          item.ModifyBy = this.sSOLoginDataModel.UserID;
  //        });



  //        await this.studentRequestService.GetAllAffidavitObjection(this.StudentReqListList)
  //          .then(async (data: any) => {
  //            this.State = data['State'];
  //            this.Message = data['Message'];
  //            this.ErrorMessage = data['ErrorMessage'];

  //            if (this.State == EnumStatus.Success) {
  //              this.toastr.success(this.Message);
  //              await this.ResetControl();

  //              await this.GetAllGenerateHostelWardenStudentMeritlist();
  //            }
  //            else if (this.State === -2) {
  //              this.toastr.warning("Some students are already submitted for affidavit objection.");
  //            }

  //            else {
  //              this.toastr.error(this.ErrorMessage);
  //            }
  //          })
  //          .catch((error: any) => {
  //            console.error(error);
  //          })
  //          .finally(() => {
  //            setTimeout(() => {
  //              this.loaderService.requestEnded();
  //            }, 200);
  //          });
  //      }
  //    });
  //  } catch (ex) {
  //    console.log(ex);
  //  }
  //}


  onAffidavitObjection() {
    const selected = this.getSelectedItems();

    if (selected.length === 0) {
      this.toastr.warning("Please select at least one student.");
      return;
    }

    const selectedCount = selected.length;

    try {
      this.Swal2.Confirmation(
        `Are you sure you want to raise affidavit objection for ${selectedCount} selected student(s)?`,
        async (result: any) => {
          if (result.isConfirmed) {
            this.isSubmitted = true;
            this.loaderService.requestStarted();

            // Set ModifyBy only for selected students
            selected.forEach((item: any) => {
              item.ModifyBy = this.sSOLoginDataModel.UserID;
            });

            await this.studentRequestService.GetAllAffidavitObjection(selected)
              .then(async (data: any) => {
                this.State = data['State'];
                this.Message = data['Message'];
                this.ErrorMessage = data['ErrorMessage'];

                if (this.State === EnumStatus.Success) {
                  this.toastr.success(this.Message);
                  await this.ResetControl();
                  await this.GetAllGenerateHostelWardenStudentMeritlist();
                } else if (this.State === -2) {
                  this.toastr.warning("Some students are already submitted for affidavit objection.");
                } else {
                  this.toastr.error(this.ErrorMessage);
                }
              })
              .catch((error: any) => {
                console.error('Affidavit Objection Error:', error);
                this.toastr.error("An error occurred while processing your request.");
              })
              .finally(() => {
                setTimeout(() => {
                  this.loaderService.requestEnded();
                }, 200);
              });
          }
        }
      );
    } catch (ex) {
      console.log("Affidavit Objection Exception:", ex);
      this.toastr.error("Something went wrong.");
    }
  }




}
