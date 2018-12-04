import {Configurable} from './Configurable';
import {Electron, MovingObject, Protone} from './Particles';

export interface PolygonSettings {
    context: CanvasRenderingContext2D;
    color: string;
    width: number;
    height: number;
}

export interface Orbit {
    center: { X: number, Y: number };
    radius: number;
}

export class AtomProps {
    public coreDepth: number;
    public front: number;
    public speed: number;
    public count: number;
    public stretchX: number;
    public stretchY: number;
    public rotate: number;
    public randomSize: number;
    public tracing: boolean;
    public tracingLength: number;
    public delay: number;

    constructor(initial) {
        this.coreDepth = initial['coreDepth'] || 1;
        this.front = initial['front'] || 0;
        this.speed = initial['speed'] || 1;
        this.count = initial['count'] || 5;
        this.stretchX = initial['stretchX'] || 1;
        this.stretchY = initial['stretchY'] || 1;
        this.rotate = initial['rotate'] || 1;
        this.randomSize = initial['randomSize'] || false;
        this.tracing = initial['tracing'] || false;
        this.tracingLength = initial['tracingLength'] || 5;
        this.delay = initial['delay'] || 40;
    }
}

export class Atom extends Configurable<AtomProps> {
    private corePaths: Protone[];
    private paths: Electron[];
    private polygon: PolygonSettings;
    private orbit: Orbit;

    constructor(props: AtomProps) {
        super();

        this.applyConfig(props);

        this.paths = [];
        this.corePaths = [];
        this.polygon = {
            context: null,
            color: '#bbbbbb',
            height: 0,
            width: 0
        };
        this.orbit = {
            center: { X: 0, Y: 0},
            radius: 300
        };
    }

    smartConfigApply(config: AtomProps) {
        const difference = Object.keys(this.configuration)
            .filter(k => this.configuration[k] !== config[k]);

        this.applyConfig(config);
        for (const i of difference) {
            const key = i;
            switch (key) {
                case 'count':
                    this.generateObjects();
                    this.generateCore();
                    break;
                case 'coreDepth':
                    break;
                case 'rotate':
                    this.generateRotateMatrix();
                    break;
                case 'tracing':
                case 'tracingLength':
                    this.updateTracing();
                    break;
            }
        }
    }

    setContext(context: CanvasRenderingContext2D, width: number, height: number) {
        this.polygon.context = context;
        this.polygon.width = width;
        this.polygon.height = height;

        this.orbit.center = {
            X: width / 2,
            Y: height / 2
        };

        this.generateCore();
    }

    setFillColor(color: string) {
        this.polygon.color = color;
    }

    setOrbitRadius(radius: number) {
        this.orbit.radius = radius;
    }

    initialize() {
        if (!this.paths || this.paths.length === 0) {
            this.generateObjects();
        }
        if (!this.corePaths || this.corePaths.length === 0) {
            this.generateCore();
        }
    }

    redraw() {
        this.drawPolygon();
        this.paths.forEach((path) => {
            if (path.configuration.depth < 0) {
                path.draw(this.polygon.context);
            }
        });

        this.corePaths.forEach((particle) => {
            particle.draw(this.polygon.context);
        });

        this.paths.forEach((path) => {
            if (path.configuration.depth > 0) {
                path.draw(this.polygon.context);
            }
        });
    }

    drawPolygon() {
        this.polygon.context.clearRect(0, 0, this.polygon.width, this.polygon.height);

        const grd = this.polygon.context.createRadialGradient(
            this.polygon.width / 2,
            this.polygon.height / 2,
            10,
            this.polygon.width / 2,
            this.polygon.width / 2,
            1000
        );
        grd.addColorStop(0, '#555');
        grd.addColorStop(1, '#333');
        this.polygon.context.clearRect(0, 0, this.polygon.width, this.polygon.height);
        this.polygon.context.beginPath();
        this.polygon.context.fillStyle = grd;
        this.polygon.context.fillRect(0, 0, this.polygon.width, this.polygon.height);
        this.polygon.context.closePath();
    }

