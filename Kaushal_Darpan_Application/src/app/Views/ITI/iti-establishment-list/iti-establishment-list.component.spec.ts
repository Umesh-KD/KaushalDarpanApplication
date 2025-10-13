import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItiEstablishmentListComponent } from './iti-establishment-list.component';

describe('ItiEstablishmentListComponent', () => {
  let component: ItiEstablishmentListComponent;
  let fixture: ComponentFixture<ItiEstablishmentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItiEstablishmentListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItiEstablishmentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
