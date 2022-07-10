import { isUndefined } from "lodash-es";
import { locationService } from ".";
import * as api from "../helpers/api";
import store from "../store";
import { setUser, patchUser, setHost, setOwner } from "../store/modules/user";

const convertResponseModelUser = (user: User): User => {
  return {
    ...user,
    createdTs: user.createdTs * 1000,
    updatedTs: user.updatedTs * 1000,
  };
};

const userService = {
  getState: () => {
    return store.getState().user;
  },

  initialState: async () => {
    const {
      data: { host },
    } = (await api.getSystemStatus()).data;
    if (host) {
      store.dispatch(setHost(convertResponseModelUser(host)));
    }

    const ownerUserId = userService.getUserIdFromPath();
    if (ownerUserId) {
      const { data: owner } = (await api.getUserById(ownerUserId)).data;
      if (owner) {
        store.dispatch(setOwner(convertResponseModelUser(owner)));
      }
    }

    const { data: user } = (await api.getUser()).data;
    if (user) {
      store.dispatch(setUser(convertResponseModelUser(user)));
    }
  },

  isVisitorMode: () => {
    return !isUndefined(userService.getUserIdFromPath());
  },

  getUserIdFromPath: () => {
    const userIdRegex = /^\/u\/(\d+).*/;
    const result = locationService.getState().pathname.match(userIdRegex);
    if (result && result.length === 2) {
      return Number(result[1]);
    }
    return undefined;
  },

  doSignIn: async () => {
    const { data: user } = (await api.getUser()).data;
    if (user) {
      store.dispatch(setUser(convertResponseModelUser(user)));
    } else {
      userService.doSignOut();
    }
    return user;
  },

  doSignOut: async () => {
    store.dispatch(setUser());
    await api.signout();
  },

  getUserById: async (userId: UserId) => {
    const { data: user } = (await api.getUserById(userId)).data;
    if (user) {
      return convertResponseModelUser(user);
    } else {
      return undefined;
    }
  },

  patchUser: async (userPatch: UserPatch): Promise<void> => {
    const { data } = (await api.patchUser(userPatch)).data;
    const user = convertResponseModelUser(data);
    store.dispatch(patchUser(user));
  },
};

export default userService;
