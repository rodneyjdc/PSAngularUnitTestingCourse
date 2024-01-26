import { ComponentFixture, TestBed, fakeAsync, flush, waitForAsync } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";

import { HeroDetailComponent } from "./hero-detail.component";
import { HeroService } from "../hero.service";
import { of } from "rxjs";
import { FormsModule } from "@angular/forms";


describe('HeroDetailComponent', () => {
    let mockActivatedRoute, mockHeroService, mockLocation;
    let fixture: ComponentFixture<HeroDetailComponent>;

    beforeEach(() => {
        mockActivatedRoute = {
            snapshot: { paramMap: { get: () => { return '3'; }}}
        };
        mockHeroService = jasmine.createSpyObj(['getHero', 'updateHero']);
        mockLocation = jasmine.createSpyObj(['back']);

        TestBed.configureTestingModule({
            imports: [FormsModule],
            declarations: [HeroDetailComponent],
            providers: [
                { provide: ActivatedRoute, useValue: mockActivatedRoute},
                { provide: HeroService, useValue: mockHeroService},
                { provide: Location, useValue: mockLocation}
            ]
        });

        fixture = TestBed.createComponent(HeroDetailComponent);
    });

    it('should render hero name in an h2 tag', () => {
        // arrange
        mockHeroService.getHero.and.returnValue(of({id: 3, name: 'MistahPotato', strength: 20}));

        // act
        fixture.detectChanges();

        // assert
        expect(fixture.nativeElement.querySelector('h2').textContent).toContain('MISTAHPOTATO');
    });

    // it('should call updateHero when save is called', fakeAsync(() => {
    //     // arrange
    //     mockHeroService.getHero.and.returnValue(of({id: 3, name: 'MistahPotato', strength: 20})); 
    //     mockHeroService.updateHero.and.returnValue(of({}));
    //     fixture.detectChanges();

    //     // act
    //     fixture.componentInstance.save();
    //          // waits for all tasks to complete, including Promises
    //     flush();

    //     // assert
    //     expect(mockHeroService.updateHero).toHaveBeenCalled();
    // }));

    // works only with Promises
    it('should call updateHero when save is called', waitForAsync(() => {
        // arrange
        mockHeroService.getHero.and.returnValue(of({id: 3, name: 'MistahPotato', strength: 20})); 
        mockHeroService.updateHero.and.returnValue(of({}));
        fixture.detectChanges();

        // act
        fixture.componentInstance.save();

        // assert
            // waits for Promises to resolve
        fixture.whenStable().then(() => {
            expect(mockHeroService.updateHero).toHaveBeenCalled();
        });
    }));
})