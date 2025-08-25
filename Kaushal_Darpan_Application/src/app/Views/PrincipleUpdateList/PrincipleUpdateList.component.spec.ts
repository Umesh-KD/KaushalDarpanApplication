import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrincipleListComponent } from './PrincipleList.Component';

describe('BridgeCourseComponent', () => {
  let component: PrincipleListComponent;
  let fixture: ComponentFixture<PrincipleListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrincipleListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrincipleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
