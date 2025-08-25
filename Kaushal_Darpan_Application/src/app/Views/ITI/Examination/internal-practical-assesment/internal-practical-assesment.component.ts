import { Component } from '@angular/core';
import { ITITheoryMarksDataModels, ITITheoryMarksSearchModel } from '../../../../Models/ITITheoryMarksDataModel';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { StreamMasterService } from '../../../../Services/BranchesMaster/branches-master.service';
import { ITIPracticalAssesmentService } from '../../../../Services/ITI/ITIPracticalAssesment/ITIPracticalAssesment.service';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EnumStatus } from '../../../../Common/GlobalConstants';

@Component({
  selector: 'app-internal-practical-assesment',
  standalone: false,

  templateUrl: './internal-practical-assesment.component.html',
  styleUrl: './internal-practical-assesment.component.css'
})
export class InternalPracticalAssesmentComponent {
  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public SemesterMasterList: any = [];
  public Branchlist: any = [];
  public InternalPracticalID: number | null = null;
  /*public TheoryMarksList: any = [];*/
  public UserID: number = 0;
  searchText: string = '';
  allSelected = false;
  public Table_SearchText: string = '';
  public isDisabledGrid: boolean = false;
  public isDisabledDOJ: boolean = false;
  isSubmittedItemDetails: boolean = false;
  public isLoadingExport: boolean = false;
  public IsView: boolean = false;
  public tbl_txtSearch: string = '';
  /*request = new TheoryMarksDataModels()*/
  public searchRequest = new ITITheoryMarksSearchModel();
  sSOLoginDataModel = new SSOLoginDataModel();
  public TheoryMarksList: ITITheoryMarksDataModels[] = []
  public id: number = 0;
  constructor(private commonMasterService: CommonFunctionService, private activatedRoute: ActivatedRoute,
    private Router: Router, private InternalPracticalStudentService: ITIPracticalAssesmentService, private toastr: ToastrService,
    private loaderService: LoaderService, private router: ActivatedRoute, private routers: Router,
    private modalService: NgbModal, private Swal2: SweetAlert2, private streamMasterService: StreamMasterService) {
  }


  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    /*this.UserID = this.sSOLoginDataModel.UserID;*/

    this.router.queryParams.subscribe(params => {
      this.id = +params['id']; 
      console.log(this.id); 
    });

