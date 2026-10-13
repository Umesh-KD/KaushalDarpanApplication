import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatedEmailTemplateComponent } from './updated-email-template.component';

describe('UpdatedEmailTemplateComponent', () => {
  let component: UpdatedEmailTemplateComponent;
  let fixture: ComponentFixture<UpdatedEmailTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdatedEmailTemplateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdatedEmailTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
