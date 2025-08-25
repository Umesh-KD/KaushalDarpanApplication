import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollegeLoginInfoMasterComponent } from './college-login-info-master.component';

describe('CollegeLoginInfoMasterComponent', () => {
  let component: CollegeLoginInfoMasterComponent;
  let fixture: ComponentFixture<CollegeLoginInfoMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CollegeLoginInfoMasterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollegeLoginInfoMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
