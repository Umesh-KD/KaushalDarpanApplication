import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewStaffProfileModalComponent } from './view-staff-profile-modal.component';

describe('ViewStaffProfileModalComponent', () => {
  let component: ViewStaffProfileModalComponent;
  let fixture: ComponentFixture<ViewStaffProfileModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewStaffProfileModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewStaffProfileModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
