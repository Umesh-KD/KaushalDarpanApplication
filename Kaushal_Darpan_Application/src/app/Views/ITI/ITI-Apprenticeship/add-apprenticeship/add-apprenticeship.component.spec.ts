import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddApprenticeshipComponent } from './add-apprenticeship.component';

describe('AddApprenticeshipComponent', () => {
  let component: AddApprenticeshipComponent;
  let fixture: ComponentFixture<AddApprenticeshipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddApprenticeshipComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddApprenticeshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
