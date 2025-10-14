import { ComponentFixture, TestBed } from '@angular/core/testing';

import { THTEPrincipleApplicationListComponent } from './thte-principle-application-list.component';

describe('THTEPrincipleApplicationListComponent', () => {
  let component: THTEPrincipleApplicationListComponent;
  let fixture: ComponentFixture<THTEPrincipleApplicationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [THTEPrincipleApplicationListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(THTEPrincipleApplicationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
