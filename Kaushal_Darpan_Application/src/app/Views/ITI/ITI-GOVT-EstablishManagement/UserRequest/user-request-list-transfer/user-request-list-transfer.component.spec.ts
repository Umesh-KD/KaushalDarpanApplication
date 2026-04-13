import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRequestListTransferComponent } from './user-request-list-transfer.component';

describe('UserRequestListTransferComponent', () => {
  let component: UserRequestListTransferComponent;
  let fixture: ComponentFixture<UserRequestListTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserRequestListTransferComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserRequestListTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
