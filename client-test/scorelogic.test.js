const scorelogic = require('./scorelogic')

describe('left padding', () => {
    describe('off right', () => {
        it('should add padding to offset', () => {
            const currentOffset = -400
            const selectionLeft = 600
            const selectionRight = 700
            const screenWidth = 200
            const leftPadding = 35
            const measureBoundaries = [
                0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000
            ]

            expect(scorelogic.getScoreOffset(
                currentOffset, selectionLeft, selectionRight,
                measureBoundaries, screenWidth, leftPadding,
            )).toBe(-565);
        })
    })
    describe('off left', () => {
        it('should add padding to offset', () => {
            const currentOffset = -500
            const selectionLeft = 400
            const selectionRight = 500
            const screenWidth = 200
            const leftPadding = 35
            const measureBoundaries = [
                0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000
            ]

            expect(scorelogic.getScoreOffset(
                currentOffset, selectionLeft, selectionRight,
                measureBoundaries, screenWidth, leftPadding,
            )).toBe(-265);
        })
    })
})

describe('simple tests', () => {
    describe('when selection visible', () => {
        it('should return existing offset', () => {
            const currentOffset = -300
            const selectionLeft = 400
            const selectionRight = 500
            const screenWidth = 200
            const leftPadding = 0
            const measureBoundaries = [
                0, 100, 200, 300, 400, 500
            ]

            expect(scorelogic.getScoreOffset(
                currentOffset, selectionLeft, selectionRight,
                measureBoundaries, screenWidth, leftPadding,
            )).toBe(-300);

        })
    })
    describe('when off right side', () => {
        it('should move one page right', () => {

            const currentOffset = 0
            const selectionLeft = 200
            const selectionRight = 300
            const screenWidth = 200
            const leftPadding = 0
            const measureBoundaries = [
                0, 100, 200, 300, 400, 500
            ]

            expect(scorelogic.getScoreOffset(
                currentOffset, selectionLeft, selectionRight,
                measureBoundaries, screenWidth, leftPadding,
            )).toBe(-200);
        })
    })

    describe('when off left side', () => {
        it('should move one page left', () => {

            const currentOffset = -300 
            const selectionLeft = 200
            const selectionRight = 300
            const screenWidth = 200
            const leftPadding = 0
            const measureBoundaries = [
                0, 100, 200, 300, 400, 500
            ]

            expect(scorelogic.getScoreOffset(
                currentOffset, selectionLeft, selectionRight,
                measureBoundaries, screenWidth, leftPadding,
            )).toBe(-100);
        })

    })

    describe('when off right from middle', () => {
        it('should move one page right', () => {
            const currentOffset = -400
            const selectionLeft = 600
            const selectionRight = 700
            const screenWidth = 200
            const leftPadding = 0
            const measureBoundaries = [
                0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000
            ]

            expect(scorelogic.getScoreOffset(
                currentOffset, selectionLeft, selectionRight,
                measureBoundaries, screenWidth, leftPadding,
            )).toBe(-600);

        })
    })

    describe('when off left from middle', () => {
        it('should move one page right', () => {
            const currentOffset = -600
            const selectionLeft = 500
            const selectionRight = 600
            const screenWidth = 200
            const leftPadding = 0
            const measureBoundaries = [
                0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000
            ]

            expect(scorelogic.getScoreOffset(
                currentOffset, selectionLeft, selectionRight,
                measureBoundaries, screenWidth, leftPadding,
            )).toBe(-400);

        })
    })


})

