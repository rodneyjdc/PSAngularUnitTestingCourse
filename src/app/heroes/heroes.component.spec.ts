import { of } from "rxjs";
import { HeroesComponent } from "./heroes.component"
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Component, Directive, Input, NO_ERRORS_SCHEMA } from "@angular/core";
import { HeroService } from "../hero.service";
import { Hero } from "../hero";
import { By } from "@angular/platform-browser";
import { HeroComponent } from "../hero/hero.component";

describe('HeroesComponent (isolated tests)', () => {
    let component: HeroesComponent;
    let HEROES;
    let mockHeroService;

    beforeEach(() => {
        HEROES = [
            {id: 1, name: 'SpiderBruh', strength: 12},
            {id: 2, name: 'SuperBruh', strength: 3},
            {id: 3, name: 'MistahPotato', strength: 20},
        ];

        mockHeroService = jasmine.createSpyObj(
            ['getHeroes', 'addHero', 'deleteHero']
        );

        component = new HeroesComponent(mockHeroService);
    })

    describe('delete method', () => {
        it('should remove the indicated hero from the heroes list', () => {
            // arrange
            component.heroes = HEROES;
            mockHeroService.deleteHero.and.returnValue(of(true));
    
            // act
            component.delete(HEROES[1]);
    
            // assert
            expect(component.heroes.length).toBe(2);
            expect(component.heroes[0].name).toBe('SpiderBruh');
            expect(component.heroes[1].name).toBe('MistahPotato');
        });

        it ('should call deleteHero with a specified hero', () => {
            // arrange
            component.heroes = HEROES;
                // setting the return value of deleteHero() to an observable with a value of TRUE
            mockHeroService.deleteHero.and.returnValue(of(true));
    
            // act
            component.delete(HEROES[1]);
    
            // assert
            expect(mockHeroService.deleteHero).toHaveBeenCalledWith(HEROES[1]);
        })
    })

})

describe('HeroesComponent (integration shallow tests)', () => {
    let HEROES;
    let mockHeroService;
    let fixture: ComponentFixture<HeroesComponent>;

    // this fake component resolves issues regarding the child component
    //      within template
    @Component({
        selector: 'app-hero',
        template: '<div></div>'
    })
    class FakeHeroComponent {
        @Input() hero: Hero;
        // @Output() delete = new EventEmitter();
    }

    beforeEach(() => {
        HEROES = [
            {id: 1, name: 'SpiderBruh', strength: 12},
            {id: 2, name: 'SuperBruh', strength: 3},
            {id: 3, name: 'MistahPotato', strength: 20},
        ];
        mockHeroService = jasmine.createSpyObj(['getHeroes', 'addHero', 'deleteHero']);

        TestBed.configureTestingModule({
            declarations: [HeroesComponent, FakeHeroComponent],
            providers: [
                { provide: HeroService, useValue: mockHeroService}
            ],
            // NO_ERRORS_SCHEMA hides all the problems in our template
            // schemas: [NO_ERRORS_SCHEMA]
        });
        fixture = TestBed.createComponent(HeroesComponent);

    });

    it('should set heroes correctly from the service', () => {
        // arrange
            // setting the return value of getHeroes() to an 
            //    observable with a value of a list of heroes
        mockHeroService.getHeroes.and.returnValue(of(HEROES));
        let componentInstance = fixture.componentInstance;

        // act
        fixture.detectChanges();

        // assert
        expect(componentInstance.heroes.length).toBe(3);
    });

    it('should create one li for each hero', () => {
        // arrange
            // setting the return value of getHeroes() to an 
            //    observable with a value of a list of heroes
        mockHeroService.getHeroes.and.returnValue(of(HEROES));

        // act
        fixture.detectChanges();

        // assert
        expect(fixture.debugElement.queryAll(By.css('li')).length).toBe(3);
    })
})

@Directive({
    selector: '[routerLink]',
    host: { '(click)': 'onClick()' }
})
export class RouterLinkDirectiveStub {
    @Input('routerLink') linkParams: any;
    navigatedTo: any = null;

    onClick() {
        this.navigatedTo = this.linkParams;
    }
}

