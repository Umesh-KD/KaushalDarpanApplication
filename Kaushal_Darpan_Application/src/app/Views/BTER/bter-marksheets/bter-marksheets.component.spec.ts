import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BterMarksheetsComponent } from './bter-marksheets.component';

describe('BterMarksheetsComponent', () => {
  let component: BterMarksheetsComponent;
  let fixture: ComponentFixture<BterMarksheetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BterMarksheetsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BterMarksheetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
