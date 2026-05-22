import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMasterOfficeWiseComponent } from './user-master-office-wise.component';

describe('UserMasterOfficeWiseComponent', () => {
  let component: UserMasterOfficeWiseComponent;
  let fixture: ComponentFixture<UserMasterOfficeWiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserMasterOfficeWiseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserMasterOfficeWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
