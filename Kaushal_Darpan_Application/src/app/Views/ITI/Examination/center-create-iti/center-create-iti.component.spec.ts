import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CenterCreateITIComponent } from './center-create-iti.component';

describe('CenterCreateITIComponent', () => {
  let component: CenterCreateITIComponent;
  let fixture: ComponentFixture<CenterCreateITIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CenterCreateITIComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CenterCreateITIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
