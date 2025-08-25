import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddItiIMCFundComponent } from './add-imc-fund.component';

describe('AddItiIMCFundComponent', () => {
  let component: AddItiIMCFundComponent;
  let fixture: ComponentFixture<AddItiIMCFundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddItiIMCFundComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddItiIMCFundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
