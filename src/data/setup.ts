interface Item {
  Name: string;
  Description: string;
  IconName?: string;
  Style?: string;
}

interface ItemVal {
  Name: string;
  Description: string;
  ContentType: Item[];
}

export const ROLES = ['OWNER', 'MANAGER', 'MEMBER'];

export const VALIDATIONS_DEFAULT_DATA: ItemVal[] = [
  {
    Name: 'IssueType',
    Description:
      'The currently defined issue types are listed below. In addition, you can add more in the administration section.',
    ContentType: [
      {
        Name: 'Task',
        Description: 'A small, distinct piece of work.',
      },
      {
        Name: 'Bug',
        Description: 'A problem or error.',
      },
      {
        Name: 'Improvement',
        Description:
          'An improvement or enhancement to an existing feature or task.',
      },
      {
        Name: 'New Feature',
        Description:
          'A new feature of the product, which has yet to be developed.',
      },
    ],
  },
  {
    Name: 'Priority',
    Description:
      'An issue has a priority level which indicates its importance. The currently defined priorities are listed below. In addition, you can add more priority levels in the administration section.',
    ContentType: [
      {Name: 'Highest', Description: 'This problem will block progress.'},
      {Name: 'High', Description: 'Serious problem that could block progress.'},
      {Name: 'Medium', Description: 'Has the potential to affect progress.'},
      {Name: 'Low', Description: 'Minor problem or easily worked around.'},
      {
        Name: 'Lowest',
        Description: 'Trivial problem with little or no impact on progress.',
      },
    ],
  },
  {
    Name: 'Statuses',
    Description:
      'Each issue has a status, which indicates the stage of the issue. In the default workflow, issues start as being Open, progressing to In Progress, Resolved and then Closed. Other workflows may have other status transitions.',
    ContentType: [
      {
        Name: 'OPEN',
        Description:
          'The issue is open and ready for the assignee to start work on it.',
      },
      {
        Name: 'READY WORK',
        Description: 'The problem is clarified, and ready to go IN PROGRESS',
      },
      {
        Name: 'IN PROGRESS',
        Description:
          'This issue is being actively worked on at the moment by the assignee.',
      },
      {
        Name: 'READY TO TEST',
        Description:
          'Done and should be testing before the issue has been completed',
      },
      {
        Name: 'DONE',
        Description: 'The issue completed',
      },
    ],
  },
  {
    Name: 'StoryPoint',
    Description:
      'Each issue has a status, which indicates the lever of the issue. In the default workflow, issues start as being 0. Other workflows may have other level transitions.',
    ContentType: [
      {
        Name: '0',
        Description: 'Starter',
      },
      {
        Name: '3',
        Description: 'Easy',
      },
      {
        Name: '5',
        Description: 'Normal',
      },
      {
        Name: '8',
        Description: 'Hard',
      },
      {
        Name: '13',
        Description: 'Extremely Difficult',
      },
    ],
  },
];
