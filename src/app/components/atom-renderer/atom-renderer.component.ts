import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { AtomProps } from './lib/atom';
import {Scene, SceneProps} from './lib/scene';
import { observe } from 'rxjs-observe';
import {Observable} from 'rxjs';

class SomeObservable {

    private _story: string;
    get story(): string { return this._story; }
    set story(story: string) {
        this._story = story;
        console.log('Update detected');
    }
}

@Component({
    selector: 'app-atom-renderer',
    templateUrl: './atom-renderer.component.html',
    styleUrls: ['./atom-renderer.component.scss']
})
export class AtomRendererComponent implements OnInit, AfterViewInit {
    @ViewChild('settingsForm') settingsForm;

    settings: AtomProps;
    sceneProps: SceneProps;
    scene: Scene;
    paused = false;
    showPreferences: boolean;

    sliders = {
        speed: {
            floor: 1,
            ceil: 250,
            step: 0.0001
        },
        camera: {
            floor: 0,
            ceil: Math.PI * 2,
            step: 0.1,
            hideLimitLabels: true
        },
        electrons: {
            floor: 1,
            ceil: 100,
            step: 1
        },
        tracing: {
            floor: 1,
            ceil: 100,
            step: 1
        },
        stretch: {
            floor: 0,
            ceil: 2,
            step: 0.1,
        }
    };

    observable: any;

    constructor() {
        const settings = new AtomProps({
            count: 20,
            coreDepth: 2,
            stretchX: 0.7,
            stretchY: 1.3,
            rotate: 1,
            front: 0,
        });

        const { observables, proxy} = observe(settings);
        this.settings = proxy;
        this.observable = observables;
        this.showPreferences = true;
    }

    ngOnInit() {
        this.sceneProps = {
            container: document.getElementsByClassName('polygon')[0],
            delay: 25,
            increment: 90,
            polygon: {
                fillColor: '#C3BFAD',
                size: {
                    width: 400,
                    height: 500
                }
            },
            atomProps: this.settings
        };

        this.scene = new Scene(this.sceneProps);
        this.scene.initialize();
        this.scene.randomizeOrbits();
        this.scene.run();

        Object.keys(this.settings).forEach((key) => {
            this.observable[key].subscribe(() => {
                this.scene.updateAtomSettings(this.settings);
            });
        });
    }

    randomize_orbits() {
        this.scene.randomizeOrbits();
    }

    ngAfterViewInit() {}

    togglePause() {
        this.paused = !this.paused;
        this.paused ? this.scene.pause() : this.scene.run();
    }
}
