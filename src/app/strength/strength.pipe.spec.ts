import { StrengthPipe } from "./strength.pipe"

describe('StrengthPipe', () => {
    it('should display (weak) with a strength of 5', () => {
        // act
        let pipe = new StrengthPipe();

        // arrange
        let result = pipe.transform(5);

        // assert
        expect(result).toBe('5 (weak)');
    });

    it('should display (strong) with a strength of 15', () => {
        // act
        let pipe = new StrengthPipe();

        // arrange
        let result = pipe.transform(15);

        // assert
        expect(result).toBe('15 (strong)');
    })
})
