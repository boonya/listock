// FIXME: Remove me after testing
import {createLazyRoute} from '@tanstack/react-router';

const Route = createLazyRoute('/test')({
  component: Test,
});

function Test() {
  return <div>Test</div>;
}

export default Route;
