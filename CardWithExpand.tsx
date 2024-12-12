import React, { ReactElement } from 'react'
import { observer } from 'mobx-react'
import {
  Card as KendoCard,
  CardBody as KendoCardBody,
  CardFooter as KendoCardFooter,
  CardHeader as KendoCardHeader,
} from '@progress/kendo-react-layout'
import { ToggleShowContent } from 'components/ui/toggleShow/toggleShowContent'
import useTranslationFromKey from 'hooks/translating/useTranslationFromKey'
import { CardEntityState } from 'components/cardlist/CardEntityState'
import useWindowDimensions from 'hooks/utils/useWindowDimensions'

export type CardTheme = 'default' | 'primary' | 'info' | 'success' | 'warning' | 'error'

export interface CardWithExpandProps {
  className?: string
  children?: ReactElement | ReactElement[]
  header?: ReactElement
  body?: ReactElement
  footer?: ReactElement
  type?: CardTheme
  incrementMeToRedraw: number
  cardEntityState?: CardEntityState
}

/**
 * Renders a card ui element.
 *
 */
export const CardWithExpand: React.FC<CardWithExpandProps> = observer(
  (props: CardWithExpandProps): React.ReactElement => {
    const { width } = useWindowDimensions() // Use screen width to determine height
    const initialHeight = width <= 768 ? 205 : 110 // Dynamic height based on screen size

    const cardEntityState = props.cardEntityState

    const expanded = cardEntityState?.isExpanded
    const expandedSet = (isExpanded: boolean) => cardEntityState?.setExpanded(isExpanded)

    const onExpand = (isExpanded: boolean) => {
      if (isExpanded) expandedSet(isExpanded)
    }

    const onAnimationEnd = (isExpanded: boolean) => {
      if (!isExpanded) expandedSet(isExpanded)
    }

    const typeToUse = props.type ?? 'default'

    return (
      <KendoCard type={typeToUse} className={props.className}>
        <ToggleShowContent
          content={<ExpandComponent {...props} expanded={expanded ?? false} />}
          centerButton
          onToggle={(isExpanded) => {
            onExpand(isExpanded)
          }}
          onAnimationEnd={(isOpen) => onAnimationEnd(isOpen)}
          initialHeight={initialHeight}
          incrementMeToRedraw={props.incrementMeToRedraw}
          showMoreTranslation={useTranslationFromKey('Show More')}
          showLessTranslation={useTranslationFromKey('Show Less')}
          remeasureIntervalMs={100}
        />
      </KendoCard>
    )
  },
)

interface ExpandComponentProps extends CardWithExpandProps {
  expanded: boolean
}

const ExpandComponent: React.FC<ExpandComponentProps> = observer((props): React.ReactElement => {
  return (
    <>
      {props.header && <KendoCardHeader>{props.header}</KendoCardHeader>}
      {props.expanded === true && (
        <>
          <KendoCardBody>
            {props.body ?? props.body}
            {props.children ?? props.children}
          </KendoCardBody>
          {props.footer && <KendoCardFooter>{props.footer}</KendoCardFooter>}
        </>
      )}
    </>
  )
})
