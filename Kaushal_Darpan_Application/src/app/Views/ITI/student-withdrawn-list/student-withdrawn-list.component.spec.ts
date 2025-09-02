import { ComponentFixture, TestBed } from '@angular/core/testing';
import { studentwithdrawnlistComponent } from './student-withdrawn-list.component';

describe('AllotmentReportCollegeComponent', () => {
  let component: studentwithdrawnlistComponent;
  let fixture: ComponentFixture<studentwithdrawnlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [studentwithdrawnlistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(studentwithdrawnlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
