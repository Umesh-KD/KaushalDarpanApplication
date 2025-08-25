import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnlockApplicationFormComponent } from './unlock-application-form.component';

describe('UnlockApplicationFormComponent', () => {
  let component: UnlockApplicationFormComponent;
  let fixture: ComponentFixture<UnlockApplicationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnlockApplicationFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnlockApplicationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
