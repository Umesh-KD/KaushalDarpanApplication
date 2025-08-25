import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EMPrincipleStaffComponent } from './em-principle-staff.component';

describe('EMPrincipleStaffComponent', () => {
  let component: EMPrincipleStaffComponent;
  let fixture: ComponentFixture<EMPrincipleStaffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EMPrincipleStaffComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EMPrincipleStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
