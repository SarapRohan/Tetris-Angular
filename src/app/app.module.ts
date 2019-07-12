import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GridComponent } from './grid/grid.component';
import { TileComponent } from './tile/tile.component';
import { OverlayComponent } from './overlay/overlay.component';
import { MatDialogModule, MatButtonModule, MatCardModule, MatInputModule } from '@angular/material';
import { RightComponent } from './right/right.component';
import { LeftComponent } from './left/left.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GameOverComponent } from './game-over/game-over.component';
import { PauseComponent } from './pause/pause.component';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/compiler/src/core';

@NgModule({
  declarations: [
    AppComponent,
    GridComponent,
    TileComponent,
    OverlayComponent,
    RightComponent,
    LeftComponent,
    GameOverComponent,
    PauseComponent,
  ],
  exports: [
    PauseComponent,
    GameOverComponent,
    OverlayComponent
  ],
  entryComponents: [
    PauseComponent,
    GameOverComponent,
    OverlayComponent
  ],
  imports: [
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatDialogModule,
    MatCardModule,
    MatButtonModule,
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
