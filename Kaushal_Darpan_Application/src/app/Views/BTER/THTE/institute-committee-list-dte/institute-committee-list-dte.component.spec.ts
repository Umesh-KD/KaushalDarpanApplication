import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstituteCommitteeListDTEComponent } from './institute-committee-list-dte.component';

describe('InstituteCommitteeListDTEComponent', () => {
  let component: InstituteCommitteeListDTEComponent;
  let fixture: ComponentFixture<InstituteCommitteeListDTEComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstituteCommitteeListDTEComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstituteCommitteeListDTEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
