import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Report23Component } from './report23.component';

describe('Report23Component', () => {
  let component: Report23Component;
  let fixture: ComponentFixture<Report23Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Report23Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Report23Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
