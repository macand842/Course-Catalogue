import { observer } from 'mobx-react';
import { CardList, CardListProps } from 'components/cardlist/CardList';
import { CardEntityState } from 'components/cardlist/CardEntityState';
import { Header } from 'components/ui';
import { CardListBody } from 'components/cardlist/CardListBody';
import { CardListState } from 'components/cardlist/CardListState';
import { Filter } from 'components/filter/components/Filter';
import { setQueryString } from 'components/filter';
import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'components/ui/form/Search';
import { CourseCardBodyWaitinglist } from './card/CourseCardBodyWaitinglist';
import { CourseCardBodyUnlimitedBooking } from './card/CourseCardBodyUnlimitedBooking';
import { CourseCardBodyLimitedBooking } from './card/CourseCardBodyLimitedBooking';
import { Icon } from 'components/ui/icon/Icon';

export const CoursesBody: React.FC = (): React.ReactElement => {
  const cardListProps: CardListProps = {
    optionsProvider: 'CourseCatalogueOfferingBaseOptions',
    layout: 'List',
    cardTheme: 'info',
    isSubLabelHtml: true,
    roundedImage: true,
    showPager: true,
    hideBodyInExpand: true,
    options: [], // dirty hack to prevent options from being loaded twice..
  };

  const [cardListState] = useState<CardListState>(new CardListState(cardListProps));
  const [searchText, setSearchText] = useState<string>(
    new URLSearchParams(window.location.search).get('searchText') ?? ''
  );
  const containerRef = useRef<HTMLDivElement | null>(null); // Reference for the filter section
  const [showFab, setShowFab] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const distanceFromTop = containerRef.current.getBoundingClientRect().top;
        setShowFab(distanceFromTop <= -500); // Show FAB when the section is 500px out of view
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="coursesbody-outer-container">
      <div className="coursesbody-inner-container" ref={containerRef}>
        <Header className={'coursesbody-search-header h2'} size="2" tKey="CourseCatalogue-FindCourse" />
        <div className={'coursesbody-search-input'}>
          <Search
            className={'coursesbody-search'}
            value={searchText}
            onChange={(value) => {
              setSearchText(value);
              setQueryString(value, 'searchText');
              if (cardListState?.filter) {
                const newFilter: PaginatedFilter = {
                  ...cardListState.filter,
                  searchText: value,
                };
                cardListState.updateFilter(newFilter);
              }
            }}
          />
        </div>
      </div>
      <div className="mb-3 course-catalogue-filter">
        <Filter
          filterProvider={'CourseCatalogueOfferingBaseFilterProvider'}
          callbacks={{
            onChange: (filter) => {
              const newFilter: PaginatedFilter = {
                ...filter,
                searchText: new URLSearchParams(window.location.search).get('searchText') ?? undefined,
              };
              cardListState?.updateFilter(newFilter);
            },

            onReset: () => {
              setSearchText('');
              const newFilter: PaginatedFilter = { ...cardListState.filter, searchText: '' };
              cardListState?.updateFilter(newFilter);
              setQueryString('', 'searchText');
            },
          }}
        />{' '}
      </div>

      {cardListState && (
        <CardListBody
          state={cardListState}
          cardListProps={{
            ...cardListProps,
            cardBodyComponent: (entityState: CardEntityState, filter: PaginatedFilter | undefined) => (
              <CourseBody entityState={entityState} filter={filter ?? {}} />
            ),
          }}
        />
      )}

      {/* Floating action button */}
      <div
        className={`fab ${showFab ? 'show' : ''}`}
        onClick={() => {
          containerRef.current?.scrollIntoView({ behavior: 'smooth' });
        }}
      >
        <Icon type="arrowUp" />
      </div>
    </div>
  );
};

interface CourseCardBodyProps {
  entityState: CardEntityState;
  filter: PaginatedFilter;
}

/**
 * Course card body
 *
 */
const CourseBody: React.FC<CourseCardBodyProps> = observer((props): React.ReactElement => {
  const filter = { ...props.filter } as CourseCatalogueOfferingFilter;
  filter.offeringBaseId = parseInt(props.entityState.option.value);

  const getCheckoutItemFlowBySignupMethod = (dto: CourseCatalogueOfferingDto) => {
    const signupMethod = dto.signupMethod ?? 0;

    if (
      signupMethod === 0 ||
      signupMethod === 'usingWaitinglistOnly' ||
      (signupMethod === 'usingMaxStudentsWithWaitinglistOverflow' && !dto.availableSpots)
    ) {
      // waitinglist
      return <CourseCardBodyWaitinglist {...props} dto={dto} />;
    }

    if (signupMethod === 'usingUnlimitedMaxStudents') {
      // unlimited
      return <CourseCardBodyUnlimitedBooking {...props} dto={dto} />;
    }

    if (
      (signupMethod === 'usingMaxStudentsWithWaitinglistOverflow' && dto.availableSpots) ||
      signupMethod === 'usingMaxStudents'
    ) {
      // limited
      return <CourseCardBodyLimitedBooking {...props} dto={dto} />;
    }
  };

  return (
    <>
      <CardList
        optionsProvider="CourseCatalogueOfferingOptions"
        layout="List"
        cardTheme="default"
        cardBodyComponent={(entityState: CardEntityState) => {
          const dto = (entityState.option as CatalogueOfferingDto).offering;

          return <>{getCheckoutItemFlowBySignupMethod(dto)}</>;
        }}
        showPager
        defaultFilter={{ ...filter, page: 1, pageSize: 50 } as PaginatedFilter}
        hideHeader
      />
    </>
  );
});
