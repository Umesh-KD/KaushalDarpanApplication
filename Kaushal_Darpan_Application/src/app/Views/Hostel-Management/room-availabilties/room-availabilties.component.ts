import { Component } from '@angular/core';
import { StudentRequestService } from '../../../Services/StudentRequest/student-request.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { ToastrService } from 'ngx-toastr';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { RoomAvailability } from '../../../Models/Hostel-Management/RoomAllotmentDataModel';
import { RoomAllotmentDataModel } from '../../../Models/Hostel-Management/RoomAllotmentDataModel';

@Component({
  selector: 'app-room-availabilties',
  standalone: false,
  
  templateUrl: './room-availabilties.component.html',
  styleUrl: './room-availabilties.component.css'
})
export class RoomAvailabiltiesComponent {
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public showColumn: boolean = false;
  public UserID: number = 0;
  public ReqId: number = 0;
  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public sSOLoginDataModel = new SSOLoginDataModel();
  modalReference: NgbModalRef | undefined;
  public Table_SearchText: string = "";
  //public RoomAvailabiltiesList: any = [];
  public RoomAvailabiltiesList: RoomAvailability[] = [];
  request = new RoomAllotmentDataModel()
  SumofRoomCount: number = 0;
  SumofTotalSeats: number = 0;
  SumofAllocatedSeats: number = 0;
  SumofAvailableSeats: number = 0;



  constructor(
    private toastr: ToastrService,
    private studentRequestService: StudentRequestService,
    private commonFunctionService: CommonFunctionService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    private Swal2: SweetAlert2,
    private modalService: NgbModal) { }


  async ngOnInit() {
    this.ReqId = Number(this.activatedRoute.snapshot.queryParamMap.get('id')?.toString());
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.UserID = this.sSOLoginDataModel.UserID;
    await this.GetAllData();
  }

  

  async GetAllData() {
    try {
      this.loaderService.requestStarted();
      this.request.HostelID = this.sSOLoginDataModel.HostelID;
      this.request.EndTermId = this.sSOLoginDataModel.EndTermID;
      await this.studentRequestService.GetAllRoomAvailabilties(this.request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.RoomAvailabiltiesList = data.Data.Table;

          this.SumofRoomCount = data.Data.Table1[0].SumofRoomCount;
          this.SumofTotalSeats = data.Data.Table1[0].SumofTotalSeats;
          this.SumofAllocatedSeats = data.Data.Table1[0].SumofAllocatedSeats;
          this.SumofAvailableSeats = data.Data.Table1[0].SumofAvailableSeats;

          console.log(this.RoomAvailabiltiesList)
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



 
  
  
}
