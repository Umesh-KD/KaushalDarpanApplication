import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITIInventoryManagementDashboardComponent } from './dteinventory-management-dashboard.component';

describe('ITIInventoryManagementDashboardComponent', () => {
  let component: ITIInventoryManagementDashboardComponent;
  let fixture: ComponentFixture<ITIInventoryManagementDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ITIInventoryManagementDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ITIInventoryManagementDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
