import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GeoerrorComponent } from './geoerror/geoerror.component';
import { TerminalComponent } from './terminal/terminal.component';

const routes: Routes = [
  {
    path: '',
    component: TerminalComponent
  },
  {
    path: 'geo-error',
    component: GeoerrorComponent
  }, 
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  declarations: [
    AppComponent,
    GeoerrorComponent,
    TerminalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(routes),
  ],
  exports: [
    RouterModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
