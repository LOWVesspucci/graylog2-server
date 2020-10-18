// @flow strict
import asMock from 'helpers/mocking/AsMock';
import { userList as userOverviewList, admin } from 'fixtures/userOverviews';

import { UsersActions } from 'stores/users/UsersStore';
import fetch from 'logic/rest/FetchProvider';

const pagination = {
  page: 1,
  perPage: 10,
  query: '',
};

const paginationJSON = {
  page: pagination.page,
  per_page: pagination.perPage,
  query: pagination.query,
};

const listSizeInfo = {
  total: userOverviewList.size,
  count: pagination.perPage,
};

describe('UsersStore', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('loadUsers', () => {
    it('should load json users and return them as value classes', async (done) => {
      const jsonList = userOverviewList.map((u) => u.toJSON()).toArray();
      asMock(fetch).mockReturnValueOnce(Promise.resolve({ users: jsonList }));

      UsersActions.loadUsers().then((result) => {
        expect(result).toStrictEqual(userOverviewList);

        done();
      });
    });
  });

  describe('loadUsersPaginated', () => {
    it('should load paginated json users and return result with value classes', async (done) => {
      const jsonList = userOverviewList.map((u) => u.toJSON()).toArray();

      asMock(fetch).mockReturnValueOnce(Promise.resolve({
        context: {
          admin_user: admin.toJSON(),
        },
        users: jsonList,
        ...listSizeInfo,
        ...paginationJSON,
      }));

      UsersActions.loadUsersPaginated(pagination).then((result) => {
        expect(result).toStrictEqual({ users: userOverviewList, adminUser: admin, pagination, ...listSizeInfo });

        done();
      });
    });

    it('should load paginated json users without root admin and return result with value classes', async (done) => {
      const jsonList = userOverviewList.map((u) => u.toJSON()).toArray();

      asMock(fetch).mockReturnValueOnce(Promise.resolve({
        context: {
          admin_user: null,
        },
        users: jsonList,
        ...listSizeInfo,
        ...paginationJSON,
      }));

      UsersActions.loadUsersPaginated(pagination).then((result) => {
        expect(result).toStrictEqual({ users: userOverviewList, adminUser: undefined, pagination, ...listSizeInfo });

        done();
      });
    });
  });
});
