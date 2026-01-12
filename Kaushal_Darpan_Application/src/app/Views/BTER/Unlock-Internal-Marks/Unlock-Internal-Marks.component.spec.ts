import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnlockInternalMarksComponent } from './Unlock-Internal-Marks.component';

describe('UnlockInternalMarksComponent', () => {
  let component: UnlockInternalMarksComponent;
  let fixture: ComponentFixture<UnlockInternalMarksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UnlockInternalMarksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnlockInternalMarksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
