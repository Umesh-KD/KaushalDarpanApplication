import { Component, OnInit, TemplateRef, ViewChild, Renderer2, ElementRef, Inject, PLATFORM_ID, signal, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { EnumDepartment, EnumEmitraService, EnumRole, GlobalConstants } from '../../../Common/GlobalConstants';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { LoaderService } from '../../../Services/Loader/loader.service';
/*import { MenuService } from '../../../Services/Menu/menu.service';*/
import { DOCUMENT, isPlatformBrowser, PlatformLocation } from '@angular/common';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { Idle, DEFAULT_INTERRUPTSOURCES } from "@ng-idle/core";
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';
import { MenuService } from '../../../Services/Menu/menu.service';
import { HttpClient } from '@angular/common/http';
import { AppsettingService } from '../../../Common/appsetting.service';
import { BreakpointObserver, Breakpoints, MediaMatcher } from '@angular/cdk/layout';
import { map, Subscription } from 'rxjs';
import { MenuByUserAndRoleWiseModel } from '../../../Models/MenuByUserAndRoleWiseModel';
import { RoleListRequestModel } from '../../../Models/RoleMasterDataModel';
import { RequestBaseModel } from '../../../Models/RequestBaseModel';  // new added 05082025
import { SSOLoginService } from '../../../Services/SSOLogin/ssologin.service';
declare var window: any;

//declare function CommonFileUpload(_http: any): any;

@Component({
  selector: 'master-layout-page',
  templateUrl: './master-layout.component.html',
  styleUrls: ['./master-layout.component.css'],
  standalone: false
})
export class MasterLayoutComponent implements OnInit {
  sSOLoginDataModel = new SSOLoginDataModel();
  UserName: any = '';
  public MenuHTML: any = "";
  public lstUserRole: any = []
  public lstAcedmicYear: any = []
  public RoleID: number = 0;
  public fileUpload: any = {};
  public folder: string = "test";
  public InstituteName: string = "";
  public _EnumRole = EnumRole;
  public HostelID: number = 0;
  public _EnumDepartment = EnumDepartment;


  public FinancialYearID: number = 0;
  public EndTermID: number = 0;
  public TermPart: number = 0;
  public DepartmentID: number = 0
  //Manage Session
  idleState = 'Not started.';
  timedOut = false;
  lastPing?: Date = undefined;
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  groupedMenuData: any;
  isBackdropVisible: boolean = false;
  isMobile$: any;
  searchTerm: string = '';
  filterMenuData!: any;
  isMobileSubscription: Subscription | undefined;
  @ViewChild('htmlElement') htmlElement!: ElementRef;
  @ViewChild('mymodalSessionExpired') mymodalSessionExpired: TemplateRef<any> | undefined;
  @ViewChild('appMenu', { static: false }) appMenu!: ElementRef;
  protected readonly isMobile = signal(true);
  private readonly _mobileQuery: MediaQueryList;
  private readonly _mobileQueryListener: () => void;
  public MultiHostelWardenRoleList: any = [];
  public _EnumEmitraService = EnumEmitraService
  public requestRoleList = new RoleListRequestModel();
  public SessionTypeID: number = 0;    // new added 05082025
  public RequestBaseSearchModel = new RequestBaseModel();

  constructor(private breakpointObserver: BreakpointObserver, private el: ElementRef, @Inject(DOCUMENT) private document: Document, @Inject(PLATFORM_ID) private platformId: Object, private router: Router, private loaderService: LoaderService,
    private sanitizer: DomSanitizer, location: PlatformLocation, private idle: Idle, private modalService: NgbModal, private commonFunctionService: CommonFunctionService,
    private cookieService: CookieService, private menuService: MenuService, private http: HttpClient, private appsettingConfig: AppsettingService, private renderer: Renderer2,
    private ssologin: SSOLoginService

  ) {
    location.onPopState(() => {
      console.log('pressed back in add!!!!!');
    });
    const media = inject(MediaMatcher);
    this._mobileQuery = media.matchMedia('(max-width: 600px)');
    this.isMobile.set(this._mobileQuery.matches);
    this._mobileQueryListener = () => this.isMobile.set(this._mobileQuery.matches);
    this._mobileQuery.addEventListener('change', this._mobileQueryListener);
  }

  trackItem(index: number, item: any): any {
    return item.EndTermID; // Track by EndTermID
  }

  tracklstUserRoleItem(index: number, item: any): any {
    return item.EndTermID; // Track by EndTermID
  }

  parseUrl(url: string) {
    if (!url) {
      return { path: '', queryParams: {} };  // Return empty values if URL is invalid
    }

    const [path, query] = url.split('?');
    const queryParams = query ? this.parseQueryParams(query) : {};
    return { path, queryParams };
  }

  parseQueryParams(query: string) {
    const params: { [key: string]: string } = {};
    const pairs = query.split('&');
    pairs.forEach(pair => {
      const [key, value] = pair.split('=');
      if (key && value) {
        params[key] = value;
      }
    });
    return params;
  }
  reset() {
    /*this.idle.watch();*/
    this.idleState = 'Started.';
    this.timedOut = false;
  }

  async ngOnInit() {
    setTimeout("preventBack()", 0);
    this.showActiveCurrentPage();
    // Observe if the screen is mobile
    this.isMobile$ = this.breakpointObserver.observe([Breakpoints.Handset]).pipe(
      map(result => result.matches)
    );

    // Subscribe to the mobile observable
    this.isMobileSubscription = this.isMobile$.subscribe((isMobile: any) => {
      const htmlElement = this.document.documentElement;
      if (isMobile) {
        this.renderer.addClass(htmlElement, 'sidenav-enable');
      } else {
        this.renderer.removeClass(htmlElement, 'sidenav-enable');
      }
    });

    //Added By rishi kapoor >> Manage Session

    let st = Number(this.appsettingConfig.SessionTime)
    this.idle.setIdle(st);
    // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
    this.idle.setTimeout(1);
    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
    this.idle.onIdleEnd.subscribe(() => (this.idleState = "No longer idle."));
    this.idle.onTimeout.subscribe(() => {
      //this.modalService.open('#mymodalSessionExpired', { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' });
      this.modalService.open(this.mymodalSessionExpired, { size: 'sm', centered: true, backdrop: 'static', keyboard: false });
      this.idleState = "Timed out!";
      sessionStorage.removeItem('userid');
      sessionStorage.removeItem('LoginID');
      sessionStorage.clear();
      localStorage.clear();
      this.timedOut = true;
    });
    //
    this.idle.onIdleStart.subscribe(
      () => (this.idleState = "You've gone idle!")
    );
    this.idle.onTimeoutWarning.subscribe(
      countdown =>
        (this.idleState = "You will time out in " + countdown + " seconds!")
    );
    //
    this.reset();
    //
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    console.log(this.sSOLoginDataModel);
    //
    if (this.sSOLoginDataModel == null) {
      await this.Logout();
    }
    else {
      if (this.sSOLoginDataModel.SSOID == null && this.sSOLoginDataModel.SSOID == '' && this.sSOLoginDataModel.SSOID == undefined) {
        await this.Logout();
      }
    }
    // set from session
    this.RoleID = this.sSOLoginDataModel.RoleID;
    this.FinancialYearID = this.sSOLoginDataModel.FinancialYearID;
    this.TermPart = this.sSOLoginDataModel.TermPart;
    this.HostelID = this.sSOLoginDataModel.HostelID;
    this.InstituteName = this.sSOLoginDataModel.InstituteName;
    this.SessionTypeID = this.sSOLoginDataModel.SelectedValue;
    await this.GetUserRoleList();

    if (this.sSOLoginDataModel.RoleID == this._EnumRole.HostelWarden || this.sSOLoginDataModel.RoleID == this._EnumRole.HostelWardenITINCVT || this.sSOLoginDataModel.RoleID == this._EnumRole.HostelWardenITISCVT) {
      await this.GetMultiHostel_WardenRole();
    }

    await this.GetAcedmicYearList();
    //manage case
    this.EndTermID = this.sSOLoginDataModel.EndTermID;
    //manage for iti
    if (this.sSOLoginDataModel.DepartmentID == EnumDepartment.ITI || this.sSOLoginDataModel.DepartmentID == EnumDepartment.BTER) {

      if (this.lstAcedmicYear?.length == 1 || this.sSOLoginDataModel.EndTermID == 0) {

        this.EndTermID = this.lstAcedmicYear[0].EndTermID;
        this.sSOLoginDataModel.EndTermID = this.EndTermID;
        this.sSOLoginDataModel.FinancialYearID = this.lstAcedmicYear[0].YearID;
        this.commonFunctionService.setsSOLoginDataModel(this.sSOLoginDataModel);
      }
    }
    await this.LoadMenu(this.sSOLoginDataModel.UserID, this.sSOLoginDataModel.RoleID);

    //call google translation
    if (isPlatformBrowser(this.platformId)) {
      if (typeof window.LoadData === 'function') {
        window.LoadData();

      }
    }
    await this.ChangeCSS();

    // Subscribe to the sSOLoginDataModel$ observable
    //this.userDataSubscription = this.commonFunctionService.sSOLoginDataModel$.subscribe(
    //  (data) => {
    //    this.GetAllData();  // Update the userData variable when the data changes
    //  }
    //);

    //this.DDLSessionTypeChange(2);
  }

  async ChangeRolenFY() {
    // set from session
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.RoleID = this.sSOLoginDataModel.RoleID;
    this.FinancialYearID = this.sSOLoginDataModel.FinancialYearID;
    this.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.TermPart = this.sSOLoginDataModel.TermPart;
    this.commonFunctionService.setsSOLoginDataModel(this.sSOLoginDataModel);
    // load
    await this.GetUserRoleList();
    await this.GetAcedmicYearList();
    await this.LoadMenu(this.sSOLoginDataModel.UserID, this.sSOLoginDataModel.RoleID);
    //call google translation
    if (isPlatformBrowser(this.platformId)) {
      if (typeof window.LoadData === 'function') {
        window.LoadData();

      }
    }
    await this.ChangeCSS();
    this.router.navigate(['/dashboard']).then(() => {
      window.location.reload();
    });
  }
  ngOnDestroy() {
    // Unsubscribe to prevent memory leaks
    if (this.isMobileSubscription) {
      this.isMobileSubscription.unsubscribe();
    }
    this._mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }

  CloseModelPoput() {
    this.modalService.dismissAll();
  }

  async GetUserRoleList() {
    try {
      this.loaderService.requestStarted();

      this.requestRoleList.SSOID = this.sSOLoginDataModel.SSOID;
      this.requestRoleList.RoleID = this.sSOLoginDataModel.RoleID;
      this.requestRoleList.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.requestRoleList.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.requestRoleList.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.requestRoleList.InstituteId = this.sSOLoginDataModel.InstituteID;

      await this.menuService.GetUserRoleList(this.requestRoleList)
        .then((RoleData: any) => {
          RoleData = JSON.parse(JSON.stringify(RoleData));
          this.lstUserRole = RoleData['Data'];
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);

    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 10);
    }
  }

  async GetAcedmicYearList() {
    try {
      this.loaderService.requestStarted();

      await this.menuService.GetAcedmicYearList(this.sSOLoginDataModel.RoleID, this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.SelectedValue)
        .then((AcedmicYear: any) => {
          AcedmicYear = JSON.parse(JSON.stringify(AcedmicYear));
          this.lstAcedmicYear = AcedmicYear['Data'];
          if (this.sSOLoginDataModel.DepartmentID == EnumDepartment.ITI) {
            //this.EndTermID = this.lstAcedmicYear[0].EndTermID;
            //this.sSOLoginDataModel.EndTermID = this.EndTermID;
            // this.sSOLoginDataModel.EndTermID = this.lstAcedmicYear[0].EndTermID;
            // this.sSOLoginDataModel.FinancialYearID = this.lstAcedmicYear[0].YearID;
            this.sSOLoginDataModel.EndTermID_Session = this.lstAcedmicYear[0].EndTermID_Session;
            this.sSOLoginDataModel.FinancialYearID_Session = this.lstAcedmicYear[0].FinancialYearID_Session;
            this.commonFunctionService.setsSOLoginDataModel(this.sSOLoginDataModel);
          }
          //this.loaderService.requestEnded();
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);

    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 10);
    }
  }

  // when role change
  async loadMenuByRoleID(SeletedUserId: any) {
    // filter by roleid
    debugger

    var r = this.lstUserRole.filter((x: any) => x.RoleID == this.RoleID)[0];
    this.sSOLoginDataModel.RoleID = this.RoleID;
    this.sSOLoginDataModel.InstituteID = r?.['InstituteID'];
    this.sSOLoginDataModel.InstituteName = r?.['InstituteName'];
    this.sSOLoginDataModel.Eng_NonEng = r?.['courseType']; //eng(1) / noneng(2)
    this.sSOLoginDataModel.OfficeID = r?.['OfficeID']; //eng(1) / noneng(2)
    this.sSOLoginDataModel.DistrictID = r?.['DistrictID']; //eng(1) / noneng(2)

    if (this.sSOLoginDataModel.FinancialYearID_Session > 0) {
      this.sSOLoginDataModel.FinancialYearID = this.sSOLoginDataModel.FinancialYearID_Session;
    }
    if (this.sSOLoginDataModel.EndTermID_Session > 0) {
      this.sSOLoginDataModel.EndTermID = this.sSOLoginDataModel.EndTermID_Session;
    }
    //session
    localStorage.setItem('SSOLoginUser', JSON.stringify(this.sSOLoginDataModel))
    //redirect
    //window.open('/dashboard', "_self");
    console.log(this.sSOLoginDataModel, "SOLoginDataModel")
    await this.ChangeRolenFY()

  }

  // when year change
  async LoadByFYYearDDL() {
    // filter by endtermid
    debugger;
    var r = this.lstAcedmicYear.filter((x: any) => x.EndTermID == this.EndTermID)[0];
    this.sSOLoginDataModel.FinancialYearID = r?.YearID;
    this.sSOLoginDataModel.EndTermID = r?.EndTermID;
    this.sSOLoginDataModel.TermPart = r?.TermPart;

    this.sSOLoginDataModel.HostelID = this.HostelID;
    this.sSOLoginDataModel.IsMutiHostelWarden = false;
    //session
    localStorage.setItem('SSOLoginUser', JSON.stringify(this.sSOLoginDataModel))
    //redirect
    console.log(this.sSOLoginDataModel, "sso")
    //window.open('/dashboard', "_self");
    await this.ChangeRolenFY()
  }

  groupMenuItems(menuItems: any[]) {
    if (!Array.isArray(menuItems)) {
      console.error("The provided menuItems is not an array.");
      return;
    }
    const groupedData: any[] = [];
    menuItems.forEach((item) => {
      if (item.ParentId === 0) {
        groupedData.push({ ...item, children: [] });
      }
    });
    menuItems.forEach((item) => {
      if (item.ParentId !== 0) {
        const parent = groupedData.find((parent) => parent.MenuId === item.ParentId);
        if (parent) {
          parent.children.push(item);
        } else {
          console.warn(`Parent with MenuId ${item.ParentId} not found for item ${item.MenuName}`);
        }
      }
    });
    this.groupedMenuData = groupedData;
  }

  //old
  //js_SubMenu(event: any): void {
  //  const clickedElement = event.target;
  //  const parentLi = clickedElement.closest('li');
  //  if (parentLi) {
  //    parentLi.classList.add('showChildMenu');
  //    const allLis = this.el.nativeElement.querySelectorAll('li');
  //    allLis.forEach((li: HTMLElement) => {
  //      if (li !== parentLi) {
  //        li.classList.remove('showChildMenu');
  //      }
  //    });
  //  }
  //  this.showActiveCurrentPage();
  //}

  //new
  js_SubMenu(event: any): void {
    const clickedElement = event.target;
    const parentLi = clickedElement.closest('li');

    if (parentLi) {
      const isAlreadyOpen = parentLi.classList.contains('showChildMenu');

      // Close all open submenus
      const allLis = this.el.nativeElement.querySelectorAll('li');
      allLis.forEach((li: HTMLElement) => li.classList.remove('showChildMenu'));

      // Toggle the clicked menu
      if (!isAlreadyOpen) {
        parentLi.classList.add('showChildMenu');
      }
    }

    this.showActiveCurrentPage();
  }


  js_SubMenuActive(event: any): void {
    const clickedElement = event.target;
    const parentLi = clickedElement.closest('.menu-item');
    if (parentLi) {
      const allLis = this.el.nativeElement.querySelectorAll('li');

      allLis.forEach((li: HTMLElement) => {
        li.classList.remove('showChildMenu');
      });
      parentLi.classList.add('showChildMenu');
    }
    const child = clickedElement.closest('.sub-menu');;
    if (child) {
      const allLis = this.el.nativeElement.querySelectorAll('.sub-menu');
      allLis.forEach((a: HTMLElement) => {
        a.classList.remove('active');
      });
      child.classList.add('active');
    }
  }

  toggleMenu(event: any): void {
    const bodyElement = this.document.body;
    const htmlElement = this.document.documentElement;
    const isOverflowHidden = bodyElement.style.overflow === 'hidden';
    if (isOverflowHidden) {
      this.renderer.setStyle(bodyElement, 'overflow', '');
      this.isMobile$.subscribe((isMobile: any) => {
        const htmlElement = this.document.documentElement;
        if (!isMobile) {
          this.renderer.setAttribute(htmlElement, 'data-sidebar-view', 'default');
        } else {
          const backdropElement = this.renderer.createElement('div');
          this.renderer.setAttribute(backdropElement, 'id', 'app-menu-backdrop');
          this.renderer.setAttribute(backdropElement, 'data-hs-overlay-backdrop-template', '');
          this.renderer.setStyle(backdropElement, 'z-index', '59');
          this.renderer.setStyle(backdropElement, 'position', 'fixed');
          this.renderer.setStyle(backdropElement, 'top', '0');
          this.renderer.setStyle(backdropElement, 'left', '0');
          this.renderer.setStyle(backdropElement, 'right', '0');
          this.renderer.setStyle(backdropElement, 'bottom', '0');
          this.renderer.setStyle(backdropElement, 'background-color', 'rgba(0, 0, 0, 0.5)');
          this.renderer.setStyle(backdropElement, 'opacity', '0.5');
          this.renderer.addClass(backdropElement, 'hs-overlay-backdrop');
          this.renderer.appendChild(bodyElement, backdropElement);
          this.renderer.listen(backdropElement, 'click', () => this.onBackdropClick());
        }
      });
    } else {
      this.renderer.setStyle(bodyElement, 'overflow', 'hidden');
      this.isMobile$.subscribe((isMobile: any) => {
        const htmlElement = this.document.documentElement;
        if (!isMobile) {
          this.renderer.setAttribute(htmlElement, 'data-sidebar-view', 'hidden');
        } else {
          const backdropElement = this.renderer.createElement('div');
          this.renderer.setAttribute(backdropElement, 'id', 'app-menu-backdrop');
          this.renderer.setAttribute(backdropElement, 'data-hs-overlay-backdrop-template', '');
          this.renderer.setStyle(backdropElement, 'z-index', '59');
          this.renderer.setStyle(backdropElement, 'position', 'fixed');
          this.renderer.setStyle(backdropElement, 'top', '0');
          this.renderer.setStyle(backdropElement, 'left', '0');
          this.renderer.setStyle(backdropElement, 'right', '0');
          this.renderer.setStyle(backdropElement, 'bottom', '0');
          this.renderer.setStyle(backdropElement, 'background-color', 'rgba(0, 0, 0, 0.5)');
          this.renderer.setStyle(backdropElement, 'opacity', '0.5');
          this.renderer.addClass(backdropElement, 'hs-overlay-backdrop');
          this.renderer.appendChild(bodyElement, backdropElement);
          this.renderer.listen(backdropElement, 'click', () => this.onBackdropClick());
        }
      });
    }
    if (this.appMenu && this.appMenu.nativeElement) {
      const appMenuElement = this.appMenu.nativeElement;
      appMenuElement.classList.toggle('hidden');
      appMenuElement.classList.toggle('open');
    }
  }

  onBackdropClick() {
    const bodyElement = this.document.body;
    const menuElement = this.el.nativeElement.querySelector('#app-menu');
    if (this.isBackdropVisible) {
      this.renderer.setStyle(bodyElement, 'overflow', 'hidden');
      if (menuElement) {
        this.renderer.addClass(menuElement, 'open');
        this.renderer.removeClass(menuElement, 'hidden');
      }
    } else {
      this.renderer.removeStyle(bodyElement, 'overflow');
      const backdropElement = this.document.getElementById('app-menu-backdrop');
      if (backdropElement) {
        this.renderer.removeChild(bodyElement, backdropElement);
      }
      if (menuElement) {
        this.renderer.removeClass(menuElement, 'open');
        this.renderer.addClass(menuElement, 'hidden');
      }
    }
  }

  profileDropdown(event: any): void {
    const clickedElement = event.target;
    const dropdownContainer = clickedElement.closest('.hs-dropdown');
    if (dropdownContainer) {
      dropdownContainer.classList.toggle('open');
    }
    const dropdownMenu = dropdownContainer?.querySelector('.hs-dropdown-menu');
    if (dropdownMenu) {
      dropdownMenu.classList.toggle('open');
      dropdownMenu.classList.toggle('hidden');
    }
  }

  showActiveCurrentPage(): void {
    const pageName = window.location.href.split('/')[window.location.href.split('/').length - 1];
    const sanitizedPageName = pageName.replace(/#/g, '');
    setTimeout(() => {
      const adminMenu = this.el.nativeElement.querySelector('.admin-menu');
      if (!adminMenu) {
        console.error('Admin menu not found.');
        return;
      }
      const allLinks = adminMenu.querySelectorAll('a');
      allLinks.forEach((link: HTMLAnchorElement) => {
        this.renderer.removeClass(link, 'active');
      });
      let activeLink!: HTMLElement;
      allLinks.forEach((link: HTMLAnchorElement) => {
        const linkHref = link.getAttribute('href');
        const linkRouterLink = link.getAttribute('routerLink');
        if (linkHref && linkHref.includes(sanitizedPageName)) {
          activeLink = link;
        } else if (linkRouterLink && linkRouterLink.includes(sanitizedPageName)) {
          activeLink = link;
        }
      });
      if (activeLink) {
        this.renderer.addClass(activeLink, 'active');
        let parentLi = activeLink.closest('.menu-item');

        if (parentLi) {
          this.renderer.addClass(parentLi, 'showChildMenu');
          parentLi = parentLi.closest('.menu-item');
        }
      }
    }, 500);
  }

  filteredItems() {
    if (this.searchTerm && this.filterMenuData.Data) {
      return this.filterMenuData.Data.filter((menu: { MenuName: string; }) =>
        menu.MenuName.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  //for the Icon
  isValidMaterialIcon(icon: string | undefined | null): boolean {
    if (!icon) return false;
    const lowerIcon = icon.toLowerCase().trim();
    const invalidPatterns = [
      "ti ",
      "fa ",
      "itifee",
      "ti-",
      "fa-",
      "#"
    ];

    return !invalidPatterns.some(pattern => lowerIcon.startsWith(pattern));
  }


  //Load Menu
  async LoadMenu(UserID: number, RoleID: number) {
    try {
      let model: MenuByUserAndRoleWiseModel = {
        DepartmentID: this.sSOLoginDataModel.DepartmentID,
        Eng_NonEng: this.sSOLoginDataModel.Eng_NonEng,
        EndTermID: this.sSOLoginDataModel.EndTermID,
        RoleID: RoleID,
        UserID: UserID,
        InstituteId: this.sSOLoginDataModel.InstituteID
      };
      //
      await this.menuService.MenuUserandRoleWise(model)
        .then((MenuData: any) => {
          MenuData = JSON.parse(JSON.stringify(MenuData));
          this.filterMenuData = MenuData;
          localStorage.setItem('Menu', JSON.stringify(this.filterMenuData.Data));
          if (MenuData != null) {
            this.groupMenuItems(MenuData['Data']);
          }
        }, error => console.error(error));
    }

    catch (Ex) {
      console.log(Ex);
    }
  }

  async Logout() {
    console.log("Logout...");
    sessionStorage.removeItem('userid');
    sessionStorage.removeItem('LoginID');
    sessionStorage.clear();
    localStorage.clear();
    this.cookieService.set('LoginStatus', "");
    this.cookieService.deleteAll();
    try {

      this.modalService.dismissAll();
      if (this.sSOLoginDataModel.RoleID == 3 && this.sSOLoginDataModel.DepartmentID == 1) {
        this.router.navigate(['/dtepublicinfo']);
      } else
        if (this.appsettingConfig.IsLocal == true) {
          this.router.navigate(['/login']);
        }
        else {
          //window.location.href = 'https://sso.rajasthan.gov.in/'
          window.location.replace('https://sso.rajasthan.gov.in/');
        }
      // await this.loaderService.requestStarted();
      //await this.menuService.SSOLogout(this.appsettingConfig.BacktoSSOURL_Logout?.toString());
    }
    catch (Ex) {
      console.log(Ex);

    }
  }

  async BackToSSO() {
    console.log("BAck to SSO...");
    sessionStorage.removeItem('userid');
    sessionStorage.removeItem('LoginID');
    sessionStorage.clear();
    localStorage.clear();
    try {
      this.loaderService.requestStarted();
      await this.menuService.BackToSSO(this.appsettingConfig.BacktoSSOURL?.toString());
      this.modalService.dismissAll();
    }
    catch (Ex) {
      console.log(Ex);

    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 100);
    }
  }

  async btnOk() {
    //this.BackToSSO();
    await this.Logout();
  }

  showChildMenu(elem: HTMLElement): void {
    const listItems = document.querySelectorAll('li');
    listItems.forEach(item => item.classList.remove('showChildMenu'));

    let parent = elem.closest('li');
    if (parent) {
      parent.classList.add('showChildMenu');
    }
  }


  ChangeCSS() {

    this.applyCSSClassBasedOnRole(this.DepartmentID);
  }
  private applyCSSClassBasedOnRole(DepartmentID: number) {
    this.renderer.removeClass(document.body, 'ITIPortal');
    this.renderer.removeClass(document.body, 'BTER');
    if (DepartmentID == 2) {
      this.renderer.addClass(document.body, 'ITIPortal');
    }
    else {
      this.renderer.addClass(document.body, 'BTER');
    }

  }


  async GetMultiHostel_WardenRole() {





    try {
      this.loaderService.requestStarted();

      await this.commonFunctionService.GetMultiHostel_WardenDetails(this.sSOLoginDataModel.SSOID, this.sSOLoginDataModel.RoleID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.MultiHostelWardenRoleList = data['Data'];
          console.log('GetMultiHostel_WardenDetailList', this.MultiHostelWardenRoleList)
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

  async BackToSSOButton() {
    await this.Logout();
  }

  // new added 05082025
  async DDLSessionTypeChange(TypeID: number) {
    console.log("SessionTypeID", TypeID);
    debugger;
    this.sSOLoginDataModel.SelectedValue = TypeID;
    this.commonFunctionService.setsSOLoginDataModel(this.sSOLoginDataModel);
    await this.loadMenuByRoleID(0);
    if (TypeID == 2)
    {
      this.sSOLoginDataModel.EndTermID = this.lstAcedmicYear[0].EndTermID;
      this.sSOLoginDataModel.FinancialYearID = this.lstAcedmicYear[0].YearID;
      this.commonFunctionService.setsSOLoginDataModel(this.sSOLoginDataModel);
    }

    //if (TypeID == 1 || TypeID == 2)
    //{

    //  this.loaderService.requestStarted();
    //  try {
    //    this.RequestBaseSearchModel.DepartmentID = this.sSOLoginDataModel.DepartmentID
    //    this.RequestBaseSearchModel.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng
    //    this.RequestBaseSearchModel.Eng_NonEng = this.sSOLoginDataModel.RoleID
    //    this.RequestBaseSearchModel.Eng_NonEng = this.sSOLoginDataModel.RoleID
    //    this.RequestBaseSearchModel.SessionTypeID = TypeID 


    //    await this.ssologin.GetAcadmicYearListBySessionTypeID(this.RequestBaseSearchModel)
    //      .then((data: any) => {
    //        debugger;
    //        data = JSON.parse(JSON.stringify(data));
    //        if (data.Data.length > 0) {
    //          this.lstAcedmicYear = data['Data']
    //          this.EndTermID = this.lstAcedmicYear[0].EndTermID;
    //          this.sSOLoginDataModel.EndTermID = this.lstAcedmicYear[0].EndTermID;
    //          this.sSOLoginDataModel.FinancialYearID = this.lstAcedmicYear[0].YearID;
    //          this.sSOLoginDataModel.SelectedValue = TypeID;
    //          this.sSOLoginDataModel.EndTermID_Session = this.lstAcedmicYear[0].EndTermID_Session;
    //          this.sSOLoginDataModel.FinancialYearID_Session = this.lstAcedmicYear[0].FinancialYearID_Session;
    //          this.commonFunctionService.setsSOLoginDataModel(this.sSOLoginDataModel);
    //          console.log("Get Data from DDL SessionTypeID Change", data['Data']);
    //          this.router.navigate(['/dashboard']);
    //          //this.LoadByFYYearDDL();
    //          //this.router.navigate(['/dashboard']).then(() => {
    //          //  window.location.reload();
    //          //});
    //          //this.MultiHostelWardenRoleList = data['Data'];
    //        }
    //        else
    //        {
    //          this.lstAcedmicYear = [];
    //          console.log("Get Data from DDL SessionTypeID Change", data['Data']);
    //        }


    //      }, (error: any) => console.error(error)
    //      );


    //  } catch (ex) {
    //    console.log(ex);
    //  }
    //  finally {
    //    setTimeout(() => {
    //      this.loaderService.requestEnded();
    //    }, 200);
    //  }

    //}
  }
}

