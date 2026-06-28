const CATEGORY_DURATION = {
  Hematology: '24 hours',
  'Clinical Chemistry': '24 hours',
  Microbiology: '48-72 hours',
  Immunology: '48 hours',
  Hormones: '24-48 hours',
  General: '24 hours',
};

export function getTestDuration(test) {
  if (!test) return '24 hours';
  if (test.duration) return test.duration;
  if (test.turnaroundHours) return `${test.turnaroundHours} hours`;
  return CATEGORY_DURATION[test.category] || CATEGORY_DURATION.General;
}

export function normalizeLabTest(test) {
  if (!test) return test;
  const id = test.testId || test.testID || test.TestID;
  return {
    ...test,
    testId: id,
    testName: test.testName || test.TestName,
    description: test.description || test.Description,
    price: test.price ?? test.Price ?? 0,
    category: test.category || test.Category || 'General',
    duration: getTestDuration(test),
  };
}
