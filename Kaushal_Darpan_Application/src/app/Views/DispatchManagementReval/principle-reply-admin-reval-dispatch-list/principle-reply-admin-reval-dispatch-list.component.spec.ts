import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrincipleReplyAdminRevalDispatchListComponent } from './principle-reply-admin-reval-dispatch-list.component';

describe('PrincipleReplyAdminRevalDispatchListComponent', () => {
  let component: PrincipleReplyAdminRevalDispatchListComponent;
  let fixture: ComponentFixture<PrincipleReplyAdminRevalDispatchListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrincipleReplyAdminRevalDispatchListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrincipleReplyAdminRevalDispatchListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
