import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITIAdminUserComponent } from './itiadmin-user.component';

describe('ITIAdminUserComponent', () => {
  let component: ITIAdminUserComponent;
  let fixture: ComponentFixture<ITIAdminUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ITIAdminUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ITIAdminUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
