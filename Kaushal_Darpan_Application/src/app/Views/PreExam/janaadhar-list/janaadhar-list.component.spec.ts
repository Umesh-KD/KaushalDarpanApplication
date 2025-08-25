import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JanaadharListComponent } from './janaadhar-list.component';

describe('JanaadharListComponent', () => {
  let component: JanaadharListComponent;
  let fixture: ComponentFixture<JanaadharListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JanaadharListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JanaadharListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
