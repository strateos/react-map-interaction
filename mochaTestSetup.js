// https://enzymejs.github.io/enzyme/docs/installation/react-16.html

// setup file
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });
