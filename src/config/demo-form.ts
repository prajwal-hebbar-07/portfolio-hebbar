import type { FormSchema, Patch } from '../lib/form-engine';

/* The schema behind the live demo. Everything the demo does — which fields
   show, what is computed, who may edit what and when — is read from here. */
export const demoForm: FormSchema = {
  id: 'account-opening',
  title: 'Account opening',
  sections: [
    {
      id: 'applicant',
      title: 'Applicant',
      editableBy: 'maker',
      editableIn: ['DRAFT', 'RETURNED'],
      fields: [
        { id: 'type', label: 'Applicant type', type: 'select', options: ['Individual', 'Company'], default: 'Individual' },
        { id: 'name', label: 'Name', type: 'text', required: true },
        {
          id: 'pan',
          label: 'PAN',
          type: 'text',
          required: true,
          pattern: '^[A-Z]{5}[0-9]{4}[A-Z]$',
          hint: 'ABCDE1234F',
          visibleWhen: { field: 'type', eq: 'Individual' },
        },
        {
          id: 'cin',
          label: 'Company registration no.',
          type: 'text',
          required: true,
          visibleWhen: { field: 'type', eq: 'Company' },
        },
      ],
    },
    {
      id: 'income',
      title: 'Income',
      editableBy: 'maker',
      editableIn: ['DRAFT', 'RETURNED'],
      fields: [
        { id: 'monthly', label: 'Monthly income', type: 'number', required: true },
        { id: 'annual', label: 'Annual income', type: 'number' },
        { id: 'tier', label: 'Review tier', type: 'text' },
      ],
    },
    {
      id: 'review',
      title: 'Checker review',
      editableBy: 'checker',
      editableIn: ['SUBMITTED'],
      visibleWhen: { state: ['SUBMITTED', 'RETURNED', 'COMPLETED'] },
      fields: [{ id: 'note', label: 'Message to maker', type: 'text' }],
    },
  ],
  derive: [
    { target: 'annual', expr: { mul: ['$monthly', 12] } },
    { target: 'tier', expr: { if: [{ gt: ['$annual', 2000000] }, 'Enhanced', 'Standard'] } },
  ],
  workflow: {
    initial: 'DRAFT',
    terminal: 'COMPLETED',
    transitions: [
      { action: 'submit', label: 'Submit for review', by: 'maker', from: ['DRAFT', 'RETURNED'], to: 'SUBMITTED' },
      { action: 'approve', label: 'Approve', by: 'checker', from: ['SUBMITTED'], to: 'COMPLETED' },
      { action: 'return', label: 'Return to maker', by: 'checker', from: ['SUBMITTED'], to: 'RETURNED', requires: ['note'] },
    ],
  },
};

/** Config edits the visitor can switch on; the form re-renders from the patched schema. */
export const demoPatches: { id: string; label: string; patch: Patch }[] = [
  {
    id: 'gstin',
    label: '+ field gstin (Company only)',
    patch: {
      op: 'add',
      path: 'sections.0.fields',
      value: { id: 'gstin', label: 'GSTIN', type: 'text', visibleWhen: { field: 'type', eq: 'Company' } },
    },
  },
  {
    id: 'threshold',
    label: '~ tier threshold 2000000 → 1000000',
    patch: { op: 'replace', path: 'derive.1.expr.if.0.gt.1', value: 1000000 },
  },
];
