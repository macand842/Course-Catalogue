import React from 'react'
import { observer } from 'mobx-react'
import { ModalState } from 'components/ui/modal/ModalState'
import getGuid from 'hooks/utils/getGuid'
import { Dialog } from '@progress/kendo-react-dialogs'
import { useAppState } from 'hooks/app/useAppState'

export interface ModalProps {
  modalState?: ModalState
  isProcessing?: boolean
}

export const NewModal: React.FC<ModalProps> = observer((props: ModalProps): React.ReactElement => {
  const state = props.modalState

  const appState = useAppState()
  const arialIdentifier = getGuid()

  const onCancel = () => {
    state?.close()
    if (state?.onCancel) state.onCancel()
  }

  if (!state) return <> No state </>

  return (
    <>
      {state.show && (
        <Dialog
          className='spot-modal'
          key={state.title}
          closeIcon={false}
          appendTo={appState.popupContext?.current}
          onClose={() => onCancel()}
          aria-labelledby={arialIdentifier}
        >
          <div className="modal-header">
            <h3 id={arialIdentifier}>{state.title}</h3>
            <button className="modal-close-btn" onClick={onCancel} aria-label="Close">
              ×
            </button>
          </div>
          <div className="modal-content">{state?.body}</div>
        </Dialog>
      )}
    </>
  )
})
