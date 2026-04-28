import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EMAddTrainingDetailsComponent } from './em-add-training-details.component';

describe('EMAddTrainingDetailsComponent', () => {
  let component: EMAddTrainingDetailsComponent;
  let fixture: ComponentFixture<EMAddTrainingDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EMAddTrainingDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EMAddTrainingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
