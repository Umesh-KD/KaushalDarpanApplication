import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITIFeesPerYearListComponent } from './itifees-per-year-list.component';

describe('ITIFeesPerYearListComponent', () => {
  let component: ITIFeesPerYearListComponent;
  let fixture: ComponentFixture<ITIFeesPerYearListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ITIFeesPerYearListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ITIFeesPerYearListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
