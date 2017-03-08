COLLECTIONS_TEMPLATE_PROPS_EDIT = ['media_id', 'url','name', 'pub_country', 'public_notes', 'is_monitored', 'editor_notes']
# some useful tag sets
COLLECTIONS_TAG_SET_ID = 5
GV_TAG_SET_ID = 556
EMM_TAG_SET_ID = 597
NYT_SECTIONS_TAG_SET_ID = 1961

FEATURED_COLLECTION_LIST = [8875027, 2453107, 8878332, 9201395]
POPULAR_COLLECTION_LIST = [9272347, 9201395, 8877968, 9315147, 9353688, 9173065, 9325106, 8875027, 8878332, 9319462, 9353689, 9353685, 9139458, 9273433, 9297151, 9351677, 9213928, 9228386, 9349925]
# metadata tag sets
TAG_SETS_ID_PUBLICATION_COUNTRY = 1935
TAG_SETS_ID_PUBLICATION_STATE = 1962

VALID_METADATA_IDS = [{'pub_country': TAG_SETS_ID_PUBLICATION_COUNTRY}]

def isMetaDataTagSet(metadataTagSetsId):
  for eachMetadataItem in VALID_METADATA_IDS:
  	if int(metadataTagSetsId) in eachMetadataItem.values():
  		return True
  return False
