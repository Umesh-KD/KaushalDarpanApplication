import { Injectable } from "@angular/core";
import Swal from 'sweetalert2';
import  {Router} from '@angular/router';


@Injectable({
  providedIn: 'root'
})

export class SweetAlert2 {


   constructor(
      private Router: Router
    ) { }
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
      position: "center",
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

  showRedirectMessage(message: string, route: string, timer: number = 3000) {
   Swal.fire({
    title: message,
    icon: 'warning',
    position: 'center',
    timer: timer,
    timerProgressBar: true,
    showConfirmButton: false
  }).then(() => {
    this.Router.navigate([route]);
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

public async ConfirmationWithOrderDetails(
  title: string,
  callback: (data: any) => void,
  confirmButtonText: string = 'Save'
) {

  const { value, isConfirmed } = await Swal.fire({
    title,
    width: '700px',
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText: 'Cancel',
    allowOutsideClick: false,

    html: `
<div style="text-align:left; font-size:13px;">

  <!-- Order No & Order Date -->
  <div style="display:flex; gap:10px; margin-bottom:10px;">

    <div style="flex:1;">
      <label style="font-weight:600;">
        Order No <span class="StarMarking">*</span>
      </label>
      <input
        id="OrderNo"
        placeholder="Enter Order No"
        style="
          width:100%;
          height:34px;
          padding:6px 10px;
          margin-top:4px;
          border:1px solid #d1d5db;
          border-radius:6px;
          outline:none;
          box-sizing:border-box;
        "
      />
    </div>

    <div style="flex:1;">
      <label style="font-weight:600;">
        Order Date <span class="StarMarking">*</span>
      </label>
      <input
        id="OrderDate"
        type="date"
        style="
          width:100%;
          height:34px;
          padding:6px 10px;
          margin-top:4px;
          border:1px solid #d1d5db;
          border-radius:6px;
          outline:none;
          box-sizing:border-box;
        "
      />
    </div>

  </div>

  <!-- Remark -->
  <div>
    <label style="font-weight:600;">
      Remark <span class="StarMarking">*</span>
    </label>
    <textarea
      id="Remark"
      placeholder="Enter Remark"
      style="
        width:100%;
        height:80px;
        padding:6px 10px;
        margin-top:4px;
        border:1px solid #d1d5db;
        border-radius:6px;
        outline:none;
        resize:none;
        box-sizing:border-box;
      "
    ></textarea>
  </div>

</div>
`,


    preConfirm: () => {

      const OrderNo = (
        document.getElementById('OrderNo') as HTMLInputElement
      )?.value?.trim();

      const OrderDate = (
        document.getElementById('OrderDate') as HTMLInputElement
      )?.value;

      const Remark = (
        document.getElementById('Remark') as HTMLTextAreaElement
      )?.value?.trim();

      // if (!OrderNo) {
      //   Swal.showValidationMessage('Order No is required');
      //   return false;
      // }

      // if (!OrderDate) {
      //   Swal.showValidationMessage('Order Date is required');
      //   return false;
      // }

      // if (!Remark) {
      //   Swal.showValidationMessage('Remark is required');
      //   return false;
      // }

      return {
        OrderNo,
        OrderDate,
        Remark
      };
    }
  });

  if (isConfirmed && value) {
    callback(value);
  }
}

}
