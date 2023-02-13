import { generateRandomId } from "../../../app/server_app/data/IdGenerator"


describe('IdGenerator test suite', ()=>{

    test('should return random hex', ()=>{
        const randomId = generateRandomId();
        expect(randomId.length).toBe(20);
    })
})