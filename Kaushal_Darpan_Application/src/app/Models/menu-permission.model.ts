export interface MenuPermission { 
    MenuId: number; 
    ParentId: number; 
    MenuName: string; 
    LevelNo: number; 
    GroupId: number; 
    OnSelect: string; 
    Icon: string; 
    IDdd: string; 
    GroupId_Count: number; 
    IsMobileMenu: boolean; 
    Priority: number; 

    U_View: boolean; 
    U_Add: boolean; 
    U_Update: boolean; 
    U_Delete: boolean; 
}