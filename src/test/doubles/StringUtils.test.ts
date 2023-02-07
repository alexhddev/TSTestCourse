import { StringUtils, toUpperCaseWithCb } from "../../app/doubles/StringUtils";

describe('String utils test suite', () => {

    describe.only('Tests with spies', ()=>{

        const sut = new StringUtils();

        test('Use spy to track calls', ()=>{
            const toUpperCaseSpy = jest.spyOn(sut, 'toUpperCase');
            const actual = sut.toUpperCase('abc');
            expect(toUpperCaseSpy).toBeCalledWith('abc');
        });

        test('Use spy to replace implementation of private method', ()=>{
            const callExternalServiceSpy = jest.spyOn(sut as any, 'callExternalService').mockImplementation(()=>{
                console.log('Calling mocked implementation!')
            });
            (sut as any).callExternalService();
        });

        test.only('Use spy to track calls of external module', ()=>{
            const consoleLogSpy = jest.spyOn(console, 'log');
            sut.logString('some arg');
            console.log(consoleLogSpy.mock.calls)
            expect(consoleLogSpy).toBeCalledWith('some arg');
        });

    });





    
    describe('tests with jest mocks', () => {
        const callBackMock = jest.fn();

        afterEach(()=>{
            jest.clearAllMocks();
        })

        it('calls callback for invalid argument - mock', () => {
            const actual = toUpperCaseWithCb('', callBackMock);
            expect(actual).toBeUndefined();
            expect(callBackMock).toBeCalledWith('Invalid argument');
            expect(callBackMock).toBeCalledTimes(1)
        })

        it('calls callback for valid argument - mock', () => {
            const actual = toUpperCaseWithCb('abc', callBackMock);
            expect(actual).toBe('ABC');
            expect(callBackMock).toBeCalledWith('called function with abc');
            expect(callBackMock).toBeCalledTimes(1)
        })

        
    });

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

