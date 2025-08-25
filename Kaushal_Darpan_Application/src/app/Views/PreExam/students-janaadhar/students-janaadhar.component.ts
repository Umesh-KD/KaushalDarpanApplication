import { Component, OnInit } from '@angular/core';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { StudentsJanaadharService } from '../../../Services/StudentsJanaadhar/students-janaadhar.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StudentsJanAadharSearchModel } from '../../../Models/StudentsJanAadharSearchModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { JanAadharMemberDetails } from '../../../Models/StudentJanAadharDetailModel';

@Component({
    selector: 'app-students-janaadhar',
    templateUrl: './students-janaadhar.component.html',
    styleUrls: ['./students-janaadhar.component.css'],
    standalone: false
})
export class StudentsJanaadharComponent implements OnInit {

  public StudentsJanaadharList: any = [];
  public Table_SearchText: string = "";
  public searchRequest = new StudentsJanAadharSearchModel();
  public sSOLoginDataModel = new SSOLoginDataModel();
  public StudentAadharMemberDetails = new JanAadharMemberDetails()


  constructor(private commonMasterService: CommonFunctionService, private studentsJanaadharService: StudentsJanaadharService, private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private routers: Router, private modalService: NgbModal) {
    this.searchRequest.JanAadharStatus = '1';
  }
  async ngOnInit()
  {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetAllData();
  }

  // get all data
  async GetAllData() {
    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;

    try {
      this.loaderService.requestStarted();
      await this.studentsJanaadharService.GetAllData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.StudentsJanaadharList = data['Data'];
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

  // redirect to student janaadhar edit
  onEditStudentJanAadhar(studentId: number): void {
    this.routers.navigate(['/editstudentsjanaadhar', studentId]);
  }

  // get all data
  async ClearSearchData()
  {
    this.searchRequest.EnrollmentNo = '';
    this.searchRequest.StudentName = '';
    this.searchRequest.Gender = '';
    this.searchRequest.MobileNo = '';
    this.searchRequest.JanAadharNo = '';
    await this.GetAllData();
  }
}
