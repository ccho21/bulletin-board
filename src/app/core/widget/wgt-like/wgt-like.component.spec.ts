import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WgtLikeComponent } from './wgt-like.component';

describe('WgtLikeComponent', () => {
  let component: WgtLikeComponent;
  let fixture: ComponentFixture<WgtLikeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WgtLikeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WgtLikeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
