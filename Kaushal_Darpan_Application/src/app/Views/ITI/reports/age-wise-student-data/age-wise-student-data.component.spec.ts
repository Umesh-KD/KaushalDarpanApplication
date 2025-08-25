import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgeStudentDataComponent } from './age-wise-student-data.component';

describe('AgeStudentDataComponent', () => {
  let component: AgeStudentDataComponent;
  let fixture: ComponentFixture<AgeStudentDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AgeStudentDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgeStudentDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
