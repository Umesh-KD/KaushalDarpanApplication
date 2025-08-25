import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyForHostelComponent } from './apply-for-hostel.component';

describe('ApplyForHostelComponent', () => {
  let component: ApplyForHostelComponent;
  let fixture: ComponentFixture<ApplyForHostelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApplyForHostelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplyForHostelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
