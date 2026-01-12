import { Component } from '@angular/core';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AppsettingService } from '../../../Common/appsetting.service';
import { CommonFunctionService } from '../../../Common/common';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { StreamMasterService } from '../../../Services/BranchesMaster/branches-master.service';
import { ItiTradeService } from '../../../Services/iti-trade/iti-trade.service';
import { ITICenterAllocationService } from '../../../Services/ITICenterAllocation/ItiCenterAllocation.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ReportService } from '../../../Services/Report/report.service';
import { EnumStatus } from '../../../Common/GlobalConstants';
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

  constructor(
    private loaderService: LoaderService,
    private UnlockInternalMarks: InternalPracticalStudentService
  ) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetUnlockInternalMarksList();
  }
 
  async GetUnlockInternalMarksList() {

    try {
      this.loaderService.requestStarted();

      await this.UnlockInternalMarks.GetAllUnlockInternalMarksList(this.UnlockInternalRequest)
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.UnlockInternalMarksList = data['Data'];
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



  async SCAMarkUnlock(TypeID: any) {
    debugger
    try {
      this.UnlockInternalMarksRequest.ModifyBy = this.sSOLoginDataModel.UserID;
      this.UnlockInternalMarksRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.UnlockInternalMarksRequest.InstituteID = this.sSOLoginDataModel.InstituteID;
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
              //this.toastr.error(this.ErrorMessage)
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


}
