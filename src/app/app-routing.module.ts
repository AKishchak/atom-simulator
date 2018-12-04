import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AtomRendererComponent } from './components/atom-renderer/atom-renderer.component';
import { MainComponent } from './components/main/main.component';

const routes: Routes = [
    {
        path: '',
        component: MainComponent
    },
    {
        path: 'atom',
        component: AtomRendererComponent
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
