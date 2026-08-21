import { Injectable } from '@angular/core';
import { MenuPermission } from '../../Models/menu-permission.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class MenuPermissionService {
  
  /** * MenuId -> Permission * * Example: * 182 -> { * CanView: true, * CanAdd: true, * CanUpdate: false, * CanDelete: false * } */
  private permissionsByMenuId = new Map<number, MenuPermission>();

  /** * URL -> MenuId * * Example: * * BTERSeatIntakesList -> 182 */
  private menuIdByUrl = new Map<string, number>();

  constructor( 
    private router: Router, 
  ) {}

  
  /** * Call this once after menu API returns data. */ 
  setPermissions(menus: MenuPermission[]): void { 
    this.permissionsByMenuId.clear(); 
    this.menuIdByUrl.clear(); 
    menus.forEach(menu => { 
      // Store MenuId -> Permission 
      this.permissionsByMenuId.set( menu.MenuId, menu ); 
      // Store URL -> MenuId 
      if (menu.OnSelect) { 
        const url = this.normalizeUrl(menu.OnSelect); 
        if (url) { 
          this.menuIdByUrl.set( url, menu.MenuId ); 
        } 
      } 
    }); 
  } 
  /** * Get permission using MenuId. */ 
  getPermission( menuId: number ): MenuPermission | undefined { 
    return this.permissionsByMenuId.get(menuId); 
  } 
  /** * Get MenuId using URL. */ 
  getMenuIdByUrl( url: string ): number | undefined { 
    return this.menuIdByUrl.get( this.normalizeUrl(url) ); 
  } 
  /** * Get permission using URL. */ 
  getPermissionByUrl( url: string ): MenuPermission | undefined { 
    const menuId = this.getMenuIdByUrl(url); 
    if (menuId === undefined) { 
      return undefined; 
    } return this.getPermission(menuId); 
  } 
  /** * Get current MenuId. */ 
  getCurrentMenuId(): number | undefined { 
    return this.getMenuIdByUrl( this.router.url ); 
  } 
  /** * Get current page permission. */ 
  getCurrentPermission(): MenuPermission | undefined {
    debugger;
    return this.getPermissionByUrl( this.router.url ); 
  } 
  /** * Individual permission checks. */ 
  IsView(menuId: number): boolean { 
    return this.permissionsByMenuId.get(menuId) ?.U_View ?? false; 
  } 
  
  IsAdd(menuId: number): boolean { 
    return this.permissionsByMenuId.get(menuId) ?.U_Add ?? false; 
  } 
  
  IsUpdate(menuId: number): boolean { 
    return this.permissionsByMenuId.get(menuId) ?.U_Update ?? false; 
  } 
  
  IsDelete(menuId: number): boolean { 
    return this.permissionsByMenuId.get(menuId) ?.U_Delete ?? false; 
  } 
  
  /** * Normalize URLs so that: * * /BTERSeatIntakesList * * and * * BTERSeatIntakesList/ * * are treated as the same URL. */ 
  private normalizeUrl(url: string): string { 
    debugger;
    if (!url) { 
      return ''; 
    } 
    return url .split('?')[0] .split('#')[0] .replace(/^\/+/, '') .replace(/\/+$/, '') .toLowerCase(); 
  }
}
