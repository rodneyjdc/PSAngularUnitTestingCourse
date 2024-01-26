import { TestBed } from "@angular/core/testing";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import { HeroService } from "./hero.service";
import { MessageService } from "./message.service";

describe('HeroService', () => {
    let mockMessageService;
    let httpTestingController: HttpTestingController;
    let heroService: HeroService;

    beforeEach(() => {
        mockMessageService = jasmine.createSpyObj(['add']);

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                HeroService,
                {provide: MessageService, useValue: mockMessageService}
            ]
        });

        httpTestingController = TestBed.inject(HttpTestingController);
    })

    describe('getHero', () => {
        it('should call get with the correct URL', () => {
            // arrange
            heroService = TestBed.inject(HeroService);

            // act
                // call getHero();
            heroService.getHero(3).subscribe(result => {
                expect(result.id).toBe(3);
                expect(result.name).toBe('MistahPotato');
            });
                // test that the URL was correct
            const req = httpTestingController.expectOne('api/heroes/3');
            req.flush({id: 3, name: 'MistahPotato', strength: 20});

            // assert
            expect(req.request.method).toBe('GET');
            httpTestingController.verify();
                
            // httpTestingController.verify() - verifies that it was only the requests
            //      that we expected and exactly those and no extra requests at all.
        })
    })
})