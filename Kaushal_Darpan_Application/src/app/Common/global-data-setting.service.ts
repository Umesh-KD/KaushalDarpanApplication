import { Injectable } from '@angular/core';
import { InputValidationService } from 'app/services/CustomValidators/input-validation.service';
 

@Injectable({
  providedIn: 'root'
})
export class GlobalDataSettingService {

  constructor(private inputValidationService: InputValidationService,) { }

  public yearID: number;
  public fYear: string;
  public startDate: string;
  public endDate: string;
  public currentDate: string;


  set YearID(value: number) {
    this.yearID = value
  }
  get YearID(): number {
    return this.yearID;
  }

  set FYear(value: string) {
    this.fYear = value
  }
  get FYear(): string {
    return this.fYear;
  }

  set StartDate(value: string) {
    this.startDate = value
  }
  get StartDate(): string {
    return this.startDate;
  }

  set EndDate(value: string) {
    this.endDate = value
  }
  get EndDate(): string {
    return this.endDate;
  }

  set CurrentDate(value: string) {
    this.currentDate = value
  }
  get CurrentDate(): string {
    return this.currentDate;
  }


  public async FixedDepositAccountPayment(EnputDate: any) {
    console.log(this.StartDate);
    this.StartDate = this.inputValidationService.ConvertDateToLocalFormat(this.StartDate);
    this.EndDate = this.inputValidationService.ConvertDateToLocalFormat(this.EndDate);

    if ((EnputDate >= this.StartDate) && (EnputDate <= this.EndDate)) {
      return true;
    }
    else {
      return false;
    }
  }
}
