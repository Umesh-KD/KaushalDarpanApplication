import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITICollegeProfileComponent } from './iti-college-profile.component';

describe('ITICollegeProfileComponent', () => {
  let component: ITICollegeProfileComponent;
  let fixture: ComponentFixture<ITICollegeProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ITICollegeProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ITICollegeProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
