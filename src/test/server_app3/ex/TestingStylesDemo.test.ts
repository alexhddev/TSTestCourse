type User = {
    name: string,
    age: number
}

class AwesomeDatabase {
    
    private elements: Array<User> = new Array<User>();

    public add(user: User) {
        this.elements.push(user)
        this.elements.push(user)
    }

    public getByName(name: string) {
        return this.elements.find(x => x.name === name)
    }
}

describe('AwesomeDb test suite', ()=>{

    it('should insert user', ()=>{
        const sut = new AwesomeDatabase()
        const someUser = {
            name: 'John',
            age: 30
        }

        sut.add(someUser)

        const actual = sut.getByName('John')
        expect(actual).toEqual(someUser);
    })

    it('should insert user and call the right methods', ()=>{
        const sut = new AwesomeDatabase()
        const pushSpy = jest.spyOn(Array.prototype, 'push');

        const someUser = {
            name: 'John',
            age: 30
        }

        sut.add(someUser)
        const actual = sut.getByName('John')

        expect(actual).toEqual(someUser);
        expect(pushSpy).toBeCalledTimes(1);
    })

})