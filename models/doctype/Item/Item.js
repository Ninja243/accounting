module.exports = {
  name: 'Item',
  doctype: 'DocType',
  isSingle: 0,
  keywordFields: ['name', 'description'],
  fields: [
    {
      fieldname: 'name',
      label: 'Item Name',
      fieldtype: 'Data',
      required: 1
    },
    {
      fieldname: 'description',
      label: 'Description',
      fieldtype: 'Text'
    },
    {
      fieldname: 'unit',
      label: 'Unit',
      fieldtype: 'Select',
      default: 'No',
      options: ['No', 'Kg', 'Gram', 'Hour', 'Day']
    },
    {
      fieldname: 'incomeAccount',
      label: 'Income Account',
      fieldtype: 'Link',
      target: 'Account',
      required: 1,
      getFilters: query => {
        return {
          isGroup: 0,
          accountType: 'Income Account'
        };
      }
    },
    {
      fieldname: 'expenseAccount',
      label: 'Expense Account',
      fieldtype: 'Link',
      target: 'Account',
      required: 1,
      getFilters: query => {
        return {
          isGroup: 0,
          accountType: [
            'in',
            [
              'Cost of Goods Sold',
              'Expense Account',
              'Stock Received But Not Billed'
            ]
          ]
        };
      }
    },
    {
      fieldname: 'tax',
      label: 'Tax',
      fieldtype: 'Link',
      target: 'Tax'
    },
    {
      fieldname: 'rate',
      label: 'Rate',
      fieldtype: 'Currency'
    }
  ],
  layout: [
    // section 1
    {
      columns: [
        {
          fields: ['name', 'unit']
        },
        {
          fields: ['rate']
        }
      ]
    },

    // section 2
    {
      columns: [
        {
          fields: ['description']
        }
      ]
    },

    // section 3
    {
      title: 'Accounting',
      columns: [
        {
          fields: ['incomeAccount', 'expenseAccount']
        },
        {
          fields: ['tax']
        }
      ]
    }
  ],
  links: [
    {
      label: 'New Sales Invoice',
      condition: form => !form.doc._notInserted,
      action: async form => {
        const invoice = await frappe.getNewDoc('SalesInvoice');
        invoice.items = [
          {
            item: form.doc.name,
            rate: form.doc.rate,
            tax: form.doc.tax
          }
        ];
        invoice.on('afterInsert', async () => {
          form.$formModal.close();
          form.$router.push({
            path: `/edit/SalesInvoice/${invoice.name}`
          });
        });
        await form.$formModal.open(invoice);
      }
    },
    {
      label: 'New Purchase Invoice',
      condition: form => !form.doc._notInserted,
      action: async form => {
        const invoice = await frappe.getNewDoc('PurchaseInvoice');
        invoice.items = [
          {
            item: form.doc.name,
            rate: form.doc.rate,
            tax: form.doc.tax
          }
        ];
        invoice.on('afterInsert', async () => {
          form.$formModal.close();
          form.$router.push({
            path: `/edit/PurchaseInvoice/${invoice.name}`
          });
        });
        await form.$formModal.open(invoice);
      }
    }
  ]
};
