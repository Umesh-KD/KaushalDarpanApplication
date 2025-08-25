import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITIDirectApplicationFormTabComponent } from './iti-direct-application-form-tab.component';

describe('ITIDirectApplicationFormTabComponent', () => {
  let component: ITIDirectApplicationFormTabComponent;
  let fixture: ComponentFixture<ITIDirectApplicationFormTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ITIDirectApplicationFormTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ITIDirectApplicationFormTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
