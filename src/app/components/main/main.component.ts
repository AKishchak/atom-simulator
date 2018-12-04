import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

    public resources = [
        {
            title: 'Angular 6',
            image: '/assets/angular.svg'
        },
        {
            title: 'HTML5 Canvas',
            image: '/assets/HTML5.svg'
        },
        {
            title: 'TypeScript',
            image: '/assets/ts.svg'
        },
        {
            title: 'SCSS',
            image: '/assets/Sass.svg'
        }
    ];

    constructor() { }


    ngOnInit() {
    }

}
