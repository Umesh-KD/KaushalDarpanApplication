import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentStatusHistoryComponent } from './student-status-history.component';

describe('StudentStatusHistoryComponent', () => {
  let component: StudentStatusHistoryComponent;
  let fixture: ComponentFixture<StudentStatusHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentStatusHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentStatusHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
