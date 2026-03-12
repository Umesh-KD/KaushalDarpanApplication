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
import { GuestRoomManagmentService } from '../../../Services/GuestRoomManagment/GuestRoomManagment.service';
import { EnumStatus } from '../../../Common/GlobalConstants';

@Component({
  selector: 'app-room-availability',
  standalone: false,
  templateUrl: './room-availability.component.html',
  styleUrl: './room-availability.component.css'
})
export class RoomAvailabilityComponent {
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public showColumn: boolean = false;
  public UserID: number = 0;
  public GuestHouseID: number = 0;
  public sSOLoginDataModel = new SSOLoginDataModel();
  public Table_SearchText: string = "";
  public RoomAvailabiltiesList:any = [];

  public GuestHouseNameList: any = [];

  constructor(
    private loaderService: LoaderService,
    private activatedRoute: ActivatedRoute,
    private guestRoomManagementService: GuestRoomManagmentService,
  ) { }


  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.UserID = this.sSOLoginDataModel.UserID;
    await this.GetGuestHouseNameList();
    await this.GetGuestHouseRoomAvailabilityData();
  }

  async GetGuestHouseNameList() {
    try {
      this.loaderService.requestStarted();

      let searchRequest: any = {}
      searchRequest.GuestHouseIDs = this.sSOLoginDataModel.GuestHouseID ?? '';
      await this.guestRoomManagementService.GetGuestHouseNameList(searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.GuestHouseNameList = data['Data'];
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

  async GetGuestHouseRoomAvailabilityData() {
    try {
      this.loaderService.requestStarted();
      let request: any = {}
      request.GuestHouseID = this.GuestHouseID
      request.GuestHouseIDs = this.sSOLoginDataModel.GuestHouseID ?? '';
      await this.guestRoomManagementService.GetGuestHouseRoomAvailabilityData(request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if(data.State === EnumStatus.Success) {
            this.RoomAvailabiltiesList = data.Data;
          } 
          
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
