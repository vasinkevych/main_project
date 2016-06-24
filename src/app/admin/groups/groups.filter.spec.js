describe('unit test for a pagination filter for group page', function() {
    var startFrom;
    var n = 100;
    var specInteger = 5; // or any other
    var dummyArray = Array(n);
    while (n-- > 0) { dummyArray[n] = n; }

    beforeEach(module('app'));
    beforeEach(inject(function(startFromFilter) {
        startFrom = startFromFilter;
    }));
    
    it('should return empty array if no input', function() {
        expect(startFrom()).toEqual([]);
    });
    it('should return empty array if the first argument not defined', function() {
        expect(startFrom(undefined, n)).toEqual([]);
    });
    it('should return empty array if the first argument not an array', function() {
        expect(startFrom('string', n)).toEqual([]);
    });
    it('should return sliced part of an array', function() {
        expect(startFrom(dummyArray, specInteger)).toEqual(dummyArray.slice(specInteger));
    })
});