    //load
    await this.GetMasterData();
    await this.GetTheoryMarksList();
  }



  async GetMasterData() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.StreamMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.Branchlist = data['Data'];
        }, error => console.error(error));
      await this.commonMasterService.SemesterMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.SemesterMasterList = data['Data'];
        }, error => console.error(error));
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

  toggleAllCheckboxes(event: Event) {
    ;
    this.allSelected = (event.target as HTMLInputElement).checked;
    this.TheoryMarksList.forEach(role => {
      role.Marked = this.allSelected;
    });
  }

  toggleCheckbox(role: ITITheoryMarksDataModels) {
    // Toggle the Marked state of the role
    role.Marked = !role.Marked;

    //// If unchecked, reset IsMainRole for that row
    //if (!role.Marked) {
    //  role.IsMainRole = 0;
    //}

    // Check if all roles are selected
    this.allSelected = this.TheoryMarksList.every(r => r.Marked);
  }

  async GetTheoryMarksList() {
    try {
      this.isSubmitted = true;
      //session
      this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.searchRequest.AppointExaminerID = this.id;
      //
      this.loaderService.requestStarted();
      await this.InternalPracticalStudentService.GetAllData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          this.TheoryMarksList = data['Data'];
          console.log(this.TheoryMarksList, "TheoryMarks")
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



  async OnSubmit() {
    try {
      this.loaderService.requestStarted();

      // Filter the TheoryMarksList to get only the items where Marked is true
      var filtered = this.TheoryMarksList.filter(x => x.Marked == true);
      if (filtered.length === 0) {
        this.toastr.warning('Please Select Student data');
        return;
      }
      // Iterate over each filtered item for validation
      for (let x of filtered) {

        if (this.searchRequest.InternalPracticalID == 2) {

          // If the student is marked as "Absent" (IsPresentTheory = 0), validate marks
          if (x.IsPresentInternalAssisment === 0) {
            // Ensure marks are 0 when absent (MaxTheory and ObtainedTheory should be 0 for absent students)
            if (x.MaxInternalAssisment !== 0 || x.ObtainedInternalAssisment !== 0) {
              this.toastr.error('For absent students, marks must be 0.');
              return;
            }
          }

          // If the student is marked as "Present" (IsPresentTheory = 1), ensure that marks are entered
          if (x.IsPresentInternalAssisment === 1) {
            // If the ObtainedMarks is blank (null or undefined), show an error
            if (x.ObtainedInternalAssisment === null || x.ObtainedInternalAssisment === undefined || x.ObtainedInternalAssisment === 0) {
              this.toastr.error('Please enter marks for the student (Obtained Marks cannot be blank when Present)');
              return;
            }

            // Ensure that ObtainedTheory is greater than 0 for present students
            if (x.ObtainedInternalAssisment === 0) {
              this.toastr.error('Obtained Marks cannot be 0 for present students.');
              return;
            }

            // Ensure that ObtainedTheory is not greater than MaxTheory
            if (x.ObtainedInternalAssisment > x.MaxInternalAssisment) {
              this.toastr.error('Max Marks cannot be less than Marks Obtained');
              return;
            }
          }

          // Ensure that MaxTheory is not less than ObtainedTheory
          if (x.MaxInternalAssisment < x.ObtainedInternalAssisment) {
            this.toastr.error('Max Marks cannot be less than Marks Obtained');
            return;
          }

          // Ensure that IsPresentTheory is updated correctly (Present or Absent)
          if (x.IsPresentInternalAssisment === 0) {
            this.toastr.error('Please update Status to Present/Absent');
            return;
          }
        }

        if (this.searchRequest.InternalPracticalID == 1) {
          // If the student is marked as "Absent" (IsPresentTheory = 0), validate marks
          if (x.IsPresentPractical === 0) {
            // Ensure marks are 0 when absent (MaxTheory and ObtainedTheory should be 0 for absent students)
            if (x.MaxPractical !== 0 || x.ObtainedPractical !== 0) {
              this.toastr.error('For absent students, marks must be 0.');
              return;
            }
          }

          // If the student is marked as "Present" (IsPresentTheory = 1), ensure that marks are entered
          if (x.IsPresentPractical === 1) {
            // If the ObtainedMarks is blank (null or undefined), show an error
            if (x.ObtainedPractical === null || x.ObtainedPractical === undefined || x.ObtainedPractical === 0) {
              this.toastr.error('Please enter marks for the student (Obtained Marks cannot be blank when Present)');
              return;
            }

            // Ensure that ObtainedTheory is greater than 0 for present students
            if (x.ObtainedPractical === 0) {
              this.toastr.error('Obtained Marks cannot be 0 for present students.');
              return;
            }

            // Ensure that ObtainedTheory is not greater than MaxTheory
            if (x.ObtainedPractical > x.MaxPractical) {
              this.toastr.error('Max Marks cannot be less than Marks Obtained');
              return;
            }
          }

          // Ensure that MaxTheory is not less than ObtainedTheory
          if (x.MaxPractical < x.ObtainedPractical) {
            this.toastr.error('Max Marks cannot be less than Marks Obtained');
            return;
          }

          // Ensure that IsPresentTheory is updated correctly (Present or Absent)
          if (x.IsPresentPractical === 0) {
            this.toastr.error('Please update Status to Present/Absent');
            return;
          }

        }

        // Set the Modifier information
        x.ModifyBy = this.sSOLoginDataModel.UserID;
      }

      filtered.forEach(x => {
        x.IsPracticalChecked = true;
      })

      await this.InternalPracticalStudentService.UpdateSaveData(filtered, this.searchRequest.InternalPracticalID)
        .then(async (data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          console.log("data on save", data);

          if (this.State === EnumStatus.Success) {
            this.toastr.success(this.Message);
            await this.GetTheoryMarksList();
          } else {
            this.toastr.error(this.ErrorMessage);
          }
        })
        .catch((error: any) => {
          console.error(error);
          this.toastr.error('Failed to update SSOIDs');
        });
    } catch (ex) {
      console.log(ex);
    } finally {
      this.loaderService.requestEnded();
    }
  }

  ResetControl() {
    /* this.searchRequest = new TheoryMarksSearchModel();*/
    this.searchRequest.MarkEnter = 0;
    this.searchRequest.SemesterID = 0;
    this.searchRequest.StreamID = 0;
    this.searchRequest.StudentID = 0;
    this.searchRequest.SubjectID = 0;
    this.searchRequest.RollNo = '',
    this.TheoryMarksList = [];

  }
}