    recalculate(iteration: number) {
        this.paths.forEach((particle) => {
            const argument = iteration + particle.configuration.pathOffset;
            const a360 = (Math.PI * 2);
            // const eccentricity = Math.max(particle.configuration.angle, 1 - particle.configuration.angle) / 0.5;
            const x = Math.sin(argument) * particle.configuration.orbitRadius * this.configuration.stretchX;
            const y = Math.cos(argument) * particle.configuration.orbitRadius * this.configuration.stretchY;
            // rotation
            const xR = this.orbit.center.X + particle.rotateMatrix[0] * x + particle.rotateMatrix[1] * y;
            const yR =  this.orbit.center.Y + particle.rotateMatrix[1] * x + particle.rotateMatrix[0] * y;


            const topPoint = typeof this.configuration.front !== 'number' ? Math.PI / 6 : this.configuration.front;
            // topPoint = topPoint - Math.PI;

            const currentAngle = argument % a360;

            let awayFromTopAngle = Math.abs(currentAngle - topPoint);

            awayFromTopAngle = awayFromTopAngle > Math.PI ? 2 * Math.PI - awayFromTopAngle : awayFromTopAngle;

            // awayFromTopAngle = awayFromTopAngle > 0 ? awayFromTopAngle : a360 + awayFromTopAngle;
            // const diff = awayFromTopAngle > Math.PI ? a360 - awayFromTopAngle : awayFromTopAngle;
            // var diff = beta - alpha > 0 ? beta - alpha : Math.abs(beta - alpha);

            const radius = 3 + Math.abs(particle.configuration.initialRadius * awayFromTopAngle) / 3;
            const backGround = Math.abs(awayFromTopAngle) - Math.PI / 2;
            particle.applyConfig({
                point: {
                    X: xR,
                    Y: yR,
                },
                radius: radius,
                depth: backGround,
                color: this.generateColor(awayFromTopAngle)
            });
        });
    }

    generateObjects() {
        this.paths = [];
        for (let i = 0; i < this.configuration.count; i++) {
            const orbit = this.orbit.radius;
            const radius = this.configuration.randomSize === 1 ? 10 + Math.random() * orbit / 4 : 8;
            this.paths.push(new Electron({
                point: {
                    X: i * 30,
                    Y: 100
                },
                depth: 10,
                pathOffset: Math.random() * 1000,
                angle: Math.random(),
                initialRadius: radius,
                radius: radius,
                orbitRadius: orbit,
                tracing: this.configuration.tracing,
                tracingLength: this.configuration.tracingLength
            }));
        }
        this.generateRotateMatrix();
    }

    updateTracing() {
        if (this.paths) {
            this.paths.forEach((particle) => {
                particle.applyConfig({
                    tracing: this.configuration.tracing,
                    tracingLength: this.configuration.tracingLength
                });
            });
        }
    }

    generateCore() {
        this.corePaths = [];
        const count = 6;
        const radius = 13;
        const processedNumber = 0;
        const colors = ['#006dff', '#aa1643'];
        const angleStep = 2 * Math.PI / (count - processedNumber);

        for (let i = 0; i < count; i++) {
            const angle = angleStep * i;
            const proton = new Protone({
                point: {
                    X: this.orbit.center.X + Math.cos(angle) * 20,
                    Y: this.orbit.center.Y + Math.sin(angle) * 20
                },
                radius: radius,
                color: colors[i % 2]
            });
            this.corePaths.push(proton);
        }
        this.corePaths.push(new Protone({
            point: {
                X: this.orbit.center.X,
                Y: this.orbit.center.Y
            },
            radius: radius,
            color: colors[0]
        }));
    }

    radToDegrees(rad: number) {
        return (rad / (Math.PI * 2)) * 360;
    }

    generateColor(depth: number) {
        const color = {
            r: 11,
            g: 130,
            b: 255
        };
        const coeff = depth / Math.PI;

        return `rgb(${color.r + coeff * 100}, ${color.g + coeff * 100}, ${color.b})`;
    }

    generateRotateMatrix() {
        if (this.paths) {
            this.paths.forEach((path) => {
                path.applyConfig({
                    rotation: this.configuration.rotate
                });
                path.generateRotateMatrix();
            });
        }
    }

    resetOrbits() {
        if (this.paths) {
            this.paths.forEach((particle) => {
                particle.applyConfig({
                    rotation: Math.random() * Math.PI * 2,
                    orbitRadius: Math.round((0.3 + Math.random() % (0.7)) * this.orbit.radius)
                });
                particle.generateRotateMatrix();
            });
        }
    }
}
