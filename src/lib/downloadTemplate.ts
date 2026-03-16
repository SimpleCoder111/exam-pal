/**
 * Generates and downloads a CSV template for question bank imports.
 * CSV is universally supported by Excel, Google Sheets, and LibreOffice.
 */
export const downloadQuestionTemplate = () => {
  const headers = [
    'questionContent',
    'questionType',
    'difficulty',
    'chapterName',
    'option1',
    'option2',
    'option3',
    'option4',
    'correctAnswer',
  ];

  const sampleRows = [
    [
      'What is the capital of France?',
      'MULTIPLE_CHOICE',
      'EASY',
      'Chapter 1',
      'Paris',
      'London',
      'Berlin',
      'Madrid',
      '1',
    ],
    [
      'The Earth revolves around the Sun.',
      'TRUE_FALSE',
      'EASY',
      'Chapter 2',
      'True',
      'False',
      '',
      '',
      '1',
    ],
    [
      'The chemical symbol for water is ___.',
      'FILL_BLANK',
      'MEDIUM',
      'Chapter 3',
      '',
      '',
      '',
      '',
      'H2O',
    ],
  ];

  const csvContent = [
    headers.join(','),
    ...sampleRows.map((row) =>
      row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')
    ),
  ].join('\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'question_import_template.csv';
  link.click();
  URL.revokeObjectURL(url);
};
