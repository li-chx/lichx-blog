import { useBreakpoints } from '@vueuse/core';
import breakpoints from '~/configs/breakpoints';

const breakpointsHelper = useBreakpoints(breakpoints);
export default breakpointsHelper;
