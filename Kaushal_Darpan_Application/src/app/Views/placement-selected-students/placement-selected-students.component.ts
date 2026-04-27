import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../Services/Loader/loader.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { PlacementSelectedStudentResponseModel, PlacementStudentSelectedSearchModel } from '../../Models/PlacementSelectedStudentResponseModel';
import { PlacementSelectedStudentsService } from '../../Services/PlacementSelectedStudents/placement-selected-students.service';
import { async } from 'rxjs';
import { DropdownValidators } from '../../Services/CustomValidators/custom-validators.service';
import { EnumStatus } from '../../Common/GlobalConstants';
import { SSOIDDetailRequestModel } from '../../Models/CampusPostDataModel';
import { ApplicationMessageDataModel } from '../../Models/ApplicationMessageDataModel';
import { SMSMailService } from '../../Services/SMSMail/smsmail.service';
import * as XLSX from 'xlsx';


declare function tableToExcel(table: any, name: any, fileName: any): any;
@Component({
    selector: 'app-placement-selected-students',
    templateUrl: './placement-selected-students.component.html',
    styleUrls: ['./placement-selected-students.component.css'],
    standalone: false
})
export class PlacementSelectedStudentsComponent implements OnInit {
  public PlacementSelectedListStudentForm!: FormGroup;
  public Message: string = '';
  public ErrorMessage: string = '';
  public State: number = 0;
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public Table_SearchText: string = "";
  public UserID: number = 0;
  public AllSelect: boolean = false;
  public sSOLoginDataModel = new SSOLoginDataModel();
  
  public getSSOIDDetailData: any[]=[];
  public messageModel= new ApplicationMessageDataModel();
  
  public PlacedCountList:any[]=[];
  public InstituteMasterList: any[] = [];
  public StreamMasterList: any[] = [];
  public CampusMasterList: any[] = [];
  public CampusWiseHiringRoleList: any[] = [];
  public CampusPostID: number = 0;
  public BranchID: number = 0;
  public HiringRoleID: number = 0;
  public FinancialYearList: any[] = [];
  public HiringRoleMasterList: any[] = [];
  public NoRangeList: any[] = [50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70];
  public searchRequest = new PlacementStudentSelectedSearchModel();
  public StudentList: PlacementSelectedStudentResponseModel[] = [];

  constructor(private commonMasterService: CommonFunctionService,private smsMailService:SMSMailService, private Router: Router, private placementShortListStudentService: PlacementSelectedStudentsService, private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder, private router: ActivatedRoute, private routers: Router, private fb: FormBuilder, private modalService: NgbModal) {
  }

