import { Component } from '@angular/core';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AppsettingService } from '../../../Common/appsetting.service';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { StreamMasterService } from '../../../Services/BranchesMaster/branches-master.service';
import { ItiTradeService } from '../../../Services/iti-trade/iti-trade.service';
import { ITICenterAllocationService } from '../../../Services/ITICenterAllocation/ItiCenterAllocation.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ReportService } from '../../../Services/Report/report.service';
import { EnumRole, EnumStatus } from '../../../Common/GlobalConstants';
import * as XLSX from 'xlsx';
import { ActivatedRoute } from '@angular/router';
import { CollegeWiseScholarshipService } from '../../../Services/CollegeWiseScholarship/college-wise-scholarship.service';
import { InternalPracticalStudentService } from '../../../Services/InternalPracticalStudent/internal-practical-assessment-student.service';
import { ScholarshipApiDataModel } from '../../../Models/CollegeWiseScholarshipModel';
import { UnlockInternalMarksModel, updateUnlockInternalMarksModel } from '../../../Models/TheoryMarksDataModels';

@Component({
  selector: 'app-Unlock-Internal-Marks',
  standalone: false,
  templateUrl: './Unlock-Internal-Marks.component.html',
  styleUrl: './Unlock-Internal-Marks.component.css'
})
export class UnlockInternalMarksComponent {

  public State: number = 0;
  public Message: any = [];
  showDownloadOptions = false;
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public Status: number = 0
  public UnlockInternalMarksList: UnlockInternalMarksModel[] = [];
  public UserID: number = 0;
  searchText: string = '';
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  public Table_SearchText: string = '';
  public SearchTimeTableList: any = []
  UnlockInternalRequest = new UnlockInternalMarksModel();
  UnlockInternalMarksRequest = new updateUnlockInternalMarksModel();
  sSOLoginDataModel = new SSOLoginDataModel();
  public InstituteMasterList: any = [];
  

  constructor(
    private loaderService: LoaderService,
    private UnlockInternalMarks: InternalPracticalStudentService,
    private Swal2: SweetAlert2,
    private commonMasterService: CommonFunctionService,
  ) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetUnlockInternalMarksList();
    await this.InstituteMaster();
  }

  async InstituteMaster() {
    debugger
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.InstituteMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          if (this.sSOLoginDataModel.RoleID == EnumRole.Principal) {
            this.InstituteMasterList = data['Data'];
          } else {
            this.InstituteMasterList = data['Data'];
           
          }

          console.log('Institute List ==>',this.InstituteMasterList)
        }, (error: any) => console.error(error));


      
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

  async btn_Clear() {
  
    this.UnlockInternalMarksRequest.InstituteID = 0;
  }



 
  async GetUnlockInternalMarksList() {
    debugger
    try {
      this.loaderService.requestStarted();
      this.UnlockInternalRequest.InstituteID = this.UnlockInternalMarksRequest.InstituteID
      await this.UnlockInternalMarks.GetAllUnlockInternalMarksList(this.UnlockInternalRequest)
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.UnlockInternalMarksList = data['Data'];
        console.log('this.UnlockInternalMarksList',this.UnlockInternalMarksList)
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



  async SCAMarkUnlock(row:any, TypeID: any, markType: string) {
    debugger
    this.Swal2.Confirmation(`Are you sure you want to unlock ${markType}?`,
    async (result: any) => {
      if (result.isConfirmed) {
        try {
          this.UnlockInternalMarksRequest.ModifyBy = this.sSOLoginDataModel.UserID;
          this.UnlockInternalMarksRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
          this.UnlockInternalMarksRequest.InstituteID = row.InstituteID;
          this.UnlockInternalMarksRequest.TypeID = TypeID;
          try {
            await this.UnlockInternalMarks.UnlockInternalMarks(this.UnlockInternalMarksRequest)
              .then(async (data: any) => {
                this.State = data['State'];
                this.Message = data['Message'];
                this.ErrorMessage = data['ErrorMessage'];
                if (this.State == EnumStatus.Success) {

                }

                else {
                    
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

        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
  });
  }


}
