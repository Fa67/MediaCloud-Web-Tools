import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import Link from 'react-router/lib/Link';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import CollectionIcon from '../../../common/icons/CollectionIcon';
import FilledStarIcon from '../../../common/icons/FilledStarIcon';
import messages from '../../../../resources/messages';

const CollectionList = (props) => {
  const { title, description, collections } = props;
  return (
    <div className="collection-list">
      <Grid>
        <Row>
          <Col lg={12} md={12} sm={12}>
            <h2>
              <CollectionIcon height={32} />
              {title}
            </h2>
            <p>{description}</p>
          </Col>
        </Row>
        <Row>
          <table width="100%">
            <tbody>
              <tr>
                <th><FormattedMessage {...messages.collectionNameProp} /></th>
                <th><FormattedMessage {...messages.collectionDescriptionProp} /></th>
              </tr>
              {collections.map((c, idx) => (
                <tr key={c.tags_id} className={(idx % 2 === 0) ? 'even' : 'odd'}>
                  <td>
                    <Link to={`/collections/${c.tags_id}`}>{c.label}</Link>
                  </td>
                  <td>
                    {c.description}
                  </td>
                  <td>
                    { c.isFavorite ? <FilledStarIcon /> : '' }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Row>
      </Grid>
    </div>
  );
};

CollectionList.propTypes = {
  // from parent
  collections: React.PropTypes.array.isRequired,
  title: React.PropTypes.string.isRequired,
  description: React.PropTypes.string,
  // from context
  intl: React.PropTypes.object.isRequired,
};

export default
  injectIntl(
    CollectionList
  );
