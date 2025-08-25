import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollegeListAdminLevelComponent } from './CollegeListAdminLevel.component';

describe('CollegeListAdminLevelComponent', () => {
  let component: CollegeListAdminLevelComponent;
  let fixture: ComponentFixture<CollegeListAdminLevelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CollegeListAdminLevelComponent]
    });
    fixture = TestBed.createComponent(CollegeListAdminLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
