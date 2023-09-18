import { DbAccessor } from "./DbAccessor";

async function main(){
    const accessor = new DbAccessor();
    await accessor.connect();
    const addResult = await accessor.addUser({
        name: 'Sefu',
        position: 'Engineer',
        employedAt: new Date()
    })
    console.log(addResult);
    const allUsers = await accessor.getUsers();
    console.log(allUsers)
    await accessor.close();
}

main();
