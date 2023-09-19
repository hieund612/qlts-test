//cấu hình mặc đinh phân trang của grid
export const defaultGrid = {
  page: 1,
  page_size: 14,
  total: 0,
  pageSizeOptions: [15, 30, 50, 100],
};
//Cấu hình mặc định dữ liệu data get
export const DefaultMeta = {
  page: 1,
  page_size: 15,
  sort: { id: 'asc' },
  search: '',
  filter: {},
  total: 0,
};
export const DefaulPer = {
  per_Add: false,
    per_Edit: false,
    per_View: false,
    per_Delete: false,
    per_Approve: false,
};
export const PERM = {
  ADD: '01',
  EDIT: '02',
  DELETE: '03',
  APROVE: '04',
  VIEW: '05'
};
export const ApiUrl = "http://localhost:1000/";