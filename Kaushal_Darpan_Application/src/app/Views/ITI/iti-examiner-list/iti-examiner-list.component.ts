import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ItiExaminerDataModel, ItiExaminerSearchModel, ITITeacherForExaminerSearchModel, ITITeacherForExaminerSearchModels } from '../../../Models/ItiExaminerDataModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { FormBuilder } from '@angular/forms';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';
import { ItiExaminerListService } from '../../../Services/ItiExaminerList/iti-examiner-list.service';
import { EnumStatus, GlobalConstants } from '../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { ITITheorySearchModel } from '../../../Models/ITI/ItiInvigilatorDataModel';
import { TheoryMarksService } from '../../../Services/TheoryMarks/theory-marks.service';
import { ItiTheoryMarksService } from '../../../Services/ITI/ItiTheoryMarks/Iti-theory-marks.service';
import { CommonVerifierApiDataModel } from '../../../Models/PublicInfoDataModel';
import { EncryptionService } from '../../../Services/EncryptionService/encryption-service.service';
import { ItiExaminerService } from '../../../Services/ItiExaminer/iti-examiner.service';
import { AppsettingService } from '../../../Common/appsetting.service';
import { HttpClient } from '@angular/common/http';
import { ITI_AppointExaminerDetailsModel } from '../../../Models/ITI/ITI_ExaminerDashboard';

@Component({
  selector: 'app-centers',
  templateUrl: './iti-examiner-list.component.html',
  styleUrls: ['./iti-examiner-list.component.css'],
  standalone: false
})
export class ItiExaminerListComponent implements OnInit {
  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public ItiExaminerMasterList: any = [];
  public UserID: number = 0;
  searchText: string = '';
  public isDisabledGrid: boolean = false;
  public isDisabledDOJ: boolean = false;
  isSubmittedItemDetails: boolean = false;
  public isLoadingExport: boolean = false;
  public assignedInstitutesReady: boolean = false;
  public searchRequest1 = new ITI_AppointExaminerDetailsModel()
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  public tbl_txtSearch: string = '';
  public Table_SearchText: string = '';
  public DistrictList: any = [];
  public ExaminerBundlelist: any = [];
  public requestSSoApi = new CommonVerifierApiDataModel();
  //public GenderList: any = [];
  public ManagmentTypeList: any = []
  public StaffID: number | null = null;
  sSOLoginDataModel = new SSOLoginDataModel();
  request = new ItiExaminerDataModel()
  public searchRequest = new ItiExaminerSearchModel();
  public StudentList: any = [];
  private modalRef: any;
  public theorylist = new ITITeacherForExaminerSearchModels();
  public requestpdf = new ITITeacherForExaminerSearchModel();

  Email: string = ''
  MobileNumber: string = ''
  Name: string = ''
  SSOID: string = ''
  Isverifed: boolean = false




  constructor(private commonMasterService: CommonFunctionService,
    private Router: Router,
    private ItiExaminerListService: ItiExaminerListService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private router: ActivatedRoute,
    private routers: Router,
    private _fb: FormBuilder,
    private modalService: NgbModal,
    private TheoryMarksService: ItiTheoryMarksService,
    private encryptionService: EncryptionService,
    private itiexaminerservice: ItiExaminerService,
    private appsettingConfig: AppsettingService,
    private http: HttpClient,
    private Swal2: SweetAlert2) {
  }

  async ngOnInit() {
   
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    console.log("ssologin model", this.sSOLoginDataModel)
    //this.request.UserID = this.sSOLoginDataModel.UserID;
    //await this.GetCenterMasterList();
    this.UserID = this.sSOLoginDataModel.UserID;
    await this.GetItiExaminerMasterList();

    this.GetMasterData();

    //await this.commonMasterService.GetCommonMasterData('Gender')
    //  .then((data: any) => {
    //    data = JSON.parse(JSON.stringify(data));
    //    //this.GenderList = data['Data'];
    //    this.GenderList = data.Data;
    //    console.log("GenderList", this.GenderList)
    //  }, (error: any) => console.error(error)
    //  );


  }

  async GetMasterData() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetDistrictMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.DistrictList = data.Data;
          console.log(this.DistrictList)
        }, (error: any) => console.error(error))

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

   //Method to handle the cancel button click
  ResetData() {
    // Reset all filter fields
    this.searchRequest.ExaminerCode = '';
    this.searchRequest.Name = '';
    this.searchRequest.Email = '';
    this.searchRequest.SSOID = '';
    this.searchRequest.DistrictID = 0;
 this.GetItiExaminerMasterList();

  }

  async GetItiExaminerMasterList() {
    //thi
    this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID
    try {
      this.loaderService.requestStarted();
      console.log("searchrequest", this.searchRequest)
      await this.ItiExaminerListService.GetAllData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          //this.ItiExaminerMasterList = data['Data'];
          this.ItiExaminerMasterList = data.Data;
          //console.log("ItiExaminerMasterList", this.ItiExaminerMasterList)
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



  async btnDeleteOnClick(ExaminerID: number) {

    this.Swal2.Confirmation("Are you sure you want to delete this ?",
      async (result: any) => {
        if (result.isConfirmed) {
          try {
            this.loaderService.requestStarted();
            await this.ItiExaminerListService.DeleteDataByID(ExaminerID, this.request.ModifyBy)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));
                console.log(data);

                this.State = data['State'];
                this.Message = data['Message'];
                this.ErrorMessage = data['ErrorMessage'];

                if (this.State = EnumStatus.Success) {
                  this.toastr.success(this.Message)
                  //reload
                  this.GetItiExaminerMasterList(); 
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
 
  exportToExcel(): void {
    const unwantedColumns = ['StaffID', 'DistrictID', 'ExaminerName', 'ExaminerSSOID', 'DistrictNameEnglish'];
    const filteredData = this.ItiExaminerMasterList.map((item: any) => {
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
    XLSX.writeFile(wb, 'ExaminerList.xlsx');
  }
  Onroute(ExaminerID: number, index: number) {
    this.routers.navigate(['/appointitiexaminer'], {
      queryParams: { ExaminerID: ExaminerID, SubjectType: index }
    });
  }

  async btnRevertOnClick(ExaminerID: number) {
    this.Swal2.Confirmation("Are you sure you want to Revert this ?",
      async (result: any) => {
        if (result.isConfirmed) {
          try {
            this.loaderService.requestStarted();
            await this.ItiExaminerListService.DeleteAssignedStudentsByExaminerID(ExaminerID)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));
                console.log(data);

                this.State = data['State'];
                this.Message = data['Message'];
                this.ErrorMessage = data['ErrorMessage'];

                if (this.State = EnumStatus.Success) {
                  this.toastr.success(this.Message)
                  //reload
                  this.GetItiExaminerMasterList();
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


  async ClosePopup() {
    this.modalService.dismissAll()
  }


  CloseModalPopup() {
    this.SSOID = ''
    this.MobileNumber = ''
    this.Email = ''
    this.Name = ''
    this.modalService.dismissAll();
   
    //this.requestInv = new TimeTableInvigilatorModel()
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


  async GetAllTheoryStudents(content: any, ExaminerID: number) {
    this.modalRef = this.modalService.open(content, {
      size: 'xl',
      ariaLabelledBy: 'modal-basic-title',
      backdrop: 'static'
    });

    this.modalRef.result.then(
      (result: any) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason: any) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
    this.theorylist.ExaminerID = ExaminerID
    this.theorylist.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.getStudentDetails(ExaminerID);
   
  }



  async getStudentDetails(ExaminerID: number)
  {

    try {

      this.theorylist.ExaminerID = ExaminerID
      this.theorylist.EndTermID = this.sSOLoginDataModel.EndTermID


    this.loaderService.requestStarted();
    await this.ItiExaminerListService.GetTeacherForExaminerById(this.theorylist)
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.StudentList = data['Data'];


        console.log("StudentList", this.StudentList)
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


  async getExaminerBundleDetails(Content:any,ExaminerID: number,itemdata:any) {
    this.modalRef = this.modalService.open(Content, {
      size: 'xl',
      ariaLabelledBy: 'modal-basic-title',
      backdrop: 'static'
    });

    this.modalRef.result.then(
      (result: any) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason: any) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }

    );

     this.Name = itemdata.Name;
      this.SSOID = itemdata.SSOID;
    this.GetBundleDetils(ExaminerID);

  }

  async GetBundleDetils(ExaminerID:number) {


    try {

      this.searchRequest1.ExaminerID = ExaminerID;
      this.searchRequest1.EndTermID = this.sSOLoginDataModel.EndTermID
      this.searchRequest1.Status = 10


      this.loaderService.requestStarted();
      await this.itiexaminerservice.GetItiAppointExaminerDetails(this.searchRequest1)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.ExaminerBundlelist = data['Data'];


          console.log("ExaminerBundlelist", this.ExaminerBundlelist)
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



  async RevertBundle(AppointExaminerID: number) {

    this.Swal2.Confirmation("Are you sure want to Lock the Process for this Examiner?", async (result: any) => {
      //confirmed
      try {
        let obj = {
          AppointExaminerID: AppointExaminerID,
          Remark: '',
          FinalSubmit:1
        }
        // Call service to save student exam status
        await this.TheoryMarksService.RevertBundle(obj)
          .then(async (data: any) => {
            this.State = data['State'];
            this.Message = data['Message'];
            this.ErrorMessage = data['ErrorMessage'];
            //
            if (this.State == EnumStatus.Success)
            {
              await this.GetItiExaminerMasterList();
              this.toastr.success(this.Message)
            }


          })
      } catch (ex) {
        console.log(ex);
        console.log(this.ErrorMessage);
      }
    });
  }


  async RevertBundle1(AppointExaminerID: number) {

    this.Swal2.ConfirmationWithRemark("Are you sure want to UnLock the Process for this Examiner?", async (result: any) => {
      //confirmed
      try {
        let obj = {
          AppointExaminerID: AppointExaminerID,
          Remark: result,
          FinalSubmit: 0
        }
        // Call service to save student exam status
        await this.TheoryMarksService.RevertBundle(obj)
          .then(async (data: any) => {
            this.State = data['State'];
            this.Message = data['Message'];
            this.ErrorMessage = data['ErrorMessage'];
            //
            if (this.State == EnumStatus.Success) {
              await this.GetItiExaminerMasterList();
              this.toastr.success(this.Message)
            }


          })
      } catch (ex) {
        console.log(ex);
        console.log(this.ErrorMessage);
      }
    });
  }


  async UnlockBundle1(row: any) {

    this.Swal2.Confirmation("Are you sure want to Lock the Process for this Examiner Bundle?", async (result: any) => {
      //confirmed
      
      try {
        let obj = {
          AppointExaminerID: row.ExaminerID,
          Remark: '',
          FinalSubmit: 0,
          CenterID: row.CenterID,
          SemesterID: row.SemesterID,
          SubjectName: row.SubjectName,
          StreamID: row.streamID, 
         EndTermID: this.sSOLoginDataModel.EndTermID
        }
        // Call service to save student exam status
        await this.TheoryMarksService.UnlockBundle1(obj)
          .then(async (data: any) => {
            this.State = data['State'];
            this.Message = data['Message'];
            this.ErrorMessage = data['ErrorMessage'];
            //

            if (this.State == EnumStatus.Success)
            {

              this.GetBundleDetils(row.ExaminerID);
              this.toastr.success(this.Message)
            }


          })
      } catch (ex) {
        console.log(ex);
        console.log(this.ErrorMessage);
      }
    });
  }

  async SSOIDGetSomeDetails(SSOID: string): Promise<any> {
    this.Isverifed = false
    if (SSOID == "") {
      this.toastr.error("Please Enter SSOID");
      this.SSOID = ''
      this.MobileNumber = ''
      this.Email = ''
      this.Name = ''
      return;
    }

    const username = SSOID; // or hardcoded 'SIDDHA.AZAD'
    const appName = 'madarsa.test';
    const password = 'Test@1234';

    /*const url = `https://ssotest.rajasthan.gov.in:4443/SSOREST/GetUserDetailJSON/${username}/${appName}/${password}`;*/

    this.requestSSoApi.SSOID = username;
    this.requestSSoApi.appName = appName;
    this.requestSSoApi.password = password;



    try {

      this.loaderService.requestStarted();
      await this.commonMasterService.CommonVerifierApiSSOIDGetSomeDetails(this.requestSSoApi).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        let response = JSON.parse(JSON.stringify(data));
        if (response?.Data) {

          let parsedData = JSON.parse(response.Data); // parse string inside Data
          if (parsedData != null) {
            this.Name = parsedData.displayName;
            this.MobileNumber = parsedData.mobile;
            this.SSOID = parsedData.SSOID;
            this.Email = parsedData.mailPersonal;
            this.Isverifed = true

          }
          else {
            this.toastr.error("Record Not Found");
            return;
          }

          //alert("SSOID: " + parsedData.SSOID); // show SSOID in alert
        }
      });
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }


  }


  AssignCenterSuperintendent() {
    if (this.Isverifed == false) {

      this.toastr.error("Please Enter Valid SSOID")
      return
    }
    if (this.SSOID == '') {
      this.toastr.error("Please Enter Valid SSOID")
      return
    }


    let obj = {
 

      UserID: this.UserID,
      DepartmentID: this.sSOLoginDataModel.DepartmentID,
      EndTermID: this.sSOLoginDataModel.EndTermID,
      Eng_NonEng: this.sSOLoginDataModel.Eng_NonEng,
      CreatedBy: this.sSOLoginDataModel.UserID,
      ModifyBy: this.sSOLoginDataModel.UserID,
      SSOID: this.SSOID,
      Name: this.Name,
      MobileNumber: this.MobileNumber,
      Email: this.Email

    }
    try {
      // //Call service to save data
      this.ItiExaminerListService.SaveData(obj)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];

          if (this.State === EnumStatus.Success) {
            this.toastr.success(this.Message);
            this.CloseModal();
            this.GetItiExaminerMasterList();
          } else {
            this.toastr.error(this.ErrorMessage);
          }
        })
        .catch((error: any) => {
          console.error(error);
          this.toastr.error("An error occurred while saving the data.");
        });

    } catch (ex) {
      console.log(ex);
      this.toastr.error("An unexpected error occurred.");
    }
  }
  CloseModal() {
    this.modalService.dismissAll();
    // Reset dropdown ready flag
    this.assignedInstitutesReady = false;
  }


  async openModal(content: any) {
 
    try {
    

      this.assignedInstitutesReady = true;



      await this.modalService
        .open(content, { size: 'md', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' })
        .result.then(
          (result) => {
            this.closeResult = `Closed with: ${result}`;
          },
          (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          }
        );
    } catch (error) {
      console.error('Error opening modal:', error);
      this.toastr.error('Failed to open modal. Please try again.');
    }
  }


  encryptParameter(param: any) {
    return this.encryptionService.encryptData(param);
  }
  encodeURIComponent(value: string) {
    return window.encodeURIComponent(value);
  }



  async RemoveStudent(row: any)
  {
    var body = {
      StudentExamPaperMarksID: row.StudentExamPaperID,
      ExaminerID: row.ExaminerID
    }
    this.Swal2.Confirmation("Are you sure you want to delete this ?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          try {
            //Show Loading
            this.loaderService.requestStarted
            await this.itiexaminerservice.RemoveStudent(body)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));
                console.log(data);

                this.State = data['State'];
                this.Message = data['Message'];
                this.ErrorMessage = data['ErrorMessage'];

                if (this.State == EnumStatus.Success)
                {
                  this.toastr.success(this.Message)

                  this.getStudentDetails(row.ExaminerID);
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

  async exportExcelData() {
    const unwantedColumns = [
      'ActiveStatus', 'DeleteStatus', 'CreatedBy', 'ModifyBy',
      'ModifyDate', 'IPAddress', 'CenterID', 'DownloadDate',
      'CenterCode', 'EndTermID', 'CCCode', 'CenterCode1', 'InstituteID', 'CourseType',
      'StudentExamID', 'SemesterID', 'StudentType', 'DOB', 'StudentTypeID', 'SubjectId',
      'SubjectCode', 'MaxMarks', 'MinMarks', 'ObtainedMarks', 'IsPresent', 'SemesterName',
      'StudentExamPaperID', 'streamID', 'ExaminerID', 'CenterID1', 'IsPresent1',
      'PresentStatus', 'selected', 'IsChecked'

      ];

    const filteredData = this.StudentList.map(
        (item: { [key: string]: any }, index: number) => {
          const filteredItem: any = {
            SNo: index + 1
          };

          Object.keys(item).forEach(key => {
            if (!unwantedColumns.includes(key)) {
              if (key === 'IsDownload') {
                filteredItem[key] = item[key] ? 'Yes' : 'No';
              } else {
                filteredItem[key] = item[key];
              }
            }
          });

          return filteredItem;
        }
      );

      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);

      const colWidths = Object.keys(filteredData[0]).map(key => {
        let maxLength = key.length;

        filteredData.forEach((row: { [x: string]: any; }) => {
          const cellValue = row[key];
          if (cellValue !== null && cellValue !== undefined) {
            maxLength = Math.max(maxLength, cellValue.toString().length);
          }
        });

        return { wch: maxLength + 2 };
      });

      ws['!cols'] = colWidths;

      const range = XLSX.utils.decode_range(ws['!ref']!);
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
        if (ws[cellAddress]) {
          ws[cellAddress].s = { font: { bold: true } };
        }
      }

      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

      const today = new Date();
      const dateStr = today.toLocaleDateString('en-GB').split('/').join('-');
    XLSX.writeFile(wb, `Student_Examiner_assigned_Report_${dateStr}.xlsx`);
    }


  async downloadCenterWiseReport(item: any) {
    debugger

    this.requestpdf.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.requestpdf.sSOID = item?.SSOID
    this.requestpdf.ExaminerID = item?.ExaminerID
    this.requestpdf.EndTermID = this.sSOLoginDataModel.EndTermID;


    await this.itiexaminerservice.TeacherForExaminerReportDewnloadPdf(this.requestpdf)
      .subscribe({
        next: (blob: Blob) => {
          const now = new Date();
          const dateTime =
            now.getFullYear().toString() +
            ('0' + (now.getMonth() + 1)).slice(-2) +
            ('0' + now.getDate()).slice(-2) + '_' +
            ('0' + now.getHours()).slice(-2) +
            ('0' + now.getMinutes()).slice(-2);

          const fileName = `Teacher_For_Examiner_Report_${dateTime}.pdf`;

          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = fileName;
          a.click();

          window.URL.revokeObjectURL(url);
        },
        error: (err) => {
          console.error(err);
          this.toastr.warning('Failed to download report');
        }
      });
  }


  downloadExaminerSignPdf(item: any): void {
    debugger
    const fileUrl = this.appsettingConfig.StaticFileRootPathURL + "/" + "ITI" + "/" + 'ExaminerUploadFile' + "/" + item;
    this.http.get(fileUrl, { responseType: 'blob' }).subscribe((blob) => {
      const downloadLink = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.download = this.generateFileName('pdf');
      downloadLink.click();
      window.URL.revokeObjectURL(url);
    });
  }
  generateFileName(extension: string): string {
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_'); 
    return `file_${timestamp}.${extension}`;
  }

}
