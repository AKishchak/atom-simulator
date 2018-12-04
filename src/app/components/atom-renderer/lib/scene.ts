import {Configurable} from './Configurable';
import {Atom, AtomProps} from './atom';

export interface SceneProps {
    type?: string;
    container: Element;
    delay: number;
    increment: number;
    polygon: {
        fillColor: string;
        size: {
            width: number;
            height: number;
        }
    };
    atomProps: AtomProps;
    // '$scope': self.$scope
}

export class Scene extends Configurable<SceneProps> {
    private atom: Atom;
    protected atomProps: AtomProps;

    private timer: {
        intervalPointer: any,
        intervalCounter: number
    };

    constructor(config: SceneProps) {
        super();
        this.configuration = config;
        this.timer = {
            intervalCounter: 0,
            intervalPointer: null
        };
    }

    updateAtomSettings(settings: AtomProps) {
        this.atom.smartConfigApply(settings);
        this.configuration.atomProps = settings;
    }

    initialize() {
        this.atom = new Atom(this.configuration.atomProps);
        this.atom.initialize();

        this.refreshContext();
        this.setupHandlers();
        this.refreshContext();
        this.timer.intervalCounter = 0;
    }

    refreshContext() {
        if (!this.atom) { return; }
        const canvasTemplate = '<canvas width=\'#W#\' height=\'#H#\'></canvas>';
        const height = this.configuration.container.clientHeight;
        const width = this.configuration.container.clientWidth;
        const html = canvasTemplate
            .replace('#W#', width.toString())
            .replace('#H#', height.toString());

        // this.configuration.container.empty();
        this.configuration.container.innerHTML = html;

        const canvas = <HTMLCanvasElement>
            this.configuration.container.getElementsByTagName('canvas')[0];

        this.atom.setContext(canvas.getContext('2d'), width, height);
    }

    setupHandlers() {
        window.addEventListener('resize', () => {
            this.onWindowResize();
        });
    }

    onWindowResize() {
        this.refreshContext();
    }

    getAtom() {
        return this.atom;
    }

    randomizeOrbits() {
        if (!this.atom) { return; }
        this.atom.resetOrbits();
    }

    run() {
        this.timer.intervalPointer = setInterval(() => {
            this.timer.intervalCounter += this.configuration.increment / 1000;
            this.atom.recalculate(this.timer.intervalCounter);
            this.atom.redraw();
        }, this.configuration.delay);
    }

    pause() {
        clearInterval(this.timer.intervalPointer);
    }
}
