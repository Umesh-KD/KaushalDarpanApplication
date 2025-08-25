import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalPracticalRptViewComponent } from './internal-practical-rpt-view.component';

describe('InternalPracticalRptViewComponent', () => {
  let component: InternalPracticalRptViewComponent;
  let fixture: ComponentFixture<InternalPracticalRptViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InternalPracticalRptViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InternalPracticalRptViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
