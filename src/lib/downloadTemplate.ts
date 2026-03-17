/**
 * Generates and downloads a CSV template for question bank imports.
 * Accepts optional chapters list to pre-fill valid chapter names.
 */

interface ChapterInfo {
  id: number;
  name: string;
}

export const downloadQuestionTemplate = (chapters?: ChapterInfo[]) => {
  const headers = [
    'question_text',
    'type',
    'difficulty',
    'chapter',
    'points',
    'option_a',
    'option_b',
    'option_c',
    'option_d',
    'correct_answer',
  ];

  const chapterName1 = chapters?.[0]?.name ?? 'Chapter 1';
  const chapterName2 = chapters?.[1]?.name ?? 'Chapter 2';
  const chapterName3 = chapters?.[2]?.name ?? 'Chapter 3';

  const sampleRows = [
    [
      'What is the capital of France?',
      'MCQ',
      'easy',
      chapterName1,
      '5',
      'Paris',
      'London',
      'Berlin',
      'Madrid',
      'A',
    ],
    [
      'The Earth revolves around the Sun.',
      'True_False',
      'easy',
      chapterName1,
      '2',
      'True',
      'False',
      '',
      '',
      'A',
    ],
    [
      'The chemical symbol for water is ___.',
      'Fill_Blank',
      'medium',
      chapterName2,
      '3',
      '',
      '',
      '',
      '',
      'H2O',
    ],
    [
      'Write a function to reverse a string.',
      'Coding',
      'hard',
      chapterName2,
      '10',
      '',
      '',
      '',
      '',
      'def reverse(s): return s[::-1]',
    ],
    [
      'Discuss the impact of climate change on agriculture.',
      'Writing',
      '-',
      chapterName3,
      '15',
      '',
      '',
      '',
      '',
      '',
    ],
  ];

  // Build a reference sheet for valid values
  const referenceLines = [
    '',
    '',
    '# COLUMN REFERENCE',
    '# type: MCQ | Fill_Blank | True_False | Coding | Writing',
    '# difficulty: easy | medium | hard | - (use "-" for Writing)',
    `# chapter: ${chapters?.length ? chapters.map(c => c.name).join(' | ') : 'Use chapter names from your subject'}`,
    '# correct_answer: For MCQ use A/B/C/D. For True_False use A (True) or B (False). For Fill_Blank enter the answer text. For Coding enter expected code/output. Writing can be left empty.',
  ];

  const csvContent = [
    headers.join(','),
    ...sampleRows.map((row) =>
      row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')
    ),
    ...referenceLines.map((line) => `"${line.replace(/"/g, '""')}"`),
  ].join('\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'question_import_template.csv';
  link.click();
  URL.revokeObjectURL(url);
};
