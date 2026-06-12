import { Component } from '@angular/core';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { EnumRole, EnumStatus } from '../../../Common/GlobalConstants';
import * as XLSX from 'xlsx';
import { InternalPracticalStudentService } from '../../../Services/InternalPracticalStudent/internal-practical-assessment-student.service';
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
    private commonMasterService: CommonFunctionService    
  ) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.InstituteMaster();
    await this.GetUnlockInternalMarksList();
  }

  async InstituteMaster() {
    //debugger
    try {

      await this.commonMasterService.InstituteMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          if (this.sSOLoginDataModel.RoleID == EnumRole.Principal) {
            this.InstituteMasterList = data['Data'];
          } else {
            this.InstituteMasterList = data['Data'];

          }

          console.log('Institute List ==>', this.InstituteMasterList)
        }, (error: any) => console.error(error));


    }
    catch (Ex) {
      console.log(Ex);
    }
  }

  async btn_Clear() {

    this.UnlockInternalMarksRequest.InstituteID = 0;
  }




  async GetUnlockInternalMarksList() {
    //debugger
    try {

      this.UnlockInternalRequest.InstituteID = this.UnlockInternalMarksRequest.InstituteID
      this.UnlockInternalRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.UnlockInternalRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.UnlockInternalRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.UnlockInternalRequest.RoleID = this.sSOLoginDataModel.RoleID;

      // get
      await this.UnlockInternalMarks.GetAllUnlockInternalMarksList(this.UnlockInternalRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.UnlockInternalMarksList = data['Data'];
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
  }



  async SCAMarkUnlock(row: any, TypeID: any, markType: string) {
    //debugger
    this.Swal2.Confirmation(`Are you sure you want to unlock? ${markType}?`,
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

          } catch (error) {
            console.error('Error fetching data:', error);
          }
        }
      });
  }

  IsAllFinalSubmit(row: UnlockInternalMarksModel, TypeID: number) {
    let _isAllFinalSubmit = false;
    if (TypeID == 1) {// Practical Mark
      _isAllFinalSubmit = ((row?.PracticalTotalPaperCount ?? 0) > 0 && row?.PracticalTotalPaperCount == row?.PracticalFinalSubmitPaperCount);
    } else if (TypeID == 2) {// IA Mark
      _isAllFinalSubmit = ((row?.IATotalPaperCount ?? 0) > 0 && row?.IATotalPaperCount == row?.IAFinalSubmitPaperCount);
    } else if (TypeID == 3) {// SCA Mark
      _isAllFinalSubmit = ((row?.SCATotalPaperCount ?? 0) > 0 && row?.SCATotalPaperCount == row?.SCAFinalSubmitPaperCount);
    }
    //
    return _isAllFinalSubmit;
  }

}
