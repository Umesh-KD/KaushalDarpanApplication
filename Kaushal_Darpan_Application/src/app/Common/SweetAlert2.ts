import { Injectable } from "@angular/core";
import Swal from 'sweetalert2';


@Injectable({
  providedIn: 'root'
})

export class SweetAlert2 {

  public Confirmation(message: string, callBack: Function, confirmButtonText?: string, showCancelButton: boolean = true) {
    Swal.fire({
      //title: message,
      html: message,
      icon: "warning",
      showCancelButton: showCancelButton,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      allowOutsideClick: false,
      confirmButtonText: confirmButtonText ?? "Yes"
    }).then((result) => {
      return callBack(result);
    });

  }

  public ConfirmationSuccess(message: string, callBack: Function, confirmButtonText?: string, showCancelButton: boolean = true) {
    Swal.fire({
      //title: message,
      html: message,
      icon: "success",
      showCancelButton: showCancelButton,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      allowOutsideClick: false,
      confirmButtonText: confirmButtonText ?? "Yes"
    }).then((result) => {
      return callBack(result);
    });

  }


  public Success(message: string) {
    Swal.fire({
      //title: "Success",
      html: message,
      icon: "success",
      confirmButtonColor: "#3085d6",
    })
  }

  public Error(message: string) {
    Swal.fire({
      //title: "Error",
      html: message,
      icon: "error",
      confirmButtonColor: "#3085d6",
    })
  }

  public Warning(message: string) {
    Swal.fire({
      //title: "Warning",
      html: message,
      icon: "warning",
      confirmButtonColor: "#3085d6",
    })
  }

  public Info(message: string) {
    Swal.fire({
      //title: "Info",
      html: message,
      icon: "info",
      confirmButtonColor: "#3085d6",
    })
  }

  public SuccessTimer(message: string) {
    Swal.fire({
      position: "top-end",
      icon: "success",
      //title: "Success",
      html: message,
      showConfirmButton: false,
      timer: 1500
    });
  }

  public ErrorTimer(message: string) {
    Swal.fire({
      position: "top-end",
      icon: "error",
      //title: "Error",
      html: message,
      showConfirmButton: false,
      timer: 1500
    });
  }

  public WarningTimer(message: string) {
    Swal.fire({
      position: "top-end",
      icon: "warning",
      //title: "Warning",
      html: message,
      showConfirmButton: false,
      timer: 1500
    });
  }

  public InfoTimer(message: string) {
    Swal.fire({
      position: "top-end",
      icon: "info",
      //title: "Info",
      html: message,
      showConfirmButton: false,
      timer: 1500
    });
  }

  public ConfirmationWithSelect(message: string,callBack: Function,confirmButtonText?: string) {
    Swal.fire({
      html: message,
      icon: "warning",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: confirmButtonText ?? "Yes",
      input: "select",
      inputOptions: {
        '1': 'BTER',
        '2': 'ITI',
      },
      inputPlaceholder: "Select Department",
      showCancelButton: true,
      allowOutsideClick: false,
      inputValidator: (value) => {
        if (!value) {
          return "Please select a department!";
        }
        return "";
      },
    }).then((result) => {
      return callBack(result.value);
    });
  }


  public async ConfirmationWithRemark(
    title: string,
    callback: (remark: string) => void,
    confirmButtonText: string = 'Save Remark'
  ) {
    const { value, isConfirmed } = await Swal.fire({
      title: title,
      input: 'textarea',
      inputLabel: 'Remark',
      inputPlaceholder: 'Enter your remark here...',
      inputAttributes: {
        'aria-label': 'Type your remark here',
      },
      showCancelButton: true,
      confirmButtonText: confirmButtonText,
      cancelButtonText: 'Cancel',
      preConfirm: (value) => {
        const remark = (value || '').toString().trim();
        if (!remark) {
          Swal.showValidationMessage('Remark is required');
          return false;
        }
        return remark;
      },
    });

    const remark = (value || '').toString().trim();
    if (isConfirmed && remark) {
      callback(remark);
    }
  }




}
