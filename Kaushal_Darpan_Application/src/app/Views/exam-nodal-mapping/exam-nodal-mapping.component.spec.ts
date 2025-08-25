import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamNodalMappingComponent } from './exam-nodal-mapping.component';

describe('ExamNodalMappingComponent', () => {
  let component: ExamNodalMappingComponent;
  let fixture: ComponentFixture<ExamNodalMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExamNodalMappingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamNodalMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
