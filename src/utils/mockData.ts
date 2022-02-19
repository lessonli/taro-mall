const icon = 'http://dummyimage.com/120x240'

export const chinaAddrsData = [
  {
    name: '浙江省',
    level: 1,
    code: '浙江省',
    children: [
      {
        name: '湖州市',
        level: 2,
        code: '湖州市',
        children: [
          {
            name: '吴兴区',
            level: 3,
            code: '吴兴区',
          },
          {
            name: '长兴',
            level: 3,
            code: '长兴',
          }
        ]
      },
      {
        name: '杭州市',
        level: 2,
        code: '杭州市',
        children: [
          {
            name: '西湖区',
            level: 3,
            code: '西湖区',
          },
          {
            name: '余杭区',
            level: 3,
            code: '余杭区',
          }
        ]
      },
    ]
  }
]

export const Categories = [
  {
    name: '分类1',
    id: '1',
    children: [
      { name: '分类1.1', id: '1.1', icon },
      { name: '分类1.2', id: '1.2', icon },
      { name: '分类1.3', id: '1.3', icon },
      { name: '分类1.4', id: '1.4', icon },
      { name: '分类1.5', id: '1.5', icon },
    ]
  },
  {
    name: '分类2',
    id: '2',
    children: [
      { name: '分类2.1', id: '2.1', icon },
      { name: '分类2.2', id: '2.2', icon },
      { name: '分类2.3', id: '2.3', icon },
      { name: '分类2.4', id: '2.4', icon },
      { name: '分类2.5', id: '2.5', icon },
    ]
  },
  {
    name: '分类3',
    id: '3',
    children: [
      { name: '分类3.1', id: '3.1', icon },
      { name: '分类3.2', id: '3.2', icon },
      { name: '分类3.3', id: '3.3', icon },
    ]
  },
  
]