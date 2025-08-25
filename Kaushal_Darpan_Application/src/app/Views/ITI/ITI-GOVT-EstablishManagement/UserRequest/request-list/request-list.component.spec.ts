import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRequestListComponent } from './request-list.component';

describe('ITIGovtEMZonalOfficeMasterComponent', () => {
  let component: UserRequestListComponent;
  let fixture: ComponentFixture<UserRequestListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserRequestListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserRequestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
