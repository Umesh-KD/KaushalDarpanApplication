import { Component, OnInit } from '@angular/core';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { CompanyMasterService } from '../../Services/CompanyMaster/company-master.service.ts';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../Services/Loader/loader.service';
import { CompanyMasterSearchModel, ICompanyMasterDataModel } from '../../Models/CompanyMasterDataModel';
import { SweetAlert2 } from '../../Common/SweetAlert2';
import * as XLSX from 'xlsx';
import { ActivatedRoute, Router } from '@angular/router';
import { TableColumn } from '../../../app/Common/data-table/DatatableModels/table-column.model';
import { TableConfig } from '../../Common/data-table/DatatableModels/table-config.model';
import { ActionType } from '../../Common/data-table/DatatableModels/table-action.model';
import { AppsettingService } from '../../Common/appsetting.service';

@Component({
    selector: 'app-dynamic-table-master',
    templateUrl: './dynamic-table-master.component.html',
    styleUrls: ['./dynamic-table-master.component.css'],
    standalone: false
})

export class DynamicTableMasterComponent implements OnInit {
  public CompanyMasterList: ICompanyMasterDataModel[] = [];
  public Table_SearchText: string = "";
  public searchRequest = new CompanyMasterSearchModel();
  public sSOLoginDataModel = new SSOLoginDataModel();
  public ApprovedStatus: string = "0";
  //public columns:TableColumn[]=[];

  constructor(private commonMasterService: CommonFunctionService, private companyMasterService: CompanyMasterService,
    private toastr: ToastrService, private loaderService: LoaderService, private Swal2: SweetAlert2, private Router: Router, private router: ActivatedRoute,public appsettingConfig: AppsettingService,) {

  }

// -------------------------------------------------------dynamic table portion---------------------------------------------------------------------

tableConfig: TableConfig = {

  // serverSide: true,

  showSerialNo: true,

  showSearch: true,

  showPagination: true,

  pageSize: 10,

  pageSizeOptions: [10, 20, 50, 100],

  noDataMessage: 'No Company Found',

  // ----------Example1 for columns-------------Mixed Table---------------

//   columns: [

//     'Name',

//     'Website',

//     'Address'

// ]


  // ----------Example2 for columns-------------Mixed Table---------------
  

//   columns: [
//     'Name',
//     'Website',
//     {
//         dataField: 'Status',
//         type: 'badge'
//     },
//     {
//         dataField: 'CreatedDate',
//         type: 'date'
//     }
// ]

  // ----------Example3 for columns-------------Fully Customized---------------

//   columns: [

//     {
//         dataField: 'Name',
//         width: '250px',
//         formatter: (value) => value.toUpperCase()
//     },

//     {
//         dataField: 'Website',
//         type: 'link'
//     }

// ]

// ------------Example 4 for Column-----------------------------

  columns: [

    {
        dataField: 'CompanyPhoto',

        type: 'image',

        imageConfig: {

            // basePath: environment.imageUrl + '/CompanyLogo/',
            basePath: this.appsettingConfig.StaticFileRootPathURL ,

            width: 40,

            height: 40,

            borderRadius: 'circle'

        }

    },

    
    // //------------- Example 1 for image field --------Local Asset--------

  //  {
  //       dataField: 'Photo',
  //       type: 'image'
  //   },

  
    // //------------- Example 2 for image field --------Server Upload Folder--------

    // {
    //     dataField: 'Photo',

    //     type: 'image',

    //     imageConfig: {

    //         basePath: 'https://localhost:5001/uploads/'

    //     }
    // },


    // //------------- Example 3 for image field ------Dynamic Resolver----------

    // {
    //     dataField: 'Photo',

    //     type: 'image',

    //     imageConfig: {

    //         resolver: (row) => {

    //             return row.IsStudent
    //                 ? '/student/' + row.Photo
    //                 : '/staff/' + row.Photo;

    //         }

    //     }
    // },


    
    {
      dataField: 'Name',
      displayField: 'Company Name',
      // type: 'text',
      // sortable: true,
      // width: '80px',
      // align: 'center',
      // formatter:(value,row)=>{
      //   return value + ' (' + row.ID + ')';  //FORMATER EXAMPLE: company name + ID
      // }
      //ellipsis:true,
     // maxLength:40      
    },

    {
      dataField: 'Website',
      displayField: 'Website',
      // type: 'link',
      // sortable: true
    },

    {
      dataField: 'Address',
      displayField: 'Address',
      // type: 'text'
    },

    {
      dataField: 'Status',
      displayField: 'Status',
      type: 'badge',
      // align: 'center'
    },

  ],

  badgeConfig: [
    {
      value:'Approved',
      cssClass:'approved',
      icon:'ti ti-circle-check',
      text:'Approveddd'
    },


    {
      value: 'Pending',
      cssClass: 'pending',
      icon:'ti ti-clock'
    },

    {
      value: 'Rejected',
      cssClass: 'rejected',
      icon:'ti ti-close'
    }

  ],

  actions: [

    {

      action:'edit',
      label:'Edit',
      icon:'ti ti-pencil',
      type: ActionType.Router,
      visible:(row)=>row.Status=='Pending',
      disabled:(row)=>row.IsLocked,
      cssClass:(row)=>{
          return row.Status=='Rejected'
          ?'text-danger'
          :'text-primary';
      },
      tooltip:(row)=>{
          return row.Status=='Rejected'
          ?'Cannot Edit'
          :'Edit';

      },
      routerLink: (row) => {
        return '/AddCompany';
      },
      queryParams: (row) => {
        return {
          CompanyID: row.ID,
          key: 2
        };

      },

    },

    {
      action: 'delete',

      label: 'Delete',

      icon: 'ti ti-trash',

      type: ActionType.Button,

      visible: row => row.Status === 'Pending'

    },

    {
      action: 'view',

      label: 'View',

      icon: 'ti ti-eye',

      type: ActionType.Router,

      //----------------------------------------- Example 1 routerlink-queryparam-------------------------------------------------------
      // routerLink: row => {
      //     switch(row.Status){
      //         case 'Pending':
      //             return '/Student/Edit';
      //         case 'Approved':
      //             return '/Student/View';
      //         case 'Rejected':
      //             return '/Student/History';
      //         default:
      //             return '/Student';
      //     }
      // },

          // Example 1
    // queryParams: row => ({
    //     CompanyID: row.ID,
    //     key: row.Status === 'Approved' ? 1 : 2,
    //     flag: row.Status === 'Approved'
    // }),


      // ---------------------------------------Example2: another example for router link and query params--------------------------------
      // routerLink: (row) => {

      //   if (row.Status === 'Approved') {
      //     return '/ViewCompany';
      //   }

      //   return '/AddCompany';

      // },


    // Example2:
    //   queryParams: (row) => {
    //   if (row.Status === 'Approved') {
    //     return {
    //       CompanyID: row.ID,
    //       flag: 1
    //     };
    //   }
    //   return {
    //     CompanyID: row.ID,
    //     key: 2
    //   };

    // },

    // ----------------------------------------Example 3: to use routerlink - queryparam--------------------------------------------------------------------

     routerLink: (row) => {
        return '/AddCompany';
      },
      queryParams: (row) => {
        return {
          CompanyID: row.ID,
          key: 2,
          flag:1
        };

      },


      visible: row => row.Status === 'Approved'

    }

  ]

};

// ----------------------------------------------------------dynamic table portion-----------------------------------------------------



