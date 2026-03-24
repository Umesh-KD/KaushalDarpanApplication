import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScholarshipGetDataComponent } from './scholarship-get-data.component';

describe('ScholarshipGetDataComponent', () => {
  let component: ScholarshipGetDataComponent;
  let fixture: ComponentFixture<ScholarshipGetDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScholarshipGetDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScholarshipGetDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
