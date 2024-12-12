import React from 'react'
import { observer } from 'mobx-react'
import useTranslationFromKey from 'hooks/translating/useTranslationFromKey'
import { BootstrapBadge, Button, Header, Icon } from 'components/ui'
import { Translate } from 'components/translation/Translate'
import { useNumberFormatCurrency } from 'hooks/formatting/useNumberFormat'
import useDateFormat from 'hooks/formatting/useDateFormat'
import FormatAgeRestriction from 'components/formatting/FormatAgeRestriction'
import { getAppState } from 'hooks/app/getAppState'
import FormatStartEndTime from '../../../../components/formatting/FormatStartEndTime'
import { useNavigate } from 'react-router-dom'

interface CourseCardProps {
  dto: CourseCatalogueOfferingDto
  showAvaliableSpots?: boolean
  showWaitingList?: boolean
  availableSpots?: number
  AddToCartFunction: (dto: CourseCatalogueOfferingDto, flow: CheckoutItemFlow) => void
  RefreshCourseCatalogue?: () => void
}

export const CourseCard: React.FC<CourseCardProps> = observer((props): React.ReactElement => {
  const dto = props.dto

  const addToCartTranslation = useTranslationFromKey('Catalogue-AddToCart')

  const user = getAppState().user
  const navigate = useNavigate()

  const startDate = dto.startDate ? useDateFormat(new Date(dto.startDate), 'dateShort') : ''

  const endDate = dto.endDate ? useDateFormat(new Date(dto.endDate), 'dateShort') : ''

  const periodeTranslation = useTranslationFromKey('Periode').value

  const occurrencesTranslation = useTranslationFromKey('Catalogue.Occurences').value

  const joinWaitingListTranslation = useTranslationFromKey('Catalogue-JoinWaitinglist')

  const courseLinkTranslation = useTranslationFromKey('Catalogue-CourseLink')

  const teacherTranslation = useTranslationFromKey('Teacher').value

  const ageTranslation = useTranslationFromKey('ElevAlder').value

  const fee = useNumberFormatCurrency(dto.price)

  const isFull = !props.availableSpots

  const showEnrollmentButton: boolean =
    !user.isLoggedIn || user.resourceType === 'student' || user.resourceType === 'guardian'

  const showCourseLinkButton: boolean =
    user.isLoggedIn && user.resourceType === 'teacher' && dto.bookingV2Id !== undefined && dto.bookingV2Id !== 0

  const isWaitinglistOverflowOrWaitinglistOnly =
    (isFull && dto.signupMethod === 'usingMaxStudentsWithWaitinglistOverflow') ||
    dto.signupMethod === 'usingWaitinglistOnly'

  const isDirectSignupAndNotFullOrWaitinglistOverflow =
    dto.signupMethod === 'usingUnlimitedMaxStudents' ||
    (dto.signupMethod === 'usingMaxStudents' && !isFull) ||
    (dto.signupMethod === 'usingMaxStudentsWithWaitinglistOverflow' && !isFull)

  const title = dto.bookingTitle ?? props.dto.offeringName ?? ''


  return (
    <div className='lesson-card-content'>
      {dto.showMaxStudents && (
        <div className='catalogue-card-available-spots font-weight-bold'>
          10/12 spots available
          {/*  {props.showAvaliableSpots && isFull && <Translate tkey='CourseCatalogueOffering.AvailableSpotsFull' />}

          {props.showAvaliableSpots && !isFull && (
            <Translate
              tkey='CourseCatalogueOffering.AvailableSpots'
              interpolation={{
                '0': props.availableSpots + '/' + dto.maxStudents,
              }}
            ></Translate>
          )} */}
        </div>
      )}

      <h4 className='catalogue-card-header'>
        {title}
      </h4>

      <div className='location-time'>
        <div>
          {dto.location && (
            <span className='font-weight-bold'>
              <Icon type='locationDot' /> {dto.location}
            </span>
          )}
        </div>

        <div>
          {(dto.showWeekday || dto.showTime) && (
            <span>
              {dto.showWeekday && <> {dto.weekday} </>}
              {dto.showTime && (
                <span>
                  &nbsp;
                  <FormatStartEndTime startTime={dto.startTime} endTime={dto.endTime} format={'timeShort'} />
                </span>
              )}
            </span>
          )}
        </div>
      </div>

      <div className='course-details'>
        {dto.showDate && (
          <div>
            <span>
              <span className='font-weight-bold'>{periodeTranslation}:</span>{startDate}{(dto.occurrences ?? 0) > 0 && `- ${endDate}`}
            </span>
          </div>
        )}

        {/* {dto.showOccurences && (dto.occurrences ?? 0) > 0 && ( */}
        <div>
          <span>
            <span className='font-weight-bold'>{occurrencesTranslation}:</span>{dto.occurrences}
          </span>
        </div>
        {/* )} */}

        {(dto.ageRestrictionMin !== undefined || dto.ageRestrictionMax !== undefined) && (
          <div>
            <span>
              <span className='font-weight-bold'>{ageTranslation}:</span><FormatAgeRestriction minAge={dto.ageRestrictionMin} maxAge={dto.ageRestrictionMax} />
            </span>
          </div>
        )}

        {dto.tuitionLevel && (
          <div>
            <span>
              <span className='font-weight-bold'>Tuition level:</span>{dto.tuitionLevel}
            </span>
          </div>
        )}

        {dto.teacherNames && (
          <div>
            <span>
              <span className='font-weight-bold'>{teacherTranslation}:</span>{dto.teacherNames}
            </span>
          </div>
        )}
      </div>

      {
        dto.bookingDescription && (
          <div className='catalogue-card-description' dangerouslySetInnerHTML={{ __html: dto.bookingDescription }}></div>
        )
      }
      < div className='catalogue-card-footer' >
        {
          //       dto.showFee && (
          <span className='font-weight-bold'>
            {/* {fee} */}
            5.395 Kr.
          </span>
          //       )
        }

        {
          showEnrollmentButton && (
            <>
              {(props.showWaitingList || isWaitinglistOverflowOrWaitinglistOnly) && (
                <Button
                  id='catalogue-card-action'
                  title={joinWaitingListTranslation}
                  type='primaryFlat'
                  icon='hourglassHalf'
                  onClick={() => props.AddToCartFunction(dto, 'waitingList')}
                />
              )}

              {!props.showWaitingList && isDirectSignupAndNotFullOrWaitinglistOverflow && (
                <Button
                  id='catalogue-card-action'
                  title={addToCartTranslation}
                  type='primaryFlat'
                  icon='cartPlus'
                  onClick={() => props.AddToCartFunction(dto, 'limitedBooking')}
                />
              )}
            </>
          )
        }

        {
          showCourseLinkButton && (
            <Button
              id='catalogue-card-action'
              title={courseLinkTranslation}
              type='primaryFlat'
              icon='link'
              onClick={() => {
                navigate(
                  `/play/booking/${dto.bookingV2Id ?? 0}?timeslotId=${dto.bookingV2TimeslotId ?? 0}&inclFuture=true`,
                )
              }}
            />
          )
        }
      </div >
    </div>
  )
})