import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTheoryMarksUpdateComponent } from './admin-theory-marks-update.component';

describe('AdminTheoryMarksUpdateComponent', () => {
  let component: AdminTheoryMarksUpdateComponent;
  let fixture: ComponentFixture<AdminTheoryMarksUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminTheoryMarksUpdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminTheoryMarksUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
