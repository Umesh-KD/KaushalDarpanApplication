import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenumerationAccountsComponent } from './renumeration-accounts.component';

describe('RenumerationAccountsComponent', () => {
  let component: RenumerationAccountsComponent;
  let fixture: ComponentFixture<RenumerationAccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RenumerationAccountsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RenumerationAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