  async ngOnInit() {
    this.PlacementSelectedListStudentForm = this.formBuilder.group({
      CampusPostID: ['', [DropdownValidators]],
      BranchID: ['', [DropdownValidators]],
      HiringRoleID: ['',[DropdownValidators]],
    });

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    await this.GetCampusPostMasterDDL();

    this.isSubmitted = false;
    console.log(this.isSubmitted)
  }
  get _PlacementSelectedListStudentForm() { return this.PlacementSelectedListStudentForm.controls; }
  //
  async GetCampusPostMasterDDL() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCampusPostMasterDDL(this.sSOLoginDataModel.DepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CampusMasterList = data['Data'];
          console.log(this.CampusMasterList);
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
  //
  async GetStreamMasterList(CampusPostID: number) {
    try {
      this.BranchID = 0;
      this.HiringRoleID = 0;
      this.StreamMasterList = [];
      console.log(this.StreamMasterList)
      this.loaderService.requestStarted();
      await this.commonMasterService.StreamMasterByCampus(this.CampusPostID, this.sSOLoginDataModel.DepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.StreamMasterList = data['Data'];
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
  //
  async GetCampusWiseHiringRoleDDL() {
    //debugger
    try {
      this.isSubmitted = false;
      await this.GetStreamMasterList(this.CampusPostID);

      this.HiringRoleMasterList = [];
      this.loaderService.requestStarted();

      await this.commonMasterService.GetCampusWiseHiringRoleDDL(this.CampusPostID, this.sSOLoginDataModel.DepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.HiringRoleMasterList = data['Data'];
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
  //get all
  async GetAllData() {
    
    this.isSubmitted = true;
    //
    if (this.PlacementSelectedListStudentForm.invalid) {
      return console.log("error")
    }
    this.StudentList = [];
    try {
      this.loaderService.requestStarted();

      this.searchRequest.BranchID = this.BranchID;
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng
      this.searchRequest.CampusPostID = this.CampusPostID
      this.searchRequest.AgeTo = this.searchRequest.AgeTo ?? 0;
      this.searchRequest.HiringRoleID = this.HiringRoleID;
      await this.placementShortListStudentService.GetAllData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          if (data.State == EnumStatus.Success) {
            this.StudentList = data['Data'];
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
        this.isSubmitted = false;
      }, 200);
    }
  }

    async GetStudentPlacedCount() {
    debugger
    try {
      this.loaderService.requestStarted();
      await this.placementShortListStudentService.GetStudentPlacedCount()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.PlacedCountList = data['Data'];
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

  //clear search
  ClearSearchData() {
    this.isSubmitted = false;
    this.StudentList = [];
    this.HiringRoleMasterList = [];
    this.StreamMasterList = [];
  }
  //save
  async SaveAllData() {
    try {
      this.isSubmitted = true;
      this.loaderService.requestStarted();

      this.StudentList.forEach(x => {
        x.ModifyBy = this.sSOLoginDataModel.UserID;
      });
      console.log(this.StudentList);

      const isAnySelected = this.StudentList.some(x => x.Marked);
      if (!isAnySelected) {
        this.toastr.error('Please select at least one checkbox!');

        return; // Exit the method if no checkbox is selected
      }
      //save
      debugger
      await this.placementShortListStudentService.SaveAllData(this.StudentList)
        .then(async (data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == EnumStatus.Success) {
            this.SendApplicationMessage();
            this.toastr.success(this.Message)
            await this.GetAllData();
          }
          else {
            this.toastr.error(this.ErrorMessage)
          }
        })
        .catch((error: any) => {
          console.error(error);
          this.toastr.error('Failed to Action on Selection!');
        });
    }
    catch (ex) {
      console.log(ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isSubmitted = false;
      }, 200);
    }
  }

  //
  checkboxthView_checkboxchange(isChecked: boolean) {
    this.AllSelect = isChecked;
    for (let item of this.StudentList) {
      item.Marked = this.AllSelect;
    }
  }


  async SendApplicationMessage() {
       debugger
       try {
         this.loaderService.requestStarted();
        //  let SSOID = this.sSOLoginDataModel.SSOID;
        //  let action = "GetStudentDetailBySSOID";
        let request=new SSOIDDetailRequestModel();
        request.SSOID=this.sSOLoginDataModel.SSOID;
        request.Action="GetStudentDetailBySSOID";
         await this.commonMasterService.GetSSOIDDetailData(request)
           .then((data: any) => {
             data = JSON.parse(JSON.stringify(data));
             this.getSSOIDDetailData = data['Data'];
             console.log(this.getSSOIDDetailData,"getSSOIDDetailData");
   
             if (data.State == EnumStatus.Success) {
               console.log('Data load successfully', data);
             } else {
               console.log('Something went wrong', data);
             }
           }, (error: any) => console.error(error));
   
   
         // const personalMail = this.getSSOIDDetailData[0].Mailpersonal;
         // this.messageModel.Email = (personalMail && personalMail.trim() !== '') 
         //   ? personalMail 
         //   : this.getSSOIDDetailData[0].Officialmail;
   
           this.messageModel.MobileNo = (this.getSSOIDDetailData[0].MobileNo && this.getSSOIDDetailData[0].MobileNo.trim() !== '')
           ?this.getSSOIDDetailData[0].MobileNo
           :this.getSSOIDDetailData[0].TelephoneNumber;
   
         //this.messageModel.MobileNo = '8955186821';
         // this.messageModel.MobileNo = this.getSSOIDDetailData[0].MobileNo;
         // department
         //if (this.DepartmentID == EnumDepartment.BTER) {
         //  this.messageModel.MessageType = EnumMessageType.Bter_FormFinalSubmit;
         //}
         //else if (this.DepartmentID == EnumDepartment.ITI) {
         //  this.messageModel.MessageType = EnumMessageType.FormFinalSubmitITI;
         //}
         /*this.messageModel.ApplicationNo = this.ApplicationNo.toString();*/
        //  Consent_Recorded_Student
         this.messageModel.ApplicationNo = '21100634';
         this.messageModel.MessageType='OTP';
         if(this.messageModel.MobileNo!='' || this.messageModel.MobileNo!=null){
             await this.smsMailService.SendApplicationMessage(this.messageModel)
              .then((data: any) => {
                data = JSON.parse(JSON.stringify(data));
                if (data.State == EnumStatus.Success) {
                  console.log('Message sent successfully', data);
                } else {
                  console.log('Something went wrong', data);
                }
              }, (error: any) => console.error(error));
         }
         else{
            this.toastr.error("Mobile number is not available for sending SMS");
         }
        
       } catch (Ex) {
         console.log(Ex);
       }
       finally {
         setTimeout(() => {
           this.loaderService.requestEnded();
         }, 200);
       }
     }
   
       //
  public async ExcelExport() {
    if (this.StudentList.length > 0) {
      tableToExcel("tbl_placementStudent", "Students", "PlacementStudent");
    }
  }

  exportToExcel(): void {
    const unwantedColumns = [
      'TransctionStatusBtn', 'ActiveStatus', 'DeleteStatus', 'CreatedBy', 'ModifyBy', 'ModifyDate', 'IPAddress',
      'TotalRecords', 'DepartmentID', 'CourseType', 'AcademicYearID', 'EndTermID','MobileNo','Email','Mobile','Email Address','Marked','UploadedResume','Selected','CampusPostID'
    ];
    const filteredData = this.StudentList.map((item: any) => {
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
    XLSX.writeFile(wb, 'ShortlistStudentData.xlsx');
  }
   
}
