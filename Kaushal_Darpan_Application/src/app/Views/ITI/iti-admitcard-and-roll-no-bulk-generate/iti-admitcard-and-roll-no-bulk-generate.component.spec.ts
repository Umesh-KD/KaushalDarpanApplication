import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITIAdmitcardAndRollNoBulkGenerateComponent } from './iti-admitcard-and-roll-no-bulk-generate.component';

describe('ITIAdmitcardAndRollNoBulkGenerateComponent', () => {
  let component: ITIAdmitcardAndRollNoBulkGenerateComponent;
  let fixture: ComponentFixture<ITIAdmitcardAndRollNoBulkGenerateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ITIAdmitcardAndRollNoBulkGenerateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ITIAdmitcardAndRollNoBulkGenerateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
