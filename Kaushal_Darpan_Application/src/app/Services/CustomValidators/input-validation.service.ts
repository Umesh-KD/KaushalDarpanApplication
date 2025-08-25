import { formatDate, DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class InputValidationService {
  constructor(private datePipe: DatePipe,) { }
  keyPressNumbers(event: any) {
    var charCode = (event.which) ? event.which : event.keyCode;
    // Only Numbers 0-9
    if ((charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }
  keyPressNumbersWithDecimal(event: any) {
    var charCode = (event.which) ? event.which : event.keyCode;
    if (charCode != 46 && charCode > 31
      && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    }
    return true;
  }
  keyPressNumbersWithDecimalWithMins(event: any) {
    var charCode = (event.which) ? event.which : event.keyCode;
    if (charCode != 46 && charCode > 31
      && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    }
    return true;
  }
  keyPressAlphanumeric(event: any) {
    var inp = String.fromCharCode(event.keyCode);
    if (/[a-zA-Z0-9]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
  CoustomRountOff(Amount: string) {
    var valueInt: number = Number(Amount);
    if (Amount.includes(".")) {
      var InputValue: string[]
      InputValue = Amount.split('.');
      valueInt = Number(InputValue[0]); //before
      var value = Number(InputValue[1]); //after
      if (value >= 50) {
        valueInt = Number(valueInt) + 1;
      }
    }
    return valueInt;
  }
  public ConvertDateToLocalFormat(DateValue: string) {
    if (DateValue.length > 10) {
      DateValue = DateValue.substring(0, 11);
    }
    //var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    if ((DateValue.includes("Jan")) ||
      DateValue.includes("Feb") ||
      DateValue.includes("Mar") ||
      DateValue.includes("May") ||
      DateValue.includes("Jun") ||
      DateValue.includes("Jul") ||
      DateValue.includes("Aug") ||
      DateValue.includes("Sep") ||
      DateValue.includes("Oct") ||
      DateValue.includes("Nov") ||
      DateValue.includes("Dec")) {
      DateValue = DateValue.replace("/", "-").replace("-", "/").replace("-", "/");
    }
    DateValue = DateValue.replace(' ', '').replace('T', '');
    let myFormattedDate = '';
    if (moment(DateValue, 'DD/MM/YYYY').isValid()) {
      if (DateValue.split("/")[0].length == 4) {
        myFormattedDate = DateValue.split("/")[0] + "/" + DateValue.split("/")[1] + "/" + DateValue.split("/")[2];
      }
      else {
        myFormattedDate = DateValue.split("/")[2] + "-" + DateValue.split("/")[1] + "-" + DateValue.split("/")[0];      
      }
    }
    else if (moment(DateValue, 'DD-MM-YYYY').isValid()) {
      myFormattedDate = DateValue.split("-")[0] + "-" + DateValue.split("-")[1] + "-" + DateValue.split("-")[2];
    }
    else {
      myFormattedDate = formatDate(DateValue, 'yyyy-MM-dd', 'en-IN');
    }
    return myFormattedDate;
  }
}
