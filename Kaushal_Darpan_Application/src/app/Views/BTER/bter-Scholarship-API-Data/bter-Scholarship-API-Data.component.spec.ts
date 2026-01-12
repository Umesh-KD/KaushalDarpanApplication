import { ComponentFixture, TestBed } from '@angular/core/testing';

import { bterScholarshipAPIDataComponent } from './bter-Scholarship-API-Data.component';

describe('bterScholarshipAPIDataComponent', () => {
  let component: bterScholarshipAPIDataComponent;
  let fixture: ComponentFixture<bterScholarshipAPIDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [bterScholarshipAPIDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(bterScholarshipAPIDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
