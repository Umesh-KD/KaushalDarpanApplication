import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollegeHostelDetailsComponent } from './CollegeHostelDetailsComponent';

describe('CollegeHostelDetailsComponent', () => {
  let component: CollegeHostelDetailsComponent;
  let fixture: ComponentFixture<CollegeHostelDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollegeHostelDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollegeHostelDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