describe('HeroesComponent (integration deep tests)', () => {
    let HEROES;
    let mockHeroService;
    let fixture: ComponentFixture<HeroesComponent>;

    beforeEach(() => {
        HEROES = [
            {id: 1, name: 'SpiderBruh', strength: 12},
            {id: 2, name: 'SuperBruh', strength: 3},
            {id: 3, name: 'MistahPotato', strength: 20},
        ];
        mockHeroService = jasmine.createSpyObj(['getHeroes', 'addHero', 'deleteHero']);

        TestBed.configureTestingModule({
            declarations: [
                HeroesComponent, 
                HeroComponent,
                RouterLinkDirectiveStub
            ],
            providers: [
                { provide: HeroService, useValue: mockHeroService}
            ],
            // NO_ERRORS_SCHEMA hides all the problems in our template
            // schemas: [NO_ERRORS_SCHEMA]
        });
        fixture = TestBed.createComponent(HeroesComponent);
    });

    it('should render each hero as a HeroComponent', () => {
        // arrange
        mockHeroService.getHeroes.and.returnValue(of(HEROES));

        // act
            // run ngOnInit
        fixture.detectChanges();

        // assert
        const heroComponentDebugElements = fixture.debugElement.queryAll(By.directive(HeroComponent));
        expect(heroComponentDebugElements.length).toBe(HEROES.length);

        for (let i = 0; i < heroComponentDebugElements.length; i++) {
            expect(heroComponentDebugElements[i].componentInstance.hero).toEqual(HEROES[i]);
        }
    });

    it(`should call delete with the specificied Hero when the Hero Component's
        delete button is clicked`, () => {
        // arrange
        spyOn(fixture.componentInstance, 'delete');
            // tells HeroService.getHeroes() to return an observable of HEROES
        mockHeroService.getHeroes.and.returnValue(of(HEROES));
            // trigger the Angular lifecycle
        fixture.detectChanges();
            // get a handle on the created Hero components (app-hero directives) in the template
        const heroComponentDebugElements = fixture.debugElement.queryAll(By.directive(HeroComponent));

        // act
            // trigger the click event on one of the Hero component's button
        // heroComponentDebugElements[0].query(By.css('button'))
        //     .triggerEventHandler('click', {stopPropagation: () => {}});
            // OR (will achieve same result as above) tell the child component (Hero component) to emit a delete event
        // (<HeroComponent>heroComponentDebugElements[0].componentInstance).delete.emit(undefined);
            // OR trigger the delete event on child directive
        heroComponentDebugElements[0].triggerEventHandler('delete', null);

        // assert
        expect(fixture.componentInstance.delete).toHaveBeenCalledWith(HEROES[0]);
    });

    it('should add a new hero to the hero list when the add button is clicked', () => {
        // arrange
            // tells HeroService.getHeroes() to return an observable of HEROES
        mockHeroService.getHeroes.and.returnValue(of(HEROES));
            // trigger the Angular lifecycle
        fixture.detectChanges();
        const name = 'Gagamboy';
        const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
        const addButtonElement = fixture.debugElement.queryAll(By.css('button'))[0];
            // tells HeroService.addHero() to return an observable of a Hero object
        mockHeroService.addHero.and.returnValue(of({id: 10, name: name, strength: 30}));

        // act
            // setting input box text to 'Gagamboy'
        inputElement.value = name;
        addButtonElement.triggerEventHandler('click', undefined);
        fixture.detectChanges();

        // assert
        const heroText = fixture.debugElement.query(By.css('ul')).nativeElement.textContent;
        expect(heroText).toContain(name);

        const component = fixture.componentInstance;
        expect(component.heroes[component.heroes.length - 1]).toEqual({id: 10, name: name, strength: 30});
    });

    it('should have the correct route for the first hero', () => {
        // arrange 
            // tells HeroService.getHeroes() to return an observable of HEROES
        mockHeroService.getHeroes.and.returnValue(of(HEROES));
            // trigger the Angular lifecycle
        fixture.detectChanges();
        const heroComponents = fixture.debugElement.queryAll(By.directive(HeroComponent));
        let routerLink = heroComponents[0]
            .query(By.directive(RouterLinkDirectiveStub))
            .injector.get(RouterLinkDirectiveStub);

        // act
        heroComponents[0].query(By.css('a')).triggerEventHandler('click', null);

        // assert
        expect(routerLink.navigatedTo).toBe('/detail/1');
    })
    
})