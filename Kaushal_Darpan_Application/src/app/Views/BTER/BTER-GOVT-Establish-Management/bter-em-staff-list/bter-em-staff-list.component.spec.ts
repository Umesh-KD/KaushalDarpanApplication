import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BTEREMStaffListComponent } from './bter-em-staff-list.component';

describe('BTEREMStaffListComponent', () => {
  let component: BTEREMStaffListComponent;
  let fixture: ComponentFixture<BTEREMStaffListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BTEREMStaffListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BTEREMStaffListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
