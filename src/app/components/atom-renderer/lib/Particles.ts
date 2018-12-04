import {Configurable} from './Configurable';
import * as _ from 'lodash';

export interface Point {
    X: number;
    Y: number;
}

export interface ParticleSettings {
    point: {
        X: number;
        Y: number;
    };
    initialRadius?: number;
    depth?: number;
    rotation?: number;
    color?: string;
    pathOffset?: number;
    radius: number;
}

export interface ElectronSettings extends ParticleSettings {
    angle: number;
    orbitRadius: number;
    tracing: boolean;
    tracingLength: number;
    isTrajectory?: boolean;
}

export class MovingObject<T extends ParticleSettings> extends Configurable<T> {
    public rotateMatrix: any[];
    constructor() {
        super();
        this.rotateMatrix = [];
    }

    draw(context: CanvasRenderingContext2D): void {
        throw new Error('Not implemented');
    }

    generateRotateMatrix() {
        this.rotateMatrix = [Math.cos(this.configuration.rotation), Math.sin(this.configuration.rotation)];
    }
}



export class Electron extends MovingObject<ElectronSettings> {
    private tracingPaths: any[];

    static cloneTrace(obj: Electron) {
        if (null == obj || typeof obj !== 'object') {
            return obj;
        }

        let copy = _.cloneDeep(obj);
        copy.configuration = Object.assign(copy.configuration, {
            isTrajectory: true,
            pathOffset: obj.configuration.pathOffset + 50
        });
        copy.configuration.tracingLength = 0;
        delete copy.tracingPaths;
        return copy;
    }

    constructor(settings: ElectronSettings) {
        super();
        this.applyConfig(settings);
        this.generateRotateMatrix();
        this.tracingPaths = [];
    }

    draw(context: CanvasRenderingContext2D) {
        if (!this.configuration.isTrajectory &&
            this.configuration.tracing && this.configuration.tracingLength !== 1) {
            this.tracingPaths.forEach((particle) => {
                particle.draw(context);
            });

            if (this.tracingPaths.length >= this.configuration.tracingLength) {
                this.tracingPaths = this.tracingPaths.slice(this.tracingPaths.length - this.configuration.tracingLength);
            }
            this.tracingPaths.push(Electron.cloneTrace(this));
        } else {
            this.tracingPaths = [];
        }
        context.beginPath();
        context.arc(
            this.configuration.point.X,
            this.configuration.point.Y,
            this.configuration.radius, 0, 2 * Math.PI);
        context.fillStyle = this.configuration.color;
        context.fill();
        context.closePath();
        // context.lineWidth = 5;
        // context.strokeStyle = '#003300';
    }
}

export class Protone extends MovingObject<ParticleSettings> {
    constructor(settings: ParticleSettings) {
        super();
        this.applyConfig(settings);
    }

    isCollission(obj: MovingObject<ParticleSettings>) {
        const dX = this.configuration.point.X - obj.configuration.point.X;
        const dY = this.configuration.point.Y - obj.configuration.point.Y;
        const distance = Math.sqrt(dX * dX + dY * dY);
        return distance < this.configuration.radius + obj.configuration.radius;
    }

    draw(context: CanvasRenderingContext2D) {
        const grd = context.createRadialGradient(
            this.configuration.point.X + this.configuration.radius / 2,
            this.configuration.point.Y - this.configuration.radius / 2,
            0,
            this.configuration.point.X,
            this.configuration.point.Y,
            this.configuration.radius
        );
        grd.addColorStop(0, 'white');
        grd.addColorStop(1, this.configuration.color);
        context.beginPath();
        context.arc(this.configuration.point.X, this.configuration.point.Y, this.configuration.radius, 0, 2 * Math.PI);
        context.fillStyle = grd;
        context.fill();
        context.closePath();
    }
}
