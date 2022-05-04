import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeoerrorComponent } from './geoerror.component';

describe('GeoerrorComponent', () => {
  let component: GeoerrorComponent;
  let fixture: ComponentFixture<GeoerrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeoerrorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeoerrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
