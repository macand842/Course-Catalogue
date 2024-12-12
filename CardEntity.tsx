import React, { ReactNode } from 'react';
import { observer } from 'mobx-react';
import { ActionButtonState } from 'components/ui/button/actionButtons/actionButtonState';
import { ActionButtons } from 'components/ui/button/actionButtons/ActionButtons';
import { Card, CardTheme } from 'components/ui/card/Card';
import { AspectImage } from 'components/ui/image/AspectImage';
import { CardSubtitle, CardTitle } from '@progress/kendo-react-layout';
import { CardWithExpand } from 'components/ui/card/CardWithExpand';
import { CardEntityState } from 'components/cardlist/CardEntityState';
import { getAppState } from 'hooks/app/useAppState';

export interface CardEntityProps {
  state: CardEntityState;
  bodyComponent: ReactNode;
  actionButtons?: ActionButtonState[];
}

/**
 * Card component for Cardlist
 *
 */
export const CardEntity: React.FC<CardEntityProps> = observer((props: CardEntityProps): React.ReactElement => {
  const theme: CardTheme = props.state.config.cardTheme ? props.state.config.cardTheme : 'default';

  const imageUrl = `${getAppState().runtime.getApiBaseUrl()}/infrastructure/concepts/Blob/GetPublicByUniqueId?uniqueblobid=${props.state.option.imageBlobId}`;

  const getCardHeader = () => {
    if (props.state.config.hideHeader) return undefined;

    const isExpanded = props.state.isExpanded ?? false; // Check if the card is expanded

    // Function to truncate text
    const truncateText = (text: string, maxLength: number) => {
      return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
    };

    return (
      <div className="base-course-card-header-container">
        {!props.state.config.hideImage && (
          <img
            className="base-course-card-image"
            src={'https://upload.wikimedia.org/wikipedia/commons/7/76/Guitarist_girl.jpg'}
            style={{
              height: isExpanded ? 'auto' : '110px', // Limit height when not expanded
            }}
          />
        )}
        <div className="base-course-card-content">
          <CardTitle>
            <div>
              <h3 className="catalogue-course-name">{props.state.option.label}</h3>
            </div>
          </CardTitle>
          {props.state.option.subLabel && (
            <CardSubtitle>
              {props.state.config.isSubLabelHtml ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: isExpanded
                      ? props.state.option.subLabel ?? ''
                      : truncateText(props.state.option.subLabel ?? '', 200), // Limit to 200 characters when not expanded
                  }}
                ></div>
              ) : (
                <div>{isExpanded ? props.state.option.subLabel : truncateText(props.state.option.subLabel, 200)}</div>
              )}
            </CardSubtitle>
          )}
        </div>

        {/*         <div className='card-action'>
          <ActionButtons size='small' actions={props.actionButtons ?? []} />
        </div> */}
      </div>
    );
  };


  return (
    <>
      {!props.state.config.hideBodyInExpand && (
        <Card className='card' type={theme} header={getCardHeader()} body={<div>{props.bodyComponent}</div>} />
      )}

      {props.state.config.hideBodyInExpand && (
        <CardWithExpand
          className='card base-course-group'
          type={theme}
          header={getCardHeader()}
          body={<div>{props.bodyComponent}</div>}
          incrementMeToRedraw={props.state.redrawCounter}
          cardEntityState={props.state}
        />
      )}
    </>
  );
});
