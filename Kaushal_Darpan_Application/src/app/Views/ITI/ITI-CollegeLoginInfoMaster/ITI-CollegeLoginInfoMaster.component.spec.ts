import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITICollegeLoginInfoMasterComponent } from './ITI-CollegeLoginInfoMaster.component';

describe('ListItiTradeComponent', () => {
  let component: ITICollegeLoginInfoMasterComponent;
  let fixture: ComponentFixture<ITICollegeLoginInfoMasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ITICollegeLoginInfoMasterComponent]
    });
    fixture = TestBed.createComponent(ITICollegeLoginInfoMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
