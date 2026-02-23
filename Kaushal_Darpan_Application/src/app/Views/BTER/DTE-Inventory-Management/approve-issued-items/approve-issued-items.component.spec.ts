import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveIssuedItemsComponent } from './approve-issued-items.component';

describe('ApproveIssuedItemsComponent', () => {
  let component: ApproveIssuedItemsComponent;
  let fixture: ComponentFixture<ApproveIssuedItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApproveIssuedItemsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApproveIssuedItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
