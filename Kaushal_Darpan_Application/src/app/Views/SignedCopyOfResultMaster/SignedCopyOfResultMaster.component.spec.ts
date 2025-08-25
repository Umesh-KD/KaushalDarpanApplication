import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignedCopyOfResultMasterComponent } from './SignedCopyOfResultMaster.component';

describe('SignedCopyOfResultMasterComponent', () => {
  let component: SignedCopyOfResultMasterComponent;
  let fixture: ComponentFixture<SignedCopyOfResultMasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SignedCopyOfResultMasterComponent]
    });
    fixture = TestBed.createComponent(SignedCopyOfResultMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
