export type State = AppLocation;

interface SetLocationAction {
  type: "SET_LOCATION";
  payload: State;
}

interface SetPathnameAction {
  type: "SET_PATHNAME";
  payload: {
    pathname: string;
  };
}

interface SetQueryAction {
  type: "SET_QUERY";
  payload: Query;
}

interface SetShortcutIdAction {
  type: "SET_SHORTCUT_ID";
  payload: string;
}

interface SetTagQueryAction {
  type: "SET_TAG_QUERY";
  payload: {
    tag: string;
  };
}

interface SetFromAndToQueryAction {
  type: "SET_DURATION_QUERY";
  payload: {
    duration: Duration | null;
  };
}

interface SetTypeAction {
  type: "SET_TYPE";
  payload: {
    type: MemoSpecType | "";
  };
}

interface SetTextAction {
  type: "SET_TEXT";
  payload: {
    text: string;
  };
}

interface SetHashAction {
  type: "SET_HASH";
  payload: {
    hash: string;
  };
}

export type Actions =
  | SetLocationAction
  | SetPathnameAction
  | SetQueryAction
  | SetTagQueryAction
  | SetFromAndToQueryAction
  | SetTypeAction
  | SetTextAction
  | SetShortcutIdAction
  | SetHashAction;

export function reducer(state: State, action: Actions) {
  switch (action.type) {
    case "SET_LOCATION": {
      return action.payload;
    }
    case "SET_PATHNAME": {
      if (action.payload.pathname === state.pathname) {
        return state;
      }

      return {
        ...state,
        pathname: action.payload.pathname,
      };
    }
    case "SET_HASH": {
      if (action.payload.hash === state.hash) {
        return state;
      }

      return {
        ...state,
        hash: action.payload.hash,
      };
    }
    case "SET_QUERY": {
      return {
        ...state,
        query: {
          ...action.payload,
        },
      };
    }
    case "SET_TAG_QUERY": {
      if (action.payload.tag === state.query.tag) {
        return state;
      }

      return {
        ...state,
        query: {
          ...state.query,
          tag: action.payload.tag,
        },
      };
    }
    case "SET_DURATION_QUERY": {
      if (action.payload.duration === state.query.duration) {
        return state;
      }

      return {
        ...state,
        query: {
          ...state.query,
          duration: {
            ...state.query.duration,
            ...action.payload.duration,
          },
        },
      };
    }
    case "SET_TYPE": {
      if (action.payload.type === state.query.type) {
        return state;
      }

      return {
        ...state,
        query: {
          ...state.query,
          type: action.payload.type,
        },
      };
    }
    case "SET_TEXT": {
      if (action.payload.text === state.query.text) {
        return state;
      }

      return {
        ...state,
        query: {
          ...state.query,
          text: action.payload.text,
        },
      };
    }
    case "SET_SHORTCUT_ID": {
      if (action.payload === state.query.shortcutId) {
        return state;
      }

      return {
        ...state,
        query: {
          ...state.query,
          shortcutId: action.payload,
        },
      };
    }
    default: {
      return state;
    }
  }
}

export const defaultState: State = {
  pathname: "/",
  hash: "",
  query: {
    tag: "",
    duration: null,
    type: "",
    text: "",
    shortcutId: "",
  },
};
