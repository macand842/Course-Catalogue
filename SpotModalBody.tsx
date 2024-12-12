import React from 'react';
import { ISupportmodal } from 'components/ui/modal/ModalState';
import { observer } from 'mobx-react';

export interface SpotModalBodyProps extends ISupportmodal {
  spot: any;
}


export const SpotModalBody: React.FC<SpotModalBodyProps> = observer((props): React.ReactElement => {
  const { spot } = props;

  return (
    <div className="spot-modal-body">

      {spot.spotDto?.description && (
        <div
          className="spot-description"
          dangerouslySetInnerHTML={{ __html: spot.spotDto.description }}
        />
      )}
      {spot.spotDto?.imageUrl && (
        <img
          src={spot.spotDto.imageUrl}
          alt="Spot Visual"
          className="spot-image"
        />
      )}
    </div>
  );
});
