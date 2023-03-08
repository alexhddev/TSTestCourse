/* eslint-disable testing-library/no-unnecessary-act */
/* eslint-disable testing-library/no-node-access */
import { act, fireEvent, render, screen } from "@testing-library/react"
import user from '@testing-library/user-event'
import LoginComponent from "./LoginComponent"



describe('Login component tests', ()=>{

    const loginServiceMock = {
        login: jest.fn()
    }
    const setTokenMock = jest.fn();

    let container: HTMLElement;

    function setup() {
       container = render(<LoginComponent 
            loginService={loginServiceMock}
            setToken={setTokenMock}
            />).container;
    }

    beforeEach(()=>{
        setup();
    })

    it('should render correctly the login component', ()=>{
        const mainElement = screen.getByRole('main');
        expect(mainElement).toBeInTheDocument();
        expect(screen.queryByTestId('resultLabel')).not.toBeInTheDocument();
    })

    it('should render correctly - query by test id', ()=>{
        const inputs = screen.getAllByTestId('input');
        expect(inputs).toHaveLength(3);
        expect(inputs[0].getAttribute('value')).toBe('');
        expect(inputs[1].getAttribute('value')).toBe('');
        expect(inputs[2].getAttribute('value')).toBe('Login');
    })

    it('should render correctly - query by document query', ()=>{
        const inputs = container.querySelectorAll('input');
        expect(inputs).toHaveLength(3);
        expect(inputs[0].value).toBe('');
        expect(inputs[1].value).toBe('');
        expect(inputs[2].value).toBe('Login');
    })

    it('Click login button with incomplete credentials - show required message', ()=>{
        const inputs = screen.getAllByTestId('input');
        const loginButton = inputs[2];

        fireEvent.click(loginButton);

        const resultLabel = screen.getByTestId('resultLabel');
        expect(resultLabel.textContent).toBe('UserName and password required!');
    })

    it('Click login button with incomplete credentials - show required message - with user click', ()=>{
        const inputs = screen.getAllByTestId('input');
        const loginButton = inputs[2];

        act(()=>{
            user.click(loginButton);
        })

        const resultLabel = screen.getByTestId('resultLabel');
        expect(resultLabel.textContent).toBe('UserName and password required!');
    })
})