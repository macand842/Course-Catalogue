import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import { CourseCatalogueCourseComponent } from 'areas/courseCatalogue/courses/CourseCatalogueCourseComponent'
import { useSchoolDefinedStyling } from 'components/page/useSchoolDefinedStyling'
import { useAppState } from 'hooks/app/getAppState'

export interface CatalogueCoursePageProps { }

const CatalogueCoursePage: React.FC<CatalogueCoursePageProps> = observer((props): React.ReactElement => {

  useSchoolDefinedStyling()

  return <div className='course-catalogue-outer-container'>
    <CourseCatalogueCourseComponent />
  </div>
})
export default CatalogueCoursePage