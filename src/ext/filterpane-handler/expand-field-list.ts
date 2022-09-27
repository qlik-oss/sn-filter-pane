function isDateField(field) {
  if (field.qDerivedFieldData) {
    return field.qTags.indexOf('$date') > -1 || field.qTags.indexOf('$timestamp') > -1;
  }
  return false;
}

function isGeoField(field) {
  return field.qTags.indexOf('$geoname') > -1;
}

const AUTOCALENDAR_NAME = '.autoCalendar';

function trimAutoCalendarName(fieldName) {
  const res = fieldName ? fieldName.split(AUTOCALENDAR_NAME).join('') : '';
  return res;
}

export default function expandFieldList(list) {
  const result = [];
  for (let i = 0; i < list.length; ++i) {
    const field = list[i];

    field.isDateField = isDateField(field);
    field.isGeoField = isGeoField(field);
    result.push(field);

    if (field.qDerivedFieldData) {
      for (let j = 0; j < field.qDerivedFieldData.qDerivedFieldLists.length; ++j) {
        const derived = field.qDerivedFieldData.qDerivedFieldLists[j];
        for (let k = 0; k < derived.qFieldDefs.length; ++k) {
          const derived_field = derived.qFieldDefs[k];

          result.push({
            qName: derived_field.qName,
            displayName: trimAutoCalendarName(derived_field.qName),
            qSrcTables: field.qSrcTables,
            qTags: derived_field.qTags,
            isDerived: true,
            isDerivedFromDate: field.isDateField,
            sourceField: field.qName,
            derivedDefinitionName: derived.qDerivedDefinitionName,
          });
        }
      }
    }
  }
  return result;
}