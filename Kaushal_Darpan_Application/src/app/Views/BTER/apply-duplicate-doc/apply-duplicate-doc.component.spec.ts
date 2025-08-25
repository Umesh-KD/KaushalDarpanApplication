import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyDuplicateDocComponent } from './apply-duplicate-doc.component';

describe('ApplyDuplicateDocComponent', () => {
  let component: ApplyDuplicateDocComponent;
  let fixture: ComponentFixture<ApplyDuplicateDocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApplyDuplicateDocComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplyDuplicateDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
