import React from 'react';
import { observer } from 'mobx-react';
import { SpotState } from 'components/spot/states/spotState';
import { SpotTypeFactory } from 'components/spot/components/SpotTypeFactory';
import { SpotTypeProps } from 'components/spot/components/types';
import { Alert, Button, Col, Row } from 'components/ui';
import { Header } from 'components/ui';
import useTranslationFromKey from 'hooks/translating/useTranslationFromKey';
import { useClassNames } from 'hooks/utils/useClassName';
import { OpenSpotModal } from './SpotModal';

export interface SpotFromStateProps {
  state: SpotState;
}

/**
 * Renders a spot
 */
export const SpotFromState: React.FC<SpotFromStateProps> = observer((props: SpotFromStateProps): React.ReactElement => {
  const { state } = props;

  const classNames = useClassNames({
    'spot mb-md-2': true,
    'spot-edit': state?.editEnabled,
  });

  if (!state) return <></>;
  if (!state.hasEntities && state.doNotRenderWhenNoEntities) return <></>;

  console.log('SpotFromState props:', props); // Debugging

  return (
    <div className={classNames}>
      {!state.hasEntities && state.editEnabled && <NoSpotsConfigured />}
      {state.hasEntities && <DisplaySpotEntities state={state} />}
      {state.editEnabled && <EditSpotEntities state={state} />}
    </div>
  );
});

const NoSpotsConfigured: React.FC = (): React.ReactElement => {
  const noSpotsTranslation = useTranslationFromKey('Spots.NoSpotsConfigured');

  return (
    <Alert type="warning" hideIcon centerText>
      {noSpotsTranslation.value}
    </Alert>
  );
};

const DisplaySpotEntities: React.FC<SpotFromStateProps> = observer((props): React.ReactElement => {
  const { state } = props;

  console.log('DisplaySpotEntities state:', state); // Debugging

  return (
    <>
      {/* Header Spot */}
      {state.renderMode === 'vertical' && state.entities.length > 0 && (
        <Row className="headline-spot">
          <Col>
            <SpotHeadlineType state={state.entities[0]} />
          </Col>
        </Row>
      )}

      {/* Hot Spots */}
      {state.renderMode === 'horizontal' && (
        <div className="hot-spot-group-background">
          <Row justifyContent="center" className="hot-spot-group">
            <h2>Featured Courses and Announcements</h2>
            <div className="hot-spots">
              {state.entities.map((spot, index) => (
                <Col key={index} sizeSm="4">
                  <div className="spot-container">
                    <div className="spot-content">
                      <SpotTypeFactory spotEntityState={spot} />
                    </div>
                  </div>
                  <button onClick={() => OpenSpotModal(spot)} className="view-details-button">
                    See details
                  </button>
                </Col>
              ))}
            </div>
          </Row>
        </div>
      )}
    </>
  );
});

/**
 * Headline type rendering
 */
const SpotHeadlineType: React.FC<SpotTypeProps> = observer((props): React.ReactElement => {
  const data = props.state.spotDto;

  const scrollToCourses = () => {
    const container = document.querySelector('.coursesbody-inner-container');
    console.log('Scroll Target:', container); // Debugging
    if (container) {
      container.scrollIntoView({ behavior: 'smooth' });
      console.log('Scrolling to target...');
    } else {
      console.error('Target element .coursesbody-inner-container not found');
    }
  };

  console.log('SpotHeadlineType data:', data); // Debugging

  return (
    <div className="spot-headline-type-container mt-5">
      <div className="headline-type-heading">
        <Header size="1">{data?.headline1 || 'Default Headline'}</Header>
        <button onClick={scrollToCourses}>
          <span>Find your course</span>
        </button>
      </div>
      <img
        src="https://vartgoteborg.se/cms/wp-content/uploads/2024/02/lov-med-kulturskolan-800.jpg"
        alt="Logo Gothenburg Kulturskolan"
      />
    </div>
  );
});

const EditSpotEntities: React.FC<SpotFromStateProps> = observer((props): React.ReactElement => {
  const state = props.state;

  return (
    <Row>
      <Col size="12" textAlign="center" className="p-2">
        <Button onClick={() => state.handleOnAdd()} icon="add" type="primaryFlat" title={{ value: 'Add spot' }} />
      </Col>
    </Row>
  );
});
