import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndustryTrainingListComponent } from './IndustryTraining-list.component';

describe('IndustryTrainingListComponent', () => {
  let component: IndustryTrainingListComponent;
  let fixture: ComponentFixture<IndustryTrainingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IndustryTrainingListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndustryTrainingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
