import { ComponentFixture, TestBed } from "@angular/core/testing"
import { HeroComponent } from "./hero.component"
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { By } from "@angular/platform-browser";

describe('HeroComponent (shallow tests)', () => {
    let fixture: ComponentFixture<HeroComponent>;

    beforeEach(() => {
        // configure testing module
        TestBed.configureTestingModule({
            declarations: [HeroComponent],
            schemas: [NO_ERRORS_SCHEMA]
        });

        // create component fixture
        fixture = TestBed.createComponent(HeroComponent);
    });

    it('should have the correct hero', () => {
        // arrange
        let componentInstance = fixture.componentInstance;

        // act
        componentInstance.hero = {id: 1, name: 'SuperBruh', strength: 25};

        // assert
        expect(componentInstance.hero.name).toBe('SuperBruh');
    });

    // testing rendered HTML
    it('should render the hero name in an anchor tag', () => {
        // arrange
        let componentInstance = fixture.componentInstance;
        componentInstance.hero = {id: 1, name: 'SuperBruh', strength: 25};

        // act
            //  tells the component to run change detection and update 
            //     any template bindings that may exist on the component
        fixture.detectChanges(); 

        // assert
        expect(fixture.nativeElement.querySelector('a').textContent).toContain('SuperBruh');
            // same thing but using debugElement
        expect(fixture.debugElement.query(By.css('a')).nativeElement.textContent).toContain('SuperBruh');
    })
})

// fixture.detectChanges();
//      - tells the component to run change detection and update 
//              any template bindings that may exist on the component