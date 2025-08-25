import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BridgeCourseComponent } from './bridge-course.component';

describe('BridgeCourseComponent', () => {
  let component: BridgeCourseComponent;
  let fixture: ComponentFixture<BridgeCourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BridgeCourseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BridgeCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
