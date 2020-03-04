import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DanielInfoComponent } from './daniel-info.component';

describe('DanielInfoComponent', () => {
  let component: DanielInfoComponent;
  let fixture: ComponentFixture<DanielInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DanielInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DanielInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