  async ngOnInit() {
    
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    await this.GetAllData();
  }


  exportToExcel(): void {
    const unwantedColumns = [
      'TransctionStatusBtn', 'ActiveStatus', 'DeleteStatus', 'CreatedBy', 'ModifyBy', 'ModifyDate', 'IPAddress',
      'TotalRecords', 'DepartmentID', 'CourseType', 'AcademicYearID', 'EndTermID'
    ];
    const filteredData = this.CompanyMasterList.map((item: any) => {
      const filteredItem: any = {};
      Object.keys(item).forEach(key => {
        if (!unwantedColumns.includes(key)) {
          filteredItem[key] = item[key];
        }
      });
      return filteredItem;
    });
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'CompanyMasterListData.xlsx');
  }

  async GetAllData() {
    try {
      this.searchRequest.ModifyBy = this.sSOLoginDataModel.UserID
        this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID
        this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.loaderService.requestStarted();
      await this.companyMasterService.GetAllData(this.searchRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.CompanyMasterList = data.Data;
        console.log(this.CompanyMasterList)
      }, (error: any) => console.error(error))
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

  // get all data
  async ClearSearchData() {
    this.searchRequest.Name = '';
    this.searchRequest.Status = '';

    await this.GetAllData();
  }




  async DeleteById(ID: number) {
    debugger
    this.Swal2.Confirmation("Do you want to delete?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          try {
            //Show Loading
            this.loaderService.requestStarted();

            await this.companyMasterService.DeleteById(ID, this.sSOLoginDataModel.UserID)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));
                console.log(data);

                if (data.State) {
                  this.toastr.success(data.Message)
                  await this.GetAllData();
                }
                else {
                  this.toastr.error(data.ErrorMessage)
                }

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
      });
  }

  // ------------------------------------------dynamic table portion----------------------------

  tableAction(event:any){
debugger
    switch(event.action){

        // case 'edit':
        //     // this.editCompany(event.row);
        //     break;

        case 'delete':
            this.DeleteById(event.row.ID);
            break;

        // case 'view':
        //     // this.viewCompany(event.row);
        //     break;

    }

}


  // ------------------------------------------dynamic table portion----------------------------
}
