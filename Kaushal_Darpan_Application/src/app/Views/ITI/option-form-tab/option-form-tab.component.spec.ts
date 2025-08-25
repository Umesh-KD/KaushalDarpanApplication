import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionFormTabComponent } from './option-form-tab.component';

describe('OptionFormTabComponent', () => {
  let component: OptionFormTabComponent;
  let fixture: ComponentFixture<OptionFormTabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OptionFormTabComponent]
    });
    fixture = TestBed.createComponent(OptionFormTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
