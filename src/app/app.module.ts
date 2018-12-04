import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AtomRendererComponent } from './components/atom-renderer/atom-renderer.component';
import { MainComponent } from './components/main/main.component';
import { Ng5SliderModule } from 'ng5-slider';

@NgModule({
    declarations: [
        AppComponent,
        AtomRendererComponent,
        MainComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        Ng5SliderModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
