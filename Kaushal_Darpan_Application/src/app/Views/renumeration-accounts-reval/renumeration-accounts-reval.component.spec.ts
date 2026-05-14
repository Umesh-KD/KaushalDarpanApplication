import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenumerationAccountsRevalComponent } from './renumeration-accounts-reval.component';

describe('RenumerationAccountsRevalComponent', () => {
  let component: RenumerationAccountsRevalComponent;
  let fixture: ComponentFixture<RenumerationAccountsRevalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RenumerationAccountsRevalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RenumerationAccountsRevalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
