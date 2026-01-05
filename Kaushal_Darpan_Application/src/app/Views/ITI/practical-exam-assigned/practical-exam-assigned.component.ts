import { Component, OnInit } from '@angular/core';
import { ItiAssignExaminerService } from '../../../Services/ITIAssignExaminer/iti-assign-examiner.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { EnumRole } from '../../../Common/GlobalConstants';
import { LoaderService } from '../../../Services/Loader/loader.service';

@Component({
  selector: 'app-practical-exam-assigned',
  standalone: false,
  templateUrl: './practical-exam-assigned.component.html',
  styleUrl: './practical-exam-assigned.component.css'
})
export class PracticalExamAssignedComponent implements OnInit
{
  VerifyRollList: any;
  Table_SearchText: any;
  public sSOLoginDataModel = new SSOLoginDataModel();
  public _EnumRole = EnumRole;
  public State: number = 0;
  public SuccessMessage: string = '';
  public ErrorMessage: string = '';



  public AssignedExamList: any = [];
  constructor(private itiAssignExaminerService: ItiAssignExaminerService, private loaderService: LoaderService) {

  }

  async ngOnInit()
  {
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
   await this.GetAllData();
   }
  

  async GetAllData()
  {

    var body =
    {
      UserID: this.sSOLoginDataModel.UserID,
      Eng_NonEng: this.sSOLoginDataModel.Eng_NonEng,
      EndTermID: this.sSOLoginDataModel.EndTermID
    }

    try {

      
        await this.itiAssignExaminerService.GetAssignedCentersAndTimetable(body)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            debugger;

            this.AssignedExamList = data['Data']


            // Filter based on ListType 'EnrollmentType'
           
          }, (error: any) => console.error(error)
      )

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



}
