import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItiAddPerYearFeesComponent } from './iti-add-per-year-fees.component';

describe('ItiAddPerYearFeesComponent', () => {
  let component: ItiAddPerYearFeesComponent;
  let fixture: ComponentFixture<ItiAddPerYearFeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItiAddPerYearFeesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItiAddPerYearFeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
