import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITIDirectprivateApplicationFormTabComponent } from './iti-direct-private-application-form-tab.component';

describe('ITIDirectprivateApplicationFormTabComponent', () => {
  let component: ITIDirectprivateApplicationFormTabComponent;
  let fixture: ComponentFixture<ITIDirectprivateApplicationFormTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ITIDirectprivateApplicationFormTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ITIDirectprivateApplicationFormTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
