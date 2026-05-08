import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTheoryMarksUpdateRevalComponent } from './admin-theory-marks-update-reval.component';

describe('AdminTheoryMarksUpdateRevalComponent', () => {
  let component: AdminTheoryMarksUpdateRevalComponent;
  let fixture: ComponentFixture<AdminTheoryMarksUpdateRevalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminTheoryMarksUpdateRevalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminTheoryMarksUpdateRevalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
