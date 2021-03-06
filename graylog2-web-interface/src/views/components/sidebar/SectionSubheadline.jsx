// @flow strict
import styled from 'styled-components';
import type { StyledComponent } from 'styled-components';

import type { ThemeInterface } from 'theme';

const SectionSubheadline: StyledComponent<{}, ThemeInterface, HTMLHeadingElement> = styled.h3`
  margin-bottom: 10px;
`;

export default SectionSubheadline;
