// @flow strict
import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';
import styled, { css, type StyledComponent } from 'styled-components';
import moment from 'moment';
import { useField } from 'formik';

import { type ThemeInterface } from 'theme';
import { type TimeRange } from 'views/logic/queries/Query';
import StoreProvider from 'injection/StoreProvider';

type Props = {|
  timerange: ?TimeRange,
|};

const EMPTY_RANGE = '----/--/-- --:--:--.---';

const ToolsStore = StoreProvider.getStore('Tools');

const TimeRangeWrapper: StyledComponent<{}, ThemeInterface, HTMLParagraphElement> = styled.p(({ theme }) => css`
  width: 100%;
  padding: 3px 9px;
  margin: 0 12px;
  display: flex;
  justify-content: space-around;
  background-color: ${theme.colors.variant.lightest.primary};
  align-items: center;
  border-radius: 4px;
  
  > span {
    flex: 1;
  }
  
  code {
    color: ${theme.colors.variant.dark.primary};
    background: transparent;
    font-size: ${theme.fonts.size.body};
  }
`);

const dateOutput = (timerange: TimeRange) => {
  let from = EMPTY_RANGE;

  switch (timerange.type) {
    case 'relative':
      from = !timerange.range ? 'All Time' : moment()
        .subtract(timerange.range * 1000)
        .fromNow();

      return {
        from,
        until: 'Now',
      };

    case 'absolute':
    case 'keyword':
      return { from: timerange.from, until: timerange.to };
    default:
      return { from, until: from };
  }
};

const TimeRangeDisplay = ({ timerange }: Props) => {
  const emptyOutput = useMemo(() => ({ from: EMPTY_RANGE, until: EMPTY_RANGE }), []);
  const [{ from, until }, setTimeOutput] = useState(emptyOutput);
  const [, , nextRangeHelpers] = useField('tempTimeRange');

  useEffect(() => {
    if (timerange?.type === 'keyword') {
      ToolsStore.testNaturalDate(timerange.keyword)
        .then((response) => {
          setTimeOutput({
            from: response.from,
            until: response.to,
          });

          nextRangeHelpers.setValue({ ...timerange, ...response });
        }, () => {
          setTimeOutput(emptyOutput);
        });
    } else if (timerange?.type) {
      setTimeOutput(dateOutput(timerange));
    }
  }, [timerange, emptyOutput, nextRangeHelpers]);

  return (
    <TimeRangeWrapper>
      {!timerange?.type
        ? <span><code>No Override</code></span>
        : (
          <>
            <span><strong>From</strong>: <code>{from}</code></span>
            <span><strong>Until</strong>: <code>{until}</code></span>
          </>
        )}
    </TimeRangeWrapper>
  );
};

export default TimeRangeDisplay;
