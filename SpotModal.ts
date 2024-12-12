import { getAppState } from 'hooks/app/getAppState';
import { ModalStateProps } from 'components/ui/modal/ModalState';
import { createElement } from 'react';
import { SpotModalBody } from './SpotModalBody';

export const OpenSpotModal = (spot: any) => {
  const props: ModalStateProps = {
    title: spot.spotDto?.headline1 || 'Spot Details',
    type: 'primary',
    body: (modalState) =>
      createElement(SpotModalBody, {
        modalState: modalState,
        spot: spot,
      }),
  };

  getAppState().modal.openUsingProps(props);
};
