import { toUpperCaseWithCb } from "../../app/doubles/StringUtils";

describe('String utils test suite', () => {

    describe('tests with fakes', () => {
        it('returns right upper case', () => {
            const actual = toUpperCaseWithCb('abc', () => { });
            expect(actual).toBe('ABC')
        })
        it('returns nothing for invalid argument', () => {
            const actual = toUpperCaseWithCb('', () => { });
            expect(actual).toBeUndefined();
        })
        describe('Tracking fake calls', () => {
            let fakeArgs = [];
            let timesCalled = 0;

            function fakeCallBack(arg) {
                fakeArgs.push(arg);
                timesCalled++;
            }

            afterEach(()=>{
                // clear fakes:
                fakeArgs = [];
                timesCalled = 0;
            })

            it('calls callback for invalid argument - function', () => {
                const actual = toUpperCaseWithCb('', fakeCallBack);
                expect(actual).toBeUndefined();
                expect(fakeArgs).toContain('Invalid argument');
                expect(timesCalled).toBe(1);
            })

            it('calls callback for valid argument - function', () => {
                const actual = toUpperCaseWithCb('abc', fakeCallBack);
                expect(actual).toBe('ABC');
                expect(fakeArgs).toContain('called function with abc');
                expect(timesCalled).toBe(1);
            });
        })



    })

});

