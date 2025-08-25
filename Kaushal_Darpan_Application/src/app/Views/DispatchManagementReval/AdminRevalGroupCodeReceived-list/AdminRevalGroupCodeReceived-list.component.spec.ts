import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRevalGroupCodeReceivedlistComponent } from './AdminRevalGroupCodeReceived-list.component';

describe('DispatchPrincipalGroupCodeListComponent', () => {
  let component: AdminRevalGroupCodeReceivedlistComponent;
  let fixture: ComponentFixture<AdminRevalGroupCodeReceivedlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminRevalGroupCodeReceivedlistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminRevalGroupCodeReceivedlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
