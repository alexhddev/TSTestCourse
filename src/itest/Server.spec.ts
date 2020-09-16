import * as axios from 'axios';


axios.default.defaults.validateStatus = function () {
    return true;
}
const serverUrl = 'http://localhost:8080';

describe('Server itest suite', async () => {
    const testIfServerReachable = await serverReachable() ? test : test.skip;

    test('server reachable', async () => {
        await serverReachable();
    })

});


/**
 * Not usable in Jest
 * @see https://github.com/facebook/jest/issues/8604
 */
async function serverReachable(): Promise<boolean> {
    try {
        await axios.default.get(serverUrl);
    } catch (error) {
        console.log('Server NOT reachable')
        return false;
    }
    console.log('Server reachable')
    return true;
